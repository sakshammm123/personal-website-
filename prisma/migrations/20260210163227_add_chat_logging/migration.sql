-- CreateTable
CREATE TABLE "ChatQuestion" (
    "id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "reply" TEXT NOT NULL,
    "askedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isUnanswered" BOOLEAN NOT NULL DEFAULT false,
    "conversationId" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChatQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UnansweredQuestion" (
    "id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "replyGiven" TEXT,
    "firstAsked" TIMESTAMP(3) NOT NULL,
    "lastAsked" TIMESTAMP(3) NOT NULL,
    "askCount" INTEGER NOT NULL DEFAULT 1,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "answer" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UnansweredQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ChatQuestion_conversationId_idx" ON "ChatQuestion"("conversationId");

-- CreateIndex
CREATE INDEX "ChatQuestion_askedAt_idx" ON "ChatQuestion"("askedAt");

-- CreateIndex
CREATE INDEX "ChatQuestion_isUnanswered_idx" ON "ChatQuestion"("isUnanswered");

-- CreateIndex
CREATE INDEX "UnansweredQuestion_status_idx" ON "UnansweredQuestion"("status");

-- CreateIndex
CREATE INDEX "UnansweredQuestion_firstAsked_idx" ON "UnansweredQuestion"("firstAsked");

-- CreateIndex
CREATE INDEX "UnansweredQuestion_lastAsked_idx" ON "UnansweredQuestion"("lastAsked");
