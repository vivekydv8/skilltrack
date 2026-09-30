import React, { useState } from 'react';
import { X, Send, Smartphone, MessageSquare, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { FollowUpScheduleItem } from '../types';
import { fetchApi } from '../api/client';

interface FollowUpSimulatorModalProps {
  schedule: FollowUpScheduleItem | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const FollowUpSimulatorModal: React.FC<FollowUpSimulatorModalProps> = ({
  schedule,
  onClose,
  onSuccess
}) => {
  if (!schedule) return null;

  const [channel, setChannel] = useState<'WhatsApp' | 'SMS' | 'IVR'>('WhatsApp');
  const [isEmployed, setIsEmployed] = useState<boolean>(true);
  const [empType, setEmpType] = useState<string>('Wage Employment');
  const [employerName, setEmployerName] = useState<string>('Tata Motors Ltd');
  const [jobRole, setJobRole] = useState<string>('Technician Associate');
  const [monthlyWage, setMonthlyWage] = useState<number>(18500);
  const [relevance, setRelevance] = useState<number>(4);
  const [needsCounselling, setNeedsCounselling] = useState<boolean>(false);
  const [notes, setNotes] = useState<string>('Job closely aligned with PLC and Automation curriculum.');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [notificationSent, setNotificationSent] = useState<boolean>(false);

  const handleSendTrigger = async () => {
    try {
      setIsSubmitting(true);
      await fetchApi(`/api/followups/trigger/${schedule.id}`, {
        method: 'POST',
        body: JSON.stringify({ channel })
      });
      setNotificationSent(true);
    } catch (err) {
      alert(`Error triggering notification: ${err}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitResponse = async () => {
    try {
      setIsSubmitting(true);
      await fetchApi(`/api/followups/respond/${schedule.id}`, {
        method: 'POST',
        body: JSON.stringify({
          is_employed: isEmployed,
          employment_type: isEmployed ? empType : 'Unemployed',
          employer_or_business_name: isEmployed ? employerName : undefined,
          job_role: isEmployed ? jobRole : undefined,
          monthly_wage: isEmployed ? Number(monthlyWage) : 0,
          job_relevance_score: relevance,
          needs_counselling_support: needsCounselling,
          feedback_notes: notes
        })
      });
      alert('Survey response successfully submitted! Timeline milestone appended.');
      onSuccess();
      onClose();
    } catch (err) {
      alert(`Error submitting survey response: ${err}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSimulateEscalate = async () => {
    try {
      setIsSubmitting(true);
      await fetchApi(`/api/followups/escalate/${schedule.id}`, {
        method: 'POST'
      });
      alert('Trainee marked un-responsive. Auto-escalated to Assisted Follow-up Queue for Field Officer!');
      onSuccess();
      onClose();
    } catch (err) {
      alert(`Error escalating follow-up: ${err}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden my-6">
        {/* Header */}
        <div className="px-5 py-3.5 bg-gov-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Smartphone className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="text-sm font-bold tracking-tight">
                Simulated Follow-Up Engine (Milestone: {schedule.checkpoint})
              </h3>
              <p className="text-[11px] text-slate-300">
                Low-Burden Candidate Outreach: {schedule.trainee_name} ({schedule.trainee_code})
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-300 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* Step 1: Channel & Dispatch Simulation */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-800">1. Dispatch Automated Follow-Up</p>
                <p className="text-[11px] text-slate-500">
                  Select government delivery channel to simulate candidate mobile trigger:
                </p>
              </div>
              <div className="flex items-center gap-1.5 bg-white p-1 rounded-md border border-slate-200">
                {(['WhatsApp', 'SMS', 'IVR'] as const).map((ch) => (
                  <button
                    key={ch}
                    onClick={() => setChannel(ch)}
                    className={`px-2.5 py-1 text-xs font-semibold rounded ${
                      channel === ch ? 'bg-gov-700 text-white' : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {ch}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-200/80">
              <div className="text-[11px] text-slate-600">
                Recipient: <span className="font-semibold text-slate-800">{schedule.trainee_phone}</span>
                <span className="ml-2 text-slate-400">({schedule.course_name})</span>
              </div>
              <button
                onClick={handleSendTrigger}
                disabled={isSubmitting}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-emerald-700 hover:bg-emerald-800 text-white rounded transition shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{notificationSent ? 'Re-Send Trigger' : 'Send Follow-up'}</span>
              </button>
            </div>

            {/* Notification Preview Box */}
            <div className="mt-2.5 p-2.5 bg-emerald-50 border border-emerald-200 rounded text-xs text-emerald-950 font-mono flex items-start gap-2">
              <MessageSquare className="w-4 h-4 text-emerald-700 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-[11px] uppercase tracking-wider text-emerald-800">
                  Simulated {channel} Message to Candidate:
                </span>
                <p className="mt-0.5 text-[11px] font-sans">
                  "Namaskar {schedule.trainee_name}! Dept of Skills, Govt of Maharashtra wants to know how your career is progressing at your {schedule.checkpoint} milestone. Please answer 3 quick questions. Your feedback shapes Maharashtra skilling."
                </p>
              </div>
            </div>
          </div>

          {/* Step 2: Interactive Candidate Survey Response Form */}
          <div className="border border-slate-200 rounded-lg p-3.5">
            <p className="text-xs font-bold text-slate-800 mb-1">
              2. Candidate Interactive Survey (3 Simple Low-Burden Questions)
            </p>
            <p className="text-[11px] text-slate-500 mb-3">
              This simulates the candidate answering on WhatsApp or via assisted phone call.
            </p>

            <div className="space-y-3.5">
              {/* Q1: Are you currently employed? */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Q1: Are you currently employed, self-employed, or studying?
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'Wage Employment', label: 'Wage Job' },
                    { id: 'Self-Employed', label: 'Self-Employed' },
                    { id: 'Apprenticeship', label: 'Apprenticeship' },
                    { id: 'Unemployed', label: 'Seeking Work' }
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => {
                        setEmpType(opt.id);
                        setIsEmployed(opt.id !== 'Unemployed');
                      }}
                      className={`py-1.5 px-2 text-xs font-medium rounded-md border text-center transition ${
                        empType === opt.id
                          ? 'bg-gov-700 text-white border-gov-800 font-bold'
                          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Q2: Employer & Wage if employed */}
              {isEmployed ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Employer or Enterprise Name
                    </label>
                    <input
                      type="text"
                      value={employerName}
                      onChange={(e) => setEmployerName(e.target.value)}
                      className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded focus:ring-1 focus:ring-gov-600 outline-hidden"
                      placeholder="e.g. Tata Motors Ltd"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Job Role / Designation
                    </label>
                    <input
                      type="text"
                      value={jobRole}
                      onChange={(e) => setJobRole(e.target.value)}
                      className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded focus:ring-1 focus:ring-gov-600 outline-hidden"
                      placeholder="e.g. PLC Technician"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Monthly Take-Home / Revenue (₹)
                    </label>
                    <input
                      type="number"
                      value={monthlyWage}
                      onChange={(e) => setMonthlyWage(Number(e.target.value))}
                      className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded focus:ring-1 focus:ring-gov-600 outline-hidden"
                      placeholder="18000"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Q3: Training Relevance to Current Role (1 to 5)
                    </label>
                    <select
                      value={relevance}
                      onChange={(e) => setRelevance(Number(e.target.value))}
                      className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded focus:ring-1 focus:ring-gov-600 outline-hidden"
                    >
                      <option value={5}>5 - Directly Applicable (Daily use)</option>
                      <option value={4}>4 - Highly Relevant</option>
                      <option value={3}>3 - Partially Relevant</option>
                      <option value={2}>2 - Low Relevance</option>
                      <option value={1}>1 - Completely Unrelated</option>
                    </select>
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded text-xs text-amber-900">
                  <p className="font-semibold">Candidate seeking employment assistance</p>
                  <p className="text-[11px] text-amber-700 mt-0.5">
                    Will trigger notification to district employment guidance center.
                  </p>
                </div>
              )}

              {/* Assistance toggle */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <label className="flex items-center gap-2 text-xs text-slate-700 font-medium cursor-pointer">
                  <input
                    type="checkbox"
                    checked={needsCounselling}
                    onChange={(e) => setNeedsCounselling(e.target.checked)}
                    className="rounded border-slate-300 text-gov-700"
                  />
                  <span>Candidate requested 1-on-1 career counselling / guidance</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-5 py-3.5 bg-slate-100 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2">
          {/* Simulate Unresponsive Auto-Escalation */}
          <button
            type="button"
            onClick={handleSimulateEscalate}
            disabled={isSubmitting}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-amber-800 bg-amber-100 hover:bg-amber-200 border border-amber-300 rounded transition"
            title="Demonstrate auto-escalation when candidate doesn't reply within 3 days"
          >
            <Clock className="w-3.5 h-3.5 text-amber-700" />
            <span>Simulate Unresponsive → Escalate to Assisted Queue</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-200 rounded transition"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmitResponse}
              disabled={isSubmitting}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold text-white bg-gov-700 hover:bg-gov-800 rounded transition shadow-sm"
            >
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Submit Response & Append Timeline</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
