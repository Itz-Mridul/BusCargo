import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { CheckCircle, Package, Navigation, Copy, CheckCheck } from 'lucide-react';
import { trackParcel } from '../lib/api';

export const BookingConfirmPage = () => {
  const { trackingId } = useParams<{ trackingId: string }>();
  const [parcel, setParcel] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  // OTP & QR were stored at booking time
  const otp = trackingId ? sessionStorage.getItem(`otp_${trackingId}`) : null;
  const qrValue = trackingId ? (sessionStorage.getItem(`qr_${trackingId}`) || `BUSCARGO:${trackingId}`) : `BUSCARGO:${trackingId}`;

  useEffect(() => {
    if (trackingId) {
      trackParcel(trackingId).then(res => setParcel(res.data)).catch(console.error);
    }
  }, [trackingId]);

  const copyTrackingId = () => {
    navigator.clipboard.writeText(trackingId || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-8 max-w-2xl mx-auto animate-fadeInUp">
      {/* Success Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-500/20 border border-emerald-500/30 mb-4 animate-bounceIn">
          <CheckCircle className="w-10 h-10 text-emerald-400" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-2">Booking Confirmed!</h2>
        <p className="text-slate-400">Your parcel is booked. Drop it off at the origin depot.</p>
      </div>

      <div className="space-y-4">
        {/* QR Code */}
        <div className="glass-card rounded-xl p-6 border border-slate-700/50 text-center">
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-4">Scan at Depot</p>
          <div className="inline-block bg-white p-4 rounded-xl shadow-xl">
            <QRCodeSVG value={qrValue} size={180} level="H" />
          </div>
          <p className="text-xs text-slate-500 mt-3 font-mono">{qrValue}</p>
        </div>

        {/* Tracking ID */}
        <div className="glass-card rounded-xl p-5 border border-teal-500/20 bg-teal-500/5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Tracking ID</p>
              <p className="text-2xl font-mono font-bold text-teal-400">{trackingId}</p>
            </div>
            <button onClick={copyTrackingId} className="flex items-center gap-2 px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors text-sm">
              {copied ? <><CheckCheck className="w-4 h-4 text-emerald-400" /> Copied</> : <><Copy className="w-4 h-4" /> Copy</>}
            </button>
          </div>
        </div>

        {/* OTP */}
        {otp && (
          <div className="glass-card rounded-xl p-5 border border-dashed border-amber-500/40 bg-amber-500/5">
            <p className="text-xs text-amber-400 uppercase tracking-wider mb-2 font-semibold">⚠️ Receiver Delivery OTP</p>
            <p className="text-4xl font-mono font-bold tracking-[0.4em] text-white text-center py-2">{otp}</p>
            <p className="text-xs text-slate-500 text-center mt-2">Share this OTP only with the receiver. Required for final delivery confirmation.</p>
            <p className="text-xs text-slate-600 text-center mt-1 italic">Production: Sent via SMS to receiver's phone</p>
          </div>
        )}

        {/* Parcel Summary */}
        {parcel && (
          <div className="glass-card rounded-xl p-5 border border-slate-700/50">
            <p className="text-xs text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Package className="w-3 h-3" /> Parcel Details
            </p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><p className="text-slate-400">From</p><p className="font-medium">{parcel.originDepot?.name}</p></div>
              <div><p className="text-slate-400">To</p><p className="font-medium">{parcel.destDepot?.name}</p></div>
              <div><p className="text-slate-400">Weight</p><p className="font-medium">{parcel.weight} kg</p></div>
              <div><p className="text-slate-400">Price Paid</p><p className="font-medium text-teal-400">₹{parcel.price}</p></div>
              <div><p className="text-slate-400">Receiver</p><p className="font-medium">{parcel.receiverName}</p></div>
              <div><p className="text-slate-400">Status</p><p className="font-medium text-blue-400">{parcel.status}</p></div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Link to={`/sender/track/${trackingId}`}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-white font-semibold py-3 rounded-lg transition-all text-sm">
            <Navigation className="w-4 h-4" /> Track Live
          </Link>
          <Link to="/sender/book"
            className="flex items-center justify-center gap-2 btn-secondary text-sm">
            <Package className="w-4 h-4" /> Book Another
          </Link>
        </div>
      </div>
    </div>
  );
};
