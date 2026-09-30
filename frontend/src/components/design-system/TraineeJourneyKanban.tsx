import React from 'react';
import {
  GraduationCap,
  BookOpen,
  Award,
  Briefcase,
  CheckCircle2,
  ChevronRight,
  User,
  ExternalLink,
} from 'lucide-react';

export interface TraineeKanbanItem {
  id: string;
  name: string;
  course: string;
  district?: string;
  attendancePct?: number;
  placementEmployer?: string;
  wage?: number;
  status: 'Enrolled' | 'Training' | 'Assessment' | 'Certified' | 'Placement' | 'Employment';
}

export interface TraineeJourneyKanbanProps {
  trainees: TraineeKanbanItem[];
  onSelectTrainee?: (traineeId: string) => void;
  className?: string;
}

const COLUMNS: Array<{
  id: TraineeKanbanItem['status'];
  label: string;
  color: string;
  badgeStyle: string;
}> = [
  { id: 'Enrolled', label: 'Enrolled', color: 'slate', badgeStyle: 'bg-slate-100 text-slate-800' },
  { id: 'Training', label: 'Training', color: 'teal', badgeStyle: 'bg-teal-50 text-teal-800 border-teal-200' },
  { id: 'Assessment', label: 'Assessment', color: 'amber', badgeStyle: 'bg-amber-50 text-amber-800 border-amber-200' },
  { id: 'Certified', label: 'Certified', color: 'emerald', badgeStyle: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
  { id: 'Placement', label: 'Placement', color: 'indigo', badgeStyle: 'bg-indigo-50 text-indigo-800 border-indigo-200' },
  { id: 'Employment', label: 'Employment', color: 'blue', badgeStyle: 'bg-teal-900 text-white' },
];

export const TraineeJourneyKanban: React.FC<TraineeJourneyKanbanProps> = ({
  trainees,
  onSelectTrainee,
  className = '',
}) => {
  return (
    <div
      className={`w-full bg-white border border-slate-200 rounded-2xl p-5 shadow-depth-card overflow-hidden ${className}`}
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>TRAINEE JOURNEY PIPELINE</span>
            <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
              {trainees.length} Active Records
            </span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time longitudinal stage progression from batch enrollment to verified employment
          </p>
        </div>
      </div>

      {/* Kanban Column Container */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3 overflow-x-auto pb-2">
        {COLUMNS.map((col) => {
          const colItems = trainees.filter((t) => t.status === col.id);

          return (
            <div
              key={col.id}
              className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-3 flex flex-col min-w-[200px]"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200">
                <span className="text-xs font-bold text-slate-800 tracking-wide">
                  {col.label}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.2 rounded-full border ${col.badgeStyle}`}>
                  {colItems.length}
                </span>
              </div>

              {/* Trainee Cards */}
              <div className="space-y-2.5 flex-1 min-h-[140px]">
                {colItems.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-[11px] text-slate-400 italic py-6">
                    No trainees in stage
                  </div>
                ) : (
                  colItems.slice(0, 5).map((item) => (
                    <div
                      key={item.id}
                      onClick={() => onSelectTrainee && onSelectTrainee(item.id)}
                      className="bg-white border border-slate-200 rounded-lg p-2.5 shadow-sm hover:shadow-depth-sm hover:border-teal-400 transition-all cursor-pointer group"
                    >
                      <div className="flex items-start justify-between gap-1">
                        <span className="text-xs font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                          {item.name}
                        </span>
                        <ChevronRight className="w-3 h-3 text-slate-300 group-hover:text-teal-600 transition-colors shrink-0" />
                      </div>

                      <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                        {item.course}
                      </p>

                      {item.attendancePct !== undefined && (
                        <div className="mt-2 flex items-center justify-between text-[10px]">
                          <span className="text-slate-400">Attendance</span>
                          <span
                            className={`font-bold ${
                              item.attendancePct >= 80 ? 'text-emerald-700' : 'text-amber-700'
                            }`}
                          >
                            {item.attendancePct}%
                          </span>
                        </div>
                      )}

                      {item.placementEmployer && (
                        <div className="mt-2 pt-1.5 border-t border-slate-100 text-[10px] text-teal-800 font-semibold truncate">
                          {item.placementEmployer}
                          {item.wage && (
                            <span className="text-slate-500 font-normal ml-1">
                              (₹{item.wage.toLocaleString()})
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  ))
                )}

                {colItems.length > 5 && (
                  <div className="text-center text-[11px] text-teal-700 font-semibold py-1">
                    +{colItems.length - 5} more trainees
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
