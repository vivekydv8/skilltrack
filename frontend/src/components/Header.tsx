import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { Shield, Users, Download, Activity, ChevronDown, Check, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  onOpenExport?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenExport }) => {
  const { currentUser, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const roleLabels: Record<UserRole, { title: string; badge: string; icon: string }> = {
    govt_admin: { title: 'Directorate / State Authority', badge: 'Govt Admin', icon: '🏛️' },
    analyst: { title: 'Policy & Research Analyst', badge: 'Analyst Cell', icon: '📊' },
    training_provider: { title: 'Government ITI Pune Hub', badge: 'Training Provider', icon: '🏫' },
    provider: { title: 'MSSDS Hub Pune', badge: 'Training Center', icon: '🏫' },
    employer: { title: 'Tata Motors EV Division', badge: 'Industry Partner', icon: '🏢' },
    field_officer: { title: 'District Guidance Officer', badge: 'Field Officer', icon: '📋' },
    trainee: { title: 'Certified Trainee Alumni', badge: 'Skill ID Verified', icon: '🎓' },
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
      {/* Tricolor National & State Accent Bar */}
      <div className="h-1.5 w-full flex">
        <div className="flex-1 bg-[#FF7722]"></div>
        <div className="flex-1 bg-white border-y border-slate-200"></div>
        <div className="flex-1 bg-[#128807]"></div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        {/* Logo & Government Identity */}
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-full bg-slate-900 border-2 border-amber-500 flex items-center justify-center text-white shadow-sm flex-shrink-0">
            <span className="text-sm font-black tracking-tight text-amber-400">MH</span>
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <span className="text-lg font-black text-slate-900 tracking-tight">SkillTrackAI</span>
              <span className="hidden md:inline-block px-2.5 py-0.5 text-xs font-bold bg-indigo-50 text-indigo-800 rounded-md border border-indigo-200">
                SIH26135
              </span>
              <span className="hidden lg:inline-block text-xs font-semibold text-slate-500">
                Maharashtra Skills Portal
              </span>
            </div>
            <p className="text-xs font-medium text-slate-600 tracking-normal mt-0.5">
              Government of Maharashtra • MSSDS / DVET
            </p>
          </div>
        </div>

        {/* Center / Right controls */}
        <div className="flex items-center gap-3">
          {/* Quick Export Button */}
          {onOpenExport && (
            <button
              onClick={onOpenExport}
              className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 text-sm font-semibold text-slate-800 bg-slate-50 hover:bg-slate-100 border border-slate-300 rounded-lg transition shadow-xs"
            >
              <Download className="w-4 h-4 text-slate-700" />
              <span>Export Report</span>
            </button>
          )}

          {/* System Status Indicator */}
          <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Connected</span>
          </div>

          {/* User profile / Logout */}
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-3 px-3.5 py-2 bg-slate-100 hover:bg-slate-200/80 border border-slate-300 rounded-lg transition text-left"
              >
                <span className="text-lg">{roleLabels[currentUser.role]?.icon || '👤'}</span>
                <div className="hidden sm:block">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900">{currentUser.name}</span>
                    <span className="text-xs px-2 py-0.5 rounded-md bg-indigo-900 text-white font-semibold">
                      {roleLabels[currentUser.role]?.badge || currentUser.role.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-snug">
                    {roleLabels[currentUser.role]?.title || currentUser.role}
                  </p>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-600 ml-1" />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-2xl border border-slate-200 py-2.5 z-50">
                  <div className="px-4 py-3 border-b border-slate-100 bg-slate-50">
                    <p className="text-sm font-bold text-slate-900">{currentUser.name}</p>
                    <p className="text-xs text-slate-600 break-all">{currentUser.email}</p>
                    {currentUser.organization && (
                      <p className="text-xs text-indigo-700 font-medium mt-1 truncate">{currentUser.organization}</p>
                    )}
                  </div>
                  <div className="p-2">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-3.5 py-2.5 flex items-center gap-2.5 text-sm font-semibold text-rose-600 hover:bg-rose-50 rounded-lg transition"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out Session</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => navigate('/')}
              className="text-sm font-bold px-4 py-2 bg-indigo-900 text-white rounded-lg hover:bg-indigo-800 transition shadow-xs"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
