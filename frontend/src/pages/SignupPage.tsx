import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Bus, Lock, Mail, ChevronRight, User } from 'lucide-react';

export const SignupPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await register({ name, email, password });
      navigate('/');
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-100 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-md animate-fadeInUp">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-600 shadow-lg shadow-blue-500/30 mb-4">
            <Bus className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-1">BusCargo</h1>
          <p className="text-sm text-gray-500">Smart parcel logistics on MSRTC routes</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-2xl">
          <h2 className="text-xl font-semibold mb-2 text-gray-900">Create your account</h2>
          <p className="text-sm text-gray-500 mb-6">Join as a sender to book parcels instantly</p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                id="signup-name"
                placeholder="Full Name"
                value={name}
                onChange={e => setName(e.target.value)}
                className="input-field pl-10"
                required
                autoComplete="name"
              />
            </div>

            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="email"
                id="signup-email"
                placeholder="Email address"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="input-field pl-10"
                required
                autoComplete="email"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="password"
                id="signup-password"
                placeholder="Password (min. 8 characters)"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="input-field pl-10"
                required
                autoComplete="new-password"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="password"
                id="signup-confirm-password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                className="input-field pl-10"
                required
                autoComplete="new-password"
              />
            </div>

            <button
              type="submit"
              id="signup-submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Create Account <ChevronRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-100 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-600 hover:underline font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-slate-500 mt-6">
          Serving 302,452 people across 79 villages · Maharashtra, India
        </p>
      </div>
    </div>
  );
};