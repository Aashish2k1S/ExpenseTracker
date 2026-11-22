import { Plus } from 'lucide-react';
import { formatINR } from '../../utils/formatters';
import GoalCard from '../shared/GoalCard';

export default function GoalsTab({ store, onEditGoal, onNewGoal }) {
  const { state, metrics } = store;
  const shortTermGoals = state.goals.filter((g) => g.horizon === 'short');
  const longTermGoals = state.goals.filter((g) => g.horizon === 'long');
  const totalTarget = state.goals.reduce((s, g) => s + Number(g.target || 0), 0);
  const overallPct =
    totalTarget > 0 ? Math.round((metrics.totalTrackedSavings / totalTarget) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="bg-[#141414] border border-[#262626] rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 flex-1">
          <div>
            <p className="text-xs text-[#a3a3a3]">Total Tracked Savings</p>
            <p className="text-2xl font-bold text-[#10b981] mt-0.5">
              {formatINR(metrics.totalTrackedSavings)}
            </p>
          </div>
          <div>
            <p className="text-xs text-[#a3a3a3]">Combined Target</p>
            <p className="text-2xl font-bold text-[#f5f5f5] mt-0.5">{formatINR(totalTarget)}</p>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <p className="text-xs text-[#a3a3a3]">Monthly Committed</p>
            <p className="text-2xl font-bold text-[#f5f5f5] mt-0.5">
              {formatINR(metrics.monthlyTotalGoalContributions)}
              <span className="text-xs font-normal text-[#a3a3a3] ml-1">({overallPct}%)</span>
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onNewGoal}
          className="px-4 py-2.5 rounded-xl bg-[#FD1C00] hover:bg-[#e01800] text-white text-sm font-semibold flex items-center justify-center gap-2 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Goal</span>
        </button>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-3">
          <span className="w-2 h-2 rounded-full bg-[#FD1C00]" />
          <h2 className="text-base font-semibold text-[#f5f5f5]">Short-Term Goals</h2>
          <span className="text-xs text-[#a3a3a3]">(1–2 Years Horizon)</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {shortTermGoals.map((g) => (
            <GoalCard
              key={g.id}
              goal={g}
              onAddMonthlySaving={store.handleAddMonthlySaving}
              onEdit={onEditGoal}
            />
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-3">
          <span className="w-2 h-2 rounded-full bg-[#10b981]" />
          <h2 className="text-base font-semibold text-[#f5f5f5]">Long-Term Goals</h2>
          <span className="text-xs text-[#a3a3a3]">(10–15 Years Horizon)</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {longTermGoals.map((g) => (
            <GoalCard
              key={g.id}
              goal={g}
              onAddMonthlySaving={store.handleAddMonthlySaving}
              onEdit={onEditGoal}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
