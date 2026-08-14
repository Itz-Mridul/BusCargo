import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/auth';
import bookingsRoutes from './routes/bookings';
import depotRoutes from './routes/depot';
import deliveryRoutes from './routes/delivery';
import busesRoutes from './routes/buses';
import ledgerRoutes from './routes/ledger';
import depotsRoutes from './routes/depots';
import citiesRoutes from './routes/cities';
import routesRoutes from './routes/routes';
import adminRoutes from './routes/admin';
import prisma from './lib/prisma';
import { startSimulation } from './services/busSimulator';

dotenv.config();

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET is required. Copy .env.example to .env and set a strong secret.');
}

const app = express();
const PORT = process.env.PORT || 3001;

const allowedOrigins = (process.env.CORS_ORIGINS || 'http://localhost:5173').split(',').map(origin => origin.trim());
app.use(cors({ origin: (origin, callback) => callback(null, !origin || allowedOrigins.includes(origin)) }));
app.use(express.json({ limit: '100kb' }));

app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingsRoutes);
app.use('/api/depot', depotRoutes);
app.use('/api/delivery', deliveryRoutes);
app.use('/api/buses', busesRoutes);
app.use('/api/depots', depotsRoutes);
app.use('/api/cities', citiesRoutes);
app.use('/api/routes', routesRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api', ledgerRoutes);

app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  
  try {
    const inTransitParcels = await prisma.parcel.findMany({
      where: { status: 'IN_TRANSIT', busId: { not: null } }
    });
    
    for (const parcel of inTransitParcels) {
      if (parcel.busId) {
        startSimulation(parcel.id, parcel.busId);
      }
    }
  } catch (error) {
    console.error('Failed to resume simulations:', error);
  }
});

// Force event loop to stay alive
setInterval(() => {}, 1000 * 60 * 60);
