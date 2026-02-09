-- CreateTable
CREATE TABLE "LoginAttempt" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT NOT NULL,
    "ipAddress" TEXT NOT NULL,
    "userAgent" TEXT,
    "success" BOOLEAN NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_PageVisit" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "path" TEXT NOT NULL,
    "referer" TEXT,
    "refererCategory" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "deviceType" TEXT,
    "browser" TEXT,
    "browserVersion" TEXT,
    "os" TEXT,
    "country" TEXT,
    "city" TEXT,
    "sessionId" TEXT,
    "isBot" BOOLEAN NOT NULL DEFAULT false,
    "loadTime" INTEGER,
    "firstContentfulPaint" INTEGER,
    "largestContentfulPaint" INTEGER,
    "cumulativeLayoutShift" REAL,
    "firstInputDelay" INTEGER,
    "conversationId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_PageVisit" ("createdAt", "id", "ipAddress", "path", "referer", "userAgent") SELECT "createdAt", "id", "ipAddress", "path", "referer", "userAgent" FROM "PageVisit";
DROP TABLE "PageVisit";
ALTER TABLE "new_PageVisit" RENAME TO "PageVisit";
CREATE INDEX "PageVisit_path_idx" ON "PageVisit"("path");
CREATE INDEX "PageVisit_createdAt_idx" ON "PageVisit"("createdAt");
CREATE INDEX "PageVisit_sessionId_idx" ON "PageVisit"("sessionId");
CREATE INDEX "PageVisit_isBot_idx" ON "PageVisit"("isBot");
CREATE INDEX "PageVisit_conversationId_idx" ON "PageVisit"("conversationId");
CREATE INDEX "PageVisit_deviceType_idx" ON "PageVisit"("deviceType");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "LoginAttempt_ipAddress_idx" ON "LoginAttempt"("ipAddress");

-- CreateIndex
CREATE INDEX "LoginAttempt_username_idx" ON "LoginAttempt"("username");

-- CreateIndex
CREATE INDEX "LoginAttempt_createdAt_idx" ON "LoginAttempt"("createdAt");

-- CreateIndex
CREATE INDEX "LoginAttempt_ipAddress_createdAt_idx" ON "LoginAttempt"("ipAddress", "createdAt");
