import React, { useState, useEffect, useCallback } from 'react';
import { CheckCircle2, AlertCircle, X, Info, AlertTriangle } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

type ToastListener = (toast: ToastMessage) => void;

const listeners: Set<ToastListener> = new Set();

export const toast = {
  success: (title: string, message?: string) => emitToast('success', title, message),
  error: (title: string, message?: string) => emitToast('error', title, message),
  info: (title: string, message?: string) => emitToast('info', title, message),
  warning: (title: string, message?: string) => emitToast('warning', title, message),
};

function emitToast(type: ToastType, title: string, message?: string) {
  const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const t: ToastMessage = { id, type, title, message, duration: 4500 };
  listeners.forEach(fn => fn(t));
}

export const ToastContainer: React.FC = () => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    const handler: ToastListener = (t) => {
      setToasts(prev => [...prev, t]);
    };
    listeners.add(handler);
    return () => { listeners.delete(handler); };
  }, []);

  const remove = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed bottom-20 left-1/2 -translate-x-1/2 z-[9999] flex flex-col gap-2 items-center pointer-events-none"
      style={{ width: 'min(420px, 90vw)' }}
    >
      {toasts.map(t => (
        <ToastItem key={t.id} toast={t} onRemove={remove} />
      ))}
    </div>
  );
};

const ICONS: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />,
  error:   <AlertCircle   className="w-5 h-5 text-red-500 shrink-0" />,
  warning: <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />,
  info:    <Info          className="w-5 h-5 text-blue-500 shrink-0" />,
};

const BG: Record<ToastType, string> = {
  success: 'border-emerald-300 bg-white',
  error:   'border-red-300 bg-white',
  warning: 'border-amber-300 bg-white',
  info:    'border-blue-300 bg-white',
};

const ToastItem: React.FC<{ toast: ToastMessage; onRemove: (id: string) => void }> = ({
  toast: t,
  onRemove,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => onRemove(t.id), t.duration ?? 4500);
    return () => clearTimeout(timer);
  }, [t.id, t.duration, onRemove]);

  return (
    <div
      className={`pointer-events-auto w-full flex items-start gap-3 px-4 py-3 rounded-xl border-2 shadow-xl ${BG[t.type]}`}
      role="alert"
    >
      {ICONS[t.type]}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-slate-900 leading-tight">{t.title}</p>
        {t.message && (
          <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{t.message}</p>
        )}
      </div>
      <button
        onClick={() => onRemove(t.id)}
        className="text-slate-400 hover:text-slate-700 transition mt-0.5 shrink-0"
        aria-label="Dismiss"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default ToastContainer;
