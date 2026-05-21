import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Eye, EyeOff, Zap, ArrowRight } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = () => {
    setEmail('demo@example.com');
    setPassword('password123');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Floating Shapes */}
      <div className="floating-shape floating-shape-1"></div>
      <div className="floating-shape floating-shape-2"></div>
      <div className="floating-shape floating-shape-3"></div>

      <div className="w-full max-w-md z-10">
        {/* Form Box */}
        <div className="form-box animate-fade-in-up">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-block p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg mb-4">
              <Zap size={32} className="text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
              Skill<span className="gradient-text">Gap</span>
            </h1>
            <p className="text-slate-400 text-sm">
              Track, analyze, and improve your skills
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="alert alert-error mb-6 animate-slide-in-right">
              <div className="alert-title">Login Failed</div>
              <div className="alert-message">{error}</div>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div className="input-wrapper">
                <Mail className="input-icon" size={20} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field"
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="input-wrapper">
                <Lock className="input-icon" size={20} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="input-icon-right"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary btn-md btn-full mt-6"
            >
              {loading ? (
                <>
                  <div className="loader-sm"></div>
                  <span>Logging in...</span>
                </>
              ) : (
                <>
                  <span>Login to Dashboard</span>
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>
           {/* Divider */}
          <div className="my-6 flex items-center">
            <div className="flex-1 border-t border-slate-700/50"></div>
            <span className="px-3 text-slate-500 text-sm">New here?</span>
            <div className="flex-1 border-t border-slate-700/50"></div>
          </div>

          {/* Register Link */}
          <Link
            to="/register"
            className="btn btn-outline btn-md btn-full"
          >
            Create New Account
          </Link>
        </div>

        {/* Footer Text */}
        <p className="text-center text-slate-500 text-xs mt-6">
          🔒 Secure • 🚀 Free • 💡 Built with MERN
        </p>
      </div>
    </div>
  );
}