import { Calendar, ChevronLeft, ChevronRight, RotateCcw, Database, RefreshCw } from 'lucide-react';
import { formatMonthLabel, shiftMonth } from '../../utils/formatters';

export default function Header({
  selectedMonth,
  setSelectedMonth,
  onResetClick,
  dbStatus = 'checking',
  isSyncing = false,
  onReconnect,
}) {
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
        {/* MongoDB Status Pill */}
        <button
          type="button"
          onClick={onReconnect}
          title={
            dbStatus === 'connected'
              ? 'MongoDB Atlas: Connected and Synced (Click to refresh)'
              : dbStatus === 'checking'
              ? 'Connecting to MongoDB...'
              : 'MongoDB Offline - Running on Local Storage Cache (Click to retry connection)'
          }
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-medium transition-all ${
            dbStatus === 'connected'
              ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-400 hover:bg-emerald-900/40'
              : dbStatus === 'checking'
              ? 'bg-blue-950/40 border-blue-500/30 text-blue-400 animate-pulse'
              : 'bg-amber-950/40 border-amber-500/30 text-amber-400 hover:bg-amber-900/40'
          }`}
        >
          <Database className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">
            {dbStatus === 'connected'
              ? 'Atlas Synced'
              : dbStatus === 'checking'
              ? 'Checking DB...'
              : 'Local (Offline)'}
          </span>
          {isSyncing && <RefreshCw className="w-3 h-3 animate-spin text-emerald-400 ml-0.5" />}
        </button>

        {/* Month Selector */}
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

        {/* Reset Defaults Button */}
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
