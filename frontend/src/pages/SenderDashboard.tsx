import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getMetrics } from '../lib/api';
import { Package, TrendingUp, Truck, CheckCircle2, Plus, ArrowRight } from 'lucide-react';

export const SenderDashboard = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    import('../lib/api').then(({ getMyBookings }) => {
      getMyBookings().then(res => setBookings(res.data)).catch(console.error);
    });
  }, []);

  return (
    <div className="p-8 animate-fadeInUp">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name?.split(' ')[0]} 👋</h2>
          <p className="text-gray-500 mt-1">Ready to ship your next parcel?</p>
        </div>
        <Link to="/sender/book" className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Book Parcel
        </Link>
      </div>

      {/* Impact stat banner */}
      <div className="glass-card rounded-xl p-5 border border-blue-200 bg-blue-50 mb-6">
        <div className="flex items-center gap-8 flex-wrap">
          <div>
            <p className="text-3xl font-bold text-blue-600">302,452</p>
            <p className="text-xs text-blue-800">People in our coverage area</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-green-600">79</p>
            <p className="text-xs text-green-800">Villages connected</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-indigo-600">30s</p>
            <p className="text-xs text-indigo-800">Average scan time</p>
          </div>
          <div className="ml-auto text-right">
            <p className="text-xs text-gray-600">Kopargaon · Shirdi · Ahmednagar</p>
            <p className="text-xs text-gray-500">MSRTC Bus Route</p>
          </div>
        </div>
      </div>

      {/* Quick Actions (Functional Hackathon Links) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {[
          { icon: '📦', title: 'Book', desc: 'Book a new parcel', action: () => navigate('/sender/book') },
          { icon: '🔍', title: 'Scan', desc: 'Depot Staff Scanner', action: () => navigate('/staff/scan') },
          { icon: '🚌', title: 'Track', desc: 'Track Live Parcel', action: () => {
             const id = window.prompt("Enter Tracking ID (e.g., BC-...)");
             if (id) navigate(`/sender/track/${id}`);
          } },
          { icon: '✅', title: 'Deliver', desc: 'Confirm OTP at end', action: () => navigate('/delivery/confirm') },
        ].map((step, i) => (
          <button 
            key={i} 
            onClick={step.action}
            className="stat-card text-center bg-white cursor-pointer hover:scale-105 hover:shadow-lg transition-all border border-gray-100 hover:border-blue-300 w-full flex flex-col items-center justify-center">
            <div className="text-3xl mb-3">{step.icon}</div>
            <p className="font-semibold text-gray-900 text-sm">{step.title}</p>
            <p className="text-xs text-gray-500 mt-1">{step.desc}</p>
          </button>
        ))}
      </div>

      {/* Recent Bookings */}
      <div className="glass-card rounded-xl p-6 border border-gray-200 bg-white">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <Package className="w-4 h-4 text-blue-600" /> Recent Bookings
          </h3>
        </div>
        {bookings.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600 font-medium">No bookings yet</p>
            <p className="text-gray-400 text-sm mb-4">Book your first parcel to get started</p>
            <Link to="/sender/book" className="btn-primary inline-flex items-center gap-2 text-sm">
              <Plus className="w-4 h-4" /> Book Now
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {bookings.map(b => (
              <div key={b.trackingId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 border border-gray-100 transition-colors">
                <span className="font-mono text-blue-600 text-sm font-semibold">{b.trackingId}</span>
                <Link to={`/sender/track/${b.trackingId}`} className="text-xs text-gray-500 hover:text-blue-600 flex items-center gap-1 transition-colors">
                  Track <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
