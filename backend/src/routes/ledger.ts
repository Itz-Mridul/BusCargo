import { Router } from 'express';
import prisma from '../lib/prisma';
import { authenticate, requireRole } from '../middleware/auth';

const router = Router();

router.get('/ledger/:parcelId', authenticate, requireRole(['ADMIN']), async (req, res) => {
  try {
    const parcelId = String(req.params.parcelId);
    const transaction = await prisma.transaction.findFirst({
      where: { parcelId }
    });
    
    if (!transaction) {
       res.status(404).json({ error: 'Transaction not found' });
       return;
    }
    
    const transitAmount = (transaction.amount * transaction.splitTransitPct) / 100;
    const platformAmount = (transaction.amount * transaction.splitPlatformPct) / 100;
    const agentAmount = (transaction.amount * transaction.splitAgentPct) / 100;
    
    res.json({
      ...transaction,
      computed: {
        transitAmount,
        platformAmount,
        agentAmount
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/dashboard/metrics', authenticate, requireRole(['ADMIN']), async (req, res) => {
  try {
    const totalParcels = await prisma.parcel.count();
    const activeBookings = await prisma.parcel.count({ where: { status: 'BOOKED' } });
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const deliveredToday = await prisma.parcel.count({
      where: { status: 'DELIVERED', createdAt: { gte: today } }
    });

    const transactions = await prisma.transaction.findMany();
    const totalRevenue = transactions.reduce((sum, tx) => sum + tx.amount, 0);
    
    const userLogins = await prisma.user.aggregate({
      _sum: {
        loginCount: true
      }
    });
    const totalLogins = userLogins._sum.loginCount || 0;

    res.json({
      totalParcels,
      totalRevenue,
      activeBookings,
      deliveredToday,
      totalLogins
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;