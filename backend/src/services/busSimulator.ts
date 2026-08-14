import prisma from '../lib/prisma';

const activeSimulations = new Map<string, NodeJS.Timeout>();

export const startSimulation = async (parcelId: string, busId: string) => {
  if (activeSimulations.has(parcelId)) {
    return;
  }

  try {
    const bus = await prisma.bus.findUnique({
      where: { id: busId },
      include: { route: true }
    });

    if (!bus || !bus.route) return;

    const waypoints: {lat: number, lng: number}[] = JSON.parse(bus.route.waypointsJson);
    if (waypoints.length < 2) return;

    const maxSteps = waypoints.length - 1;
    const framesPerSegment = 10;
    let currentSegment = 0;
    let frame = 0;

    const interval = setInterval(async () => {
      try {
        if (currentSegment >= maxSteps) {
          clearInterval(interval);
          activeSimulations.delete(parcelId);
          return;
        }

        const p1 = waypoints[currentSegment];
        const p2 = waypoints[currentSegment + 1];
        
        const lat = p1.lat + ((p2.lat - p1.lat) * (frame / framesPerSegment));
        const lng = p1.lng + ((p2.lng - p1.lng) * (frame / framesPerSegment));

        await prisma.bus.update({
          where: { id: busId },
          data: { currentLat: lat, currentLng: lng, lastUpdated: new Date() }
        });

        frame++;
        if (frame >= framesPerSegment) {
          frame = 0;
          currentSegment++;
        }
      } catch (err) {
        console.error('Simulation error:', err);
        clearInterval(interval);
        activeSimulations.delete(parcelId);
      }
    }, 3000);

    activeSimulations.set(parcelId, interval);
  } catch (error) {
    console.error('Failed to start simulation:', error);
  }
};

export const stopSimulation = (parcelId: string) => {
  const interval = activeSimulations.get(parcelId);
  if (interval) {
    clearInterval(interval);
    activeSimulations.delete(parcelId);
  }
};
