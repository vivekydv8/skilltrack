import React, { useState, useEffect } from 'react';
import { AlertOctagon, AlertTriangle, CheckCircle2, Cpu, Sliders, ArrowRight, ShieldAlert } from 'lucide-react';
import { fetchApi } from '../api/client';
import { RiskBadge } from '../components/RiskBadge';

interface WatchlistItem {
  trainee_id: string;
  trainee_code: string;
  full_name: string;
  course_name: string;
  provider_name: string;
  district: string;
  attendance_percentage: number;
  assessment_score: number;
  certification_status: string;
  current_status: string;
  risk_score: number;
  risk_level: 'Low' | 'Medium' | 'High';
  risk_factors: string[];
  recommended_interventions: string[];
}

export const RiskPredictionPage: React.FC = () => {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [filterLevel, setFilterLevel] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Interactive Live Simulator State
  const [simAttendance, setSimAttendance] = useState<number>(64);
  const [simScore, setSimScore] = useState<number>(52);
  const [simAge, setSimAge] = useState<number>(23);
  const [simGender, setSimGender] = useState<string>('Male');
  const [simCategory, setSimCategory] = useState<string>('SC');
  const [simCourse, setSimCourse] = useState<string>('Industrial Automation & PLC Technician');
  const [simDistrict, setSimDistrict] = useState<string>('Amravati');

  const [simResult, setSimResult] = useState<{
    risk_score: number;
    risk_level: 'Low' | 'Medium' | 'High';
    risk_factors: string[];
    recommended_interventions: string[];
  } | null>(null);

  const loadWatchlist = async () => {
    try {
      setIsLoading(true);
      const url = filterLevel ? `/api/risk/in-training-watchlist?risk_level=${filterLevel}` : '/api/risk/in-training-watchlist';
      const data = await fetchApi<WatchlistItem[]>(url);
      setWatchlist(data);
    } catch (err) {
      console.error('Failed to load risk watchlist', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadWatchlist();
  }, [filterLevel]);

  // Live simulator on parameter change
  const runLiveSimulation = async () => {
    try {
      const res = await fetchApi<any>('/api/risk/predict', {
        method: 'POST',
        body: JSON.stringify({
          attendance_percentage: Number(simAttendance),
          assessment_score: Number(simScore),
          age: Number(simAge),
          gender: simGender,
          category: simCategory,
          course_name: simCourse,
          district: simDistrict,
          education_level: '12th Pass'
        })
      });
      setSimResult(res);
    } catch (err) {
      console.error('Simulation error', err);
    }
  };

  useEffect(() => {
    runLiveSimulation();
  }, [simAttendance, simScore, simAge, simGender, simCategory, simCourse, simDistrict]);

  const handleLogIntervention = async (traineeId: string, intervention: string) => {
    try {
      await fetchApi(`/api/risk/intervene/${traineeId}?intervention_type=${encodeURIComponent(intervention)}`, {
        method: 'POST'
      });
      alert(`Intervention "${intervention}" logged in trainee record and audit trail.`);
      loadWatchlist();
    } catch (err) {
      alert(`Error logging intervention: ${err}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-rose-100 text-rose-800 rounded">
              Predictive Early Warning
            </span>
            <span className="text-xs text-slate-400">• Scikit-Learn Logistic Regression + Heuristics</span>
          </div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight mt-1">
            In-Training Non-Placement Risk Prediction
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Flagging high-risk trainees proactively DURING training, not just post-mortem — allowing center heads to intervene before dropout
          </p>
        </div>
      </div>

      {/* Interactive Live ML Risk Simulator (Judge Demo Feature) */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-amber-400" />
            <h2 className="text-sm font-bold tracking-tight">
              Interactive ML Risk Simulator (Live Inference Sandbox)
            </h2>
          </div>
          <span className="text-[10px] text-amber-400 font-mono bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
            Real-time Scikit-Learn Inference
          </span>
        </div>

        <div className="p-5 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sliders & Inputs */}
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-semibold text-slate-700">Attendance Percentage</span>
                <span className={`font-bold ${simAttendance < 75 ? 'text-rose-600' : 'text-emerald-700'}`}>
                  {simAttendance}% {simAttendance < 75 ? '(Below 75% Deficit)' : ''}
                </span>
              </div>
              <input
                type="range"
                min="40"
                max="100"
                value={simAttendance}
                onChange={(e) => setSimAttendance(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-gov-700"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-semibold text-slate-700">Mock Assessment Score</span>
                <span className={`font-bold ${simScore < 60 ? 'text-rose-600' : 'text-emerald-700'}`}>
                  {simScore} / 100 {simScore < 60 ? '(Proficiency Lag)' : ''}
                </span>
              </div>
              <input
                type="range"
                min="30"
                max="100"
                value={simScore}
                onChange={(e) => setSimScore(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-gov-700"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Course Rigor</label>
                <select
                  value={simCourse}
                  onChange={(e) => setSimCourse(e.target.value)}
                  className="w-full px-2 py-1.5 border border-slate-300 rounded"
                >
                  <option value="Industrial Automation & PLC Technician">PLC Technician (Tech Rigor)</option>
                  <option value="EV Battery & Drivetrain Assembly">EV Battery Assembly (Tech)</option>
                  <option value="Full Stack Cloud Application Support">Cloud Support (IT Rigor)</option>
                  <option value="Healthcare Assistant & Dialysis Support">Healthcare Assistant</option>
                </select>
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">District / Tier</label>
                <select
                  value={simDistrict}
                  onChange={(e) => setSimDistrict(e.target.value)}
                  className="w-full px-2 py-1.5 border border-slate-300 rounded"
                >
                  <option value="Pune">Pune (Industrial Belt)</option>
                  <option value="Amravati">Amravati (Aspirational)</option>
                  <option value="Nagpur">Nagpur (Logistics Belt)</option>
                  <option value="Nashik">Nashik</option>
                </select>
              </div>
            </div>
          </div>

          {/* Model Output & Recommended Actions */}
          {simResult && (
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Model Predicted Risk:
                  </span>
                  <RiskBadge level={simResult.risk_level} score={simResult.risk_score} />
                </div>

                {/* Progress bar */}
                <div className="mt-2 w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      simResult.risk_level === 'High'
                        ? 'bg-rose-600'
                        : simResult.risk_level === 'Medium'
                        ? 'bg-amber-500'
                        : 'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.round(simResult.risk_score * 100)}%` }}
                  ></div>
                </div>

                <div className="mt-3">
                  <p className="text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Explainable AI Drivers:
                  </p>
                  <ul className="space-y-1">
                    {simResult.risk_factors.map((f, idx) => (
                      <li key={idx} className="text-xs text-slate-600 flex items-start gap-1">
                        <span className="text-rose-500 font-bold">•</span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200">
                <p className="text-[11px] font-bold text-gov-800 uppercase mb-1">
                  Proactive Center Interventions:
                </p>
                <div className="space-y-1">
                  {simResult.recommended_interventions.map((intv, idx) => (
                    <div key={idx} className="p-1.5 bg-white border border-slate-200 rounded text-xs text-slate-700 flex items-center justify-between">
                      <span>✓ {intv}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* In-Training Active Watchlist Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Active In-Training Candidate Watchlist
            </h2>
            <p className="text-[11px] text-slate-500">
              Candidates currently enrolled flagged for immediate center head and counsellor interventions
            </p>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={filterLevel}
              onChange={(e) => setFilterLevel(e.target.value)}
              className="text-xs px-2.5 py-1.5 border border-slate-300 rounded bg-white"
            >
              <option value="">All Risk Tiers</option>
              <option value="High">High Risk Only</option>
              <option value="Medium">Medium Risk</option>
              <option value="Low">Low Risk</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Trainee Code & Name</th>
                <th className="py-3 px-4">Course & Provider</th>
                <th className="py-3 px-4 text-center">Attendance / Score</th>
                <th className="py-3 px-4 text-center">Risk Score</th>
                <th className="py-3 px-4">Primary Contributing Factor</th>
                <th className="py-3 px-4 text-center">Intervene Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {watchlist.map((w) => (
                <tr key={w.trainee_id} className="hover:bg-slate-50 transition">
                  <td className="py-3 px-4">
                    <p className="font-bold text-slate-900">{w.full_name}</p>
                    <p className="font-mono text-[10px] text-slate-500">{w.trainee_code}</p>
                  </td>
                  <td className="py-3 px-4">
                    <p className="font-semibold text-slate-800">{w.course_name}</p>
                    <p className="text-[11px] text-slate-500">{w.provider_name}</p>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={`font-bold ${w.attendance_percentage < 75 ? 'text-rose-600' : 'text-slate-800'}`}>
                      {w.attendance_percentage}%
                    </span>
                    <span className="text-slate-400 block text-[10px]">{w.assessment_score}/100</span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <RiskBadge level={w.risk_level} score={w.risk_score} />
                  </td>
                  <td className="py-3 px-4 text-xs">
                    <p className="text-slate-700 font-medium">
                      {w.risk_factors[0] || 'Nominal profile'}
                    </p>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => handleLogIntervention(w.trainee_id, w.recommended_interventions[0] || 'Peer Mentoring Assigned')}
                      className="px-2.5 py-1 text-xs font-semibold bg-gov-700 hover:bg-gov-800 text-white rounded transition shadow-xs"
                    >
                      Assign Peer Mentor
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
