import React from 'react';
import { Bell, CheckCircle2, AlertTriangle, Info, Clock, X } from 'lucide-react';

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'info' | 'warning' | 'success' | 'alert';
  read?: boolean;
}

export interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  notifications?: NotificationItem[];
  onMarkAllRead?: () => void;
  className?: string;
}

const DEFAULT_NOTIFICATIONS: NotificationItem[] = [
  {
    id: '1',
    title: 'Biometric Attendance Ingestion Complete',
    message: '98,420 trainee logs synced from MSSDS Pune and Chhatrapati Sambhajinagar ITIs.',
    timestamp: '10 mins ago',
    type: 'success',
  },
  {
    id: '2',
    title: 'Early Warning: Non-Placement Risk Alert',
    message: 'Nashik Solar PV Installation cohort placement probability dropped below 60%.',
    timestamp: '42 mins ago',
    type: 'warning',
  },
  {
    id: '3',
    title: 'OEM Hiring Confirmation Received',
    message: 'Tata Motors confirmed 45 new EV technician onboardings with PF linkage.',
    timestamp: '2 hours ago',
    type: 'info',
  },
];

export const NotificationPanel: React.FC<NotificationPanelProps> = ({
  isOpen,
  onClose,
  notifications = DEFAULT_NOTIFICATIONS,
  onMarkAllRead,
  className = '',
}) => {
  if (!isOpen) return null;

  return (
    <div
      className={`absolute right-0 top-12 z-50 w-80 sm:w-96 bg-white border border-slate-200 rounded-2xl shadow-depth-floating overflow-hidden animate-scale-in ${className}`}
    >
      <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-teal-600" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
            System Notifications ({notifications.length})
          </h4>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="text-slate-400 hover:text-slate-700 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
        {notifications.map((n) => (
          <div key={n.id} className="p-3.5 hover:bg-slate-50 transition-colors">
            <div className="flex items-start gap-2.5">
              {n.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />}
              {n.type === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />}
              {n.type === 'info' && <Info className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />}
              {n.type === 'alert' && <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />}

              <div>
                <h5 className="text-xs font-bold text-slate-900">{n.title}</h5>
                <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">{n.message}</p>
                <span className="text-[10px] text-slate-400 mt-1 block flex items-center gap-1">
                  <Clock className="w-2.5 h-2.5" />
                  {n.timestamp}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {onMarkAllRead && (
        <div className="p-2.5 bg-slate-50 border-t border-slate-100 text-center">
          <button
            type="button"
            onClick={onMarkAllRead}
            className="text-xs font-bold text-teal-700 hover:text-teal-800"
          >
            Mark all as read
          </button>
        </div>
      )}
    </div>
  );
};
