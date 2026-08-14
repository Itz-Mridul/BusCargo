import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { trackParcel, getBusPosition } from '../lib/api';
import { StatusBadge } from '../components/StatusBadge';
import { Package, MapPin, Clock, ArrowRight, Navigation } from 'lucide-react';

// Fix leaflet default icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const intercityBusIcon = new L.DivIcon({
  html: '<div class="bus-icon-pulse text-3xl filter drop-shadow-lg">🚌</div>',
  className: 'bg-transparent border-0',
  iconSize: [36, 36],
  iconAnchor: [18, 18],
});

const localBusIcon = new L.DivIcon({
  html: '<div class="bus-icon-pulse text-2xl filter drop-shadow-lg bg-blue-100 rounded-full p-1 border-2 border-blue-500 shadow-md">🚐</div>',
  className: 'bg-transparent border-0',
  iconSize: [36, 36],
  iconAnchor: [18, 18],
});

const depotIcon = new L.DivIcon({
  html: '<div style="font-size:20px">📍</div>',
  className: 'bg-transparent border-0',
  iconSize: [24, 24],
  iconAnchor: [12, 24],
});

// Dynamic coordinates computed from parcel data in component

const STATUSES = ['BOOKED', 'IN_TRANSIT', 'ARRIVED', 'DELIVERED'];

export const TrackingPage = () => {
  const { trackingId } = useParams<{ trackingId: string }>();
  const [parcel, setParcel] = useState<any>(null);
  const [busPos, setBusPos] = useState<any>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  useEffect(() => {
    if (trackingId) {
      trackParcel(trackingId).then(res => setParcel(res.data)).catch(console.error);
    }
  }, [trackingId]);

  useEffect(() => {
    if (parcel?.status === 'IN_TRANSIT' && parcel.busId) {
      const fetchPos = () => {
        getBusPosition(parcel.busId).then(res => {
          setBusPos(res.data);
          setLastUpdate(new Date());
        }).catch(console.error);
      };
      fetchPos();
      const interval = setInterval(fetchPos, 4000);
      return () => clearInterval(interval);
    }
  }, [parcel]);

  // Also poll parcel status every 5s
  useEffect(() => {
    if (!trackingId) return;
    const interval = setInterval(() => {
      trackParcel(trackingId).then(res => setParcel(res.data)).catch(console.error);
    }, 5000);
    return () => clearInterval(interval);
  }, [trackingId]);

  const statusIdx = parcel ? STATUSES.indexOf(parcel.status) : 0;

  let routeLine: [number, number][] = [];
  let mapCenter: [number, number] = [18.5204, 73.8567]; // Default Pune
  
  if (parcel?.bus?.route?.waypointsJson) {
    try {
      const waypoints = JSON.parse(parcel.bus.route.waypointsJson);
      routeLine = waypoints.map((wp: any) => [wp.lat, wp.lng]);
      if (routeLine.length > 0) {
        mapCenter = routeLine[Math.floor(routeLine.length / 2)];
      }
    } catch (e) {
      console.error(e);
    }
  }

  if (!parcel) return (
    <div className="p-8 flex items-center justify-center h-64">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-slate-400">Loading tracking data...</p>
      </div>
    </div>
  );

  return (
    <div className="p-6 max-w-6xl mx-auto animate-fadeInUp space-y-6">
      {/* Header */}
      <div className="glass-card rounded-xl p-5 border border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white">
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Tracking</p>
          <h2 className="text-2xl font-bold font-mono text-blue-600">{trackingId}</h2>
          <p className="text-sm text-gray-600 mt-1">
            {parcel.originDepot?.name} → {parcel.destDepot?.name} · {parcel.weight}kg · ₹{parcel.price}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge status={parcel.status} />
          {parcel.status === 'IN_TRANSIT' && (
            <span className="flex items-center gap-1 text-xs text-blue-600 bg-blue-50 border border-blue-100 px-2 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
              Live
            </span>
          )}
        </div>
      </div>

      {/* Status Timeline */}
      <div className="glass-card rounded-xl p-5 border border-gray-200 bg-white">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Journey Status</h3>
        <div className="flex items-center">
          {STATUSES.map((s, i) => (
            <React.Fragment key={s}>
              <div className="flex flex-col items-center flex-shrink-0">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all
                  ${i < statusIdx ? 'bg-blue-600 border-blue-600 text-white' :
                    i === statusIdx ? 'bg-blue-500 border-blue-500 text-white' :
                    'bg-white border-gray-300 text-gray-400'}`}>
                  {i < statusIdx ? '✓' : i + 1}
                </div>
                <p className={`text-xs mt-1 font-medium whitespace-nowrap ${i <= statusIdx ? 'text-gray-900' : 'text-gray-400'}`}>
                  {s.replace('_', ' ')}
                </p>
              </div>
              {i < STATUSES.length - 1 && (
                <div className={`flex-1 h-0.5 mx-2 transition-all ${i < statusIdx ? 'bg-blue-600' : 'bg-gray-200'}`} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Map */}
      <div className="glass-card rounded-xl border border-gray-200 overflow-hidden shadow-sm bg-white" style={{ height: '420px' }}>
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <h3 className="text-sm font-semibold flex items-center gap-2 text-gray-800">
            <Navigation className="w-4 h-4 text-blue-600" />
            Live Route Map
            {parcel.status === 'IN_TRANSIT' && <span className="text-xs text-blue-500 font-normal">(updating every 4s — sped up ×20 for demo)</span>}
          </h3>
          {lastUpdate && <p className="text-xs text-gray-500">Updated {lastUpdate.toLocaleTimeString()}</p>}
        </div>
        <MapContainer
          center={mapCenter}
          zoom={9}
          style={{ height: 'calc(100% - 44px)', width: '100%' }}
          zoomControl={true}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          />

          <Polyline positions={routeLine} color="#14b8a6" weight={3} opacity={0.6} dashArray="8 4" />

          {/* Depot markers */}
          {[parcel.originDepot, parcel.destDepot].filter(Boolean).map((d: any) => (
            <Marker key={d.id} position={[d.lat, d.lng]} icon={depotIcon}>
              <Popup><strong>{d.name}</strong></Popup>
            </Marker>
          ))}

          {/* Bus marker */}
          {busPos && parcel.status === 'IN_TRANSIT' && (
            <Marker position={[busPos.currentLat, busPos.currentLng]} icon={parcel.serviceType === 'LOCAL' ? localBusIcon : intercityBusIcon}>
              <Popup>
                <strong>{parcel.serviceType === 'LOCAL' ? 'Local City Bus' : 'Inter-City Bus'} in Transit</strong><br />
                {parcel.originDepot?.name} → {parcel.destDepot?.name}
              </Popup>
            </Marker>
          )}
        </MapContainer>
      </div>

      {/* OTP Reminder */}
      {(parcel.status === 'ARRIVED' || parcel.status === 'IN_TRANSIT') && (
        <div className="glass-card rounded-xl p-4 border border-yellow-300 bg-yellow-50">
          <p className="text-sm text-yellow-800 font-semibold">📦 Parcel Ready for Delivery</p>
          <p className="text-sm text-yellow-700 mt-1">
            Go to <Link to="/delivery/confirm" className="text-blue-600 underline">Delivery Confirmation</Link> and enter the OTP to complete delivery.
          </p>
        </div>
      )}
    </div>
  );
};
