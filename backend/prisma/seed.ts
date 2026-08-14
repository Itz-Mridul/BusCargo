import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Cleaning existing data...');
  await prisma.transaction.deleteMany();
  await prisma.scanEvent.deleteMany();
  await prisma.parcel.deleteMany();
  await prisma.bus.deleteMany();
  await prisma.routeStop.deleteMany();
  await prisma.route.deleteMany();
  await prisma.depot.deleteMany();
  await prisma.city.deleteMany();
  await prisma.user.deleteMany();

  console.log('Seeding Users...');
  const passwordHash = await bcrypt.hash('password123', 10);
  
  await prisma.user.create({ data: { name: 'Admin User', email: 'admin@buscargo.com', passwordHash, role: 'ADMIN' } });
  await prisma.user.create({ data: { name: 'Depot Staff', email: 'staff@buscargo.com', passwordHash, role: 'STAFF' } });
  await prisma.user.create({ data: { name: 'Regular Sender', email: 'sender@example.com', passwordHash, role: 'SENDER' } });

  console.log('Seeding Cities & Depots...');
  const cityData = [
    { name: 'Mumbai',      lat: 19.0760, lng: 72.8777, type: 'METRO' },
    { name: 'Pune',        lat: 18.5204, lng: 73.8567, type: 'METRO' },
    { name: 'Nagpur',      lat: 21.1458, lng: 79.0882, type: 'METRO' },
    { name: 'Nashik',      lat: 19.9975, lng: 73.7898, type: 'TIER2' },
    { name: 'Aurangabad',  lat: 19.8762, lng: 75.3433, type: 'TIER2' },
    { name: 'Solapur',     lat: 17.6599, lng: 75.9064, type: 'TIER2' },
    { name: 'Amravati',    lat: 20.9320, lng: 77.7523, type: 'TIER2' },
    { name: 'Nanded',      lat: 19.1383, lng: 77.3210, type: 'TIER2' },
    { name: 'Kolhapur',    lat: 16.7050, lng: 74.2433, type: 'TIER2' },
    { name: 'Akola',       lat: 20.7059, lng: 77.0019, type: 'TIER2' },
    { name: 'Jalgaon',     lat: 21.0077, lng: 75.5626, type: 'TIER2' },
    { name: 'Latur',       lat: 18.4088, lng: 76.5604, type: 'TIER2' },
    { name: 'Dhule',       lat: 20.9042, lng: 74.7749, type: 'TIER2' },
    { name: 'Ahmednagar',  lat: 19.0952, lng: 74.7496, type: 'TIER2' },
    { name: 'Chandrapur',  lat: 19.9615, lng: 79.2961, type: 'TIER2' },
    { name: 'Parbhani',    lat: 19.2644, lng: 76.7728, type: 'TIER2' },
    { name: 'Jalna',       lat: 19.8297, lng: 75.8800, type: 'TIER2' },
    { name: 'Bhusawal',    lat: 21.0455, lng: 75.8011, type: 'TIER2' },
    { name: 'Navi Mumbai', lat: 19.0330, lng: 73.0297, type: 'METRO' },
    { name: 'Thane',       lat: 19.2183, lng: 72.9781, type: 'METRO' },
    { name: 'Pusad',       lat: 19.9022, lng: 77.5841, type: 'TOWN' },
    { name: 'Wardha',      lat: 20.7453, lng: 78.6022, type: 'TIER2' },
    { name: 'Yavatmal',    lat: 20.3888, lng: 78.1204, type: 'TIER2' },
    { name: 'Osmanabad',   lat: 18.1860, lng: 76.0410, type: 'TIER2' },
    { name: 'Raigad',      lat: 18.5158, lng: 73.1855, type: 'TIER2' },
    { name: 'Sangli',      lat: 16.8524, lng: 74.5815, type: 'TIER2' },
    { name: 'Satara',      lat: 17.6805, lng: 74.0183, type: 'TIER2' },
    { name: 'Ratnagiri',   lat: 16.9944, lng: 73.3001, type: 'TIER2' },
    { name: 'Sindhudurg',  lat: 16.3500, lng: 73.5900, type: 'TIER2' },
    { name: 'Beed',        lat: 18.9882, lng: 75.7598, type: 'TIER2' },
    { name: 'Hingoli',     lat: 19.7165, lng: 77.1498, type: 'TOWN' },
  ];

  const cityMap: Record<string, any> = {};
  const depotMap: Record<string, any> = {};

  for (const c of cityData) {
    const city = await prisma.city.create({ data: { name: c.name, state: 'Maharashtra', type: c.type } });
    cityMap[c.name] = city;
    const cbs = await prisma.depot.create({
      data: { name: `${c.name} Central Bus Stand`, cityId: city.id, lat: c.lat, lng: c.lng }
    });
    depotMap[c.name] = cbs;
  }

  // Mumbai specialty depots
  const dadar    = await prisma.depot.create({ data: { name: 'Dadar BEST Depot',    cityId: cityMap['Mumbai'].id, lat: 19.0178, lng: 72.8478 }});
  const andheri  = await prisma.depot.create({ data: { name: 'Andheri BEST Depot',  cityId: cityMap['Mumbai'].id, lat: 19.1136, lng: 72.8697 }});
  const borivali = await prisma.depot.create({ data: { name: 'Borivali BEST Depot', cityId: cityMap['Mumbai'].id, lat: 19.2307, lng: 72.8567 }});
  const kurla    = await prisma.depot.create({ data: { name: 'Kurla Bus Station',   cityId: cityMap['Mumbai'].id, lat: 19.0726, lng: 72.8794 }});
  const bandra   = await prisma.depot.create({ data: { name: 'Bandra Bus Station',  cityId: cityMap['Mumbai'].id, lat: 19.0596, lng: 72.8295 }});

  // Pune specialty depots
  const swargate = await prisma.depot.create({ data: { name: 'Swargate PMPML Depot',  cityId: cityMap['Pune'].id, lat: 18.5018, lng: 73.8636 }});
  const katraj   = await prisma.depot.create({ data: { name: 'Katraj PMPML Depot',    cityId: cityMap['Pune'].id, lat: 18.4529, lng: 73.8584 }});
  const wakad    = await prisma.depot.create({ data: { name: 'Wakad PMPML Depot',     cityId: cityMap['Pune'].id, lat: 18.5987, lng: 73.7688 }});
  const hadapsar = await prisma.depot.create({ data: { name: 'Hadapsar Bus Depot',    cityId: cityMap['Pune'].id, lat: 18.4988, lng: 73.9258 }});
  const kothrud  = await prisma.depot.create({ data: { name: 'Kothrud Bus Depot',     cityId: cityMap['Pune'].id, lat: 18.5074, lng: 73.8077 }});

  // Nagpur specialty depots
  const sitabuldi = await prisma.depot.create({ data: { name: 'Sitabuldi Bus Stand', cityId: cityMap['Nagpur'].id, lat: 21.1435, lng: 79.0882 }});
  const kamptee   = await prisma.depot.create({ data: { name: 'Kamptee Road Depot',  cityId: cityMap['Nagpur'].id, lat: 21.1744, lng: 79.1447 }});

  console.log('Seeding Routes...');

  const shortAlias: Record<string, any> = {
    'Dadar': dadar, 'Andheri': andheri, 'Borivali': borivali,
    'Kurla': kurla, 'Bandra': bandra,
    'Swargate': swargate, 'Katraj': katraj, 'Wakad': wakad,
    'Hadapsar': hadapsar, 'Kothrud': kothrud,
    'Sitabuldi': sitabuldi, 'Kamptee': kamptee,
  };

  const createRoute = async (name: string, type: string, sourceCityName: string, destCityName: string, stopNames: string[]) => {
    const waypoints = stopNames.map(sn => {
      const depot = shortAlias[sn] ?? depotMap[sn];
      return { lat: depot.lat, lng: depot.lng };
    });

    const route = await prisma.route.create({
      data: { name, type, sourceCityId: cityMap[sourceCityName].id, destCityId: cityMap[destCityName].id, waypointsJson: JSON.stringify(waypoints) }
    });

    for (let i = 0; i < stopNames.length; i++) {
      const depot = shortAlias[stopNames[i]] ?? depotMap[stopNames[i]];
      await prisma.routeStop.create({ data: { routeId: route.id, depotId: depot.id, stopOrder: i } });
    }

    // Add 2 buses per intercity route for density
    const busCount = type === 'INTERCITY' ? 2 : 1;
    for (let b = 0; b < busCount; b++) {
      await prisma.bus.create({
        data: { routeId: route.id, currentLat: waypoints[0].lat, currentLng: waypoints[0].lng, status: 'IDLE' }
      });
    }
  };

  // ─── INTERCITY ROUTES ─────────────────────────────────────────
  await createRoute('Mumbai - Pune Express (Shivneri)',        'INTERCITY', 'Mumbai',     'Pune',        ['Mumbai', 'Navi Mumbai', 'Pune']);
  await createRoute('Mumbai - Pune - Solapur (Shivneri)',      'INTERCITY', 'Mumbai',     'Solapur',     ['Mumbai', 'Navi Mumbai', 'Pune', 'Solapur']);
  await createRoute('Pune - Ahmednagar - Aurangabad',          'INTERCITY', 'Pune',       'Aurangabad',  ['Pune', 'Ahmednagar', 'Aurangabad']);
  await createRoute('Mumbai - Nashik - Dhule (MSRTC Express)', 'INTERCITY', 'Mumbai',     'Dhule',       ['Mumbai', 'Thane', 'Nashik', 'Dhule']);
  await createRoute('Mumbai - Nashik (MSRTC)',                 'INTERCITY', 'Mumbai',     'Nashik',      ['Mumbai', 'Thane', 'Nashik']);
  await createRoute('Nagpur - Amravati - Akola (MSRTC)',       'INTERCITY', 'Nagpur',     'Akola',       ['Nagpur', 'Amravati', 'Akola']);
  await createRoute('Nagpur - Wardha - Yavatmal',              'INTERCITY', 'Nagpur',     'Yavatmal',    ['Nagpur', 'Wardha', 'Yavatmal']);
  await createRoute('Nagpur - Chandrapur',                     'INTERCITY', 'Nagpur',     'Chandrapur',  ['Nagpur', 'Chandrapur']);
  await createRoute('Pune - Kolhapur (Shivneri)',              'INTERCITY', 'Pune',       'Kolhapur',    ['Pune', 'Satara', 'Kolhapur']);
  await createRoute('Pune - Satara - Sangli',                  'INTERCITY', 'Pune',       'Sangli',      ['Pune', 'Satara', 'Sangli']);
  await createRoute('Aurangabad - Nanded (MSRTC)',             'INTERCITY', 'Aurangabad', 'Nanded',      ['Aurangabad', 'Jalna', 'Parbhani', 'Nanded']);
  await createRoute('Aurangabad - Beed - Osmanabad',           'INTERCITY', 'Aurangabad', 'Osmanabad',   ['Aurangabad', 'Beed', 'Osmanabad']);
  await createRoute('Pune - Pusad Express (MSRTC)',            'INTERCITY', 'Pune',       'Pusad',       ['Pune', 'Ahmednagar', 'Jalna', 'Pusad']);
  await createRoute('Mumbai - Ratnagiri (Konkan)',             'INTERCITY', 'Mumbai',     'Ratnagiri',   ['Mumbai', 'Raigad', 'Ratnagiri']);
  await createRoute('Ratnagiri - Sindhudurg',                  'INTERCITY', 'Ratnagiri',  'Sindhudurg',  ['Ratnagiri', 'Sindhudurg']);
  await createRoute('Pune - Latur Express',                    'INTERCITY', 'Pune',       'Latur',       ['Pune', 'Solapur', 'Osmanabad', 'Latur']);
  await createRoute('Nagpur - Akola - Jalgaon',                'INTERCITY', 'Nagpur',     'Jalgaon',     ['Nagpur', 'Akola', 'Jalgaon']);
  await createRoute('Mumbai - Kolhapur Direct',                'INTERCITY', 'Mumbai',     'Kolhapur',    ['Mumbai', 'Pune', 'Satara', 'Sangli', 'Kolhapur']);
  await createRoute('Aurangabad - Hingoli - Nanded',           'INTERCITY', 'Aurangabad', 'Nanded',      ['Aurangabad', 'Hingoli', 'Nanded']);
  await createRoute('Pune - Ahmednagar - Latur',               'INTERCITY', 'Pune',       'Latur',       ['Pune', 'Ahmednagar', 'Beed', 'Latur']);

  // ─── LOCAL / CITY ROUTES ──────────────────────────────────────
  await createRoute('BEST Route 202 (Borivali to Dadar)',    'LOCAL', 'Mumbai', 'Mumbai', ['Borivali', 'Andheri', 'Bandra', 'Dadar']);
  await createRoute('BEST Route 310 (Andheri to Kurla)',     'LOCAL', 'Mumbai', 'Mumbai', ['Andheri', 'Bandra', 'Kurla']);
  await createRoute('PMPML Route 24 (Wakad to Katraj)',      'LOCAL', 'Pune',   'Pune',   ['Wakad', 'Kothrud', 'Swargate', 'Katraj']);
  await createRoute('PMPML Route 11 (Hadapsar to Wakad)',    'LOCAL', 'Pune',   'Pune',   ['Hadapsar', 'Swargate', 'Kothrud', 'Wakad']);
  await createRoute('Nagpur City Ring (Sitabuldi-Kamptee)', 'LOCAL', 'Nagpur', 'Nagpur', ['Sitabuldi', 'Kamptee']);

  console.log('✅ Database seeded with comprehensive Maharashtra routes, depots, and buses.');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
