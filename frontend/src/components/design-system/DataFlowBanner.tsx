import React from 'react';
import { ArrowRight, Sparkles, Database, CheckCircle2, TrendingUp, Cpu } from 'lucide-react';

export interface DataFlowBannerProps {
  mode?: 'employability' | 'pipeline';
  className?: string;
}

export const DataFlowBanner: React.FC<DataFlowBannerProps> = ({
  mode = 'employability',
  className = '',
}) => {
  const employabilityNodes = [
    { label: 'Training', desc: 'Coursework & ITI', icon: Database },
    { label: 'Skills', desc: 'Verified Skills', icon: Sparkles },
    { label: 'Jobs', desc: 'Placements', icon: CheckCircle2 },
    { label: 'Retention', desc: 'Job Stability', icon: Cpu },
    { label: 'Growth', desc: 'Career & Wage', icon: TrendingUp },
  ];

  const pipelineNodes = [
    { label: 'Connect', desc: 'ITI & MSSDS Data', icon: Database },
    { label: 'Verify', desc: 'DigiLocker & Payroll', icon: CheckCircle2 },
    { label: 'Match', desc: 'Smart AI Match', icon: Sparkles },
    { label: 'Impact', desc: 'Policy & Jobs', icon: ArrowRight },
  ];

  const nodes = mode === 'employability' ? employabilityNodes : pipelineNodes;

  return (
    <div
      className={`relative w-full overflow-hidden bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-depth-card text-white ${className}`}
    >
      {/* Background glow and subtle mesh */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left Indicator */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-400">
            <Sparkles className="w-4 h-4 animate-pulse-slow" />
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-teal-400">
              {mode === 'employability' ? 'Trainee Journey' : 'How SkillTrack Works'}
            </div>
            <div className="text-[11px] text-slate-400">
              Live across 36 districts
            </div>
          </div>
        </div>

        {/* Animated Flow Nodes */}
        <div className="flex items-center justify-center gap-1 sm:gap-3 flex-wrap">
          {nodes.map((item, idx) => {
            const Icon = item.icon;
            const isLast = idx === nodes.length - 1;

            return (
              <React.Fragment key={item.label}>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/60 transition-transform hover:scale-105">
                  <Icon className="w-3.5 h-3.5 text-teal-400" />
                  <div>
                    <span className="text-xs font-bold text-slate-200">{item.label}</span>
                    <span className="hidden lg:inline text-[10px] text-slate-400 ml-1.5 font-normal">
                      • {item.desc}
                    </span>
                  </div>
                </div>

                {!isLast && (
                  <div className="flex items-center text-teal-500/60 animate-pulse">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};
