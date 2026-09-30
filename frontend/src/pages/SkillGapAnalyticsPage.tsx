import React, { useState, useEffect } from 'react';
import { Layers, AlertTriangle, CheckCircle, TrendingDown, BookOpen, Building } from 'lucide-react';
import { fetchApi } from '../api/client';

interface SkillFeedbackItem {
  id: string;
  course_name: string;
  course_code: string;
  employer_name: string;
  skill_name: string;
  importance_rating: number;
  proficiency_observed: number;
  gap_severity: 'Critical Gap' | 'Moderate Gap' | 'Adequate' | 'Exceeds';
  feedback_notes: string;
}

interface AttritionItem {
  reason: string;
  count: number;
  percentage: number;
}

export const SkillGapAnalyticsPage: React.FC = () => {
  const [feedbacks, setFeedbacks] = useState<SkillFeedbackItem[]>([]);
  const [attrition, setAttrition] = useState<AttritionItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        const [fbRes, attRes] = await Promise.all([
          fetchApi<SkillFeedbackItem[]>('/api/employer/feedback'),
          fetchApi<AttritionItem[]>('/api/analytics/attrition-reasons')
        ]);
        setFeedbacks(fbRes);
        setAttrition(attRes);
      } catch (err) {
        console.error('Failed to load skill gap analytics', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-gov-100 text-gov-800 rounded">
              Curriculum Intelligence & Market Alignment
            </span>
            <span className="text-xs text-slate-400">• Employer Cross-Tabulation</span>
          </div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight mt-1">
            Skill Gap & Non-Placement Attrition Analytics
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Cross-tabulating syllabus competencies vs actual industry requirements and identifying root causes for career dropouts
          </p>
        </div>
      </div>

      {/* Top Banner: Core Insight */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-900">
          <div className="flex items-center gap-2 font-bold mb-1">
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            <span>Top Identified Skill Gap</span>
          </div>
          <p className="font-bold text-sm text-slate-900">CAN Bus & Industrial IoT Modbus</p>
          <p className="text-[11px] text-rose-700 mt-1">
            Flagged by Tata Motors & L&T: syllabus emphasizes theoretical ladder logic, lacking real-time hardware bus diagnostics.
          </p>
        </div>

        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900">
          <div className="flex items-center gap-2 font-bold mb-1">
            <TrendingDown className="w-4 h-4 text-amber-600" />
            <span>Primary Attrition Driver</span>
          </div>
          <p className="font-bold text-sm text-slate-900">Location / Commute Mismatch (32%)</p>
          <p className="text-[11px] text-amber-800 mt-1">
            Trainees certified in tier-2/3 districts reject plant jobs in Chakan/Bhosari industrial belts due to lack of affordable hostel lodging.
          </p>
        </div>

        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-900">
          <div className="flex items-center gap-2 font-bold mb-1">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>High Market Competence</span>
          </div>
          <p className="font-bold text-sm text-slate-900">High Voltage Safety & Dialyzer Priming</p>
          <p className="text-[11px] text-emerald-800 mt-1">
            Both healthcare and EV assembly sectors report 85%+ proficiency in compliance and sterile protocol standards.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 spans): Employer Skill Feedback Cross-Tabulation */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Curriculum Skills vs Industry Demand Matrix
              </h2>
              <p className="text-[11px] text-slate-500">
                Direct feedback logged by accredited hiring partners during post-placement reviews
              </p>
            </div>
            <span className="text-[11px] font-semibold text-gov-800 bg-gov-50 px-2 py-0.5 rounded border border-gov-200">
              Cross-Tabulated
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {feedbacks.map((f) => (
              <div key={f.id} className="p-4 hover:bg-slate-50 transition space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-xs">{f.skill_name}</span>
                    <span className="text-[11px] text-slate-400 font-mono">({f.course_code})</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    f.gap_severity === 'Critical Gap'
                      ? 'bg-rose-100 text-rose-800 border border-rose-300'
                      : f.gap_severity === 'Moderate Gap'
                      ? 'bg-amber-100 text-amber-800 border border-amber-300'
                      : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  }`}>
                    {f.gap_severity}
                  </span>
                </div>

                <div className="flex items-center gap-4 text-xs text-slate-600">
                  <span>Employer: <strong>{f.employer_name}</strong></span>
                  <span>Market Importance: <strong>{f.importance_rating}/5</strong></span>
                  <span>Candidate Proficiency: <strong>{f.proficiency_observed}/5</strong></span>
                </div>

                <p className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded border border-slate-200 font-sans">
                  💬 "{f.feedback_notes}"
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Attrition & Non-Placement Breakdown */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-xs p-5 space-y-4">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Attrition / Non-Placement Root Causes
            </h2>
            <p className="text-[11px] text-slate-500">
              Structured reason capture at training exit & post-placement checkpoints
            </p>
          </div>

          <div className="space-y-3">
            {attrition.map((a, idx) => (
              <div key={idx} className="p-2.5 bg-slate-50 rounded border border-slate-200 text-xs">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-slate-800">{a.reason}</span>
                  <span className="font-bold text-rose-700">{a.percentage}%</span>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-rose-600 h-full rounded-full"
                    style={{ width: `${a.percentage}%` }}
                  ></div>
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  {a.count} candidate responses
                </span>
              </div>
            ))}
          </div>

          <div className="p-3 bg-gov-50 border border-gov-200 rounded text-xs text-gov-950">
            <p className="font-bold">Policy Recommendation:</p>
            <p className="text-[11px] text-gov-800 mt-0.5">
              Introduce direct DBT stipend for relocation transit or partner with MIDC industrial clusters to offer shared transit buses for certified trainees.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
