-- AlterTable
ALTER TABLE "Post" ADD COLUMN "scheduledPublishAt" DATETIME;

-- CreateIndex
CREATE INDEX "Post_scheduledPublishAt_idx" ON "Post"("scheduledPublishAt");
