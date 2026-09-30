import React from 'react';
import {
  Building2,
  MapPin,
  DollarSign,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Briefcase,
} from 'lucide-react';

export interface JobCardProps {
  id: string;
  title: string;
  company: string;
  location: string;
  salaryRange?: string;
  matchScore: number; // e.g. 92
  matchingSkills: string[];
  missingSkills?: string[];
  educationMatch?: string;
  type?: string;
  postedDate?: string;
  onViewOpportunity?: () => void;
  className?: string;
}

export const JobCard: React.FC<JobCardProps> = ({
  title,
  company,
  location,
  salaryRange,
  matchScore,
  matchingSkills,
  missingSkills = [],
  educationMatch,
  type = 'Full Time',
  postedDate = 'Recently active',
  onViewOpportunity,
  className = '',
}) => {
  return (
    <div
      className={`bg-white border border-slate-200 rounded-2xl p-5 shadow-depth-card hover:shadow-depth-hover hover:border-teal-400 transition-all duration-200 flex flex-col justify-between ${className}`}
    >
      <div>
        {/* Top: Company, Location, Match Score */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-start gap-3">
            <div className="w-11 h-11 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-teal-700 shadow-sm shrink-0">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 tracking-tight leading-snug">
                {title}
              </h4>
              <p className="text-xs font-semibold text-slate-700 mt-0.5">{company}</p>
              <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  {location}
                </span>
                <span>•</span>
                <span>{type}</span>
              </div>
            </div>
          </div>

          {/* Match Score Badge */}
          <div className="flex flex-col items-end shrink-0">
            <div
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                matchScore >= 85
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : matchScore >= 70
                  ? 'bg-teal-50 text-teal-800 border border-teal-200'
                  : 'bg-amber-50 text-amber-800 border border-amber-200'
              }`}
            >
              <Sparkles className="w-3 h-3 text-teal-600" />
              <span>{matchScore}% Match</span>
            </div>
            {educationMatch && (
              <span className="text-[10px] text-slate-400 mt-1">{educationMatch}</span>
            )}
          </div>
        </div>

        {/* Salary */}
        {salaryRange && (
          <div className="flex items-center gap-1 text-xs font-bold text-slate-800 mt-2 mb-3 bg-slate-50 p-2 rounded-lg border border-slate-100">
            <DollarSign className="w-3.5 h-3.5 text-teal-600" />
            <span>₹{salaryRange} / Month</span>
            <span className="text-[10px] text-slate-400 font-normal ml-1">(Payroll verified range)</span>
          </div>
        )}

        {/* Matching Skills */}
        <div className="space-y-2 mt-3">
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Matching Skills ({matchingSkills.length})
            </span>
            <div className="flex flex-wrap gap-1.5">
              {matchingSkills.map((skill, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/80 px-2 py-0.5 rounded-md"
                >
                  <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Missing Skills */}
          {missingSkills.length > 0 && (
            <div>
              <span className="text-[10px] font-bold text-rose-600 uppercase tracking-wider block mb-1">
                Suggested Bridge Skills
              </span>
              <div className="flex flex-wrap gap-1.5">
                {missingSkills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold bg-rose-50 text-rose-800 border border-rose-200/80 px-2 py-0.5 rounded-md"
                  >
                    <AlertTriangle className="w-2.5 h-2.5 text-rose-500" />
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer / CTA */}
      <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
        <span className="text-[11px] text-slate-400">{postedDate}</span>
        <button
          type="button"
          onClick={onViewOpportunity}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 px-3.5 py-1.5 rounded-lg shadow-sm transition-all active:scale-95"
        >
          <span>View Opportunity</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
