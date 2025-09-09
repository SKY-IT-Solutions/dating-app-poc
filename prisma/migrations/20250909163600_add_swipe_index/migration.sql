-- CreateIndex
CREATE INDEX "Swipe_userId_targetId_direction_idx" ON "Swipe"("userId", "targetId", "direction");
