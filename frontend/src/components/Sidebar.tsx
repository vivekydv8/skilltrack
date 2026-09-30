import React from 'react';
import {
  LayoutDashboard,
  Trophy,
  Users,
  UserPlus,
  PhoneCall,
  Building2,
  Briefcase,
  Layers,
  AlertTriangle,
  ShieldCheck,
  ExternalLink,
  School,
  Smartphone
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export type NavigationTab = 
  | 'dashboard'
  | 'leaderboard'
  | 'provider-dashboard'
  | 'trainees'
  | 'onboarding'
  | 'followups'
  | 'survey'
  | 'employer'
  | 'self-employment'
  | 'skills'
  | 'risk'
  | 'privacy';

interface SidebarProps {
  currentTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  escalatedCount?: number;
  mismatchCount?: number;
  highRiskCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  escalatedCount = 8,
  mismatchCount = 3,
  highRiskCount = 5
}) => {
  const { currentUser } = useAuth();

  const navItems: { id: NavigationTab; label: string; icon: React.ReactNode; badge?: number; badgeColor?: string; roles?: string[] }[] = [
    {
      id: 'dashboard',
      label: 'Executive Overview',
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    {
      id: 'leaderboard',
      label: 'Provider Leaderboard',
      icon: <Trophy className="w-4 h-4" />,
    },
    {
      id: 'provider-dashboard',
      label: 'Batch Operations (Provider)',
      icon: <School className="w-4 h-4" />,
    },
    {
      id: 'trainees',
      label: 'Trainee Directory',
      icon: <Users className="w-4 h-4" />,
    },
    {
      id: 'onboarding',
      label: 'Onboarding & Consent',
      icon: <UserPlus className="w-4 h-4" />,
    },
    {
      id: 'followups',
      label: 'Follow-Up Engine (SMS)',
      icon: <PhoneCall className="w-4 h-4" />,
      badge: escalatedCount,
      badgeColor: 'bg-amber-500 text-white',
    },
    {
      id: 'survey',
      label: 'Trainee SMS Survey Form',
      icon: <Smartphone className="w-4 h-4" />,
    },
    {
      id: 'employer',
      label: 'Employer Validation',
      icon: <Building2 className="w-4 h-4" />,
      badge: mismatchCount,
      badgeColor: 'bg-rose-500 text-white',
    },
    {
      id: 'self-employment',
      label: 'Self-Emp & Apprenticeship',
      icon: <Briefcase className="w-4 h-4" />,
    },
    {
      id: 'skills',
      label: 'Skill Gap & Attrition',
      icon: <Layers className="w-4 h-4" />,
    },
    {
      id: 'risk',
      label: 'In-Training Risk (ML)',
      icon: <AlertTriangle className="w-4 h-4" />,
      badge: highRiskCount,
      badgeColor: 'bg-rose-600 text-white',
    },
    {
      id: 'privacy',
      label: 'Privacy & Audit Log',
      icon: <ShieldCheck className="w-4 h-4" />,
    },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col flex-shrink-0 min-h-[calc(100vh-53px)] select-none">
      {/* Role Context Ribbon */}
      <div className="px-4 py-3 bg-gov-900 border-b border-slate-800">
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Current Scope</p>
        <p className="text-xs font-semibold text-white truncate">{currentUser?.organization || 'Govt of Maharashtra'}</p>
        <div className="mt-1 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          <span className="text-[11px] text-slate-300 capitalize">
            {currentUser ? currentUser.role.replace('_', ' ') : 'Guest'} Access
          </span>
        </div>
      </div>

      {/* Nav List */}
      <nav className="p-3 space-y-1 flex-1">
        {navItems.map((item) => {
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-all ${
                isActive
                  ? 'bg-gov-600 text-white shadow-sm font-semibold'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className={isActive ? 'text-white' : 'text-slate-400'}>{item.icon}</span>
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && item.badge > 0 && (
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${item.badgeColor || 'bg-slate-700 text-slate-200'}`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Footer Info */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/60 text-[11px] text-slate-400">
        <div className="flex items-center justify-between">
          <span>Core Vision</span>
          <span className="text-amber-400 font-bold">SIH26135</span>
        </div>
        <p className="text-[10px] text-slate-500 mt-1 leading-tight">
          Track Outcomes → Detect Gaps → Predict Risks → Recommend Actions
        </p>
      </div>
    </aside>
  );
};
