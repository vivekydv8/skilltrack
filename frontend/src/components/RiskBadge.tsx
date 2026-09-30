import React from 'react';
import { AlertTriangle, CheckCircle2, AlertOctagon } from 'lucide-react';

interface RiskBadgeProps {
  level: 'Low' | 'Medium' | 'High';
  score?: number;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ level, score }) => {
  if (level === 'High') {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-300">
        <AlertOctagon className="w-3.5 h-3.5 text-rose-600" />
        High Risk {score !== undefined ? `(${Math.round(score * 100)}%)` : ''}
      </span>
    );
  }
  if (level === 'Medium') {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 border border-amber-300">
        <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
        Medium Risk {score !== undefined ? `(${Math.round(score * 100)}%)` : ''}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-300">
      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
      Low Risk {score !== undefined ? `(${Math.round(score * 100)}%)` : ''}
    </span>
  );
};
