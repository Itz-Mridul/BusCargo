import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getLedger } from '../lib/api';
import { CheckCircle2, IndianRupee, TrendingUp, Shield, User, Loader } from 'lucide-react';

export const LedgerPage = () => {
  const { parcelId } = useParams<{ parcelId: string }>();
  const navigate = useNavigate();
  const [ledger, setLedger] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [inputId, setInputId] = useState(parcelId || '');
  const [error, setError] = useState('');

  const fetchLedger = async (id: string) => {
    setLoading(true);
    setError('');
    try {
      const res = await getLedger(id);
      setLedger(res.data);
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Parcel not found');
      setLedger(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (parcelId) fetchLedger(parcelId);
    else setLoading(false);
  }, [parcelId]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputId) navigate(`/ledger/${inputId}`);
  };

  const splits = ledger ? [
    {
      label: 'MSRTC Transit',
      pct: ledger.splitTransitPct,
      amount: ledger.computed?.transitAmount ?? ledger.amount * 0.6,
      icon: Shield,
      color: 'teal',
      desc: 'Bus operator share — core logistics infrastructure',
    },
    {
      label: 'Platform Fee',
      pct: ledger.splitPlatformPct,
      amount: ledger.computed?.platformAmount ?? ledger.amount * 0.3,
      icon: TrendingUp,
      color: 'blue',
      desc: 'BusCargo technology & operations fee',
    },
    {
      label: 'Agent Commission',
      pct: ledger.splitAgentPct,
      amount: ledger.computed?.agentAmount ?? ledger.amount * 0.1,
      icon: User,
      color: 'purple',
      desc: 'Last-mile delivery agent (Phase 2)',
    },
  ] : [];

  const colorMap: Record<string, { bar: string; text: string; bg: string; border: string }> = {
    teal: { bar: 'bg-teal-500', text: 'text-teal-400', bg: 'bg-teal-500/10', border: 'border-teal-500/30' },
    blue: { bar: 'bg-blue-500', text: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/30' },
    purple: { bar: 'bg-purple-500', text: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/30' },
  };

  return (
    <div className="p-8 max-w-3xl mx-auto animate-fadeInUp">
      <div className="mb-8">
        <h2 className="page-header flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-teal-500/20 flex items-center justify-center">
            <IndianRupee className="w-5 h-5 text-teal-400" />
          </div>
          Revenue Ledger
        </h2>
        <p className="page-subheader">Zero manual reconciliation — auto-split on delivery confirmation</p>
      </div>

      {/* Search */}
      {!parcelId && (
        <form onSubmit={handleSearch} className="glass-card rounded-xl p-5 border border-slate-700/50 mb-6 flex gap-3">
          <input
            type="text"
            value={inputId}
            onChange={e => setInputId(e.target.value)}
            placeholder="Enter Parcel ID (UUID)"
            className="input-field flex-1"
          />
          <button type="submit" className="btn-primary px-6 py-3 text-sm whitespace-nowrap">View Ledger</button>
        </form>
      )}

      {loading && (
        <div className="text-center py-16"><Loader className="w-8 h-8 text-teal-400 animate-spin mx-auto" /></div>
      )}

      {error && (
        <div className="glass-card rounded-xl p-5 border border-red-500/30 bg-red-500/10 text-red-400">{error}</div>
      )}

      {ledger && (
        <>
          {/* Total */}
          <div className="glass-card rounded-xl p-8 border border-teal-500/20 glow-teal mb-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4">
              <span className="flex items-center gap-1 bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-xs font-semibold border border-emerald-500/30">
                <CheckCircle2 className="w-3.5 h-3.5" /> AUTO-SETTLED
              </span>
            </div>
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-teal-500/5 rounded-full blur-2xl" />

            <p className="text-sm text-slate-400 mb-1">Total Amount Collected</p>
            <div className="flex items-end gap-2">
              <h3 className="text-6xl font-black text-white">₹{ledger.amount}</h3>
              <span className="text-slate-400 mb-2 text-sm">INR</span>
            </div>
            <p className="text-xs text-slate-500 mt-2">Parcel ID: <span className="font-mono text-slate-400">{ledger.parcelId}</span></p>
          </div>

          {/* Splits */}
          <div className="space-y-3 mb-6">
            {splits.map((s) => {
              const Icon = s.icon;
              const c = colorMap[s.color];
              return (
                <div key={s.label} className={`glass-card rounded-xl p-5 border ${c.border} ${c.bg} relative overflow-hidden`}>
                  <div className={`absolute left-0 top-0 bottom-0 w-1 ${c.bar}`} />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${c.bg} border ${c.border}`}>
                        <Icon className={`w-4 h-4 ${c.text}`} />
                      </div>
                      <div>
                        <p className={`font-semibold ${c.text}`}>{s.label}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{s.desc}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-white">₹{Math.round(s.amount)}</p>
                      <p className={`text-xs ${c.text} font-semibold`}>{s.pct}%</p>
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="h-1.5 bg-slate-700 rounded-full">
                      <div className={`h-1.5 ${c.bar} rounded-full transition-all`} style={{ width: `${s.pct}%` }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="glass-card rounded-xl p-4 border border-slate-700/50 text-center">
            <p className="text-xs text-slate-500">
              Settlement is automatic on OTP confirmation. No manual bank transfer needed.<br />
              <span className="text-slate-600">Production: RazorpayX payout API distributes funds within 24h</span>
            </p>
          </div>
        </>
      )}
    </div>
  );
};
