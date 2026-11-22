import { X } from 'lucide-react';
import { formatMonthLabel } from '../../utils/formatters';

export default function SalaryConfirmModal({ selectedMonth, onClose, onConfirm }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#141414] border border-[#262626] rounded-2xl max-w-md w-full p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-[#f5f5f5]">Execute Salary-Day Routine?</h3>
          <button type="button" onClick={onClose} className="text-[#a3a3a3] hover:text-[#f5f5f5]">
            <X className="w-4 h-4" />
          </button>
        </div>
        <p className="text-xs text-[#a3a3a3] mb-4">
          For{' '}
          <span className="text-[#f5f5f5] font-semibold">{formatMonthLabel(selectedMonth)}</span>,
          this 1-click action will automatically:
        </p>
        <ul className="space-y-2 text-xs text-[#f5f5f5] bg-[#1c1c1c] border border-[#262626] rounded-xl p-3.5 mb-5">
          <li className="flex justify-between">
            <span>1. Credit Salary to SBI</span>
            <span className="text-[#10b981] font-semibold">+₹32,000</span>
          </li>
          <li className="flex justify-between">
            <span>2. Transfer to UBI (3 buckets)</span>
            <span className="font-semibold">₹15,500</span>
          </li>
          <li className="flex justify-between">
            <span>3. Deposit into PPF</span>
            <span className="font-semibold">₹500</span>
          </li>
          <li className="flex justify-between border-t border-[#262626] pt-2">
            <span>Net retained in SBI</span>
            <span className="text-[#10b981] font-bold">+₹16,000</span>
          </li>
        </ul>
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#1c1c1c] text-xs font-medium text-[#f5f5f5]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2 rounded-xl bg-[#FD1C00] hover:bg-[#e01800] text-xs font-semibold text-white"
          >
            Execute Now
          </button>
        </div>
      </div>
    </div>
  );
}
