import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Package, Plus, Navigation, CheckCircle, ShieldCheck, Star, MapPin, PhoneCall } from 'lucide-react';

export const SenderDashboard = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    import('../lib/api').then(({ getMyBookings }) => {
      getMyBookings().then(res => setBookings(res.data)).catch(console.error);
    });
  }, []);

  const statusColor: Record<string, string> = {
    BOOKED: 'bg-blue-100 text-blue-700',
    IN_TRANSIT: 'bg-orange-100 text-orange-700',
    ARRIVED: 'bg-amber-100 text-amber-700',
    DELIVERED: 'bg-emerald-100 text-emerald-700',
  };

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening';

  const steps = [
    { icon: <Package className="w-6 h-6 text-blue-600" />, title: 'Book', desc: 'Pick route & weight', color: 'bg-blue-50 border-blue-100', action: () => navigate('/sender/book') },
    { icon: <MapPin className="w-6 h-6 text-orange-500" />, title: 'Drop Off', desc: 'Hand parcel at depot', color: 'bg-orange-50 border-orange-100', action: () => navigate('/scan') },
    { icon: <Navigation className="w-6 h-6 text-indigo-500" />, title: 'Track', desc: 'Watch it move live', color: 'bg-indigo-50 border-indigo-100', action: () => {
      const id = window.prompt('Enter Tracking ID:');
      if (id) navigate(`/sender/track/${id.trim()}`);
    }},
    { icon: <CheckCircle className="w-6 h-6 text-emerald-600" />, title: 'Receive', desc: 'Confirm with OTP', color: 'bg-emerald-50 border-emerald-100', action: () => navigate('/delivery/confirm') },
  ];

  const safetyItems = [
    { icon: <ShieldCheck className="w-5 h-5 text-emerald-600" />, color: 'bg-emerald-50 border-emerald-100', title: 'OTP-Secured Delivery', desc: 'Parcel only handed over after the receiver enters the correct 6-digit OTP sent to their phone.' },
    { icon: <Star className="w-5 h-5 text-blue-600" />, color: 'bg-blue-50 border-blue-100', title: 'Digital Signature', desc: "Receiver's signature is captured on delivery as legal proof." },
    { icon: <PhoneCall className="w-5 h-5 text-purple-600" />, color: 'bg-purple-50 border-purple-100', title: 'Emergency Contacts', desc: 'Driver phone, helpline (1800 221 949), and emergency (112) visible on every tracking page.' },
  ];

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6 animate-fadeInUp">
      <div className="relative bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-6 text-white overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
        <div className="relative z-10">
          <p className="text-blue-200 text-sm mb-1">Good {greeting},</p>
          <h2 className="text-3xl font-bold mb-1">{user?.name?.split(' ')[0]} 👋</h2>
          <p className="text-blue-200 text-sm mb-5">Ready to send a parcel? It takes under 2 minutes.</p>
          <Link to="/sender/book" className="inline-flex items-center gap-2 bg-white text-blue-700 font-bold px-5 py-2.5 rounded-xl shadow-lg hover:bg-blue-50 transition-all">
            <Plus className="w-4 h-4" /> Book New Parcel
          </Link>
        </div>
        <div className="absolute right-6 top-1/2 -translate-y-1/2 text-6xl opacity-20">🚌</div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">How It Works</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {steps.map((step, i) => (
            <button key={i} onClick={step.action} className={`${step.color} border rounded-2xl p-4 text-left hover:scale-105 hover:shadow-md transition-all cursor-pointer w-full`}>
              <div className="mb-3">{step.icon}</div>
              <p className="font-bold text-gray-900 text-sm">{step.title}</p>
              <p className="text-xs text-gray-500 mt-0.5">{step.desc}</p>
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Safety Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {safetyItems.map((f, i) => (
            <div key={i} className={`${f.color} border rounded-2xl p-4`}>
              <div className="flex items-center gap-2 mb-2">
                {f.icon}
                <p className="font-bold text-gray-900 text-sm">{f.title}</p>
              </div>
              <p className="text-xs text-gray-500">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Your Bookings</h3>
          <Link to="/sender/book" className="text-sm text-blue-600 font-medium flex items-center gap-1 hover:underline">
            <Plus className="w-3.5 h-3.5" /> New Booking
          </Link>
        </div>

        {bookings.length === 0 ? (
          <div className="bg-white border border-gray-100 rounded-2xl p-8 text-center shadow-sm">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-600 font-semibold mb-1">No bookings yet</p>
            <p className="text-gray-400 text-sm mb-4">Book your first parcel to get started</p>
            <Link to="/sender/book" className="btn-primary inline-flex items-center gap-2 text-sm">
              <Plus className="w-4 h-4" /> Book Now
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {bookings.map(b => (
              <div key={b.trackingId} className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center justify-between shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                    <Package className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-mono font-bold text-blue-700 text-sm">{b.trackingId}</p>
                    <p className="text-xs text-gray-400">{b.originDepot?.name || '—'} → {b.destDepot?.name || '—'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColor[b.status] || 'bg-gray-100 text-gray-500'}`}>
                    {b.status?.replace('_', ' ')}
                  </span>
                  <Link to={`/sender/track/${b.trackingId}`} className="p-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors">
                    <Navigation className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-gray-50 rounded-2xl border border-gray-100 p-4">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div><p className="text-2xl font-bold text-blue-600">302K+</p><p className="text-xs text-gray-500">People Served</p></div>
          <div><p className="text-2xl font-bold text-emerald-600">79</p><p className="text-xs text-gray-500">Villages Connected</p></div>
          <div><p className="text-2xl font-bold text-indigo-600">30s</p><p className="text-xs text-gray-500">Avg Scan Time</p></div>
        </div>
      </div>
    </div>
  );
};
