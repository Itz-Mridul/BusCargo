import { Router } from 'express';
import prisma from '../lib/prisma';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const buses = await prisma.bus.findMany();
    res.json(buses);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:id/position', async (req, res) => {
  try {
    const { id } = req.params;
    const bus = await prisma.bus.findUnique({
      where: { id },
      select: { id: true, currentLat: true, currentLng: true, status: true, lastUpdated: true }
    });
    
    if (!bus) {
       res.status(404).json({ error: 'Bus not found' });
       return;
    }
    res.json(bus);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
