import { PrismaClient } from '@prisma/client';
// @ts-ignore
import { MONUMENTS } from '../../src/data/monuments';
// @ts-ignore
import { SACRED_CREATURES } from '../../src/data/creatures';
// @ts-ignore
import { CITY_DATA } from '../../src/data/cityData';
// @ts-ignore
import { HERITAGE_ITEMS, ADOPT_ITEMS, PRESERVED_STORIES } from '../../src/data/heritageAliveData';
// @ts-ignore
import { CULTURE_CATEGORIES, DEFAULT_CULTURE_REGIONS } from '../../src/services/cultureService';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database with ALL data...');

  // 1. Seed Creatures
  for (const c of SACRED_CREATURES as any[]) {
    await prisma.creature.upsert({
      where: { id: c.id },
      update: {},
      create: {
        id: c.id,
        name: c.name,
        sanskritName: c.sanskritName,
        title: c.title,
        associatedDeity: c.associatedDeity,
        symbolism: c.symbolism,
        anatomy: c.anatomy,
        mythology: c.mythology,
        carvingLocation: c.carvingLocation,
        colorHex: c.colorHex,
        badgeTitle: c.badgeTitle,
      },
    });
  }

  // 2. Seed Monuments (same as before)
  for (const m of MONUMENTS as any[]) {
    await prisma.monument.upsert({
      where: { id: m.id },
      update: {},
      create: {
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
        lat: m.coordinates.lat,
        lng: m.coordinates.lng,
        
        audioGuideTitleEn: m.audioGuide.titleEn,
        audioGuideTranscriptEn: m.audioGuide.transcriptEn,
        audioGuideTranscriptHi: m.audioGuide.transcriptHi,
        audioGuideDuration: m.audioGuide.durationSeconds,

        vrPanoTitle: m.vrPano.title,
        vrPanoAerialDesc: m.vrPano.aerialDesc,
        vrPanoSanctumDesc: m.vrPano.sanctumDesc,
        vrPanoCourtyardDesc: m.vrPano.courtyardDesc,
        vrPanoAerialImage: m.vrPano.aerialImage,
        vrPanoSanctumImage: m.vrPano.sanctumImage,
        vrPanoCourtyardImage: m.vrPano.courtyardImage,

        visitTipsBestTime: m.visitTips.bestTime,
        visitTipsAartiHours: m.visitTips.aartiHours,
        visitTipsPhotography: m.visitTips.photography,
        visitTipsDressCode: m.visitTips.dressCode,
      },
    });

    if (m.featuredCreatures) {
      for (const cId of m.featuredCreatures) {
        await prisma.monumentCreature.upsert({
          where: { monumentId_creatureId: { monumentId: m.id, creatureId: cId } },
          update: {},
          create: { monumentId: m.id, creatureId: cId }
        });
      }
    }

    if (m.hotspots) {
      for (const h of m.hotspots) {
        await prisma.architecturalHotspot.upsert({
          where: { id: h.id },
          update: {},
          create: {
            id: h.id,
            title: h.title,
            description: h.description,
            posX: h.position[0],
            posY: h.position[1],
            posZ: h.position[2],
            category: h.category,
            fact: h.fact,
            monumentId: m.id,
          }
        });
      }
    }

    if (m.timeline) {
      for (const t of m.timeline) {
        await prisma.historicalEra.create({
          data: {
            year: t.year,
            eraName: t.eraName,
            description: t.description,
            reconstructedCondition: t.reconstructedCondition,
            ruler: t.ruler,
            monumentId: m.id,
          }
        });
      }
    }
  }

  // 3. Seed States & Cities (Mapping CITY_DATA)
  for (const city of CITY_DATA as any[]) {
    // Upsert State
    const stateId = city.state.toLowerCase().replace(/\s+/g, '-');
    await prisma.state.upsert({
      where: { id: stateId },
      update: {},
      create: {
        id: stateId,
        name: city.state,
        tagline: `State of ${city.state}`,
        description: `Explore the vibrant culture of ${city.state}`,
        region: 'Unknown',
        capital: city.name,
        overview: `Overview of ${city.state}`,
        cultureOverview: JSON.stringify({}),
        featuredCities: JSON.stringify([city.id]),
      }
    });

    // Upsert City
    await prisma.city.upsert({
      where: { id: city.id },
      update: {},
      create: {
        id: city.id,
        stateId: stateId,
        stateName: city.state,
        name: city.name,
        tagline: `City of ${city.name}`,
        description: city.description || `Explore ${city.name}`,
        heroImage: city.heroImage,
        videoCount: 0,
        galleryImages: JSON.stringify([]),
      }
    });

    // Map CityItems to CulturalEntry
    if (city.items) {
      for (const item of city.items) {
        await prisma.culturalEntry.upsert({
          where: { id: item.id },
          update: {},
          create: {
            id: item.id,
            cityId: city.id,
            title: item.name,
            categoryType: item.category,
            description: item.description,
            history: item.details,
            mediaStatus: 'available',
            imageUrl: item.image,
            traditions: item.tags ? JSON.stringify(item.tags) : null,
            ingredients: item.ingredients ? JSON.stringify(item.ingredients) : null,
            materials: item.materials ? JSON.stringify(item.materials) : null,
          }
        });
      }
    }
  }

  // 4. Seed Heritage Items
  for (const item of HERITAGE_ITEMS as any[]) {
    await prisma.heritageItem.upsert({
      where: { id: item.id },
      update: {},
      create: {
        id: item.id,
        title: item.title,
        subtitle: item.subtitle,
        category: item.category,
        region: item.region,
        state: item.state,
        status: item.status,
        description: item.description,
        origin: item.origin,
        significance: item.significance,
        history: item.history,
        image: item.image,
        tags: item.tags ? JSON.stringify(item.tags) : null,
        artisanCount: item.artisanCount,
        featured: item.featured || false,
      }
    });
  }

  // 5. Seed Adopt Items
  for (const item of ADOPT_ITEMS as any[]) {
    await prisma.adoptItem.upsert({
      where: { id: item.id },
      update: {},
      create: {
        id: item.id,
        title: item.title,
        category: item.category,
        region: item.region,
        state: item.state,
        difficulty: item.difficulty,
        timeRequired: item.timeRequired,
        preservationImpact: item.preservationImpact,
        description: item.description,
        adopted: item.adopted || false,
        tasks: item.tasks ? JSON.stringify(item.tasks) : '[]',
      }
    });
  }

  // 6. Seed Story Items
  for (const item of PRESERVED_STORIES as any[]) {
    await prisma.storyItem.upsert({
      where: { id: item.id },
      update: {},
      create: {
        id: item.id,
        title: item.title,
        category: item.category,
        region: item.region,
        state: item.state,
        preservedBy: item.preservedBy,
        date: item.date,
        shortStory: item.shortStory,
        fullStory: item.fullStory,
        mediaType: item.mediaType,
        status: item.status,
        image: item.image,
        recipeIngredients: item.recipeIngredients ? JSON.stringify(item.recipeIngredients) : null,
      }
    });
  }

  // 7. Seed Culture Regions
  for (const item of DEFAULT_CULTURE_REGIONS as any[]) {
    await prisma.cultureRegion.upsert({
      where: { id: item.id },
      update: {},
      create: {
        id: item.id,
        name: item.name,
        hindiName: item.hindiName,
        description: item.description,
      }
    });
  }

  console.log('Database seeded successfully with all domains!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
