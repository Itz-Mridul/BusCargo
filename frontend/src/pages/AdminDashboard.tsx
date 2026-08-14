import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMetrics } from '../lib/api';
import { Package, TrendingUp, Truck, CheckCircle2, BarChart3, IndianRupee, ArrowRight, User } from 'lucide-react';

export const AdminDashboard = () => {
  const [metrics, setMetrics] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getMetrics().catch(() => ({ data: { totalParcels: 0, totalRevenue: 0, activeBookings: 0, deliveredToday: 0, totalLogins: 0 } })),
      fetch('http://localhost:3001/api/admin/users', { headers: { Authorization: `Bearer ${localStorage.getItem('buscargo_token')}` } }).then(r => r.json()).catch(() => [])
    ])
    .then(([metricsRes, usersData]) => {
      setMetrics(metricsRes.data);
      setUsers(usersData);
    })
    .finally(() => setLoading(false));
  }, []);

  const stats = metrics ? [
    { label: 'Total Logins', value: metrics.totalLogins || 0, icon: User, color: 'blue', suffix: '' },
    { label: 'Total Parcels', value: metrics.totalParcels, icon: Package, color: 'teal', suffix: '' },
    { label: 'Total Revenue', value: `₹${metrics.totalRevenue}`, icon: IndianRupee, color: 'emerald', suffix: '' },
    { label: 'Active / Booked', value: metrics.activeBookings, icon: Truck, color: 'blue', suffix: '' },
    { label: 'Delivered Today', value: metrics.deliveredToday, icon: CheckCircle2, color: 'purple', suffix: '' },
  ] : [];

  return (
    <div className="p-8 animate-fadeInUp">
      <div className="mb-8">
        <h2 className="page-header flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-teal-500/20 flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-teal-400" />
          </div>
          Admin Dashboard
        </h2>
        <p className="page-subheader">BusCargo pilot route — Kopargaon · Shirdi · Ahmednagar</p>
      </div>

      
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="stat-card animate-pulse">
              <div className="h-4 bg-slate-700 rounded mb-2 w-3/4" />
              <div className="h-8 bg-slate-700 rounded w-1/2" />
            </div>
          ))
        ) : stats.map((s) => {
          const Icon = s.icon;
          const colorMap: Record<string, string> = {
            teal: 'text-blue-600 bg-blue-50',
            emerald: 'text-green-600 bg-green-50',
            blue: 'text-indigo-600 bg-indigo-50',
            purple: 'text-purple-600 bg-purple-50',
          };
          return (
            <div key={s.label} className="stat-card">
              <div className={`inline-flex p-2 rounded-lg ${colorMap[s.color]} mb-3`}>
                <Icon className={`w-5 h-5 ${colorMap[s.color].split(' ')[0]}`} />
              </div>
              <p className="text-2xl font-bold text-gray-900">{s.value}</p>
              <p className="text-sm text-gray-500 mt-1">{s.label}</p>
            </div>
          );
        })}
      </div>

      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="glass-card rounded-xl p-6 border border-gray-200">
          <h3 className="font-semibold mb-4 text-gray-800">🗺️ Active Route</h3>
          <div className="space-y-3">
            {[
              { depot: 'Kopargaon', coords: '19.8872°N, 74.4756°E', role: 'Origin' },
              { depot: 'Shirdi', coords: '19.7669°N, 74.4770°E', role: 'Mid-Stop' },
              { depot: 'Ahmednagar', coords: '19.0952°N, 74.7496°E', role: 'Destination' },
            ].map((d, i) => (
              <div key={d.depot} className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 text-sm font-bold">{i + 1}</div>
                <div>
                  <p className="font-medium text-gray-900 text-sm">{d.depot}</p>
                  <p className="text-xs text-gray-500">{d.coords} · {d.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card rounded-xl p-6 border border-gray-200">
          <h3 className="font-semibold mb-4 text-gray-800">📊 Unit Economics</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500">Avg. Parcel Price</span>
              <span className="text-gray-900 font-medium">₹95 (1kg)</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500">Scan Time per Parcel</span>
              <span className="text-gray-900 font-medium">~30 seconds</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500">MSRTC gets (60%)</span>
              <span className="text-blue-600 font-medium">₹57</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500">Platform gets (30%)</span>
              <span className="text-indigo-600 font-medium">₹28.50</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-500">Agent gets (10%)</span>
              <span className="text-purple-600 font-medium">₹9.50</span>
            </div>
          </div>
        </div>
      </div>

      
      <div className="glass-card rounded-xl p-6 border border-gray-200">
        <h3 className="font-semibold mb-4 text-gray-800">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Link to="/delivery/confirm" className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group border border-gray-100">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-sm font-medium text-gray-900">Confirm Delivery</p>
                <p className="text-xs text-gray-500">Enter OTP to close loop</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
          </Link>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg opacity-60 cursor-not-allowed border border-gray-100">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-5 h-5 text-yellow-500" />
              <div>
                <p className="text-sm font-medium text-gray-900">ML Fraud Detection</p>
                <p className="text-xs text-gray-500">Phase 2 — Coming Soon</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      
      <div className="glass-card rounded-xl p-6 border border-gray-200 mt-6">
        <h3 className="font-semibold mb-4 text-gray-800 flex items-center gap-2">
          <User className="w-5 h-5 text-blue-600" /> Registered Clients & Users
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
              <tr>
                <th className="px-4 py-3 rounded-tl-lg">Name</th>
                <th className="px-4 py-3">Contact</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Logins</th>
                <th className="px-4 py-3 rounded-tr-lg">Last Login</th>
              </tr>
            </thead>
            <tbody>
              {users && users.length > 0 ? users.map((u: any) => (
                <tr key={u.id} className="border-b border-gray-100 hover:bg-gray-50/50">
                  <td className="px-4 py-3 font-medium text-gray-900">{u.name}</td>
                  <td className="px-4 py-3">
                    <div className="text-gray-900">{u.email}</div>
                    {u.phone && <div className="text-xs text-gray-500 mt-0.5">{u.phone}</div>}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      u.role === 'ADMIN' ? 'bg-red-100 text-red-700' : 
                      u.role === 'STAFF' ? 'bg-yellow-100 text-yellow-700' : 
                      'bg-green-100 text-green-700'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{u.loginCount}</td>
                  <td className="px-4 py-3 text-gray-500">
                    {u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleString() : 'Never'}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                    {loading ? 'Loading users...' : 'No users found'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};