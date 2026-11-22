import { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { formatINR } from '../../utils/formatters';

export default function EmergencyGuardrailModal({ tx, onClose, onConfirm }) {
  const [confirmed, setConfirmed] = useState(false);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#141414] border border-[#f59e0b]/50 rounded-2xl max-w-md w-full p-6 shadow-2xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-11 h-11 rounded-xl bg-[#f59e0b]/15 border border-[#f59e0b]/40 text-[#f59e0b] flex items-center justify-center shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] uppercase tracking-wider font-bold text-[#f59e0b]">
              Financial Rule #2 Guardrail
            </span>
            <h3 className="text-base font-bold text-[#f5f5f5]">Don't touch emergency savings</h3>
          </div>
        </div>

        <p className="text-xs text-[#a3a3a3] leading-relaxed mb-4">
          You are about to withdraw{' '}
          <span className="text-[#f5f5f5] font-bold">{formatINR(tx.amount)}</span> from your{' '}
          <span className="text-[#f5f5f5] font-semibold">Emergency Fund (UBI)</span>. Only genuine
          emergencies (medical, urgent unforeseen crisis, income loss) qualify.
        </p>

        <label className="flex items-start gap-2.5 bg-[#1c1c1c] border border-[#262626] rounded-xl p-3 mb-5 cursor-pointer">
          <input
            type="checkbox"
            checked={confirmed}
            onChange={(e) => setConfirmed(e.target.checked)}
            className="mt-0.5 accent-[#f59e0b]"
          />
          <span className="text-xs text-[#f5f5f5]">
            I confirm this is a genuine emergency and not a discretionary expense.
          </span>
        </label>

        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#1c1c1c] hover:bg-[#262626] text-xs font-medium text-[#f5f5f5]"
          >
            Cancel (Keep Protected)
          </button>
          <button
            type="button"
            disabled={!confirmed}
            onClick={onConfirm}
            className="px-4 py-2 rounded-xl bg-[#f59e0b] disabled:opacity-40 text-[#0a0a0a] text-xs font-bold transition-opacity"
          >
            Confirm Withdrawal
          </button>
        </div>
      </div>
    </div>
  );
}
