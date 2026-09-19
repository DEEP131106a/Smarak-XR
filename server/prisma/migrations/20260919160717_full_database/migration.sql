-- CreateTable
CREATE TABLE "State" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "hindiName" TEXT,
    "tagline" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "capital" TEXT NOT NULL,
    "heroPlaceholder" TEXT,
    "overview" TEXT NOT NULL,
    "cultureOverview" TEXT NOT NULL,
    "featuredCities" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "City" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "stateId" TEXT NOT NULL,
    "stateName" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "hindiName" TEXT,
    "tagline" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "heroPlaceholder" TEXT,
    "heroImage" TEXT,
    "videoCount" INTEGER NOT NULL,
    "arEnabled" BOOLEAN NOT NULL DEFAULT false,
    "galleryImages" TEXT NOT NULL,
    CONSTRAINT "City_stateId_fkey" FOREIGN KEY ("stateId") REFERENCES "State" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TimelineEvent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "period" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "significance" TEXT,
    "cityId" TEXT,
    "stateId" TEXT,
    CONSTRAINT "TimelineEvent_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "TimelineEvent_stateId_fkey" FOREIGN KEY ("stateId") REFERENCES "State" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PlaceToVisit" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "shortDescription" TEXT NOT NULL,
    "fullDescription" TEXT,
    "location" TEXT,
    "imagePlaceholder" TEXT,
    "imageUrl" TEXT,
    "arAvailable" BOOLEAN NOT NULL DEFAULT false,
    "cityId" TEXT NOT NULL,
    CONSTRAINT "PlaceToVisit_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CulturalEntry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "categoryType" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT,
    "description" TEXT NOT NULL,
    "history" TEXT,
    "mediaStatus" TEXT NOT NULL,
    "traditions" TEXT,
    "ingredients" TEXT,
    "materials" TEXT,
    "occasions" TEXT,
    "costumeDetails" TEXT,
    "imagePlaceholder" TEXT,
    "imageUrl" TEXT,
    "videoPlaceholderText" TEXT,
    "audioPlaceholderText" TEXT,
    "cityId" TEXT NOT NULL,
    CONSTRAINT "CulturalEntry_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CultureRegion" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "hindiName" TEXT,
    "description" TEXT,
    "thumbnail" TEXT,
    "featuredCategories" TEXT
);

-- CreateTable
CREATE TABLE "CultureItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "thumbnail" TEXT,
    "model3d" TEXT,
    "arEnabled" BOOLEAN NOT NULL DEFAULT false,
    "history" TEXT,
    "origin" TEXT,
    "language" TEXT,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "preparation" TEXT,
    "culturalStory" TEXT,
    "craftsmanship" TEXT,
    "artisanStory" TEXT,
    "costumeDetails" TEXT,
    "culturalSignificance" TEXT,
    "images" TEXT,
    "videos" TEXT,
    "audio" TEXT,
    "traditions" TEXT,
    "tags" TEXT,
    "ingredients" TEXT,
    "materials" TEXT,
    "instrumentsUsed" TEXT,
    "occasions" TEXT,
    "patterns" TEXT
);

-- CreateTable
CREATE TABLE "HeritageItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "subtitle" TEXT,
    "category" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "origin" TEXT,
    "significance" TEXT,
    "history" TEXT,
    "image" TEXT,
    "audioPlaceholderText" TEXT,
    "videoPlaceholderText" TEXT,
    "artisanCount" INTEGER,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "tags" TEXT
);

-- CreateTable
CREATE TABLE "AdoptItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "difficulty" TEXT NOT NULL,
    "timeRequired" TEXT NOT NULL,
    "preservationImpact" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "adopted" BOOLEAN NOT NULL DEFAULT false,
    "tasks" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "StoryItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "preservedBy" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "shortStory" TEXT NOT NULL,
    "fullStory" TEXT,
    "mediaType" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "image" TEXT,
    "audioUrl" TEXT,
    "videoUrl" TEXT,
    "recipeIngredients" TEXT
);
