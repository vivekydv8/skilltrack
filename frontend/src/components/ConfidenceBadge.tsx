import React from 'react';
import { ShieldCheck, FileCheck, Building, UserCheck } from 'lucide-react';

interface ConfidenceBadgeProps {
  score: number;
  status?: string;
  showIcon?: boolean;
}

export const ConfidenceBadge: React.FC<ConfidenceBadgeProps> = ({ score, status, showIcon = true }) => {
  let label = 'Self-Reported (25%)';
  let color = 'bg-amber-50 text-amber-800 border-amber-200';
  let Icon = UserCheck;

  if (score >= 100) {
    label = 'Doc Verified (100%)';
    color = 'bg-emerald-50 text-emerald-800 border-emerald-300 font-semibold';
    Icon = FileCheck;
  } else if (score >= 85) {
    label = 'Employer Confirmed (85%)';
    color = 'bg-blue-50 text-blue-800 border-blue-300 font-semibold';
    Icon = Building;
  } else if (score >= 50) {
    label = 'Provider Reported (50%)';
    color = 'bg-sky-50 text-sky-800 border-sky-200';
    Icon = ShieldCheck;
  } else if (score <= 15) {
    label = 'Disputed / Inactive (10%)';
    color = 'bg-rose-50 text-rose-800 border-rose-200';
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs border ${color}`}>
      {showIcon && <Icon className="w-3.5 h-3.5" />}
      <span>{status || label}</span>
    </span>
  );
};
