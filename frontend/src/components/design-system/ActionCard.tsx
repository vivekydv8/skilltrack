import React from 'react';
import {
  BookOpen,
  PlusCircle,
  Building2,
  Briefcase,
  GraduationCap,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Clock,
  TrendingUp,
} from 'lucide-react';

export type ActionCategory =
  | 'Curriculum Update'
  | 'New Skill Module'
  | 'Employer Partnership'
  | 'Apprenticeship'
  | 'Trainer Upskilling'
  | 'Placement Intervention';

export interface ActionCardProps {
  category: ActionCategory;
  title: string;
  problem: string;
  evidence: string;
  action: string;
  status: 'Proposed' | 'Under Review' | 'Approved' | 'In Progress' | 'Completed' | string;
  impact: string;
  district?: string;
  sector?: string;
  onApproveAction?: () => void;
  className?: string;
}

export const ActionCard: React.FC<ActionCardProps> = ({
  category,
  title,
  problem,
  evidence,
  action,
  status,
  impact,
  district,
  sector,
  onApproveAction,
  className = '',
}) => {
  const getCategoryConfig = (cat: ActionCategory) => {
    switch (cat) {
      case 'Curriculum Update':
        return { icon: BookOpen, tag: 'bg-teal-50 text-teal-800 border-teal-200' };
      case 'New Skill Module':
        return { icon: PlusCircle, tag: 'bg-emerald-50 text-emerald-800 border-emerald-200' };
      case 'Employer Partnership':
        return { icon: Building2, tag: 'bg-indigo-50 text-indigo-800 border-indigo-200' };
      case 'Apprenticeship':
        return { icon: Briefcase, tag: 'bg-amber-50 text-amber-800 border-amber-200' };
      case 'Trainer Upskilling':
        return { icon: GraduationCap, tag: 'bg-purple-50 text-purple-800 border-purple-200' };
      case 'Placement Intervention':
        return { icon: Sparkles, tag: 'bg-rose-50 text-rose-800 border-rose-200' };
      default:
        return { icon: BookOpen, tag: 'bg-slate-100 text-slate-800 border-slate-200' };
    }
  };

  const { icon: CategoryIcon, tag: tagStyle } = getCategoryConfig(category);

  const getStatusBadge = (s: string) => {
    switch (s) {
      case 'Approved':
      case 'Completed':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'In Progress':
        return 'bg-teal-100 text-teal-800 border-teal-300';
      case 'Under Review':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-300';
    }
  };

  return (
    <div
      className={`bg-white border border-slate-200 rounded-2xl p-5 shadow-depth-card hover:shadow-depth-hover transition-all duration-200 flex flex-col justify-between ${className}`}
    >
      <div>
        {/* Category & Status */}
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${tagStyle}`}>
              <CategoryIcon className="w-3.5 h-3.5" />
              <span>{category}</span>
            </span>
            {district && (
              <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                {district}
              </span>
            )}
          </div>

          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${getStatusBadge(status)}`}>
            {status}
          </span>
        </div>

        {/* Title */}
        <h4 className="text-sm font-bold text-slate-900 tracking-tight leading-snug">
          {title}
        </h4>

        {/* Problem */}
        <div className="mt-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100 space-y-2 text-xs">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3 text-rose-500" />
              Problem
            </span>
            <p className="text-slate-700 mt-0.5 leading-relaxed">{problem}</p>
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Evidence
            </span>
            <p className="text-slate-600 mt-0.5 leading-relaxed italic">{evidence}</p>
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-teal-600" />
              Action Required
            </span>
            <p className="text-slate-800 font-medium mt-0.5 leading-relaxed">{action}</p>
          </div>
        </div>
      </div>

      {/* Impact & Action button */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
          <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
          <span>Expected Impact: {impact}</span>
        </div>

        {onApproveAction && status !== 'Approved' && status !== 'Completed' && (
          <button
            type="button"
            onClick={onApproveAction}
            className="inline-flex items-center gap-1 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 px-3 py-1.5 rounded-lg shadow-sm transition-all active:scale-95"
          >
            <span>Execute</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
  );
};
