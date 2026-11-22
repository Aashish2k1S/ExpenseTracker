import { Edit3, Plus, Sparkles } from 'lucide-react';
import { formatINR } from '../../utils/formatters';

export default function GoalCard({ goal, onAddMonthlySaving, onEdit }) {
  const pct = goal.target > 0 ? Math.min(100, Math.round((goal.saved / goal.target) * 100)) : 0;
  const remainingAmt = Math.max(0, goal.target - goal.saved);
  const dynamicMonths =
    goal.monthlyContribution > 0 ? Math.ceil(remainingAmt / goal.monthlyContribution) : 0;
  const isCompleted = remainingAmt === 0;

  return (
    <div className="bg-[#141414] border border-[#262626] hover:border-[#363636] rounded-2xl p-5 flex flex-col justify-between transition-all">
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-base font-semibold text-[#f5f5f5]">{goal.name}</h3>
              <span
                className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full font-semibold border ${
                  goal.account === 'PPF'
                    ? 'bg-[#10b981]/10 text-[#10b981] border-[#10b981]/30'
                    : 'bg-[#1c1c1c] text-[#a3a3a3] border-[#262626]'
                }`}
              >
                {goal.account}
              </span>
            </div>
            <p className="text-xs text-[#a3a3a3]">
              Monthly contribution:{' '}
              <span className="text-[#f5f5f5] font-medium">
                {formatINR(goal.monthlyContribution)}
              </span>
            </p>
          </div>
          <div className="flex items-center gap-1.5">
            <span
              className={`text-sm font-bold px-2.5 py-1 rounded-lg ${
                isCompleted
                  ? 'bg-[#10b981]/20 text-[#10b981]'
                  : 'bg-[#1c1c1c] text-[#f5f5f5] border border-[#262626]'
              }`}
            >
              {pct}%
            </span>
            <button
              type="button"
              onClick={() => onEdit(goal)}
              title="Edit balance or target"
              className="p-2 rounded-lg bg-[#1c1c1c] hover:bg-[#262626] text-[#a3a3a3] hover:text-[#f5f5f5] border border-[#262626] transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="flex items-baseline justify-between mb-2">
          <div>
            <span className="text-2xl font-bold text-[#f5f5f5]">{formatINR(goal.saved)}</span>
            <span className="text-xs text-[#a3a3a3] ml-1.5">saved</span>
          </div>
          <div className="text-right">
            <span className="text-xs text-[#a3a3a3]">Target </span>
            <span className="text-sm font-semibold text-[#f5f5f5]">{formatINR(goal.target)}</span>
          </div>
        </div>

        <div className="w-full h-2.5 bg-[#0a0a0a] border border-[#262626] rounded-full overflow-hidden mb-3">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${pct}%`,
              backgroundColor: isCompleted
                ? '#10b981'
                : goal.account === 'PPF'
                ? '#10b981'
                : '#FD1C00',
            }}
          />
        </div>

        <div className="flex items-center justify-between text-xs text-[#a3a3a3] mb-3">
          <span>
            {isCompleted
              ? 'Target achieved!'
              : dynamicMonths > 24
              ? `~${(dynamicMonths / 12).toFixed(1)} yrs remaining (${dynamicMonths} mo)`
              : `~${dynamicMonths} month${dynamicMonths === 1 ? '' : 's'} remaining`}
          </span>
          <span>Plan: {goal.expectedTime}</span>
        </div>

        {goal.milestoneTip && (
          <div className="bg-[#1c1c1c] border border-[#262626] rounded-xl p-2.5 mb-4 flex items-start gap-2">
            <Sparkles className="w-3.5 h-3.5 text-[#f59e0b] shrink-0 mt-0.5" />
            <p className="text-[11px] text-[#a3a3a3] leading-relaxed">{goal.milestoneTip}</p>
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={() => onAddMonthlySaving(goal)}
        className="w-full py-2.5 px-3 rounded-xl bg-[#1c1c1c] hover:bg-[#10b981] text-[#f5f5f5] hover:text-[#0a0a0a] border border-[#262626] hover:border-[#10b981] text-xs font-semibold flex items-center justify-center gap-1.5 transition-all active:scale-[0.98]"
      >
        <Plus className="w-3.5 h-3.5" />
        <span>Add monthly saving ({formatINR(goal.monthlyContribution)})</span>
      </button>
    </div>
  );
}
