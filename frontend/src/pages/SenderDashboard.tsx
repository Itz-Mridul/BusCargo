import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Package, Plus, Navigation, ShieldCheck, MapPin,
  ArrowRight, Zap, TrendingUp, Leaf, Users, Lock, Scan,
  BarChart2, Truck, IndianRupee
} from 'lucide-react';

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

  const deliverySteps = [
    { num: 1, icon: Package,    color: 'bg-blue-500',    label: 'Sender Books',    desc: 'Pick depots, pay online via UPI/Cash', action: () => navigate('/sender/book') },
    { num: 2, icon: Scan,       color: 'bg-violet-500',  label: 'Parcel Scanned',  desc: 'Staff scan QR & assign cargo slot on bus', action: () => navigate('/scan') },
    { num: 3, icon: Truck,      color: 'bg-orange-500',  label: 'In Transit',      desc: 'GPS tracks the bus on its scheduled route', action: null },
    { num: 4, icon: MapPin,     color: 'bg-amber-500',   label: 'Arrival Alert',   desc: 'Receiver notified when bus reaches depot', action: null },
    { num: 5, icon: ShieldCheck,color: 'bg-emerald-500', label: 'OTP Handover',    desc: 'OTP + digital signature confirms delivery', action: () => navigate('/delivery/confirm') },
    { num: 6, icon: IndianRupee,color: 'bg-teal-500',    label: 'Revenue Split',   desc: '60% Transit · 30% Platform · 10% Agent', action: null },
  ];

  const pillars = [
    { icon: TrendingUp, color: 'from-blue-500 to-blue-600',     title: 'Economic',      desc: 'Designed to cost significantly less than traditional couriers by using existing MSRTC bus infrastructure.' },
    { icon: Users,      color: 'from-violet-500 to-violet-600', title: 'Social',        desc: 'Aims to bring reliable parcel delivery to rural and semi-urban towns in the Pune district.' },
    { icon: Leaf,       color: 'from-emerald-500 to-emerald-600',title:'Environmental', desc: 'Piggybacks on buses already in service — no extra vehicles, no extra fuel, no extra emissions.' },
    { icon: Lock,       color: 'from-amber-500 to-orange-500',  title: 'Trust',         desc: 'HMAC-signed QR codes, live GPS, OTP confirmation, and digital signatures protect every parcel.' },
  ];

  const techFeatures = [
    { icon: '🔐', label: 'HMAC-Signed QR',    desc: 'Each parcel gets a cryptographically signed QR code that cannot be forged or reused.' },
    { icon: '📍', label: 'GPS Live Tracking', desc: 'The bus position is tracked and shown live on a map for both sender and receiver.' },
    { icon: '💳', label: 'UPI / RazorpayX',   desc: 'Payment collected at booking and fare automatically split on delivery confirmation.' },
    { icon: '🛡️', label: 'Cargo Insurance',   desc: 'A small insurance amount is included in every booking to protect against loss or damage.' },
    { icon: '✍️', label: 'Digital Signature', desc: 'Receiver signs on screen at handover, creating a legally valid proof of delivery record.' },
    { icon: '📦', label: 'Cargo Slot System', desc: 'Every parcel is assigned a numbered physical slot on the bus for easy identification.' },
  ];

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-12 animate-fadeInUp">

      <div className="relative overflow-hidden rounded-[2rem] bg-slate-900 p-8 md:p-12 shadow-2xl">
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-96 h-96 bg-blue-500 rounded-full mix-blend-screen filter blur-[80px] opacity-60 animate-pulse" />
        <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-96 h-96 bg-emerald-500 rounded-full mix-blend-screen filter blur-[80px] opacity-40" />
        <div className="absolute inset-x-0 top-0 h-px">
          <div className="h-full animate-shimmer bg-gradient-to-r from-transparent via-white/30 to-transparent" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-left flex-1 space-y-4 animate-slideInLeft">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-200 text-xs font-semibold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" /> Building Phase · Pune District
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-white leading-tight">
              Good {greeting}, <br />
              <span className="gradient-text-blue-green">{user?.name?.split(' ')[0]} 👋</span>
            </h2>
            <p className="text-slate-300 text-base max-w-md">
              BusCargo uses idle MSRTC bus cargo space to deliver parcels affordably across Pune district — without adding a single new vehicle.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link to="/sender/book" className="relative inline-flex items-center gap-2 px-7 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-2xl shadow-[0_0_30px_rgba(37,99,235,0.4)] hover:shadow-[0_0_50px_rgba(37,99,235,0.6)] hover:-translate-y-0.5 transition-all duration-200 overflow-hidden">
                <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/15 to-transparent" />
                <Plus className="w-5 h-5 relative z-10" />
                <span className="relative z-10">Book a Parcel</span>
              </Link>
              <button
                onClick={() => { const id = window.prompt('Enter Tracking ID:'); if (id) navigate(`/sender/track/${id.trim()}`); }}
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-white/10 border border-white/20 text-white font-semibold rounded-2xl hover:bg-white/20 transition-all duration-200 backdrop-blur-sm"
              >
                <Navigation className="w-4 h-4" /> Track Parcel
              </button>
            </div>
          </div>
          <div className="hidden md:flex flex-col items-center gap-4 animate-float">
            <div className="w-40 h-40 bg-white/10 border border-white/20 rounded-3xl backdrop-blur-xl flex items-center justify-center shadow-2xl">
              <Package className="w-20 h-20 text-blue-300" />
            </div>
            <div className="flex gap-3">
              <div className="px-3 py-1.5 bg-emerald-500/20 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs font-bold animate-float2">✅ OTP Secured</div>
              <div className="px-3 py-1.5 bg-blue-500/20 border border-blue-500/30 rounded-xl text-blue-300 text-xs font-bold animate-float3">📍 GPS Tracking</div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold text-slate-800">How BusCargo Works</h3>
            <p className="text-slate-500 text-sm mt-1">End-to-end delivery pipeline on MSRTC buses</p>
          </div>
          <span className="hidden md:block text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100">Automated Revenue Split</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {deliverySteps.map((step, i) => (
            <div
              key={i}
              onClick={() => step.action && step.action()}
              className={`card-3d stagger-${i + 1} relative bg-white border border-slate-200 rounded-2xl p-5 overflow-hidden ${step.action ? 'cursor-pointer hover:border-blue-300 hover:shadow-xl hover:shadow-blue-500/10' : 'cursor-default'} transition-all duration-300`}
            >
              <div className={`absolute top-0 left-0 w-1 h-full ${step.color}`} />
              <div className="pl-2">
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center mb-3">
                  <step.icon className="w-5 h-5 text-slate-700" />
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">STEP {step.num}</span>
                  {step.action && <span className="text-[10px] text-blue-500 font-bold">→ Click</span>}
                </div>
                <p className="font-bold text-slate-900 text-sm">{step.label}</p>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="relative rounded-[2rem] bg-slate-900 p-8 md:p-10 overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-indigo-600 rounded-full filter blur-[100px] opacity-20 pointer-events-none" />
        <div className="relative z-10">
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-white">Why BusCargo</h3>
            <p className="text-slate-400 text-sm mt-1">The four pillars behind the model</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {pillars.map((p, i) => (
              <div key={i} className={`card-3d stagger-${i + 1} bg-white/8 border border-white/10 rounded-2xl p-5 backdrop-blur-sm`}>
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${p.color} flex items-center justify-center mb-4 shadow-lg`}>
                  <p.icon className="w-5 h-5 text-white" />
                </div>
                <p className="font-bold text-white text-sm mb-2">{p.title}</p>
                <p className="text-xs text-slate-400 leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div>
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-slate-800">Security & Technology</h3>
          <p className="text-slate-500 text-sm mt-1">Built-in trust at every step of the delivery</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {techFeatures.map((f, i) => (
            <div key={i} className={`card-3d stagger-${Math.min(i + 1, 5)} bg-white border border-slate-200 rounded-2xl p-5 flex items-start gap-4`}>
              <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-2xl shrink-0">
                {f.icon}
              </div>
              <div>
                <p className="font-bold text-slate-900 text-sm">{f.label}</p>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="relative overflow-hidden rounded-2xl border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 bg-blue-100 px-2.5 py-1 rounded-full mb-2">
              🗺️ PLANNED PILOT CORRIDOR
            </span>
            <h4 className="font-bold text-slate-900 text-lg">Kopargaon → Pune</h4>
            <p className="text-slate-600 text-sm mt-1">
              Our first target route. MSRTC buses already run this corridor daily — BusCargo only needs to add a digital layer on top.
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm font-semibold text-blue-700 shrink-0 bg-white border border-blue-200 px-5 py-3 rounded-xl shadow-sm">
            Kopargaon <ArrowRight className="w-4 h-4 text-blue-400" /> Sangamner <ArrowRight className="w-4 h-4 text-blue-400" /> Pune
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-2xl font-bold text-slate-800">Your Bookings</h3>
          <Link to="/sender/book" className="text-sm text-blue-600 font-bold flex items-center gap-1.5 bg-blue-50 px-4 py-2 rounded-xl border border-blue-100 hover:bg-blue-100 transition-colors">
            <Plus className="w-4 h-4" /> Book New
          </Link>
        </div>
        {bookings.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-[2rem] p-12 text-center shadow-sm">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
              <Package className="w-9 h-9 text-slate-300" />
            </div>
            <p className="text-slate-800 font-bold text-lg mb-2">No bookings yet</p>
            <p className="text-slate-500 text-sm mb-6">Send your first parcel via MSRTC — quick and affordable.</p>
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
                    <p className="font-mono font-bold text-slate-900">{b.trackingId}</p>
                    <div className="flex items-center gap-2 text-sm text-slate-500 mt-0.5">
                      <span>{b.originDepot?.name || '—'}</span>
                      <ArrowRight className="w-3 h-3 text-slate-300" />
                      <span>{b.destDepot?.name || '—'}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wide ${statusColor[b.status] || 'bg-slate-100 text-slate-500'}`}>
                    {b.status?.replace('_', ' ')}
                  </span>
                  <Link to={`/sender/track/${b.trackingId}`} className="w-10 h-10 bg-slate-50 text-slate-600 rounded-xl flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors shadow-sm">
                    <Navigation className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-6 text-white flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <p className="text-slate-400 text-xs uppercase tracking-wider font-semibold mb-1">India Express Parcel Market Opportunity</p>
          <p className="text-2xl font-black text-white">₹10–11B <span className="text-slate-400 text-base font-normal">growing to</span> <span className="gradient-text-blue-green">₹24–29B</span></p>
          <p className="text-slate-400 text-sm mt-1">FY25 to FY30 — a large, underserved market that BusCargo is building for.</p>
        </div>
        <div className="flex items-center gap-2 text-sm font-bold">
          <BarChart2 className="w-5 h-5 text-blue-400" />
          <span className="text-slate-300">Prototype · MSRTC Route Data · Pune District</span>
        </div>
      </div>

    </div>
  );
};
