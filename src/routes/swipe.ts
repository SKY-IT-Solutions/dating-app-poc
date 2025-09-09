import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import authMiddleware from '../middleware/auth.js';

const prisma = new PrismaClient();
const router = Router();

/** Store swipe and check for match */
router.post('/', authMiddleware, async (req: Request, res: Response) => {
  const { targetId, direction } = req.body;
  const userId = (req as any).user.userId;

  // Validate input
  if (!targetId || !['L', 'R'].includes(direction)) {
    return res.status(400).json({ message: 'Valid targetId and direction (L/R) are required' });
  }

  // Prevent self-swipe
  if (userId === targetId) {
    return res.status(400).json({ message: 'Cannot swipe on yourself' });
  }

  try {
    // Check for existing swipe from user to target
    const existingSwipe = await prisma.swipe.findFirst({
      where: {
        userId,
        targetId,
      },
    });

    if (existingSwipe) {
      // Update existing swipe direction
      await prisma.swipe.update({
        where: { id: existingSwipe.id },
        data: { direction },
      });
    } else {
      // Create new swipe
      await prisma.swipe.create({
        data: {
          userId,
          targetId,
          direction,
        },
      });
    }

    // Check for mutual right swipe (only if current direction is 'R')
    if (direction === 'R') {
      const mutualSwipe = await prisma.swipe.findFirst({
        where: {
          userId: targetId,
          targetId: userId,
          direction: 'R',
        },
      });
      if (mutualSwipe) {
        return res.json({ message: "It's a match!" });
      }
    }

    res.json({ message: 'Swipe recorded' });
  } catch (error) {
    res.status(500).json({ message: 'Error processing swipe', error });
  }
});

export default router;