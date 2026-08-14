import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Package, Plus, Navigation, CheckCircle, ShieldCheck, Star, MapPin, PhoneCall, ArrowRight } from 'lucide-react';

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
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-10 animate-fadeInUp">
      
      {/* 🌟 Premium Hero Section */}
      <div className="relative overflow-hidden rounded-[2rem] bg-slate-900 p-8 md:p-12 shadow-2xl">
        {/* Dynamic Background Gradients */}
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-96 h-96 bg-blue-500 rounded-full mix-blend-screen filter blur-[80px] opacity-60 animate-pulse" />
        <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-96 h-96 bg-emerald-500 rounded-full mix-blend-screen filter blur-[80px] opacity-50" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-left flex-1 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-blue-200 text-xs font-semibold uppercase tracking-wider backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping"></span> Live in Pune District
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-white leading-tight">
              Welcome back, <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
                {user?.name?.split(' ')[0]} 👋
              </span>
            </h2>
            <p className="text-slate-300 text-base md:text-lg max-w-lg">
              Experience the fastest, safest, and most affordable parcel delivery network powered by local transit.
            </p>
            <div className="pt-4">
              <Link to="/sender/book" className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-2xl shadow-[0_0_40px_rgba(37,99,235,0.4)] hover:shadow-[0_0_60px_rgba(37,99,235,0.6)] hover:-translate-y-1 transition-all duration-300 overflow-hidden">
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                <Plus className="w-5 h-5 relative z-10" /> 
                <span className="relative z-10">Book New Parcel</span>
              </Link>
            </div>
          </div>
          
          <div className="hidden md:flex relative">
            <div className="w-48 h-48 bg-white/10 border border-white/20 rounded-3xl backdrop-blur-xl flex items-center justify-center shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
              <Package className="w-24 h-24 text-blue-300 drop-shadow-2xl" />
            </div>
            <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-emerald-500/20 border border-emerald-500/30 rounded-2xl backdrop-blur-xl flex items-center justify-center shadow-xl transform -rotate-6">
              <ShieldCheck className="w-10 h-10 text-emerald-400" />
            </div>
          </div>
        </div>
      </div>

      {/* 🚀 Features: How It Works */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-slate-800 tracking-tight">How BusCargo Works</h3>
          <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">4 Simple Steps</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {steps.map((step, i) => (
            <button key={i} onClick={step.action} className="group relative bg-white border border-slate-200 rounded-3xl p-6 text-left hover:border-blue-300 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 transform hover:-translate-y-1 w-full overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-indigo-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              <div className={`w-14 h-14 rounded-2xl ${step.color} flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110`}>
                {step.icon}
              </div>
              <p className="font-bold text-slate-900 text-lg mb-1">{step.title}</p>
              <p className="text-sm text-slate-500">{step.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* 🛡️ Secure By Design */}
      <div className="relative rounded-[2rem] bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 p-8 md:p-10 overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="max-w-2xl mb-8">
            <h3 className="text-2xl font-bold text-slate-800 tracking-tight mb-2">Why We're 100% Secure</h3>
            <p className="text-slate-600">Enterprise-grade security features built directly into our delivery pipeline to ensure your parcels are never lost or compromised.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {safetyItems.map((f, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-xl transition-shadow duration-300">
                <div className={`w-12 h-12 rounded-xl ${f.color} flex items-center justify-center mb-4`}>
                  {f.icon}
                </div>
                <p className="font-bold text-slate-900 text-base mb-2">{f.title}</p>
                <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 📦 Your Bookings */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-slate-800 tracking-tight">Recent Bookings</h3>
          <Link to="/sender/book" className="text-sm text-blue-600 font-bold flex items-center gap-1 hover:text-blue-700 bg-blue-50 px-4 py-2 rounded-xl transition-colors">
            <Plus className="w-4 h-4" /> View All
          </Link>
        </div>

        {bookings.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-[2rem] p-12 text-center shadow-sm">
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
              <Package className="w-10 h-10 text-slate-300" />
            </div>
            <p className="text-slate-800 font-bold text-lg mb-2">No active bookings</p>
            <p className="text-slate-500 text-sm mb-6 max-w-sm mx-auto">You haven't sent any parcels yet. Book your first delivery and experience the magic.</p>
            <Link to="/sender/book" className="inline-flex items-center gap-2 bg-slate-900 text-white font-bold px-6 py-3 rounded-xl hover:bg-slate-800 transition-colors">
              <Plus className="w-4 h-4" /> Book Now
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {bookings.map(b => (
              <div key={b.trackingId} className="group bg-white border border-slate-200 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between shadow-sm hover:shadow-xl hover:border-blue-200 transition-all duration-300 gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Package className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-mono font-bold text-slate-900 text-base">{b.trackingId}</p>
                    <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
                      <span>{b.originDepot?.name || '—'}</span>
                      <ArrowRight className="w-3 h-3 text-slate-300" />
                      <span>{b.destDepot?.name || '—'}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between md:justify-end gap-4 w-full md:w-auto">
                  <span className={`text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wide ${statusColor[b.status] || 'bg-slate-100 text-slate-500'}`}>
                    {b.status?.replace('_', ' ')}
                  </span>
                  <Link to={`/sender/track/${b.trackingId}`} className="flex items-center justify-center w-10 h-10 bg-slate-50 text-slate-600 rounded-xl hover:bg-blue-600 hover:text-white transition-colors shadow-sm">
                    <Navigation className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 📊 Footer Impact Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Citizens Served', value: '302K+', color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Villages Connected', value: '79', color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Avg Handover Time', value: '30s', color: 'text-indigo-600', bg: 'bg-indigo-50' },
        ].map((stat, i) => (
          <div key={i} className={`${stat.bg} rounded-2xl p-6 border border-slate-100/50 flex flex-col items-center justify-center text-center`}>
            <p className={`text-3xl font-black ${stat.color} mb-1 tracking-tight`}>{stat.value}</p>
            <p className="text-sm font-medium text-slate-600">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
