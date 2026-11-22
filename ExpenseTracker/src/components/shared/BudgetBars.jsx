import { formatINR, formatMonthLabel } from '../../utils/formatters';

export default function BudgetBars({ categoryStats, totalMonthSbiSpent, selectedMonth }) {
  return (
    <div className="bg-[#141414] border border-[#262626] rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-sm font-semibold text-[#f5f5f5]">SBI Operating Budget</h2>
          <p className="text-xs text-[#a3a3a3]">
            ₹16,000/mo allocation • {formatMonthLabel(selectedMonth)}
          </p>
        </div>
        <div className="text-right">
          <span className="text-xs text-[#a3a3a3]">Spent</span>
          <p className="text-sm font-bold text-[#f5f5f5]">
            {formatINR(totalMonthSbiSpent)}{' '}
            <span className="text-xs font-normal text-[#a3a3a3]">/ ₹16,000</span>
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {categoryStats.map((cat) => (
          <div key={cat.id} className="bg-[#1c1c1c] border border-[#262626] rounded-xl p-3.5">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                <span className="text-sm font-medium text-[#f5f5f5]">{cat.name}</span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#0a0a0a] border border-[#262626] text-[#a3a3a3]">
                  {cat.allocation}%
                </span>
              </div>
              <div className="text-right">
                <span
                  className={`text-sm font-semibold ${
                    cat.isOver ? 'text-[#FD1C00]' : cat.isWarn ? 'text-[#f59e0b]' : 'text-[#f5f5f5]'
                  }`}
                >
                  {formatINR(cat.spent)}
                </span>
                <span className="text-xs text-[#a3a3a3]"> / {formatINR(cat.monthlyBudget)}</span>
              </div>
            </div>

            <div className="w-full h-2 bg-[#0a0a0a] rounded-full overflow-hidden mb-2">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min(100, cat.pct)}%`,
                  backgroundColor: cat.isOver ? '#FD1C00' : cat.isWarn ? '#f59e0b' : '#10b981',
                }}
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
              <span className={cat.isOver ? 'text-[#FD1C00] font-medium' : 'text-[#a3a3a3]'}>
                {cat.isOver
                  ? `Over budget by ${formatINR(Math.abs(cat.remaining))}`
                  : `Remaining: ${formatINR(cat.remaining)}`}
              </span>
              <span className="text-[#10b981] font-medium">
                Safe spend: {formatINR(cat.dailySafeSpend)}/day
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
