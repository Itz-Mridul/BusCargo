import { Router } from 'express';
import prisma from '../lib/prisma';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const { cityId, mode } = req.query;
    let whereClause: any = {};
    
    if (cityId) {
      whereClause.cityId = cityId as string;
    }
    
    if (mode === 'LOCAL') {
      whereClause.city = {
        type: { in: ['METRO', 'TIER2'] }
      };
    }

    const depots = await prisma.depot.findMany({
      where: whereClause,
      include: { city: true }
    });
    res.json(depots);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
