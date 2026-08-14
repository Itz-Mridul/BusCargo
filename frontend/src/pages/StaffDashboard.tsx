import { Link } from 'react-router-dom';
import { Scan, Clock, Package, ChevronRight } from 'lucide-react';

export const StaffDashboard = () => {
  return (
    <div className="p-8 animate-fadeInUp">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="page-header text-gray-900">Staff Dashboard 🔍</h2>
          <p className="page-subheader text-gray-500">Scan parcels in and out at your depot</p>
        </div>
        <Link to="/staff/scan" className="btn-primary flex items-center gap-2">
          <Scan className="w-4 h-4" /> Scan QR
        </Link>
      </div>

      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <Link to="/staff/scan" className="stat-card group cursor-pointer block bg-white">
          <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Scan className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">Scan Parcel QR</h3>
          <p className="text-sm text-gray-500">Load or unload a parcel at this depot</p>
          <div className="flex items-center gap-1 text-blue-600 text-sm mt-3 font-medium">
            Open Scanner <ChevronRight className="w-4 h-4" />
          </div>
        </Link>

        <Link to="/delivery/confirm" className="stat-card group cursor-pointer block bg-white">
          <div className="w-12 h-12 rounded-xl bg-green-50 border border-green-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Package className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">Confirm Delivery</h3>
          <p className="text-sm text-gray-500">Verify receiver OTP and close the loop</p>
          <div className="flex items-center gap-1 text-green-600 text-sm mt-3 font-medium">
            Confirm OTP <ChevronRight className="w-4 h-4" />
          </div>
        </Link>
      </div>

      
      <div className="glass-card rounded-xl p-6 border border-gray-200 bg-white">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Clock className="w-4 h-4 text-blue-600" /> Staff Process Guide
        </h3>
        <div className="space-y-4">
          {[
            { step: '1', title: 'Sender drops off parcel', desc: 'Scan QR at origin depot → Status changes to IN_TRANSIT → Bus simulation starts' },
            { step: '2', title: 'Bus arrives at destination', desc: 'Geofence triggers arrival alert (sped up ×20 for demo) → Scan QR again → Status: ARRIVED' },
            { step: '3', title: 'Receiver collects', desc: 'Receiver enters OTP on Delivery Confirm page → Status: DELIVERED → Ledger auto-settles' },
          ].map(p => (
            <div key={p.step} className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 text-sm font-bold flex-shrink-0">{p.step}</div>
              <div>
                <p className="font-medium text-gray-900 text-sm">{p.title}</p>
                <p className="text-xs text-gray-500 mt-0.5">{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};