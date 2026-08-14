import React, { useState } from 'react';
import { confirmDelivery } from '../lib/api';
import { KeyRound, CheckCircle2, Loader, AlertCircle, Package } from 'lucide-react';

export const OTPConfirmPage = () => {
  const [trackingId, setTrackingId] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await confirmDelivery(trackingId.trim(), otp.trim());
      setSuccess(true);
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Invalid OTP or tracking ID. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-slate-900 grid-bg flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center animate-bounceIn">
          <div className="relative mb-8">
            <div className="text-8xl mb-2">🎉</div>
            <div className="absolute -top-2 -left-4 text-4xl animate-bounce" style={{ animationDelay: '0.2s' }}>🎊</div>
            <div className="absolute -top-2 -right-4 text-4xl animate-bounce" style={{ animationDelay: '0.4s' }}>✨</div>
          </div>

          <div className="glass-card rounded-2xl p-8 border border-emerald-500/30 shadow-2xl">
            <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-white mb-2">Delivered!</h2>
            <p className="text-slate-400 mb-2">Parcel successfully delivered to the receiver.</p>
            <p className="font-mono text-teal-400 text-sm mb-6">{trackingId}</p>

            <div className="space-y-3 text-sm text-left mb-6">
              <div className="flex items-center gap-3 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span className="text-slate-300">Delivery confirmed via OTP ✓</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-teal-500/10 border border-teal-500/20 rounded-lg">
                <CheckCircle2 className="w-4 h-4 text-teal-400 flex-shrink-0" />
                <span className="text-slate-300">Revenue ledger auto-settled ✓</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <CheckCircle2 className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <span className="text-slate-300">Zero manual reconciliation ✓</span>
              </div>
            </div>

            <div className="p-3 bg-slate-800/50 rounded-lg text-xs text-slate-500">
              Revenue split automatically distributed: MSRTC 60% · Platform 30% · Agent 10%
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 grid-bg flex items-center justify-center p-4">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-md w-full animate-fadeInUp">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 shadow-lg shadow-teal-500/30 mb-4">
            <KeyRound className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-1">Delivery Confirmation</h1>
          <p className="text-slate-400 text-sm">Enter the OTP to confirm parcel receipt</p>
        </div>

        <div className="glass-card rounded-2xl p-8 border border-slate-700/50 shadow-2xl">
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-2 text-red-400 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm text-slate-400 mb-1.5">Tracking ID</label>
              <div className="relative">
                <Package className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={trackingId}
                  onChange={e => setTrackingId(e.target.value)}
                  placeholder="BC-20260812-XXXXX"
                  className="input-field pl-10 font-mono"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-slate-400 mb-1.5">6-Digit OTP</label>
              <input
                type="text"
                value={otp}
                onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="• • • • • •"
                className="input-field text-center text-3xl tracking-[0.5em] font-mono"
                maxLength={6}
                required
              />
            </div>

            <button type="submit" disabled={loading || otp.length !== 6} className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50">
              {loading
                ? <><Loader className="w-4 h-4 animate-spin" /> Verifying...</>
                : <><CheckCircle2 className="w-4 h-4" /> Confirm Delivery</>
              }
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-700/50 text-xs text-slate-500 text-center">
            OTP was shared with the receiver at booking time.<br />
            <span className="text-slate-600">Production: Sent via SMS by Twilio/MSG91</span>
          </div>
        </div>
      </div>
    </div>
  );
};
