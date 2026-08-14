import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Package, Plus, Navigation, CheckCircle, ShieldCheck, MapPin,
  ArrowRight, Zap, TrendingUp, Leaf, Users, Lock, Scan,
  BarChart2, Truck, Clock, IndianRupee
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
    { num: 1, icon: Package,   color: 'bg-blue-500',    label: 'Sender Books',      desc: 'Pick depots, pay online via UPI/Cash', action: () => navigate('/sender/book') },
    { num: 2, icon: Scan,      color: 'bg-violet-500',  label: 'Parcel Scanned',    desc: 'Staff scan QR & load into cargo slot', action: () => navigate('/scan') },
    { num: 3, icon: Truck,     color: 'bg-orange-500',  label: 'Live Transit',      desc: 'GPS tracking on bus route in real-time', action: null },
    { num: 4, icon: MapPin,    color: 'bg-amber-500',   label: 'Arrival Alert',     desc: 'Receiver notified when bus arrives', action: null },
    { num: 5, icon: ShieldCheck,color:'bg-emerald-500', label: 'OTP Handover',      desc: 'OTP + digital signature for proof of delivery', action: () => navigate('/delivery/confirm') },
    { num: 6, icon: IndianRupee,color:'bg-teal-500',    label: 'Fare Auto-Split',   desc: '60% Transit · 30% Platform · 10% Agent', action: null },
  ];

  const impactPillars = [
    { icon: TrendingUp, color: 'from-blue-500 to-blue-600',    bg: 'bg-blue-50',    border: 'border-blue-200', title: 'Economic',     stat: '40–55%', statLabel: 'Cost Savings', desc: 'Auto revenue-split, zero manual reconciliation' },
    { icon: Users,      color: 'from-violet-500 to-violet-600', bg: 'bg-violet-50', border: 'border-violet-200',title: 'Social',       stat: '79',     statLabel: 'Villages',    desc: 'Rural & semi-urban access across Pune district' },
    { icon: Leaf,       color: 'from-emerald-500 to-emerald-600',bg:'bg-emerald-50',border: 'border-emerald-200',title: 'Environmental', stat: '0',      statLabel: 'New Vehicles', desc: 'Piggyback model — zero extra emissions' },
    { icon: Lock,       color: 'from-amber-500 to-orange-500',  bg: 'bg-amber-50',  border: 'border-amber-200', title: 'Trust',        stat: '100%',   statLabel: 'Traceable',   desc: 'HMAC-signed QR + live GPS + OTP chain-of-custody' },
  ];

  const techFeatures = [
    { icon: '🔐', label: 'HMAC-Signed QR',     desc: 'Every parcel gets a tamper-proof cryptographic QR code' },
    { icon: '📍', label: 'GPS Live Tracking',  desc: 'Real-time bus position fed directly to sender & receiver' },
    { icon: '💳', label: 'UPI / RazorpayX',    desc: 'Instant payment and automated fare settlement on delivery' },
    { icon: '🛡️', label: 'Cargo Insurance',    desc: '₹10/parcel capped insurance baked into every booking' },
    { icon: '✍️', label: 'Digital Signature',  desc: 'Receiver captures signature on screen as legal proof of delivery' },
    { icon: '📦', label: 'Cargo Slot System',  desc: 'Parcel assigned to a physical numbered slot on the bus' },
  ];

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-12 animate-fadeInUp">

      {/* ── HERO BANNER ── */}
      <div className="relative overflow-hidden rounded-[2rem] bg-slate-900 p-8 md:p-12 shadow-2xl">
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-96 h-96 bg-blue-500 rounded-full mix-blend-screen filter blur-[80px] opacity-60 animate-pulse" />
        <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-96 h-96 bg-emerald-500 rounded-full mix-blend-screen filter blur-[80px] opacity-40" />
        <div className="absolute inset-x-0 top-0 h-px">
          <div className="h-full animate-shimmer bg-gradient-to-r from-transparent via-white/30 to-transparent" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-left flex-1 space-y-4 animate-slideInLeft">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-blue-200 text-xs font-semibold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" /> Live · Pune District Pilot
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-white leading-tight">
              Good {greeting}, <br />
              <span className="gradient-text-blue-green">{user?.name?.split(' ')[0]} 👋</span>
            </h2>
            <p className="text-slate-300 text-base max-w-md">
              BusCargo turns idle MSRTC bus space into a parcel network — affordable, eco-friendly, and trusted.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link to="/sender/book" className="relative inline-flex items-center gap-2 px-7 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-2xl shadow-[0_0_30px_rgba(37,99,235,0.4)] hover:shadow-[0_0_50px_rgba(37,99,235,0.6)] hover:-translate-y-0.5 transition-all duration-200 overflow-hidden group">
                <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/15 to-transparent" />
                <Plus className="w-5 h-5 relative z-10" />
                <span className="relative z-10">Book Parcel</span>
              </Link>
              <button onClick={() => { const id = window.prompt('Enter Tracking ID:'); if (id) navigate(`/sender/track/${id.trim()}`); }}
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-white/10 border border-white/20 text-white font-semibold rounded-2xl hover:bg-white/20 transition-all duration-200 backdrop-blur-sm">
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
              <div className="px-3 py-1.5 bg-blue-500/20 border border-blue-500/30 rounded-xl text-blue-300 text-xs font-bold animate-float3">📍 Live GPS</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── IMPACT STATS BAR ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { value: '302K+', label: 'People Reached', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
          { value: '79',    label: 'Villages Covered', icon: MapPin, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
          { value: '40-55%',label: 'Cheaper vs Courier', icon: TrendingUp, color: 'text-violet-600', bg: 'bg-violet-50', border: 'border-violet-100' },
          { value: '30s',   label: 'Avg Scan Time', icon: Zap, color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-100' },
        ].map((s, i) => (
          <div key={i} className={`card-3d stagger-${i+1} ${s.bg} border ${s.border} rounded-2xl p-5 flex flex-col items-center text-center`}>
            <s.icon className={`w-6 h-6 ${s.color} mb-2`} />
            <p className={`text-3xl font-black ${s.color} tracking-tight`}>{s.value}</p>
            <p className="text-xs font-medium text-slate-600 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* ── 6-STEP DELIVERY FLOW ── */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold text-slate-800">How BusCargo Works</h3>
            <p className="text-slate-500 text-sm mt-1">6-step end-to-end delivery pipeline</p>
          </div>
          <span className="hidden md:block text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100">Automated Revenue Split</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {deliverySteps.map((step, i) => (
            <div
              key={i}
              onClick={() => step.action && step.action()}
              className={`card-3d stagger-${i+1} relative bg-white border border-slate-200 rounded-2xl p-5 overflow-hidden ${step.action ? 'cursor-pointer hover:border-blue-300 hover:shadow-xl hover:shadow-blue-500/10' : 'cursor-default'} transition-all duration-300`}
            >
              <div className={`absolute top-0 left-0 w-1 h-full ${step.color}`} />
              <div className="pl-2">
                <div className={`w-10 h-10 rounded-xl ${step.color} bg-opacity-15 flex items-center justify-center mb-3`}
                  style={{ background: step.color.replace('bg-', '').includes('blue') ? 'rgba(59,130,246,0.1)' : 'rgba(100,100,100,0.08)' }}>
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

      {/* ── IMPACT PILLARS ── */}
      <div className="relative rounded-[2rem] bg-slate-900 p-8 md:p-10 overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-indigo-600 rounded-full filter blur-[100px] opacity-20 pointer-events-none" />
        <div className="relative z-10">
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-white">Impact & Benefits</h3>
            <p className="text-slate-400 text-sm mt-1">Why BusCargo is the right model for rural India</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {impactPillars.map((p, i) => (
              <div key={i} className={`card-3d stagger-${i+1} bg-white/8 border border-white/10 rounded-2xl p-5 backdrop-blur-sm`}>
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${p.color} flex items-center justify-center mb-4 shadow-lg animate-float${i % 3 === 0 ? '' : i % 3 === 1 ? '2' : '3'}`}>
                  <p.icon className="w-5 h-5 text-white" />
                </div>
                <p className="text-3xl font-black text-white leading-none">{p.stat}</p>
                <p className="text-xs text-slate-400 font-medium mt-0.5">{p.statLabel}</p>
                <div className="mt-3 pt-3 border-t border-white/10">
                  <p className="font-bold text-slate-200 text-xs">{p.title}</p>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── TECH FEATURES ── */}
      <div>
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-slate-800">Security & Technology</h3>
          <p className="text-slate-500 text-sm mt-1">Enterprise-grade trust built into every step</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {techFeatures.map((f, i) => (
            <div key={i} className={`card-3d stagger-${Math.min(i+1,5)} bg-white border border-slate-200 rounded-2xl p-5 flex items-start gap-4`}>
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

      {/* ── PILOT CORRIDOR BANNER ── */}
      <div className="relative overflow-hidden rounded-2xl border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 bg-blue-100 px-2.5 py-1 rounded-full mb-2">
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-ping" /> LIVE PILOT
            </span>
            <h4 className="font-bold text-slate-900 text-lg">Kopargaon → Pune Pilot Corridor</h4>
            <p className="text-slate-600 text-sm mt-1">
              First MoU route live — Kopargaon has direct MSRTC connectivity to Pune.<br/>
              No new infrastructure needed, just a digital layer on existing operations.
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm font-semibold text-blue-700 shrink-0 bg-white border border-blue-200 px-5 py-3 rounded-xl shadow-sm">
            Kopargaon <ArrowRight className="w-4 h-4 text-blue-400" /> Sangamner <ArrowRight className="w-4 h-4 text-blue-400" /> Pune
          </div>
        </div>
      </div>

      {/* ── RECENT BOOKINGS ── */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-2xl font-bold text-slate-800">Recent Bookings</h3>
          <Link to="/sender/book" className="text-sm text-blue-600 font-bold flex items-center gap-1.5 bg-blue-50 px-4 py-2 rounded-xl border border-blue-100 hover:bg-blue-100 transition-colors">
            <Plus className="w-4 h-4" /> Book New
          </Link>
        </div>
        {bookings.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-[2rem] p-12 text-center shadow-sm">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
              <Package className="w-9 h-9 text-slate-300" />
            </div>
            <p className="text-slate-800 font-bold text-lg mb-2">No active bookings</p>
            <p className="text-slate-500 text-sm mb-6">Send your first parcel via MSRTC in under 2 minutes.</p>
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

      {/* ── MARKET SIZE FOOTER ── */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-6 text-white flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <p className="text-slate-400 text-xs uppercase tracking-wider font-semibold mb-1">India Express Parcel Market</p>
          <p className="text-3xl font-black text-white">₹10–11B <span className="text-slate-400 text-lg font-normal">→</span> <span className="gradient-text-blue-green">₹24–29B</span></p>
          <p className="text-slate-400 text-sm mt-1">FY25 to FY30 — BusCargo is positioned for this growth wave</p>
        </div>
        <div className="flex items-center gap-2 text-sm font-bold">
          <BarChart2 className="w-5 h-5 text-blue-400" />
          <span className="text-slate-300">Pilot MoU · RazorpayX Payouts · MSRTC Partnership</span>
        </div>
      </div>

    </div>
  );
};
