import React, { useState } from 'react';
import {
  X,
  Briefcase,
  Layers,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Plus,
  Trash2,
  Building,
  DollarSign,
  MapPin,
  HelpCircle,
} from 'lucide-react';
import { toast } from '../Toast';

export interface JobCreationData {
  title: string;
  industry: string;
  location: string;
  vacancies: number;
  salaryMin: number;
  salaryMax: number;
  experience: string;
  education: string;
  description: string;
  requiredSkills: string[];
}

export interface JobCreationWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveJob: (data: JobCreationData) => Promise<void> | void;
  availableSkills?: string[];
}

export const JobCreationWizardModal: React.FC<JobCreationWizardModalProps> = ({
  isOpen,
  onClose,
  onSaveJob,
  availableSkills = [
    'EV Diagnostics',
    'Battery Management',
    'CAN Diagnostics',
    'High Voltage Safety',
    'Electrical Diagnostics',
    'Vehicle Systems',
    'Wiring Harness Assembly',
    'Siemens PLC',
    'Industrial IoT',
  ],
}) => {
  const [step, setStep] = useState<number>(1);
  const [title, setTitle] = useState('EV Diagnostic Technician');
  const [industry, setIndustry] = useState('Automotive & EV');
  const [location, setLocation] = useState('Pune (Chakan Manufacturing Plant)');
  const [vacancies, setVacancies] = useState(15);
  const [salaryMin, setSalaryMin] = useState(24000);
  const [salaryMax, setSalaryMax] = useState(32000);
  const [experience, setExperience] = useState('0 - 2 Years (ITI / Fresher)');
  const [education, setEducation] = useState('ITI Electrician / Mechanic Motor Vehicle / SCVT');
  const [description, setDescription] = useState(
    'Seeking passionate technician skilled in EV battery diagnostics, high voltage electrical testing, and CAN bus harness verification for modern electric buses and passenger cars.'
  );
  const [selectedSkills, setSelectedSkills] = useState<string[]>([
    'EV Diagnostics',
    'Battery Management',
    'High Voltage Safety',
  ]);
  const [customSkill, setCustomSkill] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  // AI Skill Extraction Simulation
  const handleExtractSkills = () => {
    setIsExtracting(true);
    setTimeout(() => {
      const detected = ['EV Diagnostics', 'High Voltage Safety', 'Battery Management', 'CAN Diagnostics'];
      const merged = Array.from(new Set([...selectedSkills, ...detected]));
      setSelectedSkills(merged);
      setIsExtracting(false);
      toast.success('AI Skill Extraction Complete', 'Extracted 4 high-match competencies from job description.');
    }, 600);
  };

  const handleToggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const handleAddCustomSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (customSkill.trim() && !selectedSkills.includes(customSkill.trim())) {
      setSelectedSkills([...selectedSkills, customSkill.trim()]);
      setCustomSkill('');
    }
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      await onSaveJob({
        title,
        industry,
        location,
        vacancies,
        salaryMin,
        salaryMax,
        experience,
        education,
        description,
        requiredSkills: selectedSkills,
      });
      toast.success('Job Published Successfully', `${title} with ${vacancies} openings is now live on SkillTrackAI.`);
      onClose();
    } catch (err) {
      toast.error('Submission Failed', 'Could not publish job.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const STEPS = [
    { num: 1, label: 'Job Details' },
    { num: 2, label: 'Requirements' },
    { num: 3, label: 'Skills & AI' },
    { num: 4, label: 'Eligibility' },
    { num: 5, label: 'Publish' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-depth-floating w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Post New Industry Opening</h3>
              <p className="text-xs text-slate-500">SkillTrackAI Intelligent Candidate Matching Engine</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Stepper Progress Bar */}
        <div className="px-6 py-3 bg-white border-b border-slate-100 flex items-center justify-between">
          {STEPS.map((s) => (
            <div key={s.num} className="flex items-center gap-2">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  step === s.num
                    ? 'bg-teal-600 text-white ring-2 ring-teal-200'
                    : step > s.num
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 text-slate-400'
                }`}
              >
                {step > s.num ? '✓' : s.num}
              </div>
              <span
                className={`text-xs hidden sm:inline ${
                  step === s.num ? 'font-bold text-slate-900' : 'text-slate-400'
                }`}
              >
                {s.label}
              </span>
            </div>
          ))}
        </div>

        {/* Wizard Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide block mb-1">
                  Job Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full st-input px-3.5 py-2.5 text-sm"
                  placeholder="e.g. EV Diagnostic Technician"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wide block mb-1">
                    Industry Sector
                  </label>
                  <input
                    type="text"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    className="w-full st-input px-3.5 py-2.5 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wide block mb-1">
                    Open Vacancies
                  </label>
                  <input
                    type="number"
                    value={vacancies}
                    onChange={(e) => setVacancies(Number(e.target.value))}
                    className="w-full st-input px-3.5 py-2.5 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide block mb-1">
                  Plant / Office Location (District)
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full st-input px-3.5 py-2.5 text-sm"
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wide block mb-1">
                    Min Monthly Salary (₹)
                  </label>
                  <input
                    type="number"
                    value={salaryMin}
                    onChange={(e) => setSalaryMin(Number(e.target.value))}
                    className="w-full st-input px-3.5 py-2.5 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wide block mb-1">
                    Max Monthly Salary (₹)
                  </label>
                  <input
                    type="number"
                    value={salaryMax}
                    onChange={(e) => setSalaryMax(Number(e.target.value))}
                    className="w-full st-input px-3.5 py-2.5 text-sm"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                    Job Description
                  </label>
                  <button
                    type="button"
                    onClick={handleExtractSkills}
                    disabled={isExtracting}
                    className="inline-flex items-center gap-1 text-xs font-bold text-teal-700 hover:text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200"
                  >
                    <Sparkles className="w-3 h-3 text-teal-600 animate-pulse" />
                    <span>{isExtracting ? 'Extracting...' : 'AI Extract Skills'}</span>
                  </button>
                </div>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full st-input px-3.5 py-2.5 text-sm"
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Required Skills & Competencies</h4>
                  <p className="text-xs text-slate-500">Skills are used by the AI engine to rank candidate profiles</p>
                </div>
                <button
                  type="button"
                  onClick={handleExtractSkills}
                  disabled={isExtracting}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-600 text-white text-xs font-bold shadow-sm hover:bg-teal-700 transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isExtracting ? 'Analyzing...' : 'AI Re-Scan Description'}</span>
                </button>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-xs font-bold text-slate-700 block mb-2">Selected Skills ({selectedSkills.length})</span>
                <div className="flex flex-wrap gap-2">
                  {selectedSkills.map((sk) => (
                    <span
                      key={sk}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-teal-50 text-teal-900 border border-teal-200 text-xs font-bold"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                      {sk}
                      <button
                        type="button"
                        onClick={() => handleToggleSkill(sk)}
                        className="text-teal-400 hover:text-teal-800 ml-1"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-xs font-bold text-slate-700 block mb-2">Add From Common Industry Library</span>
                <div className="flex flex-wrap gap-1.5">
                  {availableSkills.map((sk) => {
                    const isSelected = selectedSkills.includes(sk);
                    return (
                      <button
                        key={sk}
                        type="button"
                        onClick={() => handleToggleSkill(sk)}
                        className={`text-xs px-2.5 py-1 rounded-md border font-medium transition-all ${
                          isSelected
                            ? 'bg-teal-600 text-white border-teal-700'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        {isSelected ? '✓ ' : '+ '}
                        {sk}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide block mb-1">
                  Required Education / Trade Certification
                </label>
                <input
                  type="text"
                  value={education}
                  onChange={(e) => setEducation(e.target.value)}
                  className="w-full st-input px-3.5 py-2.5 text-sm"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide block mb-1">
                  Experience Requirement
                </label>
                <input
                  type="text"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  className="w-full st-input px-3.5 py-2.5 text-sm"
                />
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-4">
              <div className="p-4 bg-teal-50/70 border border-teal-200 rounded-2xl">
                <span className="text-xs font-bold text-teal-800 uppercase tracking-wide block mb-1">
                  Ready to Publish to Maharashtra Trainee Network
                </span>
                <h4 className="text-base font-extrabold text-slate-900">{title}</h4>
                <p className="text-xs text-slate-600 mt-1">
                  {location} • {vacancies} Openings • ₹{salaryMin.toLocaleString()} - ₹{salaryMax.toLocaleString()}
                </p>

                <div className="mt-3 pt-3 border-t border-teal-200/80 flex flex-wrap gap-1.5">
                  {selectedSkills.map((sk) => (
                    <span
                      key={sk}
                      className="px-2 py-0.5 rounded bg-white text-teal-900 border border-teal-200 text-[11px] font-semibold"
                    >
                      {sk}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/70">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="st-btn st-btn-secondary px-4 py-2 text-xs font-bold gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {step < 5 ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              className="st-btn st-btn-primary px-5 py-2 text-xs font-bold gap-1.5"
            >
              <span>Next</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="st-btn st-btn-primary px-6 py-2 text-xs font-bold gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isSubmitting ? 'Publishing...' : 'Publish Vacancy'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
