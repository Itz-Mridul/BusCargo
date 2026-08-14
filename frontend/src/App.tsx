import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';

import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { SenderDashboard } from './pages/SenderDashboard';
import { BookingPage } from './pages/BookingPage';
import { BookingConfirmPage } from './pages/BookingConfirmPage';
import { TrackingPage } from './pages/TrackingPage';
import { StaffDashboard } from './pages/StaffDashboard';
import { ScanPage } from './pages/ScanPage';
import { OTPConfirmPage } from './pages/OTPConfirmPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { LedgerPage } from './pages/LedgerPage';

const RootRedirect = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === 'SENDER') return <Navigate to="/sender" replace />;
  if (user.role === 'STAFF') return <Navigate to="/staff" replace />;
  if (user.role === 'ADMIN') return <Navigate to="/admin" replace />;
  return <Navigate to="/login" replace />;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/delivery/confirm" element={<OTPConfirmPage />} />
      
      <Route element={<Layout />}>
        <Route path="/" element={<RootRedirect />} />
        
        {/* SENDER Routes */}
        <Route element={<ProtectedRoute role="SENDER" />}>
          <Route path="/sender" element={<SenderDashboard />} />
          <Route path="/sender/book" element={<BookingPage />} />
          <Route path="/sender/booking/:trackingId" element={<BookingConfirmPage />} />
        </Route>
        
        {/* Public but structured tracking page */}
        <Route path="/sender/track/:trackingId" element={<TrackingPage />} />

        {/* STAFF Routes */}
        <Route element={<ProtectedRoute role="STAFF" />}>
          <Route path="/staff" element={<StaffDashboard />} />
          <Route path="/staff/scan" element={<ScanPage />} />
        </Route>

        {/* ADMIN Routes */}
        <Route element={<ProtectedRoute role="ADMIN" />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/ledger/:parcelId" element={<LedgerPage />} />
        </Route>
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
