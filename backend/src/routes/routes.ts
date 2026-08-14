import { Router } from 'express';
import prisma from '../lib/prisma';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const { type, originDepotId, destDepotId } = req.query;

    let where: any = {};
    if (type) where.type = type as string;

    const allRoutes = await prisma.route.findMany({
      where,
      include: {
        sourceCity: true,
        destCity: true,
        stops: {
          include: { depot: true },
          orderBy: { stopOrder: 'asc' }
        },
        buses: true
      }
    });

    let candidates = allRoutes;

    if (originDepotId && destDepotId) {
      const origin = await prisma.depot.findUnique({ where: { id: originDepotId as string } });
      const dest   = await prisma.depot.findUnique({ where: { id: destDepotId as string } });

      if (origin && dest) {
        candidates = allRoutes.filter(route => {
          if (route.type === 'LOCAL') {
            return route.sourceCityId === origin.cityId;
          }
          const oi = route.stops.findIndex(s => s.depot.cityId === origin.cityId);
          const di = route.stops.findIndex(s => s.depot.cityId === dest.cityId);
          return oi !== -1 && di !== -1 && oi <= di;
        });
      }
    }

    const scored = candidates.map(route => {
      const score = (0.4 * Math.random()) + (0.3 * Math.random()) + (0.2 * Math.random()) + (0.1 * Math.random());
      return { ...route, score };
    }).sort((a, b) => b.score - a.score);

    res.json(scored);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const route = await prisma.route.findUnique({
      where: { id: req.params.id },
      include: {
        sourceCity: true,
        destCity: true,
        stops: {
          include: { depot: true },
          orderBy: { stopOrder: 'asc' }
        }
      }
    });
    if (!route) return res.status(404).json({ error: 'Route not found' });
    res.json(route);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
