-- CreateTable
CREATE TABLE "UserAdoption" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "adoptItemId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "completedTasks" TEXT NOT NULL DEFAULT '[]',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "UserAdoption_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "UserAdoption_adoptItemId_fkey" FOREIGN KEY ("adoptItemId") REFERENCES "AdoptItem" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_StoryItem" (
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
    "submittedById" TEXT,
    "submittedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "moderatedAt" DATETIME,
    "moderatedById" TEXT,
    "moderationNote" TEXT,
    "recipeIngredients" TEXT,
    CONSTRAINT "StoryItem_submittedById_fkey" FOREIGN KEY ("submittedById") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "StoryItem_moderatedById_fkey" FOREIGN KEY ("moderatedById") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_StoryItem" ("audioUrl", "category", "date", "fullStory", "id", "image", "mediaType", "preservedBy", "recipeIngredients", "region", "shortStory", "state", "status", "title", "videoUrl") SELECT "audioUrl", "category", "date", "fullStory", "id", "image", "mediaType", "preservedBy", "recipeIngredients", "region", "shortStory", "state", "status", "title", "videoUrl" FROM "StoryItem";
DROP TABLE "StoryItem";
ALTER TABLE "new_StoryItem" RENAME TO "StoryItem";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "UserAdoption_userId_adoptItemId_key" ON "UserAdoption"("userId", "adoptItemId");
