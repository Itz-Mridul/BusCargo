import { Router } from 'express';
import bcrypt from 'bcryptjs';
import prisma from '../lib/prisma';
import { stopSimulation } from '../services/busSimulator';

const router = Router();

// Public endpoint — receiver enters OTP, no auth needed
router.post('/confirm', async (req, res) => {
  const { trackingId, otp } = req.body;

  if (!trackingId || !otp) {
    res.status(400).json({ error: 'trackingId and otp are required' });
    return;
  }

  try {
    const parcel = await prisma.parcel.findUnique({ where: { trackingId } });
    if (!parcel) {
      res.status(404).json({ error: 'Parcel not found' });
      return;
    }

    // Allow OTP for ARRIVED or IN_TRANSIT (flexible for demo)
    if (!['ARRIVED', 'IN_TRANSIT'].includes(parcel.status)) {
      res.status(400).json({ error: `Cannot confirm delivery for parcel with status: ${parcel.status}` });
      return;
    }

    const isValid = await bcrypt.compare(otp.toString(), parcel.otpHash);
    if (!isValid) {
      res.status(400).json({ error: 'Invalid OTP. Please try again.' });
      return;
    }

    await prisma.parcel.update({
      where: { id: parcel.id },
      data: { status: 'DELIVERED' }
    });

    await prisma.scanEvent.create({
      data: { parcelId: parcel.id, staffId: 'RECEIVER', eventType: 'DELIVERED' }
    });

    stopSimulation(parcel.id);

    res.json({ success: true, message: 'Parcel delivered successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
