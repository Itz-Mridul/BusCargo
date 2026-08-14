import { Router } from 'express';
import prisma from '../lib/prisma';
import { authenticate, requireRole } from '../middleware/auth';

const router = Router();

router.get('/users', authenticate, requireRole(['ADMIN']), async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { lastLoginAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        loginCount: true,
        lastLoginAt: true,
        createdAt: true,
        _count: {
          select: { parcels: true }
        }
      }
    });
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;