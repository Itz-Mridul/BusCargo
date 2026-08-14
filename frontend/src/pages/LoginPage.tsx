import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Bus, Lock, Mail, ArrowRight, Package, MapPin, Shield, Zap } from 'lucide-react';

const PARTICLES = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  size: Math.random() * 6 + 3,
  left: Math.random() * 100,
  duration: Math.random() * 12 + 8,
  delay: Math.random() * 8,
  opacity: Math.random() * 0.4 + 0.1,
}));

const FEATURES = [
  { icon: Package, label: 'Parcel Tracking', desc: 'Real-time GPS tracking on every route' },
  { icon: Shield, label: 'OTP Secured', desc: '6-digit OTP + digital signature on delivery' },
  { icon: Zap, label: 'Instant Booking', desc: 'Book in under 2 minutes, drop off anytime' },
  { icon: MapPin, label: 'Pune Pilot', desc: 'Pilot area: Pune + 7 nearby towns' },
];

export const LoginPage = () => {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const [mounted, setMounted]   = useState(false);
  const { login } = useAuth();
  const navigate  = useNavigate();

  useEffect(() => { setMounted(true); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(email, password, false);
      navigate('/');
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex overflow-hidden bg-slate-950">

      
      {PARTICLES.map(p => (
        <div
          key={p.id}
          className="absolute rounded-full bg-blue-400 pointer-events-none particle"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.left}%`,
            bottom: '-20px',
            opacity: p.opacity,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}

      
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600 rounded-full filter blur-[140px] opacity-20 animate-orb-spin pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-600 rounded-full filter blur-[120px] opacity-15 pointer-events-none" style={{ animation: 'orb-spin 25s linear infinite reverse' }} />
      <div className="absolute top-3/4 left-1/2 w-60 h-60 bg-emerald-500 rounded-full filter blur-[100px] opacity-10 pointer-events-none" />

      
      <div className={`hidden lg:flex flex-col justify-between w-1/2 p-12 relative z-10 transition-all duration-700 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
        
        
        <div className="animate-fadeInDown">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center shadow-2xl glow-blue">
              <Bus className="w-7 h-7 text-white" />
            </div>
            <span className="text-white font-extrabold text-2xl tracking-tight">BusCargo</span>
          </div>
        </div>

        
        <div className="space-y-8">
          <div className="animate-slideInLeft">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-300 text-xs font-semibold uppercase tracking-wider mb-6">
              <span className="w-2 h-2 bg-blue-400 rounded-full animate-ping" /> Live in Pune District
            </div>
            <h1 className="text-5xl font-black text-white leading-tight">
              Deliver smarter<br/>
              <span className="gradient-text-blue-green">with every bus.</span>
            </h1>
            <p className="text-slate-400 text-lg mt-4 leading-relaxed max-w-md">
              BusCargo piggybacks parcels on MSRTC buses — the most affordable, eco-friendly cargo network in Maharashtra.
            </p>
          </div>

          
          <div className="grid grid-cols-2 gap-4">
            {FEATURES.map((f, i) => (
              <div
                key={i}
                className={`card-3d bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-sm stagger-${i + 1}`}
              >
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center mb-3">
                  <f.icon className="w-5 h-5 text-blue-400" />
                </div>
                <p className="text-white font-semibold text-sm">{f.label}</p>
                <p className="text-slate-400 text-xs mt-1">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

        
        <p className="text-center text-xs text-slate-500 mt-6">
          Pilot Phase · Pune District, Maharashtra
        </p>
      </div>

      
      <div className="flex flex-1 items-center justify-center p-6 relative z-10">
        <div className={`w-full max-w-md transition-all duration-700 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>

          
          <div className="flex lg:hidden items-center justify-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center glow-blue">
              <Bus className="w-7 h-7 text-white" />
            </div>
            <span className="text-white font-extrabold text-2xl">BusCargo</span>
          </div>

          
          <div className="relative bg-white/8 backdrop-blur-2xl border border-white/15 rounded-3xl p-8 shadow-[0_8px_60px_rgba(0,0,0,0.5)]">
            
            
            <div className="absolute inset-x-0 top-0 h-px rounded-t-3xl overflow-hidden">
              <div className="h-full animate-shimmer bg-gradient-to-r from-transparent via-white/40 to-transparent" />
            </div>

            <div className="mb-8">
              <h2 className="text-3xl font-black text-white tracking-tight">Sign in</h2>
              <p className="text-slate-400 mt-1 text-sm">Welcome back — let's get your parcels moving.</p>
            </div>

            {error && (
              <div className="mb-5 p-3.5 bg-red-500/15 border border-red-500/30 rounded-xl text-red-300 text-sm flex items-center gap-2 animate-fadeInDown">
                <span className="w-2 h-2 bg-red-400 rounded-full shrink-0" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-400 transition-colors" />
                <input
                  type="email"
                  id="login-email"
                  placeholder="Email address"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  className="w-full bg-white/8 border border-white/15 rounded-xl px-4 py-3.5 pl-11 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/60 focus:bg-white/12 focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
              </div>

              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-400 transition-colors" />
                <input
                  type="password"
                  id="login-password"
                  placeholder="Password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="w-full bg-white/8 border border-white/15 rounded-xl px-4 py-3.5 pl-11 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/60 focus:bg-white/12 focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
              </div>

              <button
                type="submit"
                id="login-submit"
                disabled={loading}
                className="relative w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl shadow-[0_0_30px_rgba(37,99,235,0.4)] hover:shadow-[0_0_50px_rgba(37,99,235,0.6)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group"
              >
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                {loading ? (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span className="relative z-10">Sign In</span>
                    <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-white/10 text-center">
              <p className="text-slate-400 text-sm">
                New to BusCargo?{' '}
                <Link to="/signup" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors hover:underline">
                  Create free account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
