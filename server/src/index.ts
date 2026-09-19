import express, { Request, Response } from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

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
      include: { state: true, culturalEntries: true }
    });
    // Format to match frontend CityItem structure
    const formattedCities = cities.map(city => ({
      ...city,
      items: city.culturalEntries.map(entry => ({
        id: entry.id,
        name: entry.title,
        category: entry.categoryType,
        era: 'present', // fallback
        status: entry.mediaStatus,
        description: entry.description,
        details: entry.history,
        image: entry.imageUrl,
        tags: entry.traditions ? JSON.parse(entry.traditions) : undefined,
        ingredients: entry.ingredients ? JSON.parse(entry.ingredients) : undefined,
        materials: entry.materials ? JSON.parse(entry.materials) : undefined,
      }))
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
      include: { state: true, culturalEntries: true }
    });
    if (!city) return res.status(404).json({ error: 'City not found' });
    
    res.json({
      ...city,
      items: city.culturalEntries.map(entry => ({
        id: entry.id,
        name: entry.title,
        category: entry.categoryType,
        era: 'present',
        status: entry.mediaStatus,
        description: entry.description,
        details: entry.history,
        image: entry.imageUrl,
        tags: entry.traditions ? JSON.parse(entry.traditions) : undefined,
        ingredients: entry.ingredients ? JSON.parse(entry.ingredients) : undefined,
        materials: entry.materials ? JSON.parse(entry.materials) : undefined,
      }))
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch city' });
  }
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
    const items = await prisma.adoptItem.findMany();
    res.json(items.map(item => ({
      ...item,
      tasks: JSON.parse(item.tasks)
    })));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch adopt items' });
  }
});

// Get story items
app.get('/api/heritage/stories', async (req: Request, res: Response) => {
  try {
    const items = await prisma.storyItem.findMany();
    res.json(items.map(item => ({
      ...item,
      recipeIngredients: item.recipeIngredients ? JSON.parse(item.recipeIngredients) : undefined
    })));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch stories' });
  }
});

// --- SUBMISSION & ADMIN ROUTES ---

// Submit a new monument (User)
app.post('/api/submissions/monuments', async (req: Request, res: Response) => {
  try {
    const { id, name, hindiName, location, state, region, period, dynasty, builtYear, shortDescription, fullHistory } = req.body;
    
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
app.get('/api/admin/submissions', async (req: Request, res: Response) => {
  try {
    // In a real app, verify admin authentication token here
    if (req.query.adminKey !== 'secret123') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

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
app.put('/api/admin/submissions/:id/verify', async (req: Request, res: Response) => {
  try {
    if (req.query.adminKey !== 'secret123') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

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

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
