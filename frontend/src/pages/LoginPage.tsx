import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Bus, Lock, Mail, ChevronRight, Shield, CheckSquare, Square } from 'lucide-react';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminKey, setAdminKey] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(email, password, rememberMe, isAdmin ? adminKey : '', isAdmin);
      navigate('/');
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      {/* Background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-100 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-md animate-fadeInUp">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-600 shadow-lg shadow-blue-500/30 mb-4">
            <Bus className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-1">BusCargo</h1>
          <p className="text-sm text-gray-500">Smart parcel logistics on MSRTC routes</p>
        </div>

        {/* Card */}
        <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-2xl">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Sign in</h2>
              <p className="text-sm text-gray-500 mt-0.5">Welcome back</p>
            </div>
            <button
              type="button"
              onClick={() => setIsAdmin(!isAdmin)}
              className={`text-xs font-medium px-2 py-1 rounded border transition-colors ${isAdmin ? 'bg-red-50 text-red-600 border-red-200' : 'bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100'}`}
            >
              Admin Mode
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isAdmin && (
              <>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    id="login-email"
                    placeholder="Email address"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="input-field pl-10"
                    required={!isAdmin}
                    autoComplete="email"
                  />
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    id="login-password"
                    placeholder="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="input-field pl-10"
                    required={!isAdmin}
                    autoComplete="current-password"
                  />
                </div>
              </>
            )}

            {isAdmin && (
              <div className="relative animate-fadeIn">
                <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-red-400" />
                <input
                  type="password"
                  id="login-admin-key"
                  placeholder="Admin Security Key"
                  value={adminKey}
                  onChange={e => setAdminKey(e.target.value)}
                  className="input-field pl-10 border-red-200 focus:border-red-500 focus:ring-red-500"
                  required={isAdmin}
                  autoComplete="off"
                />
                <p className="text-xs text-gray-400 mt-1 ml-1">No email required — admin key grants direct access</p>
              </div>
            )}

            <div className="flex items-center text-sm text-gray-600 cursor-pointer select-none" onClick={() => setRememberMe(!rememberMe)}>
              {rememberMe ? <CheckSquare className="w-4 h-4 text-blue-600 mr-2" /> : <Square className="w-4 h-4 text-gray-400 mr-2" />}
              Stay logged in for 3 months
            </div>

            <button
              type="submit"
              id="login-submit"
              disabled={loading}
              className={`btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${isAdmin ? 'bg-red-600 hover:bg-red-700 shadow-red-500/30' : ''}`}
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Sign In {isAdmin && 'as Admin'}<ChevronRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-100 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link to="/signup" className="text-blue-600 hover:underline font-medium">
                Sign up free
              </Link>
            </p>
          </div>
        </div>

        {/* Footer stat */}
        <p className="text-center text-xs text-slate-500 mt-6">
          Serving 302,452 people across 79 villages · Maharashtra, India
        </p>
      </div>
    </div>
  );
};
