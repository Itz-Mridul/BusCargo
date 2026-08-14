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
  await prisma.user.create({ data: { name: 'Admin User', email: 'admin@buscargo.com', passwordHash: hash, role: 'ADMIN' } });
  await prisma.user.create({ data: { name: 'Depot Staff', email: 'staff@buscargo.com', passwordHash: hash, role: 'STAFF' } });
  await prisma.user.create({ data: { name: 'Test Sender', email: 'sender@example.com', passwordHash: hash, role: 'SENDER' } });

  const cities = [
    { name: 'Pune',       lat: 18.5204, lng: 73.8567, type: 'METRO' },
    { name: 'Mumbai',     lat: 19.0760, lng: 72.8777, type: 'METRO' },
    { name: 'Nashik',     lat: 19.9975, lng: 73.7898, type: 'TIER2' },
    { name: 'Ahmednagar', lat: 19.0952, lng: 74.7496, type: 'TIER2' },
    { name: 'Solapur',    lat: 17.6599, lng: 75.9064, type: 'TIER2' },
    { name: 'Kolhapur',   lat: 16.7050, lng: 74.2433, type: 'TIER2' },
    { name: 'Satara',     lat: 17.6805, lng: 74.0183, type: 'TIER2' },
    { name: 'Sangli',     lat: 16.8524, lng: 74.5815, type: 'TIER2' },
    { name: 'Aurangabad', lat: 19.8762, lng: 75.3433, type: 'TIER2' },
    { name: 'Baramati',   lat: 18.1518, lng: 74.5773, type: 'TOWN'  },
    { name: 'Kopargaon',  lat: 19.8957, lng: 74.4797, type: 'TOWN'  },
    { name: 'Shirdi',     lat: 19.7664, lng: 74.4777, type: 'TOWN'  },
    { name: 'Sangamner',  lat: 19.5743, lng: 74.2101, type: 'TOWN'  },
  ];

  const cityMap: Record<string, any> = {};
  const depotMap: Record<string, any> = {};

  for (const c of cities) {
    const city = await prisma.city.create({ data: { name: c.name, state: 'Maharashtra', type: c.type } });
    cityMap[c.name] = city;
    const depot = await prisma.depot.create({ data: { name: `${c.name} Central Bus Stand`, cityId: city.id, lat: c.lat, lng: c.lng } });
    depotMap[c.name] = depot;
  }

  const swargate = await prisma.depot.create({ data: { name: 'Swargate Bus Stand', cityId: cityMap['Pune'].id, lat: 18.5018, lng: 73.8636 } });
  const wakad    = await prisma.depot.create({ data: { name: 'Wakad PMPML Depot',  cityId: cityMap['Pune'].id, lat: 18.5987, lng: 73.7688 } });
  const hadapsar = await prisma.depot.create({ data: { name: 'Hadapsar Depot',     cityId: cityMap['Pune'].id, lat: 18.4988, lng: 73.9258 } });
  const kothrud  = await prisma.depot.create({ data: { name: 'Kothrud Depot',      cityId: cityMap['Pune'].id, lat: 18.5074, lng: 73.8077 } });

  const d = (name: string) => depotMap[name] ?? { id: null };
  const alias: Record<string, any> = { swargate, wakad, hadapsar, kothrud };
  const get = (name: string) => alias[name] ?? depotMap[name];

  const addRoute = async (name: string, type: string, src: string, dst: string, stops: string[]) => {
    const pts = stops.map(s => { const dp = get(s); return { lat: dp.lat, lng: dp.lng }; });
    const route = await prisma.route.create({
      data: { name, type, sourceCityId: cityMap[src].id, destCityId: cityMap[dst].id, waypointsJson: JSON.stringify(pts) }
    });
    for (let i = 0; i < stops.length; i++) {
      await prisma.routeStop.create({ data: { routeId: route.id, depotId: get(stops[i]).id, stopOrder: i } });
    }
    await prisma.bus.create({ data: { routeId: route.id, currentLat: pts[0].lat, currentLng: pts[0].lng, status: 'IDLE' } });
    await prisma.bus.create({ data: { routeId: route.id, currentLat: pts[0].lat, currentLng: pts[0].lng, status: 'IDLE' } });
  };

  await addRoute('Pune - Mumbai Express',               'INTERCITY', 'Pune',       'Mumbai',     ['Pune', 'Mumbai']);
  await addRoute('Pune - Nashik MSRTC',                 'INTERCITY', 'Pune',       'Nashik',     ['Pune', 'Sangamner', 'Nashik']);
  await addRoute('Pune - Ahmednagar MSRTC',             'INTERCITY', 'Pune',       'Ahmednagar', ['Pune', 'Ahmednagar']);
  await addRoute('Pune - Solapur MSRTC',                'INTERCITY', 'Pune',       'Solapur',    ['Pune', 'Solapur']);
  await addRoute('Pune - Kolhapur via Satara',          'INTERCITY', 'Pune',       'Kolhapur',   ['Pune', 'Satara', 'Kolhapur']);
  await addRoute('Pune - Sangli MSRTC',                 'INTERCITY', 'Pune',       'Sangli',     ['Pune', 'Satara', 'Sangli']);
  await addRoute('Pune - Aurangabad MSRTC',             'INTERCITY', 'Pune',       'Aurangabad', ['Pune', 'Ahmednagar', 'Aurangabad']);
  await addRoute('Pune - Baramati MSRTC',               'INTERCITY', 'Pune',       'Baramati',   ['Pune', 'Baramati']);
  await addRoute('Kopargaon - Ahmednagar - Pune Pilot', 'INTERCITY', 'Kopargaon',  'Pune',       ['Kopargaon', 'Sangamner', 'Ahmednagar', 'Pune']);
  await addRoute('Kopargaon - Shirdi',                  'INTERCITY', 'Kopargaon',  'Shirdi',     ['Kopargaon', 'Shirdi']);
  await addRoute('Kopargaon - Nashik',                  'INTERCITY', 'Kopargaon',  'Nashik',     ['Kopargaon', 'Sangamner', 'Nashik']);
  await addRoute('Ahmednagar - Aurangabad',             'INTERCITY', 'Ahmednagar', 'Aurangabad', ['Ahmednagar', 'Aurangabad']);
  await addRoute('PMPML Route 24 (Wakad to Swargate)',  'LOCAL',     'Pune',       'Pune',       ['wakad', 'kothrud', 'swargate']);
  await addRoute('PMPML Route 11 (Hadapsar to Wakad)',  'LOCAL',     'Pune',       'Pune',       ['hadapsar', 'swargate', 'kothrud', 'wakad']);

  console.log('Seeded: 13 cities, Pune local depots, 14 routes');
}

main().catch(e => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
