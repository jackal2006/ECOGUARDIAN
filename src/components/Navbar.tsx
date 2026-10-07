import React, { useState } from 'react';
import {
  Leaf,
  AlertCircle,
  Menu,
  X,
  User,
  Shield,
  Award,
  LogOut,
  Compass,
  Trash2,
  Trophy,
  LayoutDashboard,
  Info,
  ScanLine,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  openAuthModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, setCurrentTab, openAuthModal }) => {
  const { userProfile, isAdmin, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'Home', icon: Leaf },
    { id: 'explore', label: 'Explore', icon: Compass },
    { id: 'ai-identifier', label: 'AI Waste Identifier', icon: ScanLine },
    { id: 'waste-guide', label: 'Waste Guide', icon: Trash2 },
    { id: 'challenges', label: 'Eco Challenges', icon: Trophy },
    { id: 'community-reports', label: 'Community Feed', icon: AlertCircle },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'about', label: 'About', icon: Info },
  ];

  const handleNav = (tabId: string) => {
    setCurrentTab(tabId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-emerald-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Logo */}
          <div
            onClick={() => handleNav('home')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-emerald-700 via-green-600 to-emerald-500 flex items-center justify-center text-white shadow-md shadow-emerald-700/20 group-hover:scale-105 transition-transform duration-200">
              <Leaf className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl text-emerald-950 tracking-tight">Eco Guardian</span>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-sm">CEP</span>
              </div>
              <p className="text-xs text-emerald-700/80 font-medium hidden sm:block">Action & Awareness Platform</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = currentTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNav(link.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-150 ${
                    isActive
                      ? 'bg-emerald-100/80 text-emerald-900 shadow-xs'
                      : 'text-stone-600 hover:text-emerald-900 hover:bg-emerald-50/70'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-700' : 'text-stone-400'}`} />
                  {link.label}
                </button>
              );
            })}

            {/* Admin Dashboard Link - Always visible for quick administrative oversight */}
            <button
              onClick={() => handleNav('admin')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-bold transition-all duration-150 cursor-pointer ${
                currentTab === 'admin'
                  ? 'bg-amber-100 text-amber-950 shadow-xs ring-1 ring-amber-300'
                  : isAdmin
                  ? 'text-amber-900 bg-amber-50/80 hover:bg-amber-100/80'
                  : 'text-stone-600 hover:text-amber-900 hover:bg-amber-50/60'
              }`}
            >
              <Shield className={`w-4 h-4 ${isAdmin ? 'text-amber-600 fill-amber-100' : 'text-stone-400'}`} />
              <span>Admin Panel</span>
              {isAdmin && (
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
              )}
            </button>
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Prominent Report Pollution Button */}
            <button
              onClick={() => handleNav('report')}
              className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white px-4 py-2.5 rounded-xl text-sm font-bold shadow-md shadow-emerald-600/25 hover:shadow-lg hover:shadow-emerald-600/30 active:scale-98 transition-all cursor-pointer"
            >
              <AlertCircle className="w-4 h-4 animate-pulse" />
              <span>Report Pollution</span>
            </button>

            {/* User Profile / Login */}
            {userProfile ? (
              <div className="flex items-center gap-2 pl-2 border-l border-emerald-100">
                {/* Points Pill */}
                <button
                  onClick={() => handleNav('dashboard')}
                  className="flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/80 px-3 py-1.5 rounded-lg text-xs font-bold text-emerald-800 transition-colors"
                  title="Your Eco Points"
                >
                  <Award className="w-4 h-4 text-emerald-600" />
                  <span>{userProfile.ecoPoints} pts</span>
                </button>

                {/* Profile Avatar / Menu */}
                <button
                  onClick={() => handleNav('dashboard')}
                  className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-stone-100 transition-colors text-left"
                >
                  <div className="w-8 h-8 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-xs ring-2 ring-emerald-600/20">
                    {userProfile.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-xs font-semibold text-stone-700 max-w-[90px] truncate">
                    {userProfile.name.split(' ')[0]}
                  </span>
                </button>

                <button
                  onClick={logout}
                  title="Log out"
                  className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={openAuthModal}
                className="flex items-center gap-1.5 px-4 py-2 border border-emerald-300 text-emerald-800 hover:bg-emerald-50 rounded-xl text-sm font-semibold transition-colors"
              >
                <User className="w-4 h-4" />
                <span>Sign In</span>
              </button>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => handleNav('report')}
              className="bg-emerald-600 text-white p-2 rounded-lg text-xs font-bold shadow-xs sm:hidden"
              title="Report Pollution"
            >
              <AlertCircle className="w-4 h-4" />
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-stone-700 hover:bg-emerald-50 rounded-lg transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-emerald-100 px-4 pt-3 pb-6 shadow-xl animate-in fade-in slide-in-from-top duration-200">
          <div className="space-y-1 mb-4">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = currentTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNav(link.id)}
                  className={`flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm font-semibold text-left transition-colors ${
                    isActive ? 'bg-emerald-100/90 text-emerald-900 font-bold' : 'text-stone-700 hover:bg-emerald-50'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-emerald-700' : 'text-stone-400'}`} />
                  {link.label}
                </button>
              );
            })}

            <button
              onClick={() => handleNav('admin')}
              className={`flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm font-bold transition-colors ${
                currentTab === 'admin'
                  ? 'bg-amber-100 text-amber-950 font-black'
                  : 'text-amber-900 bg-amber-50/80 hover:bg-amber-100'
              }`}
            >
              <Shield className="w-5 h-5 text-amber-600" />
              <span>Admin Panel {isAdmin && '●'}</span>
            </button>
          </div>

          <div className="pt-4 border-t border-emerald-100 space-y-3">
            <button
              onClick={() => handleNav('report')}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-green-600 text-white py-3 rounded-xl font-bold text-sm shadow-md"
            >
              <AlertCircle className="w-4 h-4" />
              Report Pollution Incident
            </button>

            {userProfile ? (
              <div className="flex items-center justify-between bg-emerald-50/70 p-3 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-sm">
                    {userProfile.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-emerald-950">{userProfile.name}</p>
                    <p className="text-[11px] text-emerald-700">{userProfile.ecoPoints} Eco Points</p>
                  </div>
                </div>
                <button
                  onClick={logout}
                  className="text-xs text-rose-700 hover:underline font-semibold px-2 py-1"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openAuthModal();
                }}
                className="w-full py-2.5 border border-emerald-300 text-emerald-800 rounded-xl font-semibold text-sm hover:bg-emerald-50"
              >
                Sign In / Join Platform
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
