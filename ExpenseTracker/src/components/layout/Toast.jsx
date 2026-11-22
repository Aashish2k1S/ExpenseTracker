import { AlertTriangle, CheckCircle2, Info } from 'lucide-react';

export default function Toast({ toast }) {
  if (!toast) return null;

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm bg-[#1c1c1c] border border-[#262626] shadow-2xl rounded-xl px-4 py-3 flex items-center gap-2.5">
      {toast.tone === 'error' ? (
        <AlertTriangle className="w-4 h-4 text-[#FD1C00] shrink-0" />
      ) : toast.tone === 'warn' ? (
        <AlertTriangle className="w-4 h-4 text-[#f59e0b] shrink-0" />
      ) : toast.tone === 'info' ? (
        <Info className="w-4 h-4 text-blue-400 shrink-0" />
      ) : (
        <CheckCircle2 className="w-4 h-4 text-[#10b981] shrink-0" />
      )}
      <span className="text-xs font-medium text-[#f5f5f5]">{toast.message}</span>
    </div>
  );
}
