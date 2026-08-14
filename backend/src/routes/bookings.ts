import { Router } from 'express';
import bcrypt from 'bcryptjs';
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

    const originDepot = await prisma.depot.findUnique({ where: { id: originDepotId } });
    const destDepot = await prisma.depot.findUnique({ where: { id: destDepotId } });

    if (!originDepot || !destDepot) {
      return res.status(404).json({ error: 'Depots not found' });
    }

    if (serviceType === 'LOCAL' && originDepot.cityId !== destDepot.cityId) {
      return res.status(400).json({ error: 'Local City mode requires both depots to be in the same city.' });
    }

    if (serviceType === 'INTERCITY' && originDepot.cityId === destDepot.cityId) {
      return res.status(400).json({ error: 'Inter-City mode requires depots to be in different cities.' });
    }

    let price = 0;
    if (serviceType === 'INTERCITY') {
      price = 50 + (weight * 15) + 20;
    } else {
      price = 25 + (weight * 8) + 10;
    }

    const trackingId = `BC-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(10000 + Math.random() * 90000)}`;
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpHash = await bcrypt.hash(otp, 10);
    const qrCode = `BUSCARGO:${trackingId}`;

    const bus = await prisma.bus.findFirst({
      where: { routeId }
    });

    const parcel = await prisma.parcel.create({
      data: {
        trackingId,
        senderId,
        originDepotId,
        destDepotId,
        busId: bus?.id,
        serviceType,
        weight,
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

    res.json(parcel);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
