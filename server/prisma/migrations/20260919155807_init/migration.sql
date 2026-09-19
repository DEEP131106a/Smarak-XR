-- CreateTable
CREATE TABLE "Monument" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "hindiName" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "period" TEXT NOT NULL,
    "dynasty" TEXT NOT NULL,
    "unesco" BOOLEAN NOT NULL,
    "builtYear" INTEGER NOT NULL,
    "tagline" TEXT NOT NULL,
    "shortDescription" TEXT NOT NULL,
    "fullHistory" TEXT NOT NULL,
    "architecturalStyle" TEXT NOT NULL,
    "modelType" TEXT NOT NULL,
    "accentColor" TEXT NOT NULL,
    "lat" REAL NOT NULL,
    "lng" REAL NOT NULL,
    "audioGuideTitleEn" TEXT NOT NULL,
    "audioGuideTranscriptEn" TEXT NOT NULL,
    "audioGuideTranscriptHi" TEXT NOT NULL,
    "audioGuideDuration" INTEGER NOT NULL,
    "vrPanoTitle" TEXT NOT NULL,
    "vrPanoAerialDesc" TEXT NOT NULL,
    "vrPanoSanctumDesc" TEXT NOT NULL,
    "vrPanoCourtyardDesc" TEXT NOT NULL,
    "vrPanoAerialImage" TEXT NOT NULL,
    "vrPanoSanctumImage" TEXT NOT NULL,
    "vrPanoCourtyardImage" TEXT NOT NULL,
    "visitTipsBestTime" TEXT NOT NULL,
    "visitTipsAartiHours" TEXT NOT NULL,
    "visitTipsPhotography" TEXT NOT NULL,
    "visitTipsDressCode" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Creature" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "sanskritName" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "associatedDeity" TEXT NOT NULL,
    "symbolism" TEXT NOT NULL,
    "anatomy" TEXT NOT NULL,
    "mythology" TEXT NOT NULL,
    "carvingLocation" TEXT NOT NULL,
    "colorHex" TEXT NOT NULL,
    "badgeTitle" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "MonumentCreature" (
    "monumentId" TEXT NOT NULL,
    "creatureId" TEXT NOT NULL,

    PRIMARY KEY ("monumentId", "creatureId"),
    CONSTRAINT "MonumentCreature_monumentId_fkey" FOREIGN KEY ("monumentId") REFERENCES "Monument" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "MonumentCreature_creatureId_fkey" FOREIGN KEY ("creatureId") REFERENCES "Creature" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "HistoricalEra" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "year" TEXT NOT NULL,
    "eraName" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "reconstructedCondition" TEXT NOT NULL,
    "ruler" TEXT NOT NULL,
    "monumentId" TEXT NOT NULL,
    CONSTRAINT "HistoricalEra_monumentId_fkey" FOREIGN KEY ("monumentId") REFERENCES "Monument" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ArchitecturalHotspot" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "posX" REAL NOT NULL,
    "posY" REAL NOT NULL,
    "posZ" REAL NOT NULL,
    "category" TEXT NOT NULL,
    "fact" TEXT NOT NULL,
    "monumentId" TEXT NOT NULL,
    CONSTRAINT "ArchitecturalHotspot_monumentId_fkey" FOREIGN KEY ("monumentId") REFERENCES "Monument" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
