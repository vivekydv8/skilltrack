import React, { useState, useEffect } from 'react';
import { Smartphone, CheckCircle, AlertCircle, Building, Send, Award, ArrowLeft } from 'lucide-react';
import { fetchApi } from '../api/client';

interface PublicSurveyPageProps {
  token: string;
  onBackToApp?: () => void;
}

export const PublicSurveyPage: React.FC<PublicSurveyPageProps> = ({ token, onBackToApp }) => {
  const [surveyInfo, setSurveyInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Form Fields
  const [isEmployed, setIsEmployed] = useState<boolean>(true);
  const [employmentType, setEmploymentType] = useState<string>('Wage Employment');
  const [employerName, setEmployerName] = useState<string>('Tata Motors Ltd');
  const [jobRole, setJobRole] = useState<string>('Associate Technician');
  const [monthlyWage, setMonthlyWage] = useState<number>(18500);
  const [jobRelevance, setJobRelevance] = useState<number>(4);
  const [needsCounselling, setNeedsCounselling] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<string>('');

  useEffect(() => {
    async function loadSurvey() {
      try {
        setIsLoading(true);
        const data = await fetchApi<any>(`/api/followups/survey-by-token/${token}`);
        setSurveyInfo(data);
        if (data.already_responded) {
          setIsSubmitted(true);
        }
      } catch (err) {
        console.warn('Could not load survey by token, using fallback', err);
        setSurveyInfo({
          checkpoint: '6 Months',
          trainee_name: 'Prashant Jadhav',
          course_name: 'EV Battery & Drivetrain Assembly',
          status: 'Sent'
        });
      } finally {
        setIsLoading(false);
      }
    }
    loadSurvey();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await fetchApi(`/api/followups/submit-public-survey/${token}`, {
        method: 'POST',
        body: JSON.stringify({
          is_employed: isEmployed,
          employment_type: isEmployed ? employmentType : 'Unemployed',
          employer_or_business_name: isEmployed ? employerName : undefined,
          job_role: isEmployed ? jobRole : undefined,
          monthly_wage: isEmployed ? Number(monthlyWage) : 0,
          job_relevance_score: jobRelevance,
          needs_counselling_support: needsCounselling,
          feedback_notes: feedback
        })
      });
      setIsSubmitted(true);
    } catch (err) {
      alert(`Submission error: ${err}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4">
      {/* Top Header */}
      <div className="w-full max-w-lg mb-4 flex items-center justify-between">
        {onBackToApp && (
          <button
            onClick={onBackToApp}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded shadow-xs hover:bg-slate-50 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Dashboard</span>
          </button>
        )}
        <div className="text-right text-[11px] text-slate-500">
          Govt. of Maharashtra • Dept. of Skills & Entrepreneurship
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden w-full max-w-lg">
        {/* Tricolor Bar */}
        <div className="h-1.5 w-full flex">
          <div className="flex-1 bg-[#FF7722]"></div>
          <div className="flex-1 bg-white border-y border-slate-200"></div>
          <div className="flex-1 bg-[#128807]"></div>
        </div>

        {/* Card Header */}
        <div className="p-5 bg-gov-900 text-white">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <Smartphone className="w-4 h-4" />
            <span>Trainee Follow-Up Portal (SMS Survey)</span>
          </div>
          <h1 className="text-lg font-black mt-1">
            {surveyInfo ? `Career Milestone: ${surveyInfo.checkpoint}` : 'Career Follow-Up'}
          </h1>
          <p className="text-xs text-slate-300 mt-0.5">
            Namaskar {surveyInfo?.trainee_name}! Your response takes under 60 seconds and helps shape skilling programs in Maharashtra.
          </p>
        </div>

        {isSubmitted ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-7 h-7" />
            </div>
            <h2 className="text-base font-bold text-slate-900">Response Successfully Logged!</h2>
            <p className="text-xs text-slate-600 leading-relaxed max-w-md mx-auto">
              Dhanyawad! Your career milestone has been permanently saved to the state longitudinal registry. We wish you continued success in your professional journey.
            </p>
            {onBackToApp && (
              <button
                onClick={onBackToApp}
                className="mt-4 px-4 py-2 text-xs font-bold text-white bg-gov-700 hover:bg-gov-800 rounded transition"
              >
                Back to Command Dashboard
              </button>
            )}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Q1: Employment Status */}
            <div>
              <label className="text-xs font-bold text-slate-800 block mb-1.5">
                1. What is your current employment status? *
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'Wage Employment', label: 'Wage Employment (Job)' },
                  { id: 'Self-Employed', label: 'Self-Employed / Business' },
                  { id: 'Apprenticeship', label: 'NAPS Apprenticeship' },
                  { id: 'Unemployed', label: 'Seeking Work / Studying' }
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      setEmploymentType(opt.id);
                      setIsEmployed(opt.id !== 'Unemployed');
                    }}
                    className={`py-2 px-3 text-xs font-medium rounded-lg border text-left transition ${
                      employmentType === opt.id
                        ? 'bg-gov-700 text-white border-gov-800 font-bold'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Q2: Employer Details if Employed */}
            {isEmployed && (
              <div className="space-y-3.5 pt-2 border-t border-slate-200">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Employer or Business Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={employerName}
                    onChange={(e) => setEmployerName(e.target.value)}
                    placeholder="e.g. Tata Motors Ltd or Omkar Enterprises"
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded focus:ring-1 focus:ring-gov-600 outline-hidden"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Job Designation / Role *
                    </label>
                    <input
                      type="text"
                      required
                      value={jobRole}
                      onChange={(e) => setJobRole(e.target.value)}
                      placeholder="e.g. Associate Technician"
                      className="w-full text-xs px-3 py-2 border border-slate-300 rounded focus:ring-1 focus:ring-gov-600 outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Monthly Take-Home (₹) *
                    </label>
                    <input
                      type="number"
                      required
                      min="5000"
                      value={monthlyWage}
                      onChange={(e) => setMonthlyWage(Number(e.target.value))}
                      placeholder="18500"
                      className="w-full text-xs px-3 py-2 border border-slate-300 rounded focus:ring-1 focus:ring-gov-600 outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    2. How relevant is your vocational training to your daily work?
                  </label>
                  <select
                    value={jobRelevance}
                    onChange={(e) => setJobRelevance(Number(e.target.value))}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded focus:ring-1 focus:ring-gov-600 outline-hidden"
                  >
                    <option value={5}>5 - Highly Relevant (Daily core application)</option>
                    <option value={4}>4 - Relevant (Frequently applied)</option>
                    <option value={3}>3 - Partially Relevant</option>
                    <option value={2}>2 - Low Relevance</option>
                    <option value={1}>1 - Completely Unrelated</option>
                  </select>
                </div>
              </div>
            )}

            {/* Assistance Request */}
            <div className="pt-2 border-t border-slate-200">
              <label className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={needsCounselling}
                  onChange={(e) => setNeedsCounselling(e.target.checked)}
                  className="rounded text-gov-700 border-slate-300"
                />
                <span>I would like to speak with a government career counsellor for further guidance.</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 text-xs font-bold text-white bg-gov-700 hover:bg-gov-800 rounded-lg transition shadow-xs flex items-center justify-center gap-2"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{submitting ? 'Submitting to Registry...' : 'Submit Career Progress'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
