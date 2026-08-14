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
  
  await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@buscargo.com',
      passwordHash,
      role: 'ADMIN',
    },
  });

  await prisma.user.create({
    data: {
      name: 'Depot Staff',
      email: 'staff@buscargo.com',
      passwordHash,
      role: 'STAFF',
    },
  });

  await prisma.user.create({
    data: {
      name: 'Regular Sender',
      email: 'sender@example.com',
      passwordHash,
      role: 'SENDER',
    },
  });

  console.log('Seeding Cities & Depots...');
  const cityData = [
    { name: 'Mumbai', lat: 19.0760, lng: 72.8777, type: 'Metro' },
    { name: 'Pune', lat: 18.5204, lng: 73.8567, type: 'Metro' },
    { name: 'Nagpur', lat: 21.1458, lng: 79.0882, type: 'Metro' },
    { name: 'Nashik', lat: 19.9975, lng: 73.7898, type: 'City' },
    { name: 'Aurangabad', lat: 19.8762, lng: 75.3433, type: 'City' },
    { name: 'Solapur', lat: 17.6599, lng: 75.9064, type: 'City' },
    { name: 'Amravati', lat: 20.9320, lng: 77.7523, type: 'City' },
    { name: 'Nanded', lat: 19.1383, lng: 77.3210, type: 'City' },
    { name: 'Kolhapur', lat: 16.7050, lng: 74.2433, type: 'City' },
    { name: 'Akola', lat: 20.7059, lng: 77.0019, type: 'City' },
    { name: 'Jalgaon', lat: 21.0077, lng: 75.5626, type: 'City' },
    { name: 'Latur', lat: 18.4088, lng: 76.5604, type: 'City' },
    { name: 'Dhule', lat: 20.9042, lng: 74.7749, type: 'City' },
    { name: 'Ahmednagar', lat: 19.0952, lng: 74.7496, type: 'City' },
    { name: 'Chandrapur', lat: 19.9615, lng: 79.2961, type: 'City' },
    { name: 'Parbhani', lat: 19.2644, lng: 76.7728, type: 'City' },
    { name: 'Jalna', lat: 19.8297, lng: 75.8800, type: 'City' },
    { name: 'Bhusawal', lat: 21.0455, lng: 75.8011, type: 'City' },
    { name: 'Navi Mumbai', lat: 19.0330, lng: 73.0297, type: 'Metro' },
    { name: 'Thane', lat: 19.2183, lng: 72.9781, type: 'Metro' },
    { name: 'Pusad', lat: 19.9022, lng: 77.5841, type: 'Town' },
  ];

  const cityMap: Record<string, any> = {};
  const depotMap: Record<string, any> = {};

  for (const c of cityData) {
    const city = await prisma.city.create({ data: { name: c.name, state: 'Maharashtra', type: c.type } });
    cityMap[c.name] = city;

    // Main CBS
    const cbs = await prisma.depot.create({
      data: { name: `${c.name} Central Bus Stand`, cityId: city.id, lat: c.lat, lng: c.lng }
    });
    depotMap[c.name] = cbs;
  }

  // Add specific Mumbai BEST Depots
  const dadar = await prisma.depot.create({ data: { name: 'Dadar BEST Depot', cityId: cityMap['Mumbai'].id, lat: 19.0178, lng: 72.8478 }});
  const andheri = await prisma.depot.create({ data: { name: 'Andheri BEST Depot', cityId: cityMap['Mumbai'].id, lat: 19.1136, lng: 72.8697 }});
  const borivali = await prisma.depot.create({ data: { name: 'Borivali BEST Depot', cityId: cityMap['Mumbai'].id, lat: 19.2307, lng: 72.8567 }});
  
  // Add specific Pune PMPML Depots
  const swargate = await prisma.depot.create({ data: { name: 'Swargate PMPML Depot', cityId: cityMap['Pune'].id, lat: 18.5018, lng: 73.8636 }});
  const katraj = await prisma.depot.create({ data: { name: 'Katraj PMPML Depot', cityId: cityMap['Pune'].id, lat: 18.4529, lng: 73.8584 }});
  const wakad = await prisma.depot.create({ data: { name: 'Wakad PMPML Depot', cityId: cityMap['Pune'].id, lat: 18.5987, lng: 73.7688 }});

  console.log('Seeding Routes...');

  const createRoute = async (name: string, type: string, sourceCityName: string, destCityName: string, stopNames: string[]) => {
    const waypoints = stopNames.map(sn => {
      // Find depot
      let depot = depotMap[sn];
      if (!depot) {
        if (sn === 'Dadar') depot = dadar;
        if (sn === 'Andheri') depot = andheri;
        if (sn === 'Borivali') depot = borivali;
        if (sn === 'Swargate') depot = swargate;
        if (sn === 'Katraj') depot = katraj;
        if (sn === 'Wakad') depot = wakad;
      }
      return { lat: depot.lat, lng: depot.lng };
    });

    const route = await prisma.route.create({
      data: {
        name,
        type,
        sourceCityId: cityMap[sourceCityName].id,
        destCityId: cityMap[destCityName].id,
        waypointsJson: JSON.stringify(waypoints)
      }
    });

    for (let i = 0; i < stopNames.length; i++) {
      let sn = stopNames[i];
      let depot = depotMap[sn];
      if (!depot) {
        if (sn === 'Dadar') depot = dadar;
        if (sn === 'Andheri') depot = andheri;
        if (sn === 'Borivali') depot = borivali;
        if (sn === 'Swargate') depot = swargate;
        if (sn === 'Katraj') depot = katraj;
        if (sn === 'Wakad') depot = wakad;
      }
      await prisma.routeStop.create({
        data: { routeId: route.id, depotId: depot.id, stopOrder: i }
      });
    }

    // Add a bus
    await prisma.bus.create({
      data: {
        routeId: route.id,
        currentLat: waypoints[0].lat,
        currentLng: waypoints[0].lng,
        status: 'IDLE'
      }
    });
  };

  await createRoute('Mumbai - Pune - Solapur (Shivneri)', 'INTERCITY', 'Mumbai', 'Solapur', ['Mumbai', 'Navi Mumbai', 'Pune', 'Solapur']);
  await createRoute('Pune - Ahmednagar - Aurangabad (Shivshahi)', 'INTERCITY', 'Pune', 'Aurangabad', ['Pune', 'Ahmednagar', 'Aurangabad']);
  await createRoute('Mumbai - Nashik - Dhule (MSRTC Express)', 'INTERCITY', 'Mumbai', 'Dhule', ['Mumbai', 'Thane', 'Nashik', 'Dhule']);
  await createRoute('Nagpur - Amravati - Akola (MSRTC)', 'INTERCITY', 'Nagpur', 'Akola', ['Nagpur', 'Amravati', 'Akola']);
  await createRoute('Pune - Kolhapur (Shivneri)', 'INTERCITY', 'Pune', 'Kolhapur', ['Pune', 'Kolhapur']);
  await createRoute('Aurangabad - Nanded (MSRTC)', 'INTERCITY', 'Aurangabad', 'Nanded', ['Aurangabad', 'Jalna', 'Parbhani', 'Nanded']);
  await createRoute('Pune - Pusad Express (MSRTC)', 'INTERCITY', 'Pune', 'Pusad', ['Pune', 'Ahmednagar', 'Jalna', 'Pusad']);

  await createRoute('BEST Route 202 (Borivali to Dadar)', 'LOCAL', 'Mumbai', 'Mumbai', ['Borivali', 'Andheri', 'Dadar']);
  await createRoute('PMPML Route 24 (Wakad to Katraj)', 'LOCAL', 'Pune', 'Pune', ['Wakad', 'Swargate', 'Katraj']);

  console.log('Database seeded successfully with comprehensive Maharashtra data.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
