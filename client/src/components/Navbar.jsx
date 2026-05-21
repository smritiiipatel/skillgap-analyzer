import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Menu, X, Bell, Home, BookOpen, FileText, BarChart3, Zap } from 'lucide-react';

export default function Navbar() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: Home },
    { path: '/skills', label: 'Skills', icon: Zap },
    { path: '/assessment', label: 'Assessment', icon: FileText },
    { path: '/reports', label: 'Reports', icon: BarChart3 },
    { path: '/resources', label: 'Resources', icon: BookOpen },
  ];

  return (
    <>
      {/* Navbar */}
      <nav className="glass-effect sticky top-0 z-40 border-b border-slate-700/50 shadow-2xl">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20">
            {/* Logo */}
            <Link 
              to="/dashboard" 
              className="flex items-center space-x-2 group transition-all duration-300"
            >
              <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg group-hover:shadow-lg group-hover:shadow-indigo-500/50">
                <Zap size={24} className="text-white" />
              </div>
              <span className="gradient-text font-bold text-xl sm:text-2xl hidden sm:inline">
                SkillGap
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {navItems.map(item => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                      isActive(item.path)
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/50'
                        : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                    }`}
                  >
                    <Icon size={18} />
                    <span className="text-sm font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Notification Bell */}
              <div className="relative hidden sm:block">
                <button
                  onClick={() => setNotifOpen(!notifOpen)}
                  className="relative p-2 text-slate-300 hover:text-white transition-colors"
                >
                  <Bell size={20} />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                </button>
                
                {notifOpen && (
                  <div className="absolute right-0 mt-2 w-64 glass-effect rounded-lg p-4 shadow-2xl animate-slide-in-right border border-slate-700/50">
                    <p className="text-sm text-slate-400 mb-2">Recent Activity</p>
                    <div className="space-y-2">
                      <div className="p-2 bg-slate-700/50 rounded text-sm">
                        ✅ Assessment completed
                      </div>
                      <div className="p-2 bg-slate-700/50 rounded text-sm">
                        🎯 New skill added
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* User Profile (Desktop) */}
              <div className="hidden sm:flex items-center space-x-2 sm:space-x-3">
                <div className="text-right">
                  <p className="text-sm font-semibold text-white truncate max-w-[120px]">
                    {user?.name}
                  </p>
                  <p className="text-xs text-slate-400">{user?.designation}</p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
              </div>

              {/* Logout Button (Desktop) */}
              <button
                onClick={handleLogout}
                className="hidden sm:flex items-center space-x-2 bg-red-600/20 hover:bg-red-600/40 border border-red-500/50 text-red-300 hover:text-red-200 px-3 sm:px-4 py-2 rounded-lg transition-all duration-300"
              >
                <LogOut size={18} />
                <span className="text-sm hidden md:inline">Logout</span>
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="lg:hidden p-2 text-slate-300 hover:text-white transition-colors"
              >
                {menuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {menuOpen && (
            <div className="lg:hidden pb-4 border-t border-slate-700/50 animate-fade-in-up">
              <div className="flex flex-col space-y-2 mt-4">
                {navItems.map(item => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMenuOpen(false)}
                      className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-all duration-300 ${
                        isActive(item.path)
                          ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white'
                          : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                      }`}
                    >
                      <Icon size={20} />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  );
                })}

                <div className="pt-4 border-t border-slate-700/50">
                  <div className="flex items-center space-x-3 px-4 py-3 mb-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                      {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">
                        {user?.name}
                      </p>
                      <p className="text-xs text-slate-400">{user?.designation}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      handleLogout();
                      setMenuOpen(false);
                    }}
                    className="w-full flex items-center space-x-2 bg-red-600/20 hover:bg-red-600/40 border border-red-500/50 text-red-300 hover:text-red-200 px-4 py-2 rounded-lg transition-all duration-300"
                  >
                    <LogOut size={18} />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Background Shapes */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="floating-shape floating-shape-1"></div>
        <div className="floating-shape floating-shape-2"></div>
      </div>
    </>
  );
}