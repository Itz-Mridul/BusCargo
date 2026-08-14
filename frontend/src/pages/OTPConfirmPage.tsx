import React, { useState, useRef, useEffect } from 'react';
import { confirmDelivery, trackParcel } from '../lib/api';
import { KeyRound, CheckCircle2, Loader, AlertCircle, Package, PenLine, Trash2, Download } from 'lucide-react';

export const OTPConfirmPage = () => {
  const [trackingId, setTrackingId] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [parcelInfo, setParcelInfo] = useState<any>(null);
  const [lookupLoading, setLookupLoading] = useState(false);
  const [step, setStep] = useState<'LOOKUP' | 'SIGN' | 'OTP'>('LOOKUP');

  // Signature canvas
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawing = useRef(false);
  const [hasSigned, setHasSigned] = useState(false);
  const [signatureData, setSignatureData] = useState('');

  // Fetch parcel info once tracking ID is entered
  const lookupParcel = async () => {
    if (!trackingId.trim()) return;
    setLookupLoading(true);
    setError('');
    try {
      const res = await trackParcel(trackingId.trim());
      setParcelInfo(res.data);
      setStep('SIGN');
    } catch {
      setError('Parcel not found. Please check the Tracking ID.');
    } finally {
      setLookupLoading(false);
    }
  };

  // Canvas drawing
  const getPos = (e: React.MouseEvent | React.TouchEvent, canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect();
    if ('touches' in e) {
      return { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top };
    }
    return { x: (e as React.MouseEvent).clientX - rect.left, y: (e as React.MouseEvent).clientY - rect.top };
  };

  const startDraw = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    e.preventDefault();
    const ctx = canvas.getContext('2d')!;
    const pos = getPos(e, canvas);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    isDrawing.current = true;
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    e.preventDefault();
    const ctx = canvas.getContext('2d')!;
    const pos = getPos(e, canvas);
    ctx.lineTo(pos.x, pos.y);
    ctx.strokeStyle = '#1e40af';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.stroke();
    setHasSigned(true);
  };

  const stopDraw = () => { isDrawing.current = false; };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSigned(false);
    setSignatureData('');
  };

  const saveSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setSignatureData(canvas.toDataURL('image/png'));
    setStep('OTP');
  };

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
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center animate-bounceIn">
          <div className="bg-white rounded-3xl shadow-2xl border border-emerald-100 p-8">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-10 h-10 text-emerald-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Delivered! 🎉</h2>
            <p className="text-gray-500 mb-1">Parcel successfully handed over to receiver.</p>
            <p className="font-mono text-blue-600 text-sm mb-6">{trackingId}</p>

            {signatureData && (
              <div className="mb-6 border border-gray-100 rounded-xl p-3 bg-gray-50">
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Digital Signature Captured</p>
                <img src={signatureData} alt="Receiver Signature" className="max-h-16 mx-auto" />
                <p className="text-xs text-gray-400 mt-1">Signed by: {parcelInfo?.receiverName}</p>
              </div>
            )}

            <div className="space-y-2 text-sm mb-6">
              <div className="flex items-center gap-3 p-3 bg-emerald-50 border border-emerald-100 rounded-xl">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span className="text-gray-700">Delivery confirmed via OTP ✓</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-100 rounded-xl">
                <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0" />
                <span className="text-gray-700">Digital signature recorded ✓</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-teal-50 border border-teal-100 rounded-xl">
                <CheckCircle2 className="w-4 h-4 text-teal-600 flex-shrink-0" />
                <span className="text-gray-700">Revenue ledger auto-settled ✓</span>
              </div>
            </div>

            <p className="text-xs text-gray-400 bg-gray-50 rounded-lg p-3">
              Revenue split auto-distributed: MSRTC 60% · Platform 30% · Agent 10%
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <div className="relative z-10 w-full max-w-lg animate-fadeInUp">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-600 shadow-lg shadow-blue-500/30 mb-4">
            <KeyRound className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Confirm Delivery</h1>
          <p className="text-gray-500 text-sm">Parcel handover with digital proof</p>
        </div>

        {/* Progress steps */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {['Lookup', 'Signature', 'OTP'].map((label, i) => {
            const active = (step === 'LOOKUP' && i === 0) || (step === 'SIGN' && i === 1) || (step === 'OTP' && i === 2);
            const done = (step === 'SIGN' && i === 0) || (step === 'OTP' && i <= 1);
            return (
              <React.Fragment key={label}>
                <div className={`flex items-center gap-1.5 text-sm font-medium ${done ? 'text-emerald-600' : active ? 'text-blue-600' : 'text-gray-400'}`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border-2 ${done ? 'bg-emerald-600 border-emerald-600 text-white' : active ? 'bg-blue-600 border-blue-600 text-white' : 'border-gray-300 text-gray-400'}`}>
                    {done ? '✓' : i + 1}
                  </div>
                  {label}
                </div>
                {i < 2 && <div className={`flex-1 h-0.5 max-w-8 ${done ? 'bg-emerald-400' : 'bg-gray-200'}`} />}
              </React.Fragment>
            );
          })}
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-red-600 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
            </div>
          )}

          {/* Step 1: Lookup */}
          {step === 'LOOKUP' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Tracking ID</label>
                <div className="relative">
                  <Package className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={trackingId}
                    onChange={e => setTrackingId(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && lookupParcel()}
                    placeholder="BC-20260812-XXXXX"
                    className="input-field pl-10 font-mono"
                    required
                  />
                </div>
              </div>
              <button onClick={lookupParcel} disabled={!trackingId || lookupLoading} className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50">
                {lookupLoading ? <Loader className="w-4 h-4 animate-spin" /> : 'Find Parcel →'}
              </button>
            </div>
          )}

          {/* Step 2: Parcel Info + Digital Signature */}
          {step === 'SIGN' && parcelInfo && (
            <div className="space-y-4">
              {/* Parcel Info Card */}
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 space-y-2">
                <p className="text-xs text-blue-600 font-semibold uppercase tracking-wider mb-2">Parcel Details</p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                  <span className="text-gray-500">Receiver</span>
                  <span className="font-semibold text-gray-900">{parcelInfo.receiverName}</span>
                  <span className="text-gray-500">Phone</span>
                  <span className="font-medium text-blue-600">{parcelInfo.receiverPhone}</span>
                  <span className="text-gray-500">From</span>
                  <span className="font-medium text-gray-900">{parcelInfo.originDepot?.name}</span>
                  <span className="text-gray-500">To</span>
                  <span className="font-medium text-gray-900">{parcelInfo.destDepot?.name}</span>
                  <span className="text-gray-500">Weight</span>
                  <span className="font-medium text-gray-900">{parcelInfo.weight} kg</span>
                </div>
              </div>

              {/* Digital Signature */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                    <PenLine className="w-4 h-4 text-blue-600" /> Receiver's Digital Signature
                  </label>
                  <button onClick={clearSignature} className="text-xs text-gray-400 hover:text-red-500 flex items-center gap-1">
                    <Trash2 className="w-3 h-3" /> Clear
                  </button>
                </div>
                <div className="border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 overflow-hidden">
                  <canvas
                    ref={canvasRef}
                    width={450}
                    height={150}
                    className="w-full cursor-crosshair touch-none"
                    onMouseDown={startDraw}
                    onMouseMove={draw}
                    onMouseUp={stopDraw}
                    onMouseLeave={stopDraw}
                    onTouchStart={startDraw}
                    onTouchMove={draw}
                    onTouchEnd={stopDraw}
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">Ask the receiver to sign above using mouse or touch</p>
              </div>

              <button
                onClick={saveSignature}
                disabled={!hasSigned}
                className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-40"
              >
                Capture Signature & Enter OTP →
              </button>
            </div>
          )}

          {/* Step 3: OTP */}
          {step === 'OTP' && (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Signature preview */}
              {signatureData && (
                <div className="border border-gray-100 rounded-xl p-3 bg-gray-50 text-center">
                  <p className="text-xs text-gray-400 mb-2">Signature Captured ✓</p>
                  <img src={signatureData} alt="Signature" className="max-h-12 mx-auto" />
                </div>
              )}

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <p className="text-xs text-amber-700 font-semibold mb-1">📱 OTP sent to receiver's phone</p>
                <p className="text-xs text-amber-600">The receiver should check their SMS for the 6-digit OTP that was sent to <strong>{parcelInfo?.receiverPhone}</strong>.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Enter 6-Digit OTP</label>
                <input
                  type="text"
                  value={otp}
                  onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="• • • • • •"
                  className="input-field text-center text-3xl tracking-[0.5em] font-mono"
                  maxLength={6}
                  autoFocus
                  required
                />
              </div>

              <button type="submit" disabled={loading || otp.length !== 6} className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50">
                {loading
                  ? <><Loader className="w-4 h-4 animate-spin" /> Verifying...</>
                  : <><CheckCircle2 className="w-4 h-4" /> Confirm Delivery</>
                }
              </button>

              <button type="button" onClick={() => setStep('SIGN')} className="w-full text-sm text-gray-400 hover:text-gray-600 py-1">
                ← Back to signature
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
