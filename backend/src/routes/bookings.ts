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
      return res.status(400).json({ error: 'Invalid serviceType. Must be INTERCITY or LOCAL.' });
    }
    const numericWeight = Number(weight);
    const maxWeight = serviceType === 'INTERCITY' ? 20 : 8;
    if (!Number.isFinite(numericWeight) || numericWeight < 0.1 || numericWeight > maxWeight) {
      return res.status(400).json({ error: `Weight must be between 0.1 and ${maxWeight} kg.` });
    }
    if (typeof receiverName !== 'string' || receiverName.trim().length < 2 || receiverName.trim().length > 80 ||
        typeof receiverPhone !== 'string' || !/^\+?[0-9\s-]{8,20}$/.test(receiverPhone.trim())) {
      return res.status(400).json({ error: 'Enter a valid receiver name and phone number.' });
    }

    const originDepot = await prisma.depot.findUnique({ where: { id: originDepotId } });
    const destDepot = await prisma.depot.findUnique({ where: { id: destDepotId } });

    if (!originDepot || !destDepot) {
      return res.status(404).json({ error: 'Depots not found' });
    }
    if (originDepotId === destDepotId) return res.status(400).json({ error: 'Origin and destination must be different.' });

    const route = await prisma.route.findUnique({
      where: { id: routeId },
      include: { stops: { orderBy: { stopOrder: 'asc' } } }
    });
    if (!route || route.type !== serviceType) return res.status(400).json({ error: 'Select an available route for this service.' });
    const originIndex = route.stops.findIndex(stop => stop.depotId === originDepotId);
    const destinationIndex = route.stops.findIndex(stop => stop.depotId === destDepotId);
    if (originIndex < 0 || destinationIndex < 0 || originIndex >= destinationIndex) {
      return res.status(400).json({ error: 'The selected route does not serve this journey in that direction.' });
    }

    if (serviceType === 'LOCAL' && originDepot.cityId !== destDepot.cityId) {
      return res.status(400).json({ error: 'Local City mode requires both depots to be in the same city.' });
    }

    if (serviceType === 'INTERCITY' && originDepot.cityId === destDepot.cityId) {
      return res.status(400).json({ error: 'Inter-City mode requires depots to be in different cities.' });
    }

    let price = 0;
    if (serviceType === 'INTERCITY') {
      price = 50 + (numericWeight * 15) + 20;
    } else {
      price = 25 + (numericWeight * 8) + 10;
    }

    const trackingId = `BC-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${randomInt(100000, 1000000)}`;
    const otp = randomInt(100000, 1000000).toString();
    const otpHash = await bcrypt.hash(otp, 10);
    const qrCode = `BUSCARGO:${trackingId}`;

    const bus = await prisma.bus.findFirst({
      where: { routeId: route.id, status: 'IDLE' }
    });

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
        weight: numericWeight,
        price,
        status: 'BOOKED',
        qrCode,
        otpHash,
        transactions: {
          create: {
            amount: price,
            splitTransitPct: 60,
            splitPlatformPct: 30,
            splitAgentPct: 10,
          }
        }
      },
      include: {
        transactions: true
      }
    });

    res.json({ parcel, qrData: qrCode, otp });
  } catch (error) {
    console.error(error);
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
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:trackingId/track', async (req, res) => {
  try {
    const { trackingId } = req.params;
    const parcel = await prisma.parcel.findUnique({
      where: { trackingId },
      include: {
        originDepot: true,
        destDepot: true,
        bus: {
          include: { route: true }
        }
      }
    });

    if (!parcel) {
       res.status(404).json({ error: 'Parcel not found' });
       return;
    }

    const { otpHash, senderId, receiverPhone, ...safeParcel } = parcel;
    res.json(safeParcel);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
