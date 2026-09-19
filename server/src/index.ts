import express, { Request, Response } from 'express';
import cors from 'cors';
import { randomUUID } from 'crypto';
import type { Server } from 'http';
import {
  createToken, hashPassword, prisma, requireAdmin, requireAuth, verifyPassword,
  type AuthenticatedRequest,
} from './auth';
import {
  adoptionUpdateSchema, loginSchema, moderationSchema, monumentSubmissionSchema,
  parseBody, profileSchema, registerSchema, storySchema,
} from './validation';

const app = express();
const PORT = process.env.PORT || 3000;
const JSON_BODY_LIMIT = process.env.JSON_BODY_LIMIT || '1mb';
const allowedOrigins = (process.env.CORS_ORIGINS || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);
const authRateLimitWindowMs = Number(process.env.AUTH_RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000);
const authRateLimitMax = Number(process.env.AUTH_RATE_LIMIT_MAX || 10);
const authAttempts = new Map<string, { count: number; resetAt: number }>();
const authCookie = (token: string, maxAgeSeconds = 8 * 60 * 60) =>
  `smarak_auth=${token}; HttpOnly; SameSite=Strict; Path=/; Max-Age=${maxAgeSeconds}${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`;

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }
    callback(new Error('Origin is not allowed'));
  },
}));
app.use((req: Request, res: Response, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'no-referrer');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  if (process.env.NODE_ENV === 'production') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }
  next();
});
app.use((req: Request, res: Response, next) => {
  const startedAt = process.hrtime.bigint();
  const requestId = req.header('x-request-id') || randomUUID();
  res.setHeader('X-Request-Id', requestId);
  res.on('finish', () => {
    const durationMs = Number(process.hrtime.bigint() - startedAt) / 1_000_000;
    console.log(JSON.stringify({
      requestId,
      method: req.method,
      path: req.originalUrl,
      status: res.statusCode,
      durationMs: Number(durationMs.toFixed(2)),
    }));
  });
  next();
});
app.use(express.json({ limit: JSON_BODY_LIMIT }));

function authRateLimit(req: Request, res: Response, next: () => void) {
  const key = `${req.ip}:${req.path}`;
  const now = Date.now();
  const current = authAttempts.get(key);
  if (!current || current.resetAt <= now) {
    authAttempts.set(key, { count: 1, resetAt: now + authRateLimitWindowMs });
    next();
    return;
  }
  if (current.count >= authRateLimitMax) {
    res.setHeader('Retry-After', Math.ceil((current.resetAt - now) / 1000));
    res.status(429).json({ error: 'Too many authentication attempts. Try again later.' });
    return;
  }
  current.count += 1;
  next();
}

app.get('/health/live', (_req: Request, res: Response) => {
  res.setHeader('Cache-Control', 'no-store');
  res.json({ status: 'ok' });
});

app.get('/health/ready', async (_req: Request, res: Response) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.setHeader('Cache-Control', 'no-store');
    res.json({ status: 'ready' });
  } catch (error) {
    console.error('Readiness check failed', error);
    res.status(503).json({ status: 'not_ready' });
  }
});

app.post('/api/auth/register', authRateLimit, async (req: Request, res: Response) => {
  try {
    const parsed = parseBody(registerSchema, req.body);
    if (parsed.error) return res.status(400).json({ error: parsed.error });
    const { username, email, name, password, specialization } = parsed.data!;

    const normalizedUsername = username.trim().toLowerCase();
    const normalizedEmail = email.trim().toLowerCase();
    const existing = await prisma.user.findFirst({
      where: { OR: [{ username: normalizedUsername }, { email: normalizedEmail }] }
    });
    if (existing) {
      res.status(409).json({ error: 'An account with that username or email already exists' });
      return;
    }

    const user = await prisma.user.create({
      data: {
        username: normalizedUsername,
        email: normalizedEmail,
        name: name.trim(),
        passwordHash: await hashPassword(password),
        specialization,
      }
    });
    const token = createToken(user);
    res.setHeader('Set-Cookie', authCookie(token));
    res.status(201).json({ user: publicUser(user) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create account' });
  }
});

app.post('/api/auth/login', authRateLimit, async (req: Request, res: Response) => {
  try {
    const parsed = parseBody(loginSchema, req.body);
    if (parsed.error) return res.status(400).json({ error: parsed.error });
    const { identifier, password } = parsed.data!;
    const normalizedIdentifier = identifier.trim().toLowerCase();
    const user = await prisma.user.findFirst({
      where: { OR: [{ username: normalizedIdentifier }, { email: normalizedIdentifier }] }
    });
    if (!user || !(await verifyPassword(password, user.passwordHash))) {
      res.status(401).json({ error: 'Incorrect username or password' });
      return;
    }
    const token = createToken(user);
    res.setHeader('Set-Cookie', authCookie(token));
    res.json({ user: publicUser(user) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to authenticate' });
  }
});

app.post('/api/auth/logout', (_req: Request, res: Response) => {
  res.setHeader('Set-Cookie', authCookie('', 0));
  res.status(204).send();
});

app.get('/api/auth/me', requireAuth, (req: AuthenticatedRequest, res) => {
  res.json({ user: publicUser(req.user!) });
});

function publicUser(user: {
  id: string; username: string; email: string; name: string; role: string;
  avatar: string | null; specialization: string; points: number; level: number;
}) {
  const rewardThresholds = [0, 150, 400, 750];
  const currentThreshold = [...rewardThresholds].reverse().find((threshold) => user.points >= threshold) || 0;
  const nextThreshold = rewardThresholds.find((threshold) => threshold > user.points) || currentThreshold + 500;
  const levelProgress = user.points - currentThreshold;
  return {
    id: user.id, username: user.username, email: user.email, name: user.name,
    role: user.role, isAdmin: user.role === 'ADMIN', avatar: user.avatar,
    specialization: user.specialization, points: user.points, level: user.level,
    levelProgress, pointsToNextLevel: Math.max(0, nextThreshold - user.points),
  };
}

const REWARDS = [
  { id: 'heritage-explorer-badge', name: 'Heritage Explorer Badge', description: 'A digital badge for your Smarak profile.', icon: '🏛️', requiredLevel: 1, pointsRequired: 0, fulfillment: 'DIGITAL' },
  { id: 'smarak-tshirt', name: 'Smarak Heritage T-shirt', description: 'A limited-edition T-shirt inspired by Indian heritage motifs.', icon: '👕', requiredLevel: 3, pointsRequired: 400, fulfillment: 'PHYSICAL' },
  { id: 'artisan-notebook', name: 'Artisan Heritage Notebook', description: 'A handcrafted notebook celebrating Indian craft traditions.', icon: '📔', requiredLevel: 4, pointsRequired: 750, fulfillment: 'PHYSICAL' },
  { id: 'handloom-stole', name: 'Indian Handloom Stole', description: 'A handloom keepsake sourced from an Indian artisan collective.', icon: '🧣', requiredLevel: 5, pointsRequired: 1200, fulfillment: 'PHYSICAL' },
] as const;

function rewardCatalog(user: { points: number; level: number }, redemptions: Array<{ rewardId: string; status: string }>) {
  return REWARDS.map((reward) => {
    const redemption = redemptions.find((entry) => entry.rewardId === reward.id);
    return {
      ...reward,
      unlocked: user.level >= reward.requiredLevel && user.points >= reward.pointsRequired,
      redeemed: Boolean(redemption),
      redemptionStatus: redemption?.status || null,
    };
  });
}

const STORY_SUBMISSION_POINTS = 25;
const STORY_MODERATION_POINTS = 10;

async function awardPoints(userId: string, type: string, points: number, referenceId: string) {
  return prisma.$transaction(async (tx) => {
    try {
      await tx.rewardEvent.create({ data: { userId, type, points, referenceId } });
    } catch (error: any) {
      if (error?.code === 'P2002') return tx.user.findUnique({ where: { id: userId } });
      throw error;
    }
    const user = await tx.user.update({
      where: { id: userId },
      data: { points: { increment: points } },
    });
    const level = [0, 150, 400, 750].filter((threshold) => user.points >= threshold).length;
    return level === user.level ? user : tx.user.update({ where: { id: userId }, data: { level } });
  });
}

function jsonValue<T>(value: string | null | undefined, fallback: T): T {
  if (!value) return fallback;
  try { return JSON.parse(value) as T; } catch { return fallback; }
}

function normalizeHeritageCategory(category: string): string {
  const aliases: Record<string, string> = {
    crafts: 'craft',
    dress: 'tradition',
    festival: 'festival',
    festivals: 'festival',
    story: 'tradition',
    stories: 'tradition',
    vanishing: 'tradition',
    monument: 'site',
  };
  const normalized = category.trim().toLowerCase();
  return aliases[normalized] || normalized;
}

function cultureResponse(item: any) {
  return {
    ...item,
    images: jsonValue(item.images, []), videos: jsonValue(item.videos, []),
    audio: jsonValue(item.audio, []), traditions: jsonValue(item.traditions, []),
    tags: jsonValue(item.tags, []), ingredients: jsonValue(item.ingredients, []),
    materials: jsonValue(item.materials, []), instrumentsUsed: jsonValue(item.instrumentsUsed, []),
    occasions: jsonValue(item.occasions, []), patterns: jsonValue(item.patterns, []),
  };
}

function formatCity(city: any) {
  return {
    ...city,
    galleryImages: jsonValue(city.galleryImages, []),
    items: city.culturalEntries.map((entry: any) => ({
      id: entry.id,
      name: entry.title,
      category: entry.categoryType,
      era: 'present',
      status: entry.mediaStatus,
      description: entry.description,
      details: entry.history,
      image: entry.imageUrl,
      tags: jsonValue(entry.traditions, []),
      ingredients: jsonValue(entry.ingredients, []),
      materials: jsonValue(entry.materials, []),
    })),
    historyTimeline: city.historyTimeline,
    placesToVisit: city.placesToVisit,
  };
}

// API Routes

// Root route
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Welcome to the Smarak-XR API!', status: 'running' });
});

// Get all monuments
app.get('/api/monuments', async (req: Request, res: Response) => {
  try {
    const monuments = await prisma.monument.findMany({
      where: { status: 'APPROVED' },
      include: {
        creatures: {
          include: {
            creature: true
          }
        },
        hotspots: true,
        timeline: true
      }
    });

    // Transform the data to match the frontend types
    const formattedMonuments = monuments.map(m => ({
      id: m.id,
      name: m.name,
      hindiName: m.hindiName,
      location: m.location,
      state: m.state,
      region: m.region,
      period: m.period,
      dynasty: m.dynasty,
      unesco: m.unesco,
      builtYear: m.builtYear,
      tagline: m.tagline,
      shortDescription: m.shortDescription,
      fullHistory: m.fullHistory,
      architecturalStyle: m.architecturalStyle,
      modelType: m.modelType,
      accentColor: m.accentColor,
      coordinates: { lat: m.lat, lng: m.lng },
      featuredCreatures: m.creatures.map(c => c.creatureId),
      audioGuide: {
        titleEn: m.audioGuideTitleEn,
        transcriptEn: m.audioGuideTranscriptEn,
        transcriptHi: m.audioGuideTranscriptHi,
        durationSeconds: m.audioGuideDuration,
      },
      vrPano: {
        title: m.vrPanoTitle,
        aerialDesc: m.vrPanoAerialDesc,
        sanctumDesc: m.vrPanoSanctumDesc,
        courtyardDesc: m.vrPanoCourtyardDesc,
        aerialImage: m.vrPanoAerialImage,
        sanctumImage: m.vrPanoSanctumImage,
        courtyardImage: m.vrPanoCourtyardImage,
      },
      visitTips: {
        bestTime: m.visitTipsBestTime,
        aartiHours: m.visitTipsAartiHours,
        photography: m.visitTipsPhotography,
        dressCode: m.visitTipsDressCode,
      },
      hotspots: m.hotspots.map(h => ({
        id: h.id,
        title: h.title,
        description: h.description,
        position: [h.posX, h.posY, h.posZ],
        category: h.category,
        fact: h.fact,
      })),
      timeline: m.timeline.map(t => ({
        year: t.year,
        eraName: t.eraName,
        description: t.description,
        reconstructedCondition: t.reconstructedCondition,
        ruler: t.ruler,
      }))
    }));

    res.json(formattedMonuments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch monuments' });
  }
});

// Get all creatures
app.get('/api/creatures', async (req: Request, res: Response) => {
  try {
    const creatures = await prisma.creature.findMany({
      include: {
        monuments: true
      }
    });

    const formattedCreatures = creatures.map(c => ({
      ...c,
      primaryMonuments: c.monuments.map(m => m.monumentId)
    }));

    res.json(formattedCreatures);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch creatures' });
  }
});

// Get specific monument by ID
app.get('/api/monuments/:id', async (req: Request, res: Response) => {
  try {
    const m = await prisma.monument.findUnique({
      where: { id: req.params.id as string, status: 'APPROVED' },
      include: {
        creatures: {
          include: {
            creature: true
          }
        },
        hotspots: true,
        timeline: true
      }
    });

    if (!m) {
      return res.status(404).json({ error: 'Monument not found' });
    }

    const formattedMonument = {
      id: m.id,
      name: m.name,
      hindiName: m.hindiName,
      location: m.location,
      state: m.state,
      region: m.region,
      period: m.period,
      dynasty: m.dynasty,
      unesco: m.unesco,
      builtYear: m.builtYear,
      tagline: m.tagline,
      shortDescription: m.shortDescription,
      fullHistory: m.fullHistory,
      architecturalStyle: m.architecturalStyle,
      modelType: m.modelType,
      accentColor: m.accentColor,
      coordinates: { lat: m.lat, lng: m.lng },
      featuredCreatures: m.creatures.map(c => c.creatureId),
      audioGuide: {
        titleEn: m.audioGuideTitleEn,
        transcriptEn: m.audioGuideTranscriptEn,
        transcriptHi: m.audioGuideTranscriptHi,
        durationSeconds: m.audioGuideDuration,
      },
      vrPano: {
        title: m.vrPanoTitle,
        aerialDesc: m.vrPanoAerialDesc,
        sanctumDesc: m.vrPanoSanctumDesc,
        courtyardDesc: m.vrPanoCourtyardDesc,
        aerialImage: m.vrPanoAerialImage,
        sanctumImage: m.vrPanoSanctumImage,
        courtyardImage: m.vrPanoCourtyardImage,
      },
      visitTips: {
        bestTime: m.visitTipsBestTime,
        aartiHours: m.visitTipsAartiHours,
        photography: m.visitTipsPhotography,
        dressCode: m.visitTipsDressCode,
      },
      hotspots: m.hotspots.map(h => ({
        id: h.id,
        title: h.title,
        description: h.description,
        position: [h.posX, h.posY, h.posZ],
        category: h.category,
        fact: h.fact,
      })),
      timeline: m.timeline.map(t => ({
        year: t.year,
        eraName: t.eraName,
        description: t.description,
        reconstructedCondition: t.reconstructedCondition,
        ruler: t.ruler,
      }))
    };

    res.json(formattedMonument);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch monument' });
  }
});

// Get all cities
app.get('/api/cities', async (req: Request, res: Response) => {
  try {
    const cities = await prisma.city.findMany({
      include: { state: true, culturalEntries: true, historyTimeline: true, placesToVisit: true }
    });
    // Format to match frontend CityItem structure
    const formattedCities = cities.map(city => ({
      ...city,
      galleryImages: jsonValue(city.galleryImages, []),
      items: city.culturalEntries.map(entry => ({
        id: entry.id,
        name: entry.title,
        category: entry.categoryType,
        era: 'present', // fallback
        status: entry.mediaStatus,
        description: entry.description,
        details: entry.history,
        image: entry.imageUrl,
        tags: jsonValue(entry.traditions, []),
        ingredients: jsonValue(entry.ingredients, []),
        materials: jsonValue(entry.materials, []),
      })),
      historyTimeline: city.historyTimeline,
      placesToVisit: city.placesToVisit,
    }));
    res.json(formattedCities);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch cities' });
  }
});

// Get specific city
app.get('/api/cities/:id', async (req: Request, res: Response) => {
  try {
    const city = await prisma.city.findUnique({
      where: { id: req.params.id as string },
      include: { state: true, culturalEntries: true, historyTimeline: true, placesToVisit: true }
    });

    if (!city) return res.status(404).json({ error: 'City not found' });
    
    res.json({
      ...city,
      galleryImages: jsonValue(city.galleryImages, []),
      items: city.culturalEntries.map(entry => ({
        id: entry.id,
        name: entry.title,
        category: entry.categoryType,
        era: 'present',
        status: entry.mediaStatus,
        description: entry.description,
        details: entry.history,
        image: entry.imageUrl,
        tags: jsonValue(entry.traditions, []),
        ingredients: jsonValue(entry.ingredients, []),
        materials: jsonValue(entry.materials, []),
      })),
      historyTimeline: city.historyTimeline,
      placesToVisit: city.placesToVisit,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch city' });
  }
});

    app.get('/api/states', async (_req, res) => {
      try {
        const states = await prisma.state.findMany({ include: { cities: true, historyTimeline: true } });
        res.json(states.map((state) => ({ ...state, cultureOverview: jsonValue(state.cultureOverview, {}),
          featuredCities: jsonValue(state.featuredCities, []) })));
      } catch { res.status(500).json({ error: 'Failed to fetch states' }); }
    });

    app.get('/api/states/:id', async (req, res) => {
      const state = await prisma.state.findUnique({ where: { id: String(req.params.id) }, include: { cities: true, historyTimeline: true } });
      if (!state) return res.status(404).json({ error: 'State not found' });
      res.json({ ...state, cultureOverview: jsonValue(state.cultureOverview, []), featuredCities: jsonValue(state.featuredCities, []) });
    });

    // Culture is database-backed; category metadata remains a stable frontend contract.
    app.get('/api/culture/categories', (_req, res) => res.json([
      'dance', 'music', 'food', 'clothing', 'crafts', 'festivals', 'stories'
    ]));
    app.get('/api/culture/regions', async (_req, res) => {
      const regions = await prisma.cultureRegion.findMany();
      res.json(regions.map((r) => ({ ...r, featuredCategories: jsonValue(r.featuredCategories, []) })));
    });
    app.get('/api/culture/items', async (req, res) => {
      const { category, region, search, featured, arEnabled, mediaType } = req.query;
      const items = await prisma.cultureItem.findMany({
        where: {
          ...(typeof category === 'string' && category !== 'all' ? { category } : {}),
          ...(typeof region === 'string' && region !== 'all' ? { region } : {}),
          ...(featured === 'true' ? { featured: true } : {}),
          ...(arEnabled === 'true' ? { arEnabled: true } : {}),
        },
      });
      const q = typeof search === 'string' ? search.trim().toLowerCase() : '';
      res.json(items.map(cultureResponse).filter((item) => {
        if (mediaType === 'video' && !item.videos.length) return false;
        if (mediaType === 'audio' && !item.audio.length) return false;
        if (mediaType === 'image' && !item.images.length) return false;
        if (mediaType === 'model3d' && !item.model3d) return false;
        if (mediaType === 'ar' && !item.arEnabled) return false;
        return !q || [item.title, item.description, item.region, ...item.tags].join(' ').toLowerCase().includes(q);
      }));
    });
    app.get('/api/culture/items/:id', async (req, res) => {
      const item = await prisma.cultureItem.findUnique({ where: { id: req.params.id } });
      if (!item) return res.status(404).json({ error: 'Culture item not found' });
      res.json(cultureResponse(item));
    });

    app.post('/api/admin/culture/items', requireAuth, requireAdmin, async (req, res) => {
      try {
        const input = req.body as Record<string, unknown>;
        const data = {
          id: String(input.id || ''), title: String(input.title || ''), category: String(input.category || ''),
          region: String(input.region || ''), description: String(input.description || ''),
          thumbnail: typeof input.thumbnail === 'string' ? input.thumbnail : null,
          featured: input.featured === true, arEnabled: input.arEnabled === true,
        };
        if (!data.id || !data.title || !data.category || !data.region || !data.description) return res.status(400).json({ error: 'id, title, category, region, and description are required' });
        const item = await prisma.cultureItem.upsert({ where: { id: data.id }, update: data, create: data });
        res.status(201).json(cultureResponse(item));
      } catch { res.status(400).json({ error: 'Invalid culture item' }); }
    });
    app.delete('/api/admin/culture/items/:id', requireAuth, requireAdmin, async (req, res) => {
      await prisma.cultureItem.delete({ where: { id: String(req.params.id) } }); res.status(204).end();
    });
    app.post('/api/admin/culture/regions', requireAuth, requireAdmin, async (req, res) => {
      const input = req.body as Record<string, unknown>;
      if (typeof input.id !== 'string' || typeof input.name !== 'string') return res.status(400).json({ error: 'id and name are required' });
      const region = await prisma.cultureRegion.upsert({ where: { id: input.id }, update: { name: input.name, hindiName: typeof input.hindiName === 'string' ? input.hindiName : null, description: typeof input.description === 'string' ? input.description : null }, create: { id: input.id, name: input.name, hindiName: typeof input.hindiName === 'string' ? input.hindiName : null, description: typeof input.description === 'string' ? input.description : null } });
      res.status(201).json(region);
    });

    // Explore-prefixed routes are the canonical frontend contract; legacy routes above remain supported.
    app.get('/api/explore/states', async (_req, res) => {
      try {
        const states = await prisma.state.findMany({ include: { cities: true, historyTimeline: true } });
        res.json(states.map((state) => ({
          ...state,
          cultureOverview: jsonValue(state.cultureOverview, {}),
          featuredCities: jsonValue(state.featuredCities, []),
        })));
      } catch {
        res.status(500).json({ error: 'Failed to fetch states' });
      }
    });

    app.get('/api/explore/states/:id', async (req, res) => {
      const state = await prisma.state.findUnique({
        where: { id: String(req.params.id) },
        include: { cities: true, historyTimeline: true },
      });
      if (!state) return res.status(404).json({ error: 'State not found' });
      res.json({
        ...state,
        cultureOverview: jsonValue(state.cultureOverview, {}),
        featuredCities: jsonValue(state.featuredCities, []),
      });
    });

    app.get('/api/explore/states/:id/cities', async (req, res) => {
      const state = await prisma.state.findUnique({ where: { id: String(req.params.id) }, select: { id: true } });
      if (!state) return res.status(404).json({ error: 'State not found' });
      const cities = await prisma.city.findMany({
        where: { stateId: String(req.params.id) },
        include: { state: true, culturalEntries: true, historyTimeline: true, placesToVisit: true },
      });
      res.json(cities.map(formatCity));
    });

    app.get('/api/explore/cities/:id', async (req, res) => {
      const city = await prisma.city.findUnique({
        where: { id: String(req.params.id) },
        include: { state: true, culturalEntries: true, historyTimeline: true, placesToVisit: true },
      });
      if (!city) return res.status(404).json({ error: 'City not found' });
      res.json(formatCity(city));
    });

    // Get heritage items
app.get('/api/heritage/items', async (req: Request, res: Response) => {
  try {
    const items = await prisma.heritageItem.findMany();
    res.json(items.map(item => ({
      ...item,
      tags: item.tags ? JSON.parse(item.tags) : undefined
    })));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch heritage items' });
  }
});

// Get adopt items
app.get('/api/heritage/adopt', async (req: Request, res: Response) => {
  try {
    const search = typeof req.query.search === 'string' ? req.query.search.trim().toLowerCase() : '';
    const category = typeof req.query.category === 'string' ? req.query.category.trim().toLowerCase() : '';
    const location = typeof req.query.location === 'string' ? req.query.location.trim().toLowerCase() : '';
    const [items, culturalEntries, heritageItems] = await Promise.all([
      prisma.adoptItem.findMany(),
      prisma.culturalEntry.findMany({ include: { city: true } }),
      prisma.heritageItem.findMany(),
    ]);
    const adoptionItems = items.map(item => ({
      ...item,
      source: 'adoption',
      city: item.region,
      tasks: JSON.parse(item.tasks),
    }));
    const cultureItems = culturalEntries
      .filter((item) => ['food', 'dance', 'music', 'story', 'dress', 'festival', 'vanishing'].includes(item.categoryType.toLowerCase()))
      .map((item) => ({
        id: `culture-${item.id}`,
        title: item.title,
        category: item.categoryType,
        region: item.city.name,
        state: item.city.stateName,
        city: item.city.name,
        description: item.description,
        history: item.history,
        image: item.imageUrl || item.imagePlaceholder || undefined,
        ingredients: item.ingredients ? jsonValue(item.ingredients, []) : [],
        difficulty: 'Explore',
        timeRequired: 'Self-paced',
        preservationImpact: 'Discover and share this living tradition',
        adopted: false,
        tasks: [],
        source: 'culture',
      }))
      .filter((item) => {
        const haystack = `${item.title} ${item.category} ${item.description} ${item.city} ${item.state}`.toLowerCase();
        return (!search || haystack.includes(search)) &&
          (!category || item.category.toLowerCase() === category) &&
          (!location || haystack.includes(location));
      });
    const preservedHeritageItems = heritageItems
      .map((item) => ({
        id: `heritage-${item.id}`,
        title: item.title,
        category: item.category.toLowerCase(),
        region: item.region,
        state: item.state,
        city: item.region,
        description: item.description,
        history: item.history,
        image: item.image,
        ingredients: [],
        difficulty: 'Explore',
        timeRequired: 'Self-paced',
        preservationImpact: 'Discover and share this living tradition',
        adopted: false,
        tasks: [],
        source: 'heritage',
        tags: item.tags ? jsonValue(item.tags, []) : [],
      }))
      .filter((item) => {
        const haystack = `${item.title} ${item.category} ${item.description} ${item.city} ${item.state} ${item.region} ${item.tags.join(' ')}`.toLowerCase();
        return (!search || haystack.includes(search)) &&
          (!category || normalizeHeritageCategory(item.category) === normalizeHeritageCategory(category)) &&
          (!location || haystack.includes(location));
      });
    const filteredAdoptions = adoptionItems.filter((item) => {
      const haystack = `${item.title} ${item.category} ${item.description} ${item.city} ${item.state}`.toLowerCase();
      return (!search || haystack.includes(search)) &&
        (!category || item.category.toLowerCase() === category) &&
        (!location || haystack.includes(location));
    });
    res.json([...filteredAdoptions, ...cultureItems, ...preservedHeritageItems]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch adopt items' });
  }
});

// Get story items
app.get('/api/heritage/stories', async (req: Request, res: Response) => {
  try {
    const items = await prisma.storyItem.findMany({ where: { status: { in: ['APPROVED', 'approved', 'VERIFIED', 'verified', 'published'] } } });
    res.json(items.map(item => ({
      ...item,
      recipeIngredients: item.recipeIngredients ? JSON.parse(item.recipeIngredients) : undefined
    })));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch stories' });
  }
});

app.post('/api/heritage/stories', requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const parsed = parseBody(storySchema, req.body);
    if (parsed.error) return res.status(400).json({ error: parsed.error });
    const data = parsed.data!;
    const story = await prisma.storyItem.create({ data: {
      id: randomUUID(),
      title: data.title, category: data.category, region: data.region, state: data.state,
      preservedBy: data.preservedBy || req.user!.name, date: data.date || new Date().toISOString(),
      shortStory: data.shortStory, fullStory: data.fullStory, mediaType: data.mediaType || 'text',
      image: data.image, audioUrl: data.audioUrl, videoUrl: data.videoUrl,
      recipeIngredients: data.recipeIngredients ? JSON.stringify(data.recipeIngredients) : null,
      status: 'PENDING', submittedById: req.user!.id,
    }});
    const user = await awardPoints(req.user!.id, 'STORY_SUBMITTED', STORY_SUBMISSION_POINTS, story.id);
    res.status(201).json({ ...story, reward: { pointsAwarded: STORY_SUBMISSION_POINTS, totalPoints: user?.points, level: user?.level } });
  } catch { res.status(400).json({ error: 'Failed to submit story' }); }
});
app.post('/api/heritage/stories/:id/review', requireAuth, async (req: AuthenticatedRequest, res) => {
  const story = await prisma.storyItem.findUnique({ where: { id: String(req.params.id) } });
  if (!story || story.status.toUpperCase() !== 'APPROVED') {
    res.status(404).json({ error: 'Approved story not found' });
    return;
  }
  if (story.submittedById === req.user!.id) {
    res.status(400).json({ error: 'You cannot review your own story' });
    return;
  }
  const reward = await awardPoints(req.user!.id, 'STORY_REVIEWED', 5, story.id);
  res.json({ reviewed: true, reward: { pointsAwarded: reward ? 5 : 0, totalPoints: reward?.points, level: reward?.level } });
});
app.get('/api/heritage/stories/mine', requireAuth, async (req: AuthenticatedRequest, res) => {
  const stories = await prisma.storyItem.findMany({ where: { submittedById: req.user!.id }, orderBy: { submittedAt: 'desc' } });
  res.json(stories);
});
app.get('/api/heritage/stories/me', requireAuth, async (req: AuthenticatedRequest, res) => {
  const stories = await prisma.storyItem.findMany({ where: { submittedById: req.user!.id }, orderBy: { submittedAt: 'desc' } });
  res.json(stories);
});

app.get('/api/adoptions/me', requireAuth, async (req: AuthenticatedRequest, res) => {
  const rows = await prisma.userAdoption.findMany({ where: { userId: req.user!.id }, include: { adoptItem: true } });
  res.json(rows.map((row) => ({ ...row.adoptItem, tasks: jsonValue(row.adoptItem.tasks, []), adoption: { id: row.id, status: row.status, completedTasks: jsonValue(row.completedTasks, []), createdAt: row.createdAt, updatedAt: row.updatedAt } })));
});
app.post('/api/adoptions/:itemId', requireAuth, async (req: AuthenticatedRequest, res) => {
  const item = await prisma.adoptItem.findUnique({ where: { id: String(req.params.itemId) } });
  if (!item) return res.status(404).json({ error: 'Adoption item not found' });
  const row = await prisma.userAdoption.upsert({ where: { userId_adoptItemId: { userId: req.user!.id, adoptItemId: item.id } }, update: { status: 'ACTIVE' }, create: { userId: req.user!.id, adoptItemId: item.id } });
  res.status(201).json({ ...row, tasks: jsonValue(item.tasks, []) });
});
app.patch('/api/adoptions/:itemId', requireAuth, async (req: AuthenticatedRequest, res) => {
  const parsed = parseBody(adoptionUpdateSchema, req.body);
  if (parsed.error) return res.status(400).json({ error: parsed.error });
  const completedTasks = parsed.data!.completedTasks;
  const row = await prisma.userAdoption.update({ where: { userId_adoptItemId: { userId: req.user!.id, adoptItemId: String(req.params.itemId) } }, data: { completedTasks: JSON.stringify(completedTasks), status: req.body.status === 'COMPLETED' ? 'COMPLETED' : 'ACTIVE' } });
  res.json({ ...row, completedTasks });
});
app.delete('/api/adoptions/:itemId', requireAuth, async (req: AuthenticatedRequest, res) => {
  await prisma.userAdoption.delete({ where: { userId_adoptItemId: { userId: req.user!.id, adoptItemId: String(req.params.itemId) } } }); res.status(204).end();
});

app.get('/api/profile/me', requireAuth, (req: AuthenticatedRequest, res) => res.json({ user: publicUser(req.user!) }));
app.get('/api/rewards', requireAuth, async (req: AuthenticatedRequest, res) => {
  const redemptions = await prisma.rewardRedemption.findMany({
    where: { userId: req.user!.id },
    select: { rewardId: true, status: true },
  });
  res.json({ rewards: rewardCatalog(req.user!, redemptions) });
});
app.post('/api/rewards/:rewardId/redeem', requireAuth, async (req: AuthenticatedRequest, res) => {
  const reward = REWARDS.find((entry) => entry.id === String(req.params.rewardId));
  if (!reward) return res.status(404).json({ error: 'Reward not found' });
  if (req.user!.level < reward.requiredLevel || req.user!.points < reward.pointsRequired) {
    return res.status(403).json({ error: `Reach level ${reward.requiredLevel} and ${reward.pointsRequired} points to unlock this reward` });
  }
  try {
    const redemption = await prisma.rewardRedemption.create({
      data: { userId: req.user!.id, rewardId: reward.id },
    });
    res.status(201).json({ reward, redemption });
  } catch (error: any) {
    if (error?.code === 'P2002') return res.status(409).json({ error: 'You have already claimed this reward' });
    console.error(error);
    res.status(500).json({ error: 'Failed to claim reward' });
  }
});
app.patch('/api/profile/me', requireAuth, async (req: AuthenticatedRequest, res) => {
  const parsed = parseBody(profileSchema, req.body);
  if (parsed.error) return res.status(400).json({ error: parsed.error });
  const data = parsed.data!;
  const user = await prisma.user.update({ where: { id: req.user!.id }, data });
  res.json({ user: publicUser(user) });
});

app.get('/api/admin/moderation/stories', requireAuth, requireAdmin, async (_req, res) => {
  const stories = await prisma.storyItem.findMany({ where: { status: 'PENDING' }, orderBy: { submittedAt: 'asc' } });
  res.json({ stories });
});
app.put('/api/admin/moderation/stories/:id', requireAuth, requireAdmin, async (req: AuthenticatedRequest, res) => {
  const parsed = parseBody(moderationSchema, req.body);
  if (parsed.error) return res.status(400).json({ error: parsed.error });
  const { status, note } = parsed.data!;
  const existing = await prisma.storyItem.findUnique({ where: { id: String(req.params.id) }, select: { id: true, moderatedAt: true } });
  if (!existing) return res.status(404).json({ error: 'Story not found' });
  const story = await prisma.storyItem.update({ where: { id: existing.id }, data: { status, moderatedAt: new Date(), moderatedById: req.user!.id, moderationNote: note || null } });
  const reward = existing.moderatedAt ? null : await awardPoints(req.user!.id, 'STORY_MODERATED', STORY_MODERATION_POINTS, story.id);
  res.json({ story, reward: reward ? { pointsAwarded: STORY_MODERATION_POINTS, totalPoints: reward.points, level: reward.level } : { pointsAwarded: 0, alreadyAwarded: true } });
});

// --- SUBMISSION & ADMIN ROUTES ---

// Submit a new monument (User)
app.post('/api/submissions/monuments', requireAuth, async (req: Request, res: Response) => {
  try {
    const parsed = parseBody(monumentSubmissionSchema, req.body);
    if (parsed.error) return res.status(400).json({ error: parsed.error });
    const { id, name, hindiName, location, state, region, period, dynasty, builtYear, shortDescription, fullHistory } = parsed.data!;
    
    const newMonument = await prisma.monument.create({
      data: {
        id: id || name.toLowerCase().replace(/\s+/g, '-'),
        name,
        hindiName: hindiName || '',
        location,
        state,
        region,
        period,
        dynasty,
        unesco: false,
        builtYear: Number(builtYear),
        tagline: 'A waiting discovery',
        shortDescription,
        fullHistory,
        architecturalStyle: 'Unknown',
        modelType: 'default',
        accentColor: '#CCCCCC',
        lat: 0,
        lng: 0,
        status: 'PENDING',
        
        audioGuideTitleEn: '', audioGuideTranscriptEn: '', audioGuideTranscriptHi: '', audioGuideDuration: 0,
        vrPanoTitle: '', vrPanoAerialDesc: '', vrPanoSanctumDesc: '', vrPanoCourtyardDesc: '',
        vrPanoAerialImage: '', vrPanoSanctumImage: '', vrPanoCourtyardImage: '',
        visitTipsBestTime: '', visitTipsAartiHours: '', visitTipsPhotography: '', visitTipsDressCode: ''
      }
    });
    
    res.status(201).json({ message: 'Submission received and is pending admin approval.', data: newMonument });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to submit monument.' });
  }
});

// Get all pending submissions (Admin only)
app.get('/api/admin/submissions', requireAuth, requireAdmin, async (req: Request, res: Response) => {
  try {
    const pendingMonuments = await prisma.monument.findMany({
      where: { status: 'PENDING' }
    });
    
    res.json({ monuments: pendingMonuments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch submissions' });
  }
});

// Verify (approve/reject) a submission (Admin only)
app.put('/api/admin/submissions/:id/verify', requireAuth, requireAdmin, async (req: Request, res: Response) => {
  try {
    const { status } = req.body; // 'APPROVED' or 'REJECTED'
    
    if (status !== 'APPROVED' && status !== 'REJECTED') {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const updatedMonument = await prisma.monument.update({
      where: { id: req.params.id as string },
      data: { status }
    });
    
    res.json({ message: `Monument successfully ${status}`, data: updatedMonument });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update submission status' });
  }
});

export { app };

if (require.main === module) {
  const server: Server = app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });

  let shuttingDown = false;
  const shutdown = (signal: string) => {
    if (shuttingDown) return;
    shuttingDown = true;
    console.log(`Received ${signal}; shutting down gracefully`);

    const timeout = setTimeout(() => {
      console.error('Graceful shutdown timed out');
      process.exit(1);
    }, Number(process.env.SHUTDOWN_TIMEOUT_MS || 10000));
    timeout.unref();

    server.close(async (error) => {
      if (error) {
        console.error('Failed to close HTTP server', error);
        process.exitCode = 1;
      }
      await prisma.$disconnect();
      clearTimeout(timeout);
      if (error) process.exit(1);
    });
  };

  process.once('SIGTERM', () => shutdown('SIGTERM'));
  process.once('SIGINT', () => shutdown('SIGINT'));
}
