import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { randomInt } from 'crypto';
import prisma from '../lib/prisma';
import { authenticate, requireRole } from '../middleware/auth';

const router = Router();

router.post('/', authenticate, requireRole(['SENDER', 'ADMIN']), async (req, res) => {
  const { originDepotId, destDepotId, routeId, weight, receiverName, receiverPhone, serviceType } = req.body;
  const senderId = req.user!.id;

  try {
    if (!['INTERCITY', 'LOCAL'].includes(serviceType)) {
      return res.status(400).json({ error: 'Invalid service type.' });
    }

    const kg = Number(weight);
    const maxKg = serviceType === 'INTERCITY' ? 20 : 8;
    if (!Number.isFinite(kg) || kg < 0.1 || kg > maxKg) {
      return res.status(400).json({ error: `Weight must be between 0.1 and ${maxKg} kg.` });
    }

    if (typeof receiverName !== 'string' || receiverName.trim().length < 2 || receiverName.trim().length > 80) {
      return res.status(400).json({ error: 'Enter a valid receiver name.' });
    }

    if (typeof receiverPhone !== 'string' || !/^\+?[0-9\s-]{8,20}$/.test(receiverPhone.trim())) {
      return res.status(400).json({ error: 'Enter a valid phone number.' });
    }

    const origin = await prisma.depot.findUnique({ where: { id: originDepotId } });
    const dest   = await prisma.depot.findUnique({ where: { id: destDepotId } });

    if (!origin || !dest) return res.status(404).json({ error: 'Depot not found.' });
    if (originDepotId === destDepotId) return res.status(400).json({ error: 'Origin and destination cannot be the same.' });

    const route = await prisma.route.findUnique({
      where: { id: routeId },
      include: { stops: { orderBy: { stopOrder: 'asc' } } }
    });

    if (!route || route.type !== serviceType) return res.status(400).json({ error: 'Invalid route selected.' });

    const oi = route.stops.findIndex(s => s.depotId === originDepotId);
    const di = route.stops.findIndex(s => s.depotId === destDepotId);

    if (oi < 0 || di < 0 || oi >= di) {
      return res.status(400).json({ error: 'Route does not serve this journey direction.' });
    }

    if (serviceType === 'LOCAL' && origin.cityId !== dest.cityId) {
      return res.status(400).json({ error: 'Local mode requires both depots in the same city.' });
    }

    if (serviceType === 'INTERCITY' && origin.cityId === dest.cityId) {
      return res.status(400).json({ error: 'Inter-city mode requires depots in different cities.' });
    }

    const price = serviceType === 'INTERCITY'
      ? 50 + (kg * 15) + 20 + 10
      : 25 + (kg * 8) + 10 + 10;

    const trackingId = `BC-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${randomInt(100000, 1000000)}`;
    const otp = randomInt(100000, 1000000).toString();
    const otpHash = await bcrypt.hash(otp, 10);
    const qrCode = `BUSCARGO:${trackingId}`;

    const bus = await prisma.bus.findFirst({ where: { routeId: route.id, status: 'IDLE' } });

    const parcel = await prisma.parcel.create({
      data: {
        trackingId,
        senderId,
        originDepotId,
        destDepotId,
        busId: bus?.id,
        serviceType,
        receiverName: receiverName.trim(),
        receiverPhone: receiverPhone.trim(),
        weight: kg,
        price,
        status: 'BOOKED',
        qrCode,
        otpHash,
        transactions: {
          create: { amount: price, splitTransitPct: 60, splitPlatformPct: 30, splitAgentPct: 10 }
        }
      },
      include: { transactions: true }
    });

    res.json({ parcel, qrData: qrCode, otp });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/me', authenticate, requireRole(['SENDER', 'ADMIN']), async (req, res) => {
  try {
    const parcels = await prisma.parcel.findMany({
      where: { senderId: req.user!.id },
      orderBy: { createdAt: 'desc' }
    });
    res.json(parcels);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:trackingId/track', async (req, res) => {
  try {
    const parcel = await prisma.parcel.findUnique({
      where: { trackingId: req.params.trackingId },
      include: {
        originDepot: true,
        destDepot: true,
        bus: { include: { route: true } }
      }
    });

    if (!parcel) {
      res.status(404).json({ error: 'Parcel not found' });
      return;
    }

    const { otpHash, senderId, receiverPhone, ...safe } = parcel;
    res.json(safe);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;