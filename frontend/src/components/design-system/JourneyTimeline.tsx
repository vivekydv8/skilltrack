import React from 'react';
import {
  GraduationCap,
  BookOpen,
  Sparkles,
  Award,
  Briefcase,
  TrendingUp,
  CheckCircle2,
} from 'lucide-react';

export interface JourneyStage {
  id: string;
  label: string;
  status: 'completed' | 'current' | 'upcoming';
  date?: string;
  detail?: string;
}

export interface JourneyTimelineProps {
  stages?: JourneyStage[];
  activeStageId?: string;
  onSelectStage?: (stageId: string) => void;
  className?: string;
}

const DEFAULT_STAGES: JourneyStage[] = [
  { id: 'education', label: 'Education', status: 'completed', date: '2022', detail: 'HSC / 12th Vocational' },
  { id: 'training', label: 'Training', status: 'completed', date: '2023', detail: 'Govt ITI Pune - EV Diagnostics' },
  { id: 'skills', label: 'Skills', status: 'completed', date: '2023', detail: '14 Competencies Mastered' },
  { id: 'certification', label: 'Certification', status: 'completed', date: '2024', detail: 'NCVT Grade A Certified' },
  { id: 'employment', label: 'Employment', status: 'current', date: '2024 - Present', detail: 'Tata Motors Ltd (EV Division)' },
  { id: 'growth', label: 'Growth', status: 'upcoming', date: 'Target 2026', detail: 'Senior Diagnostic Lead (+40% Wage)' },
];

export const JourneyTimeline: React.FC<JourneyTimelineProps> = ({
  stages = DEFAULT_STAGES,
  activeStageId,
  onSelectStage,
  className = '',
}) => {
  const icons = [GraduationCap, BookOpen, Sparkles, Award, Briefcase, TrendingUp];

  return (
    <div className={`w-full bg-white border border-slate-200/90 rounded-2xl p-5 shadow-depth-card ${className}`}>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Your Career Journey</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Verified longitudinal milestones powered by DigiLocker and Maharashtra State Skilling
          </p>
        </div>
      </div>

      {/* Responsive Timeline Grid */}
      <div className="relative overflow-x-auto pb-2 scrollbar-none">
        <div className="flex items-start justify-between min-w-[680px] relative px-3">
          {/* Animated Connecting Track Line */}
          <div className="absolute left-8 right-8 top-5 h-[2px] bg-slate-200 -z-0">
            <div className="h-full bg-gradient-to-r from-teal-600 via-teal-500 to-emerald-500 w-4/6 rounded-full" />
          </div>

          {stages.map((stage, idx) => {
            const Icon = icons[idx % icons.length];
            const isCompleted = stage.status === 'completed';
            const isCurrent = stage.status === 'current';
            const isUpcoming = stage.status === 'upcoming';
            const isSelected = activeStageId === stage.id;

            return (
              <div
                key={stage.id}
                onClick={() => onSelectStage && onSelectStage(stage.id)}
                className={`relative flex flex-col items-center group cursor-pointer transition-all duration-200 ${
                  isSelected ? 'scale-105' : ''
                }`}
                style={{ width: `${100 / stages.length}%` }}
              >
                {/* Node Orb */}
                <div
                  className={`relative z-10 w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                    isCurrent
                      ? 'bg-teal-600 text-white shadow-depth-hover ring-4 ring-teal-100 scale-110'
                      : isCompleted
                      ? 'bg-teal-50 border-2 border-teal-600 text-teal-700'
                      : 'bg-white border border-slate-200 text-slate-400 group-hover:border-slate-300'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {isCompleted && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 absolute -bottom-1 -right-1 bg-white rounded-full" />
                  )}
                  {isCurrent && (
                    <span className="w-2.5 h-2.5 bg-emerald-400 rounded-full absolute -top-1 -right-1 ring-2 ring-white" />
                  )}
                </div>

                {/* Stage Info */}
                <div className="mt-3 text-center px-1">
                  <div
                    className={`text-xs font-bold ${
                      isCurrent
                        ? 'text-teal-700'
                        : isCompleted
                        ? 'text-slate-900'
                        : 'text-slate-400'
                    }`}
                  >
                    {stage.label}
                  </div>
                  {stage.date && (
                    <div className="text-[10px] font-semibold text-slate-400 mt-0.5">
                      {stage.date}
                    </div>
                  )}
                  {stage.detail && (
                    <div className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-snug">
                      {stage.detail}
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
