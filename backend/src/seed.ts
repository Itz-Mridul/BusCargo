import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Wipe existing data to apply clean schema for dual-mode demo
  console.log('Wiping existing data for fresh seed...');
  await prisma.transaction.deleteMany();
  await prisma.scanEvent.deleteMany();
  await prisma.parcel.deleteMany();
  await prisma.bus.deleteMany();
  await prisma.routeStop.deleteMany();
  await prisma.route.deleteMany();
  await prisma.depot.deleteMany();
  await prisma.city.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash('password123', 10);

  // Users
  await prisma.user.create({ data: { role: 'ADMIN', name: 'Admin User', email: 'admin@buscargo.local', passwordHash } });
  await prisma.user.create({ data: { role: 'SENDER', name: 'Demo Sender', email: 'sender@buscargo.local', passwordHash } });
  await prisma.user.create({ data: { role: 'STAFF', name: 'Demo Staff', email: 'staff@buscargo.local', passwordHash } });

  // Cities
  const puneCity = await prisma.city.create({ data: { name: 'Pune', type: 'METRO' } });
  const ahmednagarCity = await prisma.city.create({ data: { name: 'Ahmednagar', type: 'TIER3' } });
  const shirdiCity = await prisma.city.create({ data: { name: 'Shirdi', type: 'RURAL' } });
  const kopargaonCity = await prisma.city.create({ data: { name: 'Kopargaon', type: 'TIER3' } });

  // Depots - Intercity (Route 1)
  const kopargaon = await prisma.depot.create({ data: { name: 'Kopargaon Depot', cityId: kopargaonCity.id, lat: 19.8872, lng: 74.4756 } });
  const shirdi = await prisma.depot.create({ data: { name: 'Shirdi Depot', cityId: shirdiCity.id, lat: 19.7669, lng: 74.4770 } });
  const ahmednagar = await prisma.depot.create({ data: { name: 'Ahmednagar Depot', cityId: ahmednagarCity.id, lat: 19.0952, lng: 74.7496 } });

  // Depots - Local (Pune)
  const swargate = await prisma.depot.create({ data: { name: 'Swargate Bus Stand', cityId: puneCity.id, lat: 18.5018, lng: 73.8636 } });
  const shivajinagar = await prisma.depot.create({ data: { name: 'Shivajinagar Bus Stand', cityId: puneCity.id, lat: 18.5314, lng: 73.8446 } });
  const hadapsar = await prisma.depot.create({ data: { name: 'Hadapsar Gadital', cityId: puneCity.id, lat: 18.5028, lng: 73.9272 } });

  // Route 1: Inter-City
  const intercityRoute = await prisma.route.create({
    data: {
      name: 'Kopargaon - Shirdi - Ahmednagar',
      type: 'INTERCITY',
      sourceCityId: kopargaonCity.id,
      destCityId: ahmednagarCity.id,
      waypointsJson: JSON.stringify([
        { lat: 19.8872, lng: 74.4756, name: 'Kopargaon' },
        { lat: 19.7669, lng: 74.4770, name: 'Shirdi' },
        { lat: 19.0952, lng: 74.7496, name: 'Ahmednagar' }
      ])
    }
  });

  // Route 2: Local (Pune)
  const localRoute = await prisma.route.create({
    data: {
      name: 'Pune Local: Swargate - Shivajinagar - Hadapsar',
      type: 'LOCAL',
      sourceCityId: puneCity.id,
      destCityId: puneCity.id,
      waypointsJson: JSON.stringify([
        { lat: 18.5018, lng: 73.8636, name: 'Swargate' },
        { lat: 18.5314, lng: 73.8446, name: 'Shivajinagar' },
        { lat: 18.5028, lng: 73.9272, name: 'Hadapsar' }
      ])
    }
  });

  // Route Stops (Intercity)
  await prisma.routeStop.create({ data: { routeId: intercityRoute.id, depotId: kopargaon.id, stopOrder: 0 } });
  await prisma.routeStop.create({ data: { routeId: intercityRoute.id, depotId: shirdi.id, stopOrder: 1 } });
  await prisma.routeStop.create({ data: { routeId: intercityRoute.id, depotId: ahmednagar.id, stopOrder: 2 } });

  // Route Stops (Local)
  await prisma.routeStop.create({ data: { routeId: localRoute.id, depotId: swargate.id, stopOrder: 0 } });
  await prisma.routeStop.create({ data: { routeId: localRoute.id, depotId: shivajinagar.id, stopOrder: 1 } });
  await prisma.routeStop.create({ data: { routeId: localRoute.id, depotId: hadapsar.id, stopOrder: 2 } });

  // Buses
  await prisma.bus.create({
    data: {
      routeId: intercityRoute.id,
      currentLat: 19.8872,
      currentLng: 74.4756,
      status: 'IDLE'
    }
  });

  await prisma.bus.create({
    data: {
      routeId: localRoute.id,
      currentLat: 18.5018,
      currentLng: 73.8636,
      status: 'IDLE'
    }
  });

  console.log('Database seeded with fresh dual-mode demo data');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
