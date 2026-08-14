import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Package, Scan, LayoutDashboard, FileText, KeyRound, IndianRupee, Bus } from 'lucide-react';

const NAV_CONFIG: Record<string, { label: string; path: string; icon: React.FC<any> }[]> = {
  SENDER: [
    { label: 'Dashboard', path: '/sender', icon: LayoutDashboard },
    { label: 'Book Parcel', path: '/sender/book', icon: Package },
  ],
  STAFF: [
    { label: 'Dashboard', path: '/staff', icon: LayoutDashboard },
    { label: 'Scan QR', path: '/staff/scan', icon: Scan },
    { label: 'Confirm Delivery', path: '/delivery/confirm', icon: KeyRound },
  ],
  ADMIN: [
    { label: 'Overview', path: '/admin', icon: LayoutDashboard },
    { label: 'Confirm Delivery', path: '/delivery/confirm', icon: KeyRound },
  ],
};

export const Layout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const navItems = user?.role ? NAV_CONFIG[user.role] || [] : [];

  const roleColors: Record<string, string> = {
    SENDER: 'text-teal-400 bg-teal-500/20',
    STAFF: 'text-blue-400 bg-blue-500/20',
    ADMIN: 'text-purple-400 bg-purple-500/20',
  };

  return (
    <div className="min-h-screen flex bg-gray-50 text-gray-900">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col justify-between">
        {/* Logo */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Bus className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900 leading-none">BusCargo</h1>
              <p className="text-xs text-gray-500 mt-0.5">Pilot: Kopargaon→Shirdi</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path.split('/').length <= 2}
              className={({ isActive }) =>
                isActive ? 'nav-link-active' : 'nav-link'
              }
            >
              <item.icon className="w-4 h-4 flex-shrink-0" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Phase 2 hint */}
        <div className="mx-4 mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-xs font-semibold text-gray-400 mb-1">Phase 2 Roadmap</p>
          <div className="space-y-1">
            {['Multi-route optimization', 'Last-mile agent network', 'ML fraud detection'].map(f => (
              <p key={f} className="text-xs text-gray-500 flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-gray-300" /> {f}
              </p>
            ))}
          </div>
        </div>

        {/* User info */}
        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-bold text-gray-600">
              {user?.name?.[0] || user?.email?.[0] || '?'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{user?.name || user?.email}</p>
              <p className="text-xs text-gray-500">{user?.role}</p>
            </div>
          </div>
          <button
            onClick={() => { logout(); navigate('/login'); }}
            className="flex items-center gap-2 w-full text-xs text-red-600 hover:text-red-700 transition-colors py-1"
          >
            <LogOut className="w-3.5 h-3.5" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto min-h-screen">
        <Outlet />
      </main>
    </div>
  );
};
