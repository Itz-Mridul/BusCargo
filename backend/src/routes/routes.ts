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
          const stopDepotIds = route.stops.map(s => s.depotId);
          const oi = stopDepotIds.indexOf(origin.id);
          const di = stopDepotIds.indexOf(dest.id);
          if (oi !== -1 && di !== -1 && oi <= di) return true;
          const oiByCityId = route.stops.findIndex(s => s.depot.cityId === origin.cityId);
          const diByCityId = route.stops.findIndex(s => s.depot.cityId === dest.cityId);
          return oiByCityId !== -1 && diByCityId !== -1 && oiByCityId <= diByCityId;
        });
      }
    }

    const scored = candidates.map((route, i) => ({ ...route, score: candidates.length - i })).sort((a, b) => b.score - a.score);

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