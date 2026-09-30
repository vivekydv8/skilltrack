import React from 'react';
import {
  GraduationCap,
  Sparkles,
  BookOpen,
  Award,
  Briefcase,
  Building2,
  ShieldCheck,
  TrendingUp,
  Compass,
} from 'lucide-react';

export interface OutcomeGraphProps {
  currentStage?: number; // 0 to 8
  interactive?: boolean;
  onSelectNode?: (stageIndex: number, stageName: string) => void;
  className?: string;
  compact?: boolean;
}

const OUTCOME_NODES = [
  { label: 'Trainee', subtitle: 'Demographics & Aspiration', icon: GraduationCap },
  { label: 'Skill', subtitle: 'Curriculum & Inferred', icon: Sparkles },
  { label: 'Training', subtitle: 'ITI & MSSDS Delivery', icon: BookOpen },
  { label: 'Certification', subtitle: 'NCVT / SCVT Verified', icon: Award },
  { label: 'Job', subtitle: 'Vacancy & Matching', icon: Briefcase },
  { label: 'Employer', subtitle: 'Industry Partner', icon: Building2 },
  { label: 'Retention', subtitle: '3-12 Month Audit', icon: ShieldCheck },
  { label: 'Wage', subtitle: 'Progression & Increment', icon: TrendingUp },
  { label: 'Career Growth', subtitle: 'Longitudinal Mobility', icon: Compass },
];

export const OutcomeGraph: React.FC<OutcomeGraphProps> = ({
  currentStage = 4,
  interactive = true,
  onSelectNode,
  className = '',
  compact = false,
}) => {
  return (
    <div
      className={`relative w-full bg-white border border-slate-200/90 rounded-2xl p-5 shadow-depth-card overflow-hidden ${className}`}
    >
      {/* Background Subtle Gradient & Light Grid */}
      <div className="absolute inset-0 bg-subtle-grid pointer-events-none opacity-40" />

      {/* Header */}
      <div className="relative flex items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-600 animate-ping" />
            <h3 className="text-sm font-bold tracking-tight text-slate-900">
              SKILLTRACKAI OUTCOME GRAPH™
            </h3>
            <span className="px-2 py-0.5 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-[10px] font-bold">
              Longitudinal Architecture
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Interconnected employability lineage from grassroots trainee intake to verified wage growth.
          </p>
        </div>

        <div className="hidden sm:flex items-center gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-teal-600" />
            <span>Verified Stage</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
            <span>Projected</span>
          </div>
        </div>
      </div>

      {/* Connected Lineage Graph */}
      <div className="relative overflow-x-auto pb-3 pt-1 scrollbar-none">
        <div className="flex items-center min-w-[760px] justify-between relative px-2">
          {/* Subtle animated connecting line */}
          <div className="absolute left-6 right-6 top-[22px] h-[3px] bg-slate-100 -z-0">
            <div
              className="h-full bg-gradient-to-r from-teal-600 via-teal-500 to-emerald-500 transition-all duration-700 rounded-full"
              style={{
                width: `${(currentStage / (OUTCOME_NODES.length - 1)) * 100}%`,
              }}
            />
          </div>

          {OUTCOME_NODES.map((node, idx) => {
            const Icon = node.icon;
            const isCompleted = idx < currentStage;
            const isCurrent = idx === currentStage;
            const isFuture = idx > currentStage;

            return (
              <div
                key={node.label}
                onClick={() => interactive && onSelectNode && onSelectNode(idx, node.label)}
                className={`relative flex flex-col items-center group ${
                  interactive ? 'cursor-pointer' : ''
                } transition-all duration-200`}
                style={{ width: `${100 / OUTCOME_NODES.length}%` }}
              >
                {/* Node Orb */}
                <div
                  className={`relative z-10 w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                    isCurrent
                      ? 'bg-teal-600 text-white shadow-depth-hover ring-4 ring-teal-100 scale-110'
                      : isCompleted
                      ? 'bg-teal-50 border-2 border-teal-600 text-teal-700 hover:scale-105'
                      : 'bg-white border border-slate-200 text-slate-400 group-hover:border-slate-300'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {isCurrent && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 ring-2 ring-white" />
                  )}
                </div>

                {/* Node Labels */}
                <div className="mt-2.5 text-center px-1">
                  <div
                    className={`text-xs font-bold leading-tight ${
                      isCurrent
                        ? 'text-teal-700'
                        : isCompleted
                        ? 'text-slate-800'
                        : 'text-slate-400'
                    }`}
                  >
                    {node.label}
                  </div>
                  {!compact && (
                    <div className="text-[10px] text-slate-400 line-clamp-1 mt-0.5 leading-tight">
                      {node.subtitle}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
