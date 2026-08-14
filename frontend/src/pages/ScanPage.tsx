import React, { useState, useEffect, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { scanQR, confirmDelivery } from '../lib/api';
import { StatusBadge } from '../components/StatusBadge';
import { Scan, Keyboard, CheckCircle2, AlertCircle, Loader } from 'lucide-react';

export const ScanPage = () => {
  const [manualCode, setManualCode] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Handover state
  const [handoverOtp, setHandoverOtp] = useState('');
  const [handoverLoading, setHandoverLoading] = useState(false);
  const [handoverSuccess, setHandoverSuccess] = useState(false);
  const [mode, setMode] = useState<'camera' | 'manual'>('camera');
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const scannedRef = useRef(false);

  useEffect(() => {
    if (mode === 'camera') {
      scannedRef.current = false;
      const scanner = new Html5QrcodeScanner('qr-reader', {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        rememberLastUsedCamera: true,
      }, false);
      scanner.render(
        (text) => {
          if (!scannedRef.current) {
            scannedRef.current = true;
            scanner.clear().catch(() => {});
            handleScan(text);
          }
        },
        (_err) => {}
      );
      scannerRef.current = scanner;
      return () => {
        scanner.clear().catch(() => {});
      };
    }
  }, [mode]);

  const handleScan = async (code: string) => {
    if (loading) return;
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const res = await scanQR(code.trim());
      setResult(res.data);
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Invalid QR code or parcel not found.');
    } finally {
      setLoading(false);
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualCode) handleScan(manualCode);
  };

  const reset = () => {
    setResult(null);
    setError('');
    setManualCode('');
    setHandoverOtp('');
    setHandoverSuccess(false);
    scannedRef.current = false;
  };

  const handleHandover = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!result?.parcel?.trackingId) return;
    
    setHandoverLoading(true);
    setError('');
    try {
      await confirmDelivery(result.parcel.trackingId, handoverOtp);
      setHandoverSuccess(true);
      setResult({ ...result, parcel: { ...result.parcel, status: 'DELIVERED' } });
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Invalid OTP. Please try again.');
    } finally {
      setHandoverLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto animate-fadeInUp">
      <div className="mb-6">
        <h2 className="page-header flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-teal-500/20 flex items-center justify-center">
            <Scan className="w-5 h-5 text-teal-400" />
          </div>
          Scan Parcel QR
        </h2>
        <p className="page-subheader">Scan at origin depot to load, destination depot to unload</p>
      </div>

      {/* Mode Toggle */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => { setMode('camera'); reset(); }}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${mode === 'camera' ? 'bg-teal-500 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}>
          <Scan className="w-4 h-4" /> Camera Scan
        </button>
        <button
          onClick={() => { setMode('manual'); reset(); }}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${mode === 'manual' ? 'bg-teal-500 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}>
          <Keyboard className="w-4 h-4" /> Manual Entry
        </button>
      </div>

      {/* Camera Scanner */}
      {mode === 'camera' && !result && (
        <div className="glass-card rounded-xl border border-slate-700/50 overflow-hidden mb-4">
          <div id="qr-reader" className="w-full" />
        </div>
      )}

      {/* Manual Entry */}
      {mode === 'manual' && !result && (
        <div className="glass-card rounded-xl p-6 border border-slate-700/50 mb-4">
          <form onSubmit={handleManualSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-slate-400 mb-2">QR Code Value</label>
              <input
                type="text"
                value={manualCode}
                onChange={e => setManualCode(e.target.value)}
                placeholder="BUSCARGO:BC-20260812-XXXXX"
                className="input-field font-mono"
                autoFocus
              />
              <p className="text-xs text-slate-500 mt-1">Format: <code className="text-teal-400">BUSCARGO:tracking-id</code></p>
            </div>
            <button type="submit" disabled={!manualCode || loading} className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50">
              {loading ? <Loader className="w-4 h-4 animate-spin" /> : <Scan className="w-4 h-4" />}
              {loading ? 'Processing...' : 'Process QR'}
            </button>
          </form>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="text-center py-8">
          <Loader className="w-8 h-8 text-teal-400 animate-spin mx-auto mb-3" />
          <p className="text-slate-400">Processing scan...</p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="glass-card rounded-xl p-5 border border-red-500/30 bg-red-500/10 animate-fadeInUp">
          <div className="flex items-center gap-3 text-red-400">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <div>
              <p className="font-semibold">Scan Failed</p>
              <p className="text-sm text-red-300 mt-1">{error}</p>
            </div>
          </div>
          <button onClick={reset} className="mt-4 btn-secondary text-sm w-full">Try Again</button>
        </div>
      )}

      {/* Success */}
      {result && (
        <div className="glass-card rounded-xl p-6 border border-emerald-500/30 bg-emerald-500/10 animate-fadeInUp">
          <div className="flex items-center gap-3 mb-4">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 flex-shrink-0" />
            <div>
              <p className="font-bold text-emerald-400 text-lg">Scan Successful!</p>
              <p className="text-sm text-slate-400">Parcel status updated</p>
            </div>
          </div>

          <div className="space-y-3 mb-4">
            <div className="flex justify-between items-center py-2 border-b border-slate-700/50">
              <span className="text-sm text-slate-400">Tracking ID</span>
              <span className="font-mono text-sm text-white font-medium">{result.parcel?.trackingId}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-700/50">
              <span className="text-sm text-slate-400">New Status</span>
              <StatusBadge status={result.parcel?.status} />
            </div>
            {result.parcel?.status === 'IN_TRANSIT' && (
              <div className="p-3 bg-teal-500/10 border border-teal-500/30 rounded-lg space-y-2">
                <p className="text-xs text-teal-400">🚌 Bus simulation started — parcel is now moving on the map (sped up ×20 for demo)</p>
                <div className="flex items-center justify-between bg-teal-500/10 rounded-md px-3 py-2">
                  <span className="text-xs text-teal-300 font-medium">Cargo Slot Assigned</span>
                  <span className="font-mono font-bold text-teal-400 text-sm">SLOT-{String((Math.abs(result.parcel.trackingId?.charCodeAt(4) ?? 0) % 12) + 1).padStart(2, '0')}B</span>
                </div>
              </div>
            )}
            {result.parcel?.status === 'ARRIVED' && !handoverSuccess && (
              <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                <p className="text-sm font-semibold text-amber-400 mb-2">📦 Ready for Handover</p>
                <form onSubmit={handleHandover} className="flex gap-2">
                  <input
                    type="text"
                    value={handoverOtp}
                    onChange={e => setHandoverOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="Enter 6-digit OTP"
                    className="input-field flex-1 text-center font-mono tracking-widest text-lg"
                    maxLength={6}
                    required
                  />
                  <button type="submit" disabled={handoverLoading || handoverOtp.length !== 6} className="btn-primary whitespace-nowrap disabled:opacity-50">
                    {handoverLoading ? <Loader className="w-4 h-4 animate-spin" /> : 'Confirm'}
                  </button>
                </form>
              </div>
            )}
            {result.parcel?.status === 'DELIVERED' && (
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <p className="text-sm text-emerald-400 font-semibold">Parcel Handed Over Successfully!</p>
              </div>
            )}
          </div>

          <button onClick={reset} className="btn-primary w-full text-sm">
            <Scan className="w-4 h-4 mr-2 inline" /> Scan Next Parcel
          </button>
        </div>
      )}
    </div>
  );
};
