import { Router } from 'express';
import prisma from '../lib/prisma';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const { type, originDepotId, destDepotId } = req.query;
    
    let whereClause: any = {};
    if (type) {
      whereClause.type = type as string;
    }

    const allRoutes = await prisma.route.findMany({
      where: whereClause,
      include: {
        sourceCity: true,
        destCity: true,
        stops: {
          include: {
            depot: true
          },
          orderBy: {
            stopOrder: 'asc'
          }
        },
        buses: true
      }
    });

    let candidates = allRoutes;

    if (originDepotId && destDepotId) {
      const originDepot = await prisma.depot.findUnique({ where: { id: originDepotId as string } });
      const destDepot = await prisma.depot.findUnique({ where: { id: destDepotId as string } });
      
      if (originDepot && destDepot) {
        candidates = allRoutes.filter(route => {
          if (route.type === 'LOCAL') {
             return route.sourceCityId === originDepot.cityId;
          } else {
             const originIndex = route.stops.findIndex(s => s.depot.cityId === originDepot.cityId);
             const destIndex = route.stops.findIndex(s => s.depot.cityId === destDepot.cityId);
             return originIndex !== -1 && destIndex !== -1 && originIndex <= destIndex;
          }
        });
      }
    }

    // Scoring stage
    const scoredRoutes = candidates.map(route => {
      // Mock metrics for demo
      const frequencyScore = Math.random(); // 0-1
      const etaScore = Math.random(); // 0-1
      const distanceScore = Math.random(); // 0-1
      const loadFactorScore = Math.random(); // 0-1

      const score = (0.4 * frequencyScore) + (0.3 * etaScore) + (0.2 * distanceScore) + (0.1 * loadFactorScore);

      return {
        ...route,
        score,
        metrics: { frequencyScore, etaScore, distanceScore, loadFactorScore }
      };
    }).sort((a, b) => b.score - a.score);

    res.json(scoredRoutes);
  } catch (error) {
    console.error('Error fetching routes:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get specific route details
router.get('/:id', async (req, res) => {
  try {
    const route = await prisma.route.findUnique({
      where: { id: req.params.id },
      include: {
        sourceCity: true,
        destCity: true,
        stops: {
          include: {
            depot: true
          },
          orderBy: {
            stopOrder: 'asc'
          }
        }
      }
    });
    
    if (!route) return res.status(404).json({ error: 'Route not found' });
    res.json(route);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
