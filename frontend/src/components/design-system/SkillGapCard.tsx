import React from 'react';
import { AlertCircle, TrendingUp, ChevronRight, Sparkles } from 'lucide-react';

export interface SkillGapItemData {
  skill: string;
  demandCount: number;
  supplyCount: number;
  gapPercent: number; // e.g. 42%
  urgency?: 'Critical' | 'Moderate' | 'Low' | string;
  district?: string;
  sector?: string;
}

export interface SkillGapCardProps {
  skill: string;
  demandCount: number;
  supplyCount: number;
  gapPercent?: number;
  urgency?: 'Critical' | 'Moderate' | 'Low' | string;
  onClick?: () => void;
  className?: string;
}

export const SkillGapCard: React.FC<SkillGapCardProps> = ({
  skill,
  demandCount,
  supplyCount,
  gapPercent,
  urgency = 'Critical',
  onClick,
  className = '',
}) => {
  const max = Math.max(demandCount, supplyCount, 1);
  const demandWidth = Math.round((demandCount / max) * 100);
  const supplyWidth = Math.round((supplyCount / max) * 100);
  const calculatedGap = gapPercent ?? Math.round(((demandCount - supplyCount) / demandCount) * 100);

  const urgencyStyle = {
    Critical: 'bg-rose-50 text-rose-800 border-rose-200',
    Moderate: 'bg-amber-50 text-amber-800 border-amber-200',
    Low: 'bg-teal-50 text-teal-800 border-teal-200',
  }[urgency] || 'bg-slate-100 text-slate-700 border-slate-200';

  return (
    <div
      onClick={onClick}
      className={`group bg-white border border-slate-200 rounded-xl p-4 transition-all duration-200 ${
        onClick ? 'cursor-pointer hover:border-teal-400 hover:shadow-depth-hover hover:-translate-y-0.5' : 'shadow-depth-card'
      } ${className}`}
    >
      {/* Skill Title & Urgency */}
      <div className="flex items-center justify-between gap-3 mb-2.5">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-900 text-sm group-hover:text-teal-700 transition-colors">
            {skill}
          </span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${urgencyStyle}`}>
            {urgency} Deficit
          </span>
        </div>

        {onClick && (
          <div className="flex items-center gap-1 text-xs text-slate-400 group-hover:text-teal-600 font-medium">
            <span>Intelligence</span>
            <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
          </div>
        )}
      </div>

      {/* Demand Bar */}
      <div className="space-y-2 mt-3">
        <div>
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-medium text-slate-600">Industry Demand</span>
            <span className="font-bold text-slate-900 tabular-nums">{demandCount.toLocaleString()} open roles</span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-teal-600 rounded-full transition-all duration-500"
              style={{ width: `${demandWidth}%` }}
            />
          </div>
        </div>

        {/* Supply Bar */}
        <div>
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-medium text-slate-600">Certified Supply</span>
            <span className="font-bold text-slate-900 tabular-nums">{supplyCount.toLocaleString()} trainees</span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-slate-400 rounded-full transition-all duration-500"
              style={{ width: `${supplyWidth}%` }}
            />
          </div>
        </div>
      </div>

      {/* Gap summary pill */}
      <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
        <span className="text-slate-500 flex items-center gap-1">
          <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
          Shortfall
        </span>
        <span className="font-bold text-rose-600">
          {calculatedGap > 0 ? `-${calculatedGap}% unmet` : 'Balanced'}
        </span>
      </div>
    </div>
  );
};
