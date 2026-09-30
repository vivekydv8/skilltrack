import React from 'react';
import {
  GraduationCap,
  BookOpen,
  Award,
  Briefcase,
  CheckCircle2,
  ShieldCheck,
  ArrowDown,
} from 'lucide-react';

export interface FunnelStage {
  name: 'TRAINED' | 'COMPLETED' | 'CERTIFIED' | 'PLACED' | 'EMPLOYED' | 'RETAINED';
  count: number;
  pctOfTotal: number;
  dropOffPct?: number;
}

export interface GovernmentFunnelProps {
  stages?: FunnelStage[];
  onSelectStage?: (stageName: string) => void;
  className?: string;
}

const DEFAULT_STAGES: FunnelStage[] = [
  { name: 'TRAINED', count: 124850, pctOfTotal: 100 },
  { name: 'COMPLETED', count: 112360, pctOfTotal: 90.0, dropOffPct: 10.0 },
  { name: 'CERTIFIED', count: 98450, pctOfTotal: 78.8, dropOffPct: 11.2 },
  { name: 'PLACED', count: 76820, pctOfTotal: 61.5, dropOffPct: 17.3 },
  { name: 'EMPLOYED', count: 68940, pctOfTotal: 55.2, dropOffPct: 6.3 },
  { name: 'RETAINED', count: 58210, pctOfTotal: 46.6, dropOffPct: 8.6 },
];

const stageConfig: Record<string, { icon: React.ElementType; gradient: string; labelColor: string; bgLight: string }> = {
  TRAINED: {
    icon: GraduationCap,
    gradient: 'from-slate-500 to-slate-600',
    labelColor: 'text-slate-700',
    bgLight: 'bg-slate-50 border-slate-200',
  },
  COMPLETED: {
    icon: BookOpen,
    gradient: 'from-blue-500 to-blue-600',
    labelColor: 'text-blue-700',
    bgLight: 'bg-blue-50 border-blue-200',
  },
  CERTIFIED: {
    icon: Award,
    gradient: 'from-indigo-500 to-indigo-600',
    labelColor: 'text-indigo-700',
    bgLight: 'bg-indigo-50 border-indigo-200',
  },
  PLACED: {
    icon: Briefcase,
    gradient: 'from-teal-500 to-teal-600',
    labelColor: 'text-teal-700',
    bgLight: 'bg-teal-50 border-teal-200',
  },
  EMPLOYED: {
    icon: CheckCircle2,
    gradient: 'from-emerald-500 to-emerald-600',
    labelColor: 'text-emerald-700',
    bgLight: 'bg-emerald-50 border-emerald-200',
  },
  RETAINED: {
    icon: ShieldCheck,
    gradient: 'from-green-600 to-green-700',
    labelColor: 'text-green-700',
    bgLight: 'bg-green-50 border-green-200',
  },
};

export const GovernmentFunnel: React.FC<GovernmentFunnelProps> = ({
  stages = DEFAULT_STAGES,
  onSelectStage,
  className = '',
}) => {
  return (
    <div className={`chart-container-premium p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-500 animate-ping" />
            <h3 className="text-sm font-extrabold text-slate-900 tracking-tight uppercase">
              State Employment Outcome Funnel
            </h3>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Stage-by-stage conversion &amp; leak analysis · Maharashtra Skill Programs
          </p>
        </div>
        <span className="text-[10px] font-bold text-teal-800 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200 whitespace-nowrap">
          Longitudinal
        </span>
      </div>

      {/* Funnel Stages */}
      <div className="space-y-2">
        {stages.map((stage, idx) => {
          const config = stageConfig[stage.name] || stageConfig.TRAINED;
          const Icon = config.icon;
          const isFirst = idx === 0;
          const isLast = idx === stages.length - 1;
          // Width shrinks as funnel narrows
          const widthPct = Math.max(stage.pctOfTotal, 40);

          return (
            <div key={stage.name}>
              {/* Drop-off connector */}
              {!isFirst && stage.dropOffPct !== undefined && (
                <div className="flex items-center gap-2 px-4 py-0.5">
                  <ArrowDown className="w-3 h-3 text-rose-400 shrink-0" />
                  <div className="flex-1 h-px bg-gradient-to-r from-rose-200 to-transparent" />
                  <span className="text-[10px] font-bold text-rose-500 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">
                    −{stage.dropOffPct}% drop-off
                  </span>
                </div>
              )}

              {/* Stage Row */}
              <button
                onClick={() => onSelectStage && onSelectStage(stage.name)}
                className={`group w-full text-left rounded-xl border p-3 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 ${config.bgLight}`}
              >
                <div className="flex items-center gap-3">
                  {/* Stage Icon */}
                  <div
                    className={`w-10 h-10 rounded-xl bg-gradient-to-br ${config.gradient} flex items-center justify-center text-white shadow-sm shrink-0 group-hover:scale-110 transition-transform`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>

                  {/* Stage Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className={`text-xs font-extrabold uppercase tracking-wider ${config.labelColor}`}>
                        {stage.name}
                      </span>
                      <div className="flex items-center gap-3 text-xs font-bold">
                        <span className="text-slate-700 tabular-nums">
                          {stage.count.toLocaleString('en-IN')}
                        </span>
                        <span
                          className={`tabular-nums font-black text-sm ${
                            stage.pctOfTotal >= 75 ? 'text-emerald-700' :
                            stage.pctOfTotal >= 55 ? 'text-teal-700' :
                            stage.pctOfTotal >= 40 ? 'text-amber-700' :
                            'text-rose-700'
                          }`}
                        >
                          {stage.pctOfTotal}%
                        </span>
                      </div>
                    </div>

                    {/* Visual Bar - width proportional to funnel */}
                    <div className="w-full h-3 bg-white/70 rounded-full overflow-hidden shadow-inner">
                      <div
                        className={`funnel-stage-bar h-full rounded-full bg-gradient-to-r ${config.gradient} transition-all duration-700`}
                        style={{ width: `${stage.pctOfTotal}%` }}
                      />
                    </div>
                  </div>
                </div>
              </button>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
        <span className="text-slate-400 italic">Click any stage for district drill-down</span>
        <div className="flex items-center gap-1.5 text-emerald-700 font-extrabold">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>46.6% Final 12-Month Retention</span>
        </div>
      </div>
    </div>
  );
};
