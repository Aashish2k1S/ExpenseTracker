import {
  Wallet,
  Target,
  Edit3,
  Lock,
  PiggyBank,
  ArrowUpRight,
  ArrowDownRight,
  Receipt,
  Trash2,
} from 'lucide-react';
import { formatINR, formatMonthLabel, formatDateHeader } from '../../utils/formatters';
import QuickLogWidget from '../shared/QuickLogWidget';
import BudgetBars from '../shared/BudgetBars';
import GoalCard from '../shared/GoalCard';

export default function OverviewTab({
  store,
  setActiveTab,
  onEditSbi,
  onEditGoal,
  onTriggerEmergencyGuardrail,
}) {
  const { state, selectedMonth, metrics } = store;

  return (
    <div className="space-y-6">
      {/* Top KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-[#141414] border border-[#262626] rounded-2xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-[#a3a3a3]">Monthly income</span>
            <Wallet className="w-4 h-4 text-[#a3a3a3]" />
          </div>
          <p className="text-2xl font-bold text-[#f5f5f5]">{formatINR(state.profile.inHandSalary)}</p>
          <p className="text-[11px] text-[#a3a3a3] mt-1">
            Gross {formatINR(state.profile.grossSalary)} • Diff {formatINR(state.profile.deductions)}
          </p>
        </div>

        <div className="bg-[#141414] border border-[#262626] rounded-2xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-[#a3a3a3]">Monthly savings goals</span>
            <Target className="w-4 h-4 text-[#10b981]" />
          </div>
          <p className="text-2xl font-bold text-[#10b981]">
            {formatINR(metrics.monthlyUbiSavingsTarget)}
          </p>
          <p className="text-[11px] text-[#a3a3a3] mt-1">UBI buckets + ₹500 PPF (50% w/ buffer)</p>
        </div>

        <div className="bg-[#141414] border border-[#262626] rounded-2xl p-4 relative group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-[#a3a3a3]">Current bank balance</span>
            <button
              type="button"
              onClick={onEditSbi}
              className="text-[#a3a3a3] hover:text-[#f5f5f5] transition-colors"
              title="Adjust SBI balance"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-2xl font-bold text-[#f5f5f5]">{formatINR(state.sbiBalance)}</p>
          <p className="text-[11px] text-[#a3a3a3] mt-1">SBI operating (separate from goals)</p>
        </div>

        <div className="bg-[#141414] border border-[#262626] rounded-2xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-[#a3a3a3]">Current PPF</span>
            <Lock className="w-4 h-4 text-[#10b981]" />
          </div>
          <p className="text-2xl font-bold text-[#f5f5f5]">{formatINR(metrics.ppfBalance)}</p>
          <p className="text-[11px] text-[#a3a3a3] mt-1">15-year long-term account</p>
        </div>

        <div className="bg-linear-to-br from-[#141414] to-[#1c1c1c] border border-[#FD1C00]/40 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-[#f5f5f5] font-medium">Total tracked savings</span>
            <PiggyBank className="w-4 h-4 text-[#FD1C00]" />
          </div>
          <p className="text-2xl font-bold text-[#f5f5f5]">
            {formatINR(metrics.totalTrackedSavings)}
          </p>
          <p className="text-[11px] text-[#a3a3a3] mt-1">
            UBI ({formatINR(metrics.ubiBalance)}) + PPF ({formatINR(metrics.ppfBalance)})
          </p>
        </div>
      </div>

      {/* Quick Log + SBI Budget */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <QuickLogWidget
            compact
            selectedMonth={selectedMonth}
            goals={state.goals}
            onPresetTap={store.handlePresetTap}
            onCommitTransaction={store.commitTransaction}
            onTriggerEmergencyGuardrail={onTriggerEmergencyGuardrail}
            onError={store.showToast}
          />
        </div>
        <div className="lg:col-span-5">
          <BudgetBars
            categoryStats={metrics.categoryStats}
            totalMonthSbiSpent={metrics.totalMonthSbiSpent}
            selectedMonth={selectedMonth}
          />
        </div>
      </div>

      {/* Financial Goals Preview */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-semibold text-[#f5f5f5]">Financial Goals</h2>
            <p className="text-xs text-[#a3a3a3]">
              Click "+ Add monthly saving" when you make your actual deposit
            </p>
          </div>
          <button
            type="button"
            onClick={() => setActiveTab('goals')}
            className="text-xs font-medium text-[#FD1C00] hover:underline flex items-center gap-1"
          >
            Manage all goals <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {state.goals.map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              onAddMonthlySaving={store.handleAddMonthlySaving}
              onEdit={onEditGoal}
            />
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-[#141414] border border-[#262626] rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-[#f5f5f5]">
            Recent Activity ({formatMonthLabel(selectedMonth)})
          </h2>
          <button
            type="button"
            onClick={() => setActiveTab('transactions')}
            className="text-xs text-[#FD1C00] hover:underline"
          >
            View full ledger ({metrics.monthTransactions.length})
          </button>
        </div>
        {metrics.monthTransactions.length === 0 ? (
          <div className="text-center py-8 border border-dashed border-[#262626] rounded-xl">
            <Receipt className="w-8 h-8 text-[#a3a3a3] mx-auto mb-2 opacity-60" />
            <p className="text-sm text-[#f5f5f5] font-medium">No transactions logged yet</p>
            <p className="text-xs text-[#a3a3a3] mt-1">
              Tap a quick preset above (like Chai ₹20) or execute your Salary-Day Routine to begin.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[#262626]">
            {metrics.monthTransactions.slice(0, 6).map((tx) => (
              <div
                key={tx.id}
                className="py-3 flex items-center justify-between gap-3 hover:bg-[#1c1c1c]/50 px-2 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      tx.type === 'income' || tx.type === 'goal_deposit'
                        ? 'bg-[#10b981]/15 text-[#10b981]'
                        : 'bg-[#FD1C00]/15 text-[#FD1C00]'
                    }`}
                  >
                    {tx.type === 'income' || tx.type === 'goal_deposit' ? (
                      <ArrowDownRight className="w-4 h-4" />
                    ) : (
                      <ArrowUpRight className="w-4 h-4" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-[#f5f5f5] truncate">{tx.description}</p>
                    <p className="text-[11px] text-[#a3a3a3]">
                      {tx.categoryLabel} • {tx.account} • {tx.paymentMode} •{' '}
                      {formatDateHeader(tx.timestamp)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span
                    className={`text-sm font-semibold ${
                      tx.type === 'income' || tx.type === 'goal_deposit'
                        ? 'text-[#10b981]'
                        : 'text-[#f5f5f5]'
                    }`}
                  >
                    {tx.type === 'income' || tx.type === 'goal_deposit' ? '+' : '-'}
                    {formatINR(tx.amount)}
                  </span>
                  <button
                    type="button"
                    onClick={() => store.handleDeleteTransaction(tx.id)}
                    className="p-1.5 rounded-lg text-[#a3a3a3] hover:text-[#FD1C00] hover:bg-[#262626] transition-colors"
                    title="Delete & reverse balance"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
