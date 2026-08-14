import { Router } from 'express';
import prisma from '../lib/prisma';
import { authenticate, requireRole } from '../middleware/auth';
import { startSimulation } from '../services/busSimulator';

const router = Router();

router.post('/scan', authenticate, requireRole(['STAFF', 'ADMIN']), async (req, res) => {
  const { qrCode } = req.body;
  const staffId = req.user!.id;

  if (!qrCode?.startsWith('BUSCARGO:')) {
     res.status(400).json({ error: 'Invalid QR Code format' });
     return;
  }
  const trackingId = qrCode.split(':')[1];

  try {
    const parcel = await prisma.parcel.findUnique({ where: { trackingId } });
    if (!parcel) {
       res.status(404).json({ error: 'Parcel not found' });
       return;
    }

    let updatedParcel;
    if (parcel.status === 'BOOKED') {
      const bus = parcel.busId
        ? await prisma.bus.findUnique({ where: { id: parcel.busId } })
        : await prisma.bus.findFirst({ where: { route: { stops: { some: { depotId: parcel.originDepotId } } }, status: 'IDLE' } });
      if (!bus) {
        res.status(409).json({ error: 'No available bus is assigned to this route yet.' });
        return;
      }
      updatedParcel = await prisma.parcel.update({
        where: { id: parcel.id },
        data: { status: 'IN_TRANSIT', busId: bus.id }
      });
      await prisma.scanEvent.create({
        data: { parcelId: parcel.id, staffId, eventType: 'LOADED' }
      });
      startSimulation(parcel.id, bus.id);
    } else if (parcel.status === 'IN_TRANSIT') {
      updatedParcel = await prisma.parcel.update({
        where: { id: parcel.id },
        data: { status: 'ARRIVED' }
      });
      await prisma.scanEvent.create({
        data: { parcelId: parcel.id, staffId, eventType: 'UNLOADED' }
      });
    } else {
       res.status(400).json({ error: `Cannot scan parcel with status ${parcel.status}` });
       return;
    }

    res.json({ parcel: updatedParcel });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
