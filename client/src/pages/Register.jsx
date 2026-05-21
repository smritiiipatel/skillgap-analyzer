import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, Briefcase, Eye, EyeOff, Zap, ArrowRight } from 'lucide-react';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    department: '',
    designation: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register(
        formData.name,
        formData.email,
        formData.password,
        formData.department,
        formData.designation
      );
      navigate('/dashboard');
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Floating Shapes */}
      <div className="floating-shape floating-shape-1"></div>
      <div className="floating-shape floating-shape-2"></div>
      <div className="floating-shape floating-shape-3"></div>

      <div className="w-full max-w-md z-10">
        {/* Form Box */}
        <div className="form-box animate-fade-in-up max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-block p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg mb-4">
              <Zap size={32} className="text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
              Join Skill<span className="gradient-text">Gap</span>
            </h1>
            <p className="text-slate-400 text-sm">
              Start tracking your skill development today
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="alert alert-error mb-6 animate-slide-in-right">
              <div className="alert-title">Registration Failed</div>
              <div className="alert-message">{error}</div>
            </div>
          )}

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div className="form-group">
              <label className="form-label required">Full Name</label>
              <div className="input-wrapper">
                <User className="input-icon" size={20} />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="John Doe"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="form-group">
              <label className="form-label required">Email Address</label>
              <div className="input-wrapper">
                <Mail className="input-icon" size={20} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="form-group">
              <label className="form-label required">Password</label>
              <div className="input-wrapper">
                <Lock className="input-icon" size={20} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
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

            {/* Department */}
            <div className="form-group">
              <label className="form-label">Department</label>
              <div className="input-wrapper">
                <Briefcase className="input-icon" size={20} />
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="e.g., Engineering, Marketing"
                />
              </div>
            </div>

            {/* Designation */}
            <div className="form-group">
              <label className="form-label">Designation</label>
              <div className="input-wrapper">
                <Briefcase className="input-icon" size={20} />
                <input
                  type="text"
                  name="designation"
                  value={formData.designation}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="e.g., Junior Developer"
                />
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
                  <span>Creating account...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>

          {/* Info Box */}
          <div className="mt-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
            <p className="text-xs sm:text-sm text-slate-300">
              <strong>✨ Free to use:</strong> No credit card required. Start for free!
            </p>
          </div>

          {/* Divider */}
          <div className="my-6 flex items-center">
            <div className="flex-1 border-t border-slate-700/50"></div>
            <span className="px-3 text-slate-500 text-sm">Already registered?</span>
            <div className="flex-1 border-t border-slate-700/50"></div>
          </div>

          {/* Login Link */}
          <Link
            to="/login"
            className="btn btn-outline btn-md btn-full"
          >
            Login Instead
          </Link>
        </div>

        {/* Footer Text */}
        <p className="text-center text-slate-500 text-xs mt-6">
          🔒 Secure • 📊 Track Progress • 🚀 Grow Skills
        </p>
      </div>
    </div>
  );
}