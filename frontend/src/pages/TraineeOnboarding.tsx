import React, { useState } from 'react';
import { UserPlus, ShieldCheck, CheckCircle2, ArrowLeft } from 'lucide-react';
import { fetchApi } from '../api/client';
import { useAuth } from '../context/AuthContext';

export const TraineeOnboarding: React.FC<{ onComplete: (newTraineeId: string) => void; onCancel: () => void }> = ({
  onComplete,
  onCancel
}) => {
  const { currentUser } = useAuth();

  // Form Fields
  const [fullName, setFullName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [gender, setGender] = useState<string>('Male');
  const [age, setAge] = useState<number>(22);
  const [category, setCategory] = useState<string>('OBC');
  const [district, setDistrict] = useState<string>('Pune');
  const [educationLevel, setEducationLevel] = useState<string>('12th Pass');
  const [courseId, setCourseId] = useState<string>('crs-auto-01');
  const [providerId, setProviderId] = useState<string>('prv-pune-01');
  const [attendance, setAttendance] = useState<number>(88.0);
  const [score, setScore] = useState<number>(78.0);
  const [certStatus, setCertStatus] = useState<string>('In Training');

  // Explicit Digital Consent State
  const [consentGiven, setConsentGiven] = useState<boolean>(true);
  const [allowTracking, setAllowTracking] = useState<boolean>(true);
  const [allowEpfo, setAllowEpfo] = useState<boolean>(true);
  const [allowAssisted, setAllowAssisted] = useState<boolean>(true);
  const [consentVersion] = useState<string>('v1.2-2024-MH-SDED');
  const [purposeText] = useState<string>(
    'I hereby grant explicit digital consent to Dept of Skills, Govt of Maharashtra, to track post-training employability outcomes, verify employment records via employer portal, and facilitate assisted career progression services under SkillTrackAI.'
  );

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone) {
      alert('Please fill in candidate full name and mobile number.');
      return;
    }
    if (!consentGiven) {
      alert('Explicit digital consent is legally required under DPDP Act 2023 for post-training tracking.');
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = {
        full_name: fullName,
        primary_phone: phone,
        primary_email: email || undefined,
        gender,
        age: Number(age),
        category,
        district,
        education_level: educationLevel,
        course_id: courseId,
        provider_id: providerId,
        enrolment_date: new Date().toISOString().slice(0, 10),
        completion_date: '2025-06-30',
        attendance_percentage: Number(attendance),
        assessment_score: Number(score),
        certification_status: certStatus,
        skills_tagged: ['Industrial Safety', 'Wiring Diagnostics'],
        consent: {
          consent_given: consentGiven,
          consent_version: consentVersion,
          purpose_of_use_text: purposeText,
          allow_placement_tracking: allowTracking,
          allow_epfo_linking: allowEpfo,
          allow_assisted_followup: allowAssisted
        }
      };

      const uName = currentUser?.name || 'Onboarding Officer';
      const uRole = currentUser?.role || 'provider';
      const res = await fetchApi<{ success: boolean; trainee_id: string; trainee_code: string }>(
        `/api/trainees?user_name=${encodeURIComponent(uName)}&user_role=${uRole}`,
        {
          method: 'POST',
          body: JSON.stringify(payload)
        }
      );

      alert(`Trainee registered successfully! Persistent Code: ${res.trainee_code}`);
      onComplete(res.trainee_id);
    } catch (err) {
      alert(`Registration error: ${err}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={onCancel}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded shadow-xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Cancel & Return</span>
        </button>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
        {/* Header */}
        <div className="p-6 bg-gov-900 text-white">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <UserPlus className="w-4 h-4" />
            <span>Candidate Registration & DPDP Consent Intake</span>
          </div>
          <h1 className="text-xl font-black mt-1">Enroll New Candidate in SkillTrackAI</h1>
          <p className="text-xs text-slate-300 mt-0.5">
            Initializes persistent Trainee UUID and records legally binding digital consent with immutable audit trail.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Section 1: Personal & Demographic Info */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-gov-800 pb-1 border-b border-slate-200">
              1. Candidate Demographics (For Equity Analytics)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Rohini Ramesh Shinde"
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded focus:ring-1 focus:ring-gov-600 outline-hidden"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Primary Mobile Number *</label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98220 99881"
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded focus:ring-1 focus:ring-gov-600 outline-hidden"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Email Address (Optional)</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="rohini.s@example.com"
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded focus:ring-1 focus:ring-gov-600 outline-hidden"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Gender</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded focus:ring-1 focus:ring-gov-600 outline-hidden"
                >
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Transgender">Transgender</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Age</label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded focus:ring-1 focus:ring-gov-600 outline-hidden"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Social Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded focus:ring-1 focus:ring-gov-600 outline-hidden"
                >
                  <option value="OBC">OBC</option>
                  <option value="SC">SC</option>
                  <option value="ST">ST</option>
                  <option value="General">General</option>
                  <option value="EWS">EWS</option>
                  <option value="VJNT">VJNT</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">District</label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded focus:ring-1 focus:ring-gov-600 outline-hidden"
                >
                  <option value="Pune">Pune</option>
                  <option value="Nagpur">Nagpur</option>
                  <option value="Nashik">Nashik</option>
                  <option value="Mumbai Suburban">Mumbai Suburban</option>
                  <option value="Chhatrapati Sambhajinagar">Chhatrapati Sambhajinagar</option>
                  <option value="Amravati">Amravati</option>
                  <option value="Solapur">Solapur</option>
                  <option value="Kolhapur">Kolhapur</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Prior Education Level</label>
                <select
                  value={educationLevel}
                  onChange={(e) => setEducationLevel(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded focus:ring-1 focus:ring-gov-600 outline-hidden"
                >
                  <option value="10th Pass">10th Pass</option>
                  <option value="12th Pass">12th Pass</option>
                  <option value="ITI / Diploma">ITI / Diploma</option>
                  <option value="Graduate">Graduate</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Status</label>
                <select
                  value={certStatus}
                  onChange={(e) => setCertStatus(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded focus:ring-1 focus:ring-gov-600 outline-hidden"
                >
                  <option value="In Training">In Training</option>
                  <option value="Certified">Certified</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Course & Provider Selection */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-gov-800 pb-1 border-b border-slate-200">
              2. Training Center & Specialization
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Enrolled Course *</label>
                <select
                  value={courseId}
                  onChange={(e) => setCourseId(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded focus:ring-1 focus:ring-gov-600 outline-hidden"
                >
                  <option value="crs-auto-01">EV Battery & Drivetrain Assembly (Automotive & EV)</option>
                  <option value="crs-elec-02">Industrial Automation & PLC Technician (Electronics)</option>
                  <option value="crs-it-03">Full Stack Cloud Application Support (IT & BPM)</option>
                  <option value="crs-hlth-04">Healthcare Assistant & Dialysis Support (Healthcare)</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Training Provider *</label>
                <select
                  value={providerId}
                  onChange={(e) => setProviderId(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded focus:ring-1 focus:ring-gov-600 outline-hidden"
                >
                  <option value="prv-pune-01">MSSDS Central Skilling Hub (Pune)</option>
                  <option value="prv-nagpur-02">Tata STRIVE Skill Development Center (Nagpur)</option>
                  <option value="prv-nashik-03">Don Bosco Technical Institute (Nashik)</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Attendance Percentage (%)</label>
                <input
                  type="number"
                  step="0.5"
                  value={attendance}
                  onChange={(e) => setAttendance(Number(e.target.value))}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Mock Assessment Score (out of 100)</label>
                <input
                  type="number"
                  step="1"
                  value={score}
                  onChange={(e) => setScore(Number(e.target.value))}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded"
                />
              </div>
            </div>
          </div>

          {/* Section 3: EXPLICIT DIGITAL CONSENT CAPTURE (AUDITABLE IN DB) */}
          <div className="p-4 bg-slate-50 border border-slate-300 rounded-lg space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-700" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  3. Explicit Digital Consent Capture (Mandatory under DPDP Act 2023)
                </h3>
              </div>
              <span className="text-[10px] font-mono text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                {consentVersion}
              </span>
            </div>

            <div className="p-3 bg-white border border-slate-200 rounded text-xs text-slate-700 leading-relaxed font-mono">
              "{purposeText}"
            </div>

            <div className="space-y-2 pt-1 text-xs">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={consentGiven}
                  onChange={(e) => setConsentGiven(e.target.checked)}
                  className="mt-0.5 rounded text-gov-700 border-slate-300"
                />
                <span className="font-semibold text-slate-900">
                  Candidate has read and granted explicit informed consent for longitudinal employment outcome tracking.
                </span>
              </label>

              <label className="flex items-start gap-2.5 cursor-pointer ml-5">
                <input
                  type="checkbox"
                  checked={allowEpfo}
                  onChange={(e) => setAllowEpfo(e.target.checked)}
                  className="mt-0.5 rounded text-gov-700 border-slate-300"
                />
                <span className="text-slate-600">
                  Authorize EPFO / Shram Suvidha database validation for automated wage confirmation.
                </span>
              </label>

              <label className="flex items-start gap-2.5 cursor-pointer ml-5">
                <input
                  type="checkbox"
                  checked={allowAssisted}
                  onChange={(e) => setAllowAssisted(e.target.checked)}
                  className="mt-0.5 rounded text-gov-700 border-slate-300"
                />
                <span className="text-slate-600">
                  Authorize district field officer assisted outreach if automated digital surveys are unreachable.
                </span>
              </label>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-gov-700 hover:bg-gov-800 rounded transition shadow-sm"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isSubmitting ? 'Registering...' : 'Save & Capture Auditable Consent'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
