-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Monument" (
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
    "status" TEXT NOT NULL DEFAULT 'APPROVED',
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
INSERT INTO "new_Monument" ("accentColor", "architecturalStyle", "audioGuideDuration", "audioGuideTitleEn", "audioGuideTranscriptEn", "audioGuideTranscriptHi", "builtYear", "dynasty", "fullHistory", "hindiName", "id", "lat", "lng", "location", "modelType", "name", "period", "region", "shortDescription", "state", "tagline", "unesco", "visitTipsAartiHours", "visitTipsBestTime", "visitTipsDressCode", "visitTipsPhotography", "vrPanoAerialDesc", "vrPanoAerialImage", "vrPanoCourtyardDesc", "vrPanoCourtyardImage", "vrPanoSanctumDesc", "vrPanoSanctumImage", "vrPanoTitle") SELECT "accentColor", "architecturalStyle", "audioGuideDuration", "audioGuideTitleEn", "audioGuideTranscriptEn", "audioGuideTranscriptHi", "builtYear", "dynasty", "fullHistory", "hindiName", "id", "lat", "lng", "location", "modelType", "name", "period", "region", "shortDescription", "state", "tagline", "unesco", "visitTipsAartiHours", "visitTipsBestTime", "visitTipsDressCode", "visitTipsPhotography", "vrPanoAerialDesc", "vrPanoAerialImage", "vrPanoCourtyardDesc", "vrPanoCourtyardImage", "vrPanoSanctumDesc", "vrPanoSanctumImage", "vrPanoTitle" FROM "Monument";
DROP TABLE "Monument";
ALTER TABLE "new_Monument" RENAME TO "Monument";
CREATE TABLE "new_PlaceToVisit" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "shortDescription" TEXT NOT NULL,
    "fullDescription" TEXT,
    "location" TEXT,
    "imagePlaceholder" TEXT,
    "imageUrl" TEXT,
    "arAvailable" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'APPROVED',
    "cityId" TEXT NOT NULL,
    CONSTRAINT "PlaceToVisit_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_PlaceToVisit" ("arAvailable", "category", "cityId", "fullDescription", "id", "imagePlaceholder", "imageUrl", "location", "name", "shortDescription") SELECT "arAvailable", "category", "cityId", "fullDescription", "id", "imagePlaceholder", "imageUrl", "location", "name", "shortDescription" FROM "PlaceToVisit";
DROP TABLE "PlaceToVisit";
ALTER TABLE "new_PlaceToVisit" RENAME TO "PlaceToVisit";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
