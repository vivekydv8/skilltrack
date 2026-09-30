import React from 'react';
import { TrendingUp, TrendingDown, ArrowUpRight, ShieldCheck } from 'lucide-react';

export interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ComponentType<{ className?: string }>;
  trend?: {
    value: number | string;
    isPositive?: boolean;
    label?: string;
  };
  source?: string;
  confidence?: 'High' | 'Verified' | 'Medium' | 'Inferred';
  sparklineData?: number[];
  sparklineColor?: string;
  period?: string;
  onClick?: () => void;
  className?: string;
  highlight?: boolean;
  statusBadge?: React.ReactNode;
  colorScheme?: 'teal' | 'blue' | 'green' | 'indigo' | 'amber' | 'rose' | 'default';
}

const colorMap: Record<string, {
  card: string;
  iconBg: string;
  iconText: string;
  iconBorder: string;
  valuText: string;
  trendPos: string;
  dot: string;
  sparkStroke: string;
}> = {
  teal: {
    card: 'metric-card-teal',
    iconBg: 'bg-teal-600',
    iconText: 'text-white',
    iconBorder: 'border-teal-500',
    valuText: 'text-teal-900',
    trendPos: 'text-teal-700 bg-teal-50 border border-teal-200',
    dot: 'bg-teal-500',
    sparkStroke: '#0D9488',
  },
  blue: {
    card: 'metric-card-blue',
    iconBg: 'bg-blue-600',
    iconText: 'text-white',
    iconBorder: 'border-blue-500',
    valuText: 'text-blue-900',
    trendPos: 'text-blue-700 bg-blue-50 border border-blue-200',
    dot: 'bg-blue-500',
    sparkStroke: '#2563EB',
  },
  green: {
    card: 'metric-card-green',
    iconBg: 'bg-emerald-600',
    iconText: 'text-white',
    iconBorder: 'border-emerald-500',
    valuText: 'text-emerald-900',
    trendPos: 'text-emerald-700 bg-emerald-50 border border-emerald-200',
    dot: 'bg-emerald-500',
    sparkStroke: '#16A34A',
  },
  indigo: {
    card: 'metric-card-indigo',
    iconBg: 'bg-indigo-600',
    iconText: 'text-white',
    iconBorder: 'border-indigo-500',
    valuText: 'text-indigo-900',
    trendPos: 'text-indigo-700 bg-indigo-50 border border-indigo-200',
    dot: 'bg-indigo-500',
    sparkStroke: '#6366F1',
  },
  amber: {
    card: 'metric-card-amber',
    iconBg: 'bg-amber-500',
    iconText: 'text-white',
    iconBorder: 'border-amber-400',
    valuText: 'text-amber-900',
    trendPos: 'text-amber-700 bg-amber-50 border border-amber-200',
    dot: 'bg-amber-500',
    sparkStroke: '#F59E0B',
  },
  rose: {
    card: 'metric-card-rose',
    iconBg: 'bg-rose-600',
    iconText: 'text-white',
    iconBorder: 'border-rose-500',
    valuText: 'text-rose-900',
    trendPos: 'text-rose-700 bg-rose-50 border border-rose-200',
    dot: 'bg-rose-500',
    sparkStroke: '#F43F5E',
  },
  default: {
    card: '',
    iconBg: 'bg-teal-600',
    iconText: 'text-white',
    iconBorder: 'border-teal-500',
    valuText: 'text-slate-900',
    trendPos: 'text-emerald-700 bg-emerald-50 border border-emerald-200',
    dot: 'bg-slate-400',
    sparkStroke: '#0D9488',
  },
};

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  source,
  confidence,
  sparklineData = [12, 14, 15, 18, 22, 21, 25, 28],
  sparklineColor,
  period = 'FY 2024-25',
  onClick,
  className = '',
  highlight = false,
  statusBadge,
  colorScheme = 'default',
}) => {
  const scheme = colorMap[colorScheme] || colorMap.default;
  const effectiveStroke = sparklineColor || scheme.sparkStroke;

  // Sparkline SVG
  const max = Math.max(...sparklineData, 1);
  const min = Math.min(...sparklineData, 0);
  const range = max - min || 1;
  const svgW = 90;
  const svgH = 36;
  const points = sparklineData
    .map((val, idx) => {
      const x = (idx / (sparklineData.length - 1)) * svgW;
      const y = svgH - ((val - min) / range) * (svgH - 6) - 3;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');

  // Fill area below sparkline
  const firstPt = sparklineData[0];
  const lastPt = sparklineData[sparklineData.length - 1];
  const firstX = 0;
  const lastX = svgW;
  const firstY = svgH - ((firstPt - min) / range) * (svgH - 6) - 3;
  const lastY = svgH - ((lastPt - min) / range) * (svgH - 6) - 3;
  const fillPath = `M${firstX},${firstY} ${points} L${lastX},${svgH} L${firstX},${svgH} Z`;

  return (
    <div
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick();
        }
      }}
      className={`group relative rounded-2xl p-5 transition-all duration-300 premium-stat-card ${
        onClick ? 'cursor-pointer' : ''
      } ${
        highlight
          ? 'border-teal-400 ring-2 ring-teal-300/50 shadow-glow-teal'
          : ''
      } ${scheme.card || 'bg-white border border-slate-200'} shadow-depth-card ${className}`}
    >
      {/* Top row: Icon + Title + Arrow */}
      <div className="flex items-start justify-between gap-2 mb-4">
        <div className="flex items-center gap-3">
          {Icon && (
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-md shrink-0 transition-transform duration-300 group-hover:scale-110 ${scheme.iconBg} ${scheme.iconText} border ${scheme.iconBorder}`}
            >
              <Icon className="w-6 h-6" />
            </div>
          )}
          <div>
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest leading-tight">
              {title}
            </h4>
            {period && (
              <span className="text-[10px] text-slate-400 font-mono">{period}</span>
            )}
          </div>
        </div>

        {statusBadge ? (
          statusBadge
        ) : onClick ? (
          <div className="w-8 h-8 rounded-xl bg-white/60 border border-white/80 flex items-center justify-center shadow-sm group-hover:bg-white transition-all duration-200">
            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-teal-600 transition-colors" />
          </div>
        ) : null}
      </div>

      {/* Main value & sparkline */}
      <div className="flex items-end justify-between gap-3 mb-4">
        <div className="min-w-0">
          <div className={`kpi-xl-number ${scheme.valuText} count-up`}>
            {value}
          </div>
          {subtitle && (
            <p className="text-xs text-slate-500 mt-1.5 leading-snug font-medium">{subtitle}</p>
          )}
        </div>

        {/* Enhanced Sparkline with fill */}
        {sparklineData.length > 1 && (
          <div className="shrink-0">
            <svg
              width={svgW}
              height={svgH}
              className="overflow-visible opacity-80 group-hover:opacity-100 transition-opacity duration-300"
            >
              <defs>
                <linearGradient id={`sparkFill-${title}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={effectiveStroke} stopOpacity="0.25" />
                  <stop offset="100%" stopColor={effectiveStroke} stopOpacity="0" />
                </linearGradient>
              </defs>
              {/* Fill */}
              <path
                d={fillPath}
                fill={`url(#sparkFill-${title})`}
              />
              {/* Line */}
              <polyline
                fill="none"
                stroke={effectiveStroke}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={points}
              />
              {/* End dot */}
              <circle
                cx={lastX}
                cy={lastY}
                r="3.5"
                fill={effectiveStroke}
                stroke="white"
                strokeWidth="1.5"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Footer: Trend + Source */}
      <div className="pt-3 border-t border-white/60 flex items-center justify-between text-xs gap-2">
        {trend ? (
          <div
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-bold text-[11px] ${
              trend.isPositive !== false ? scheme.trendPos : 'text-rose-700 bg-rose-50 border border-rose-200'
            }`}
          >
            {trend.isPositive !== false ? (
              <TrendingUp className="w-3.5 h-3.5" />
            ) : (
              <TrendingDown className="w-3.5 h-3.5 text-rose-500" />
            )}
            <span>{trend.value}</span>
            {trend.label && (
              <span className="opacity-70 font-normal">{trend.label}</span>
            )}
          </div>
        ) : (
          <div className="text-[11px] text-slate-400">Longitudinal Signal</div>
        )}

        {source && (
          <div className="flex items-center gap-1 text-[10px] text-slate-400 truncate">
            <ShieldCheck className="w-3 h-3 text-teal-600 shrink-0" />
            <span className="truncate max-w-[110px]" title={source}>{source}</span>
            {confidence && (
              <span
                className={`ml-1 px-1.5 py-0.5 rounded-full text-[9px] font-bold ${
                  confidence === 'High' || confidence === 'Verified'
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-amber-100 text-amber-700'
                }`}
              >
                ✓ {confidence}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
