import React, { useState } from 'react';
import {
  FileText,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Download,
  Eye,
  Calendar,
  Building,
  ArrowRight,
  Cpu,
} from 'lucide-react';
import { toast } from '../Toast';

export interface DocumentCardProps {
  id: string;
  title: string;
  documentType: string;
  issuer: string;
  issuedDate: string;
  isVerified: boolean;
  verificationSource?: string;
  extractedSkills?: string[];
  qualification?: string;
  specialization?: string;
  careerRelevance?: string;
  onView?: () => void;
  onDownload?: () => void;
  className?: string;
}

export const DocumentCard: React.FC<DocumentCardProps> = ({
  id,
  title,
  documentType,
  issuer,
  issuedDate,
  isVerified,
  verificationSource = 'DigiLocker Government Repository',
  extractedSkills = ['EV Diagnostics', 'High Voltage Safety', 'Battery Management'],
  qualification = 'National Trade Certificate (NTC)',
  specialization = 'Automotive Electrical & EV Diagnostics',
  careerRelevance = 'Direct qualification match for Tier-1 EV OEM Technician roles',
  onView,
  onDownload,
  className = '',
}) => {
  const [showAiBreakdown, setShowAiBreakdown] = useState(false);

  return (
    <div
      className={`bg-white border border-slate-200 rounded-2xl p-5 shadow-depth-card transition-all duration-200 hover:shadow-depth-hover ${className}`}
    >
      {/* Top row: Type, Title & Verified Badge */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-start gap-3">
          <div className="w-11 h-11 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 shadow-sm shrink-0">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 tracking-tight leading-snug">
              {title}
            </h4>
            <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
              <span className="flex items-center gap-1 font-medium text-slate-700">
                <Building className="w-3 h-3 text-slate-400" />
                {issuer}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-slate-400">
                <Calendar className="w-3 h-3 text-slate-400" />
                {issuedDate}
              </span>
            </div>
          </div>
        </div>

        {/* Verification seal */}
        <div className="shrink-0">
          {isVerified ? (
            <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>DigiLocker Verified</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold">
              <span>Pending Verification</span>
            </div>
          )}
        </div>
      </div>

      {/* Document Metadata Pill */}
      <div className="flex items-center justify-between text-xs bg-slate-50 border border-slate-100 rounded-lg p-2.5 my-3">
        <span className="text-slate-500">
          Document Category: <strong className="text-slate-700 font-semibold">{documentType}</strong>
        </span>
        <span className="text-[11px] text-teal-700 font-medium">{verificationSource}</span>
      </div>

      {/* Document AI Extraction Section */}
      <div className="mt-3">
        <button
          type="button"
          onClick={() => setShowAiBreakdown(!showAiBreakdown)}
          className="w-full flex items-center justify-between p-2.5 rounded-xl bg-gradient-to-r from-teal-50/70 to-slate-50 border border-teal-200/70 text-xs text-teal-900 font-bold transition-all hover:bg-teal-50"
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-teal-600 animate-pulse-slow" />
            <span>AI Verified Extraction & Skills Detected</span>
          </div>
          <span className="text-[11px] text-teal-700 font-semibold">
            {showAiBreakdown ? 'Hide Breakdown ▲' : 'Inspect Extraction ▼'}
          </span>
        </button>

        {showAiBreakdown && (
          <div className="mt-2.5 p-3.5 rounded-xl bg-slate-900 text-white border border-slate-800 text-xs space-y-3 animate-fade-in">
            <div className="flex items-center justify-between text-teal-400 text-[11px] font-bold uppercase tracking-wider pb-2 border-b border-slate-800">
              <span className="flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5" />
                SkillTrackAI Neural Extractor v4.2
              </span>
              <span className="text-emerald-400 font-mono">100% Match Integrity</span>
            </div>

            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                Parsed Qualification
              </span>
              <p className="text-slate-200 font-semibold mt-0.5">{qualification}</p>
            </div>

            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                Specialization Domain
              </span>
              <p className="text-slate-200 font-semibold mt-0.5">{specialization}</p>
            </div>

            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                Identified Competencies
              </span>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {extractedSkills.map((sk, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-teal-950 text-teal-300 border border-teal-700/60 text-[11px] font-medium"
                  >
                    <CheckCircle2 className="w-2.5 h-2.5 text-teal-400" />
                    {sk}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                Career Relevance
              </span>
              <p className="text-emerald-300 text-[11px] mt-0.5 leading-relaxed">
                {careerRelevance}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
        <span className="text-[11px] text-slate-400">Authenticated via SHA-256 Hash</span>

        <div className="flex items-center gap-2">
          {onView && (
            <button
              type="button"
              onClick={onView}
              className="inline-flex items-center gap-1 text-slate-600 hover:text-slate-900 font-medium px-2 py-1 rounded hover:bg-slate-100 transition-colors"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Preview</span>
            </button>
          )}

          {onDownload && (
            <button
              type="button"
              onClick={onDownload}
              className="inline-flex items-center gap-1 text-teal-700 hover:text-teal-800 font-semibold px-2.5 py-1 rounded bg-teal-50 border border-teal-200/80 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
