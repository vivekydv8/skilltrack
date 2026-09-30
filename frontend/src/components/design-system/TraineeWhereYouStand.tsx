import React from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Sparkles,
  Target,
  ShieldCheck,
} from 'lucide-react';

export interface TraineeSkillItemData {
  id: string;
  name: string;
  level?: string;
  verified?: boolean;
}

export interface TargetRoleSkillItemData {
  id: string;
  name: string;
  importance: 'Required' | 'Preferred' | 'Bonus';
  matched: boolean;
}

export interface TraineeWhereYouStandProps {
  targetRole?: string;
  matchScore?: number; // e.g. 78%
  userSkills?: TraineeSkillItemData[];
  targetSkills?: TargetRoleSkillItemData[];
  recommendedLearning?: Array<{
    skill: string;
    courseName: string;
    provider: string;
    duration: string;
  }>;
  onExploreCourse?: (courseName: string) => void;
  className?: string;
}

const DEFAULT_USER_SKILLS: TraineeSkillItemData[] = [
  { id: '1', name: 'EV Diagnostics', level: 'Advanced', verified: true },
  { id: '2', name: 'CAN Bus Analysis', level: 'Intermediate', verified: true },
  { id: '3', name: 'Electrical Safety High Voltage', level: 'Advanced', verified: true },
  { id: '4', name: 'C Programming', level: 'Intermediate', verified: true },
  { id: '5', name: 'Battery Testing', level: 'Advanced', verified: true },
];

const DEFAULT_TARGET_SKILLS: TargetRoleSkillItemData[] = [
  { id: '1', name: 'EV Diagnostics', importance: 'Required', matched: true },
  { id: '2', name: 'CAN Bus Analysis', importance: 'Required', matched: true },
  { id: '3', name: 'Electrical Safety High Voltage', importance: 'Required', matched: true },
  { id: '4', name: 'Embedded C (ECU Flashing)', importance: 'Required', matched: false },
  { id: '5', name: 'Automotive Thermal Management', importance: 'Preferred', matched: false },
];

export const TraineeWhereYouStand: React.FC<TraineeWhereYouStandProps> = ({
  targetRole = 'Senior EV Diagnostics Lead (Tata Motors / Mahindra)',
  matchScore = 78,
  userSkills = DEFAULT_USER_SKILLS,
  targetSkills = DEFAULT_TARGET_SKILLS,
  recommendedLearning = [
    {
      skill: 'Embedded C (ECU Flashing)',
      courseName: 'Advanced Embedded C for EV Diagnostics',
      provider: 'MSSDS & Tata Technologies',
      duration: '4 Weeks',
    },
    {
      skill: 'Automotive Thermal Management',
      courseName: 'Battery Thermal Dynamics & Cooling Systems',
      provider: 'Govt ITI Pune Center of Excellence',
      duration: '2 Weeks',
    },
  ],
  onExploreCourse,
  className = '',
}) => {
  return (
    <div
      className={`bg-white border border-slate-200/90 rounded-2xl p-6 shadow-depth-card ${className}`}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 mb-6 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-teal-600" />
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Skill Fit & Target Role
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Target: <strong className="text-slate-800 font-semibold">{targetRole}</strong>
          </p>
        </div>

        {/* Match Percentage Pill */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-2xl font-extrabold text-teal-700 tabular-nums">
              {matchScore}%
            </div>
            <div className="text-[11px] font-semibold text-slate-400">Skill Match</div>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center">
            <Sparkles className="w-7 h-7 text-teal-600" />
          </div>
        </div>
      </div>

      {/* Comparison Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
        {/* Left: Your Verified Skills */}
        <div className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-teal-600" />
              Your Verified Skills ({userSkills.length})
            </span>
            <span className="text-[10px] text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200 font-semibold">
              DigiLocker Linked
            </span>
          </div>

          <div className="space-y-2">
            {userSkills.map((s) => (
              <div
                key={s.id}
                className="flex items-center justify-between p-2.5 rounded-lg bg-white border border-slate-200 text-xs shadow-sm"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="font-semibold text-slate-800">{s.name}</span>
                </div>
                {s.level && (
                  <span className="text-[10px] text-slate-500 font-medium">{s.level}</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right: Target Role Requirements */}
        <div className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Target className="w-4 h-4 text-indigo-600" />
              Target Role Skills ({targetSkills.length})
            </span>
            <span className="text-[10px] text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200 font-semibold">
              Industry Standard
            </span>
          </div>

          <div className="space-y-2">
            {targetSkills.map((s) => (
              <div
                key={s.id}
                className={`flex items-center justify-between p-2.5 rounded-lg border text-xs shadow-sm ${
                  s.matched
                    ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950'
                    : 'bg-rose-50/70 border-rose-200 text-rose-950'
                }`}
              >
                <div className="flex items-center gap-2">
                  {s.matched ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
                  )}
                  <span className="font-semibold">{s.name}</span>
                </div>

                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    s.matched
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-rose-100 text-rose-800 animate-pulse'
                  }`}
                >
                  {s.matched ? 'Matched' : 'Missing Gap'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* What to Learn Next */}
      <div className="mt-6 pt-5 border-t border-slate-100">
        <div className="flex items-center gap-2 mb-3">
          <BookOpen className="w-4 h-4 text-teal-600" />
          <h4 className="text-xs font-bold text-slate-800 tracking-wider">
            Recommended Courses to Bridge Gaps
          </h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {recommendedLearning.map((item, idx) => (
            <div
              key={idx}
              className="bg-white border border-teal-200/80 rounded-xl p-3.5 shadow-sm flex items-start justify-between gap-3 hover:border-teal-400 transition-colors"
            >
              <div>
                <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
                  To Learn: {item.skill}
                </span>
                <h5 className="text-xs font-bold text-slate-900 mt-1.5">{item.courseName}</h5>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {item.provider} • <span className="text-slate-700 font-medium">{item.duration}</span>
                </p>
              </div>

              <button
                type="button"
                onClick={() => onExploreCourse && onExploreCourse(item.courseName)}
                className="mt-1 inline-flex items-center gap-1 text-xs font-bold text-teal-700 hover:text-teal-800 bg-teal-50 hover:bg-teal-100 px-2.5 py-1.5 rounded-lg border border-teal-200 transition-all shrink-0 active:scale-95"
              >
                <span>Enroll</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
