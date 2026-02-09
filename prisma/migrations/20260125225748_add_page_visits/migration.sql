-- CreateTable
CREATE TABLE "PageVisit" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "path" TEXT NOT NULL,
    "referer" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE INDEX "PageVisit_path_idx" ON "PageVisit"("path");

-- CreateIndex
CREATE INDEX "PageVisit_createdAt_idx" ON "PageVisit"("createdAt");
