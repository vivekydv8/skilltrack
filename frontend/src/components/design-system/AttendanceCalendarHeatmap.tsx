import React from 'react';
import { Calendar, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';

export interface HeatmapDay {
  date: string;
  dayName: string;
  ratePct: number; // 0 to 100
  traineeCount: number;
}

export interface AttendanceCalendarHeatmapProps {
  monthName?: string;
  cohortName?: string;
  days?: HeatmapDay[];
  averageAttendance?: number;
  className?: string;
}

export const AttendanceCalendarHeatmap: React.FC<AttendanceCalendarHeatmapProps> = ({
  monthName = 'September 2024',
  cohortName = 'Batch EV-24-Pune-01',
  days,
  averageAttendance = 88.4,
  className = '',
}) => {
  // Generate 28 days of mock attendance if none provided
  const sampleDays: HeatmapDay[] = days || Array.from({ length: 28 }, (_, i) => {
    const day = i + 1;
    const isWeekend = day % 7 === 0 || day % 7 === 6;
    const rate = isWeekend ? 0 : Math.min(100, Math.floor(75 + Math.random() * 23));
    return {
      date: `2024-09-${String(day).padStart(2, '0')}`,
      dayName: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][day % 7],
      ratePct: rate,
      traineeCount: isWeekend ? 0 : 42,
    };
  });

  const getColorClass = (rate: number) => {
    if (rate === 0) return 'bg-slate-100 text-slate-300 border-slate-200'; // Weekend / Off
    if (rate >= 90) return 'bg-emerald-600 text-white font-bold';
    if (rate >= 80) return 'bg-teal-500 text-white font-semibold';
    if (rate >= 70) return 'bg-teal-200 text-teal-900';
    return 'bg-amber-300 text-amber-950 font-bold';
  };

  return (
    <div
      className={`bg-white border border-slate-200 rounded-2xl p-5 shadow-depth-card ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Calendar className="w-4 h-4 text-teal-600" />
            <span>ATTENDANCE CALENDAR HEATMAP</span>
          </h4>
          <p className="text-xs text-slate-500 mt-0.5">
            {cohortName} • {monthName}
          </p>
        </div>

        {/* Avg Attendance Pill */}
        <div className="text-right">
          <div className="text-xl font-extrabold text-teal-700 tabular-nums">
            {averageAttendance}%
          </div>
          <span className="text-[10px] text-slate-400 font-semibold uppercase">Avg Monthly Rate</span>
        </div>
      </div>

      {/* Grid of days */}
      <div className="grid grid-cols-7 gap-2">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((dayHeader, idx) => (
          <div
            key={idx}
            className="text-center text-[10px] font-bold text-slate-400 uppercase py-1"
          >
            {dayHeader}
          </div>
        ))}

        {sampleDays.map((d, idx) => (
          <div
            key={idx}
            title={`${d.date}: ${d.ratePct > 0 ? `${d.ratePct}% attendance` : 'Holiday / Off'}`}
            className={`h-9 rounded-lg flex items-center justify-center text-xs border border-white/40 shadow-sm transition-all hover:scale-110 cursor-pointer ${getColorClass(
              d.ratePct
            )}`}
          >
            {idx + 1}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span className="text-[11px] text-slate-400">Longitudinal Biometric Sync</span>
        <div className="flex items-center gap-2 text-[10px]">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded bg-slate-200" /> Off
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded bg-amber-300" /> &lt;75%
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded bg-teal-500" /> 80-90%
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded bg-emerald-600" /> &gt;90%
          </span>
        </div>
      </div>
    </div>
  );
};
