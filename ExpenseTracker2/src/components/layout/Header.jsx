import { Calendar, ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import { formatMonthLabel, shiftMonth } from '../../utils/formatters';

export default function Header({ selectedMonth, setSelectedMonth, onResetClick }) {
  return (
    <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-5 border-b border-[#262626]">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-[#f5f5f5] tracking-tight">
          Aashish's Financial Dashboard
        </h1>
        <p className="text-xs text-[#a3a3a3] mt-0.5">
          Confirmed ₹32,000 in-hand plan • 50% savings rate incl. buffer
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        <div className="flex items-center bg-[#141414] border border-[#262626] rounded-xl p-1">
          <button
            type="button"
            onClick={() => setSelectedMonth((m) => shiftMonth(m, -1))}
            className="p-1.5 rounded-lg hover:bg-[#262626] text-[#a3a3a3] hover:text-[#f5f5f5] transition-colors"
            aria-label="Previous month"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-1.5 px-3 text-xs font-semibold text-[#f5f5f5] min-w-32.5 justify-center">
            <Calendar className="w-3.5 h-3.5 text-[#FD1C00]" />
            <span>{formatMonthLabel(selectedMonth)}</span>
          </div>
          <button
            type="button"
            onClick={() => setSelectedMonth((m) => shiftMonth(m, 1))}
            className="p-1.5 rounded-lg hover:bg-[#262626] text-[#a3a3a3] hover:text-[#f5f5f5] transition-colors"
            aria-label="Next month"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <button
          type="button"
          onClick={onResetClick}
          className="p-2.5 rounded-xl bg-[#141414] hover:bg-[#1c1c1c] border border-[#262626] text-[#a3a3a3] hover:text-[#FD1C00] transition-colors"
          title="Reset to Nov 2026 Defaults"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
