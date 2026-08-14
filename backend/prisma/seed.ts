import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  await prisma.transaction.deleteMany();
  await prisma.scanEvent.deleteMany();
  await prisma.parcel.deleteMany();
  await prisma.bus.deleteMany();
  await prisma.routeStop.deleteMany();
  await prisma.route.deleteMany();
  await prisma.depot.deleteMany();
  await prisma.city.deleteMany();
  await prisma.user.deleteMany();

  const hash = await bcrypt.hash('password123', 10);
  await prisma.user.create({ data: { name: 'Admin User',  email: 'admin@buscargo.com', passwordHash: hash, role: 'ADMIN' } });
  await prisma.user.create({ data: { name: 'Depot Staff', email: 'staff@buscargo.com', passwordHash: hash, role: 'STAFF' } });
  await prisma.user.create({ data: { name: 'Test Sender', email: 'sender@example.com', passwordHash: hash, role: 'SENDER' } });

  const pune = await prisma.city.create({ data: { name: 'Pune', state: 'Maharashtra', type: 'METRO' } });

  const towns = [
    { name: 'Pimpri-Chinchwad', lat: 18.6298, lng: 73.7997 },
    { name: 'Lonavala',         lat: 18.7481, lng: 73.4072 },
    { name: 'Talegaon',         lat: 18.7317, lng: 73.6747 },
    { name: 'Baramati',         lat: 18.1518, lng: 74.5773 },
    { name: 'Jejuri',           lat: 18.2736, lng: 74.1595 },
    { name: 'Saswad',           lat: 18.3411, lng: 74.0207 },
    { name: 'Kopargaon',        lat: 19.8957, lng: 74.4797 },
  ];

  const cityMap: Record<string, any> = { Pune: pune };
  for (const t of towns) {
    const city = await prisma.city.create({ data: { name: t.name, state: 'Maharashtra', type: 'TOWN' } });
    cityMap[t.name] = city;
  }

  const swargate    = await prisma.depot.create({ data: { name: 'Swargate Bus Stand',       cityId: pune.id, lat: 18.5018, lng: 73.8636 } });
  const shivajinagar= await prisma.depot.create({ data: { name: 'Shivajinagar Bus Stand',   cityId: pune.id, lat: 18.5308, lng: 73.8474 } });
  const kothrud     = await prisma.depot.create({ data: { name: 'Kothrud Bus Depot',         cityId: pune.id, lat: 18.5074, lng: 73.8077 } });
  const wakad       = await prisma.depot.create({ data: { name: 'Wakad PMPML Depot',         cityId: pune.id, lat: 18.5987, lng: 73.7688 } });
  const hadapsar    = await prisma.depot.create({ data: { name: 'Hadapsar Bus Depot',         cityId: pune.id, lat: 18.4988, lng: 73.9258 } });
  const katraj      = await prisma.depot.create({ data: { name: 'Katraj Bus Stand',           cityId: pune.id, lat: 18.4529, lng: 73.8584 } });
  const deccan      = await prisma.depot.create({ data: { name: 'Deccan Gymkhana Stop',       cityId: pune.id, lat: 18.5167, lng: 73.8407 } });

  const townDepots: Record<string, any> = {};
  const townCoords: Record<string, {lat: number, lng: number}> = {};
  for (const t of towns) {
    townCoords[t.name] = { lat: t.lat, lng: t.lng };
    townDepots[t.name] = await prisma.depot.create({ data: { name: `${t.name} Bus Stand`, cityId: cityMap[t.name].id, lat: t.lat, lng: t.lng } });
  }

  const addRoute = async (name: string, type: string, src: string, dst: string, stops: any[]) => {
    const pts = stops.map(s => ({ lat: s.lat, lng: s.lng }));
    const route = await prisma.route.create({
      data: { name, type, sourceCityId: cityMap[src].id, destCityId: cityMap[dst].id, waypointsJson: JSON.stringify(pts) }
    });
    for (let i = 0; i < stops.length; i++) {
      await prisma.routeStop.create({ data: { routeId: route.id, depotId: stops[i].id, stopOrder: i } });
    }
    await prisma.bus.create({ data: { routeId: route.id, currentLat: pts[0].lat, currentLng: pts[0].lng, status: 'IDLE' } });
    await prisma.bus.create({ data: { routeId: route.id, currentLat: pts[0].lat, currentLng: pts[0].lng, status: 'IDLE' } });
  };

  await addRoute('PMPML 24 – Wakad to Swargate',         'LOCAL', 'Pune', 'Pune', [wakad, kothrud, deccan, swargate]);
  await addRoute('PMPML 11 – Hadapsar to Wakad',          'LOCAL', 'Pune', 'Pune', [hadapsar, swargate, deccan, shivajinagar, wakad]);
  await addRoute('PMPML 50 – Katraj to Shivajinagar',     'LOCAL', 'Pune', 'Pune', [katraj, swargate, shivajinagar]);
  await addRoute('PMPML 99 – Kothrud to Hadapsar',        'LOCAL', 'Pune', 'Pune', [kothrud, deccan, shivajinagar, hadapsar]);

  await addRoute('Pune – Pimpri-Chinchwad',        'INTERCITY', 'Pune', 'Pimpri-Chinchwad', [shivajinagar, townDepots['Pimpri-Chinchwad']]);
  await addRoute('Pune – Lonavala via Talegaon',   'INTERCITY', 'Pune', 'Lonavala',         [swargate, townDepots['Talegaon'], townDepots['Lonavala']]);
  await addRoute('Pune – Talegaon',                'INTERCITY', 'Pune', 'Talegaon',         [shivajinagar, townDepots['Talegaon']]);
  await addRoute('Pune – Baramati',                'INTERCITY', 'Pune', 'Baramati',         [swargate, townDepots['Jejuri'], townDepots['Baramati']]);
  await addRoute('Pune – Jejuri',                  'INTERCITY', 'Pune', 'Jejuri',           [katraj, townDepots['Saswad'], townDepots['Jejuri']]);
  await addRoute('Pune – Saswad',                  'INTERCITY', 'Pune', 'Saswad',           [hadapsar, townDepots['Saswad']]);
  await addRoute('Kopargaon – Pune (Pilot Route)', 'INTERCITY', 'Kopargaon', 'Pune',        [townDepots['Kopargaon'], swargate]);

  console.log('Seeded: Pune city + 7 nearby towns, 11 routes (4 local, 7 intercity)');
}

main().catch(e => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
