import React from 'react';
import { X, Printer, Download, FileSpreadsheet, CheckCircle2 } from 'lucide-react';
import { ExecutiveSummary, ProviderLeaderboardItem } from '../types';

interface ExportReportModalProps {
  summary: ExecutiveSummary | null;
  leaderboard: ProviderLeaderboardItem[];
  onClose: () => void;
}

export const ExportReportModal: React.FC<ExportReportModalProps> = ({
  summary,
  leaderboard,
  onClose
}) => {
  const handlePrint = () => {
    window.print();
  };

  const handleDownloadCsv = () => {
    if (!leaderboard.length) return;
    const headers = ['Provider Name', 'District', 'Grade', 'Enrolled', 'Placement Rate %', 'Avg Wage (₹)', 'Wage Growth %', 'Retention Rate %', 'Followup Compliance %'];
    const rows = leaderboard.map(l => [
      `"${l.provider_name}"`,
      `"${l.district}"`,
      `"${l.grade}"`,
      l.total_candidates,
      `${l.placement_rate_pct}%`,
      l.avg_starting_wage,
      `${l.wage_growth_pct}%`,
      `${l.retention_rate_pct}%`,
      `${l.followup_compliance_pct}%`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SkillTrackAI_Policy_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full border border-slate-200 overflow-hidden my-6">
        {/* Header */}
        <div className="px-6 py-4 bg-gov-900 text-white flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold tracking-tight">Executive Policy Summary & Report Export</h3>
            <p className="text-xs text-slate-300">
              Govt of Maharashtra • Dept of Skills, Employment, Entrepreneurship & Innovation
            </p>
          </div>
          <button onClick={onClose} className="text-slate-300 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Content */}
        <div className="p-6 space-y-5" id="printable-policy-report">
          <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-gov-800 bg-gov-100 px-2 py-0.5 rounded">
                Official Government Report
              </span>
              <h4 className="text-lg font-bold text-slate-900 mt-1">
                State Skilling Outcomes & Longitudinal Employability Review
              </h4>
              <p className="text-xs text-slate-500">
                Generated On: {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>

          {/* KPI Summary Block */}
          {summary && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-lg border border-slate-200">
              <div>
                <p className="text-[11px] font-semibold text-slate-500">Total Enrolled</p>
                <p className="text-xl font-bold text-slate-900">{summary.total_enrolled}</p>
              </div>
              <div>
                <p className="text-[11px] font-semibold text-slate-500">Certified Candidates</p>
                <p className="text-xl font-bold text-emerald-800">{summary.certified}</p>
              </div>
              <div>
                <p className="text-[11px] font-semibold text-slate-500">Employability Rate</p>
                <p className="text-xl font-bold text-gov-800">{summary.employability_rate_pct}%</p>
              </div>
              <div>
                <p className="text-[11px] font-semibold text-slate-500">Avg Starting Wage</p>
                <p className="text-xl font-bold text-slate-900">₹{summary.avg_starting_wage.toLocaleString('en-IN')}</p>
              </div>
            </div>
          )}

          {/* Provider Performance Table */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Accredited Provider Accountability Rankings
            </h5>
            <div className="border border-slate-200 rounded-md overflow-hidden">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="p-2">Provider Name</th>
                    <th className="p-2">District</th>
                    <th className="p-2 text-right">Placement %</th>
                    <th className="p-2 text-right">Avg Wage</th>
                    <th className="p-2 text-right">6m Wage Growth</th>
                    <th className="p-2 text-right">Retention</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {leaderboard.map((item) => (
                    <tr key={item.provider_id}>
                      <td className="p-2 font-medium">{item.provider_name}</td>
                      <td className="p-2">{item.district}</td>
                      <td className="p-2 text-right font-bold text-emerald-700">{item.placement_rate_pct}%</td>
                      <td className="p-2 text-right">₹{item.avg_starting_wage.toLocaleString('en-IN')}</td>
                      <td className="p-2 text-right font-medium text-gov-700">+{item.wage_growth_pct}%</td>
                      <td className="p-2 text-right">{item.retention_rate_pct}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="p-3 bg-amber-50 border border-amber-200 rounded text-xs text-amber-900 flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
            <p>
              Verified via SkillTrackAI longitudinal tracker using multi-source validation (Self-reported + Provider + Employer HR portal + EPFO match). Suitable for cabinet briefs and district skilling committee evaluations.
            </p>
          </div>
        </div>

        {/* Modal Controls */}
        <div className="px-6 py-3.5 bg-slate-100 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded"
          >
            Close
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded transition"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save as PDF</span>
            </button>
            <button
              onClick={handleDownloadCsv}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold text-white bg-gov-700 hover:bg-gov-800 rounded transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download CSV</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
