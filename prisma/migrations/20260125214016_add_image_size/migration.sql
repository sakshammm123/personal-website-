-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_PostImage" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "postId" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "alt" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "size" TEXT NOT NULL DEFAULT 'large',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PostImage_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_PostImage" ("alt", "createdAt", "id", "order", "postId", "url") SELECT "alt", "createdAt", "id", "order", "postId", "url" FROM "PostImage";
DROP TABLE "PostImage";
ALTER TABLE "new_PostImage" RENAME TO "PostImage";
CREATE INDEX "PostImage_postId_idx" ON "PostImage"("postId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
