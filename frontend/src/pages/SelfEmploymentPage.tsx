import React, { useState } from 'react';
import { Briefcase, Building, Users, TrendingUp, CheckCircle, ShieldCheck } from 'lucide-react';
import { fetchApi } from '../api/client';
import { useAuth } from '../context/AuthContext';

export const SelfEmploymentPage: React.FC = () => {
  const { currentUser } = useAuth();

  // Intake Form State
  const [traineeId, setTraineeId] = useState<string>('trn-mh-2024-0007');
  const [businessName, setBusinessName] = useState<string>('Omkar EV & Electrical Works');
  const [businessType, setBusinessType] = useState<string>('Fabrication/Repair');
  const [regType, setRegType] = useState<string>('Udyam Registered');
  const [regNumber, setRegNumber] = useState<string>('UDYAM-MH-26-0034182');
  const [revenueBand, setRevenueBand] = useState<string>('₹30,000 - ₹50,000');
  const [peopleEmployed, setPeopleEmployed] = useState<number>(3);
  const [seedSource, setSeedSource] = useState<string>('MUDRA Loan');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const uName = currentUser?.name || 'Field Officer';
      const uRole = currentUser?.role || 'field_officer';
      await fetchApi(
        `/api/placements/self-employment?user_name=${encodeURIComponent(uName)}&user_role=${uRole}`,
        {
          method: 'POST',
          body: JSON.stringify({
            trainee_id: traineeId,
            business_name: businessName,
            business_type: businessType,
            registration_type: regType,
            registration_number: regNumber,
            monthly_revenue_band: revenueBand,
            people_employed: Number(peopleEmployed),
            seed_capital_source: seedSource
          })
        }
      );
      alert(`Self-employment & multiplier impact recorded successfully!`);
    } catch (err) {
      alert(`Error submitting self-employment record: ${err}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-gov-100 text-gov-800 rounded">
              Livelihood & Entrepreneurship Tracker
            </span>
            <span className="text-xs text-slate-400">• Multiplier Effect Measurement</span>
          </div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight mt-1">
            Self-Employment & Apprenticeship Outcomes
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Beyond wage jobs: capturing micro-enterprises, Udyam registration, revenue tiers, and downstream jobs created
          </p>
        </div>
      </div>

      {/* Multiplier Effect Impact Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs border-l-4 border-l-gov-700">
          <p className="text-xs text-slate-500 font-semibold uppercase">Micro-Enterprises Tracked</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">13 Enterprises</p>
          <p className="text-[11px] text-gov-800 font-medium mt-0.5">85% Udyam / GST Verified</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs border-l-4 border-l-emerald-600">
          <p className="text-xs text-slate-500 font-semibold uppercase">Downstream Jobs Multiplier</p>
          <p className="text-2xl font-bold text-emerald-800 mt-1">+28 Local Jobs</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Additional youth employed by trainee entrepreneurs</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs border-l-4 border-l-purple-600">
          <p className="text-xs text-slate-500 font-semibold uppercase">NAPS Apprenticeships</p>
          <p className="text-2xl font-bold text-purple-900 mt-1">7 Active Contracts</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Avg Stipend: ₹12,500/month</p>
        </div>
      </div>

      {/* Structured Intake Form */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden max-w-3xl">
        <div className="p-5 bg-slate-900 text-white">
          <h2 className="text-sm font-bold tracking-tight">
            Structured Self-Employment & Enterprise Intake Form
          </h2>
          <p className="text-xs text-slate-300 mt-0.5">
            Logs enterprise scale, official registration, and job creation multiplier metrics directly into the longitudinal log.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Trainee Record</label>
              <select
                value={traineeId}
                onChange={(e) => setTraineeId(e.target.value)}
                className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded"
              >
                <option value="trn-mh-2024-0007">Aniket Gaikwad (MH-TRN-2024-0007)</option>
                <option value="trn-mh-2024-0014">Sneha Kamble (MH-TRN-2024-0014)</option>
                <option value="trn-mh-2024-0021">Kiran Pawar (MH-TRN-2024-0021)</option>
                <option value="trn-mh-2024-0028">Swapnil Bhosale (MH-TRN-2024-0028)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Business / Enterprise Name</label>
              <input
                type="text"
                required
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Business Domain / Type</label>
              <select
                value={businessType}
                onChange={(e) => setBusinessType(e.target.value)}
                className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded"
              >
                <option value="Fabrication/Repair">Fabrication & EV Repair Workshop</option>
                <option value="Electrical Contractor">Electrical & PLC Contracting</option>
                <option value="Retail/Shop">Electronics Retail & Service Store</option>
                <option value="Freelance IT">Cloud Support & IT Freelancing</option>
                <option value="NAPS National Apprenticeship">NAPS National Apprenticeship</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Registration Status</label>
              <select
                value={regType}
                onChange={(e) => setRegType(e.target.value)}
                className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded"
              >
                <option value="Udyam Registered">Udyam Registered (MSME)</option>
                <option value="GST Registered">GST Registered</option>
                <option value="Trade License">Gram Panchayat / Municipal Trade License</option>
                <option value="Informal">Informal / In-Progress</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Udyam / Registration Number</label>
              <input
                type="text"
                value={regNumber}
                onChange={(e) => setRegNumber(e.target.value)}
                placeholder="UDYAM-MH-..."
                className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Monthly Revenue Band</label>
              <select
                value={revenueBand}
                onChange={(e) => setRevenueBand(e.target.value)}
                className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded"
              >
                <option value="Below ₹15,000">Below ₹15,000</option>
                <option value="₹15,000 - ₹30,000">₹15,000 - ₹30,000</option>
                <option value="₹30,000 - ₹50,000">₹30,000 - ₹50,000</option>
                <option value="Above ₹50,000">Above ₹50,000</option>
              </select>
            </div>

            <div className="bg-amber-50 p-2.5 rounded border border-amber-200">
              <label className="text-xs font-bold text-amber-900 block mb-1">
                ⭐ Multiplier Effect: People Employed by Trainee
              </label>
              <input
                type="number"
                min="0"
                value={peopleEmployed}
                onChange={(e) => setPeopleEmployed(Number(e.target.value))}
                className="w-full text-xs px-2.5 py-1.5 border border-amber-300 rounded bg-white font-bold"
              />
              <p className="text-[10px] text-amber-800 mt-1">
                Direct jobs created for other local youth by this enterprise
              </p>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Seed Capital Support</label>
              <select
                value={seedSource}
                onChange={(e) => setSeedSource(e.target.value)}
                className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded"
              >
                <option value="MUDRA Loan">Pradhan Mantri MUDRA Yojana (PMMY)</option>
                <option value="CMEGP Scheme">Chief Minister Employment Generation Scheme (CMEGP)</option>
                <option value="Self/Family Savings">Self / Family Savings</option>
                <option value="Bank Loan">Commercial Bank Credit</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-3 border-t border-slate-200">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-gov-700 hover:bg-gov-800 rounded transition"
            >
              <CheckCircle className="w-4 h-4" />
              <span>{isSubmitting ? 'Logging...' : 'Save Self-Employment Record'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
