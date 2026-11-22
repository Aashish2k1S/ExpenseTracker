import { useMemo } from 'react';
import { ShieldAlert, Download, Upload, RotateCcw } from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
} from 'recharts';
import { FINANCIAL_RULES } from '../../constants/financeConfig';
import { formatINR, formatMonthLabel } from '../../utils/formatters';

export default function ReviewTab({ store, onImportClick, onResetClick }) {
  const { state, selectedMonth, metrics } = store;

  const plannedVsActualData = useMemo(() => {
    const sbiRows = metrics.categoryStats.map((c) => ({
      name: c.name.split(' ')[0],
      fullName: c.name,
      Planned: c.monthlyBudget,
      Actual: c.spent,
    }));

    const goalRows = state.goals.map((g) => {
      const actualSaved = metrics.monthTransactions
        .filter((tx) => tx.type === 'goal_deposit' && tx.goalId === g.id)
        .reduce((sum, tx) => sum + Number(tx.amount || 0), 0);
      return {
        name: g.name.split(' ')[0],
        fullName: g.name,
        Planned: g.monthlyContribution,
        Actual: actualSaved,
      };
    });

    return [...sbiRows, ...goalRows];
  }, [metrics.categoryStats, state.goals, metrics.monthTransactions]);

  const savingsVsExpensesPieData = useMemo(() => {
    const data = [
      { name: 'SBI Expenses', value: metrics.totalMonthSbiSpent, color: '#FD1C00' },
      { name: 'Goals & PPF Saved', value: metrics.totalMonthGoalDeposits, color: '#10b981' },
    ];
    if (metrics.totalMonthSbiSpent === 0 && metrics.totalMonthGoalDeposits === 0) {
      return [
        { name: 'Planned Operating (SBI)', value: 16000, color: '#FD1C00' },
        { name: 'Planned Savings (UBI + PPF)', value: 16000, color: '#10b981' },
      ];
    }
    return data.filter((d) => d.value > 0);
  }, [metrics.totalMonthSbiSpent, metrics.totalMonthGoalDeposits]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 bg-[#141414] border border-[#262626] rounded-2xl p-5">
          <div className="mb-4">
            <h2 className="text-base font-semibold text-[#f5f5f5]">
              Planned vs Actual — {formatMonthLabel(selectedMonth)}
            </h2>
            <p className="text-xs text-[#a3a3a3]">
              Compare budgeted ₹32,000 allocations against real spending & deposits
            </p>
          </div>
          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={plannedVsActualData} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
                <XAxis dataKey="name" stroke="#a3a3a3" fontSize={11} tickLine={false} />
                <YAxis
                  stroke="#a3a3a3"
                  fontSize={11}
                  tickLine={false}
                  tickFormatter={(v) => `₹${v >= 1000 ? `${v / 1000}k` : v}`}
                />
                <Tooltip
                  cursor={{ fill: '#1c1c1c' }}
                  contentStyle={{
                    backgroundColor: '#141414',
                    borderColor: '#262626',
                    borderRadius: '12px',
                    color: '#f5f5f5',
                    fontSize: '12px',
                  }}
                  formatter={(value) => formatINR(value)}
                />
                <Bar dataKey="Planned" fill="#3f3f46" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Actual" fill="#FD1C00" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-5 bg-[#141414] border border-[#262626] rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <h2 className="text-base font-semibold text-[#f5f5f5]">Savings vs Expenses</h2>
            <p className="text-xs text-[#a3a3a3]">
              {metrics.totalMonthSbiSpent === 0 && metrics.totalMonthGoalDeposits === 0
                ? 'Showing planned 50/50 split until transactions are logged'
                : `Actual cashflow split for ${formatMonthLabel(selectedMonth)}`}
            </p>
          </div>
          <div className="w-full h-56 my-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={savingsVsExpensesPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={58}
                  outerRadius={84}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {savingsVsExpensesPieData.map((entry, idx) => (
                    <Cell key={idx} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#141414',
                    borderColor: '#262626',
                    borderRadius: '12px',
                    color: '#f5f5f5',
                    fontSize: '12px',
                  }}
                  formatter={(value) => formatINR(value)}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[#262626]">
            {savingsVsExpensesPieData.map((d) => (
              <div key={d.name} className="bg-[#1c1c1c] rounded-xl p-2.5 border border-[#262626]">
                <div className="flex items-center gap-1.5 text-xs text-[#a3a3a3] mb-1">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />
                  <span className="truncate">{d.name}</span>
                </div>
                <p className="text-sm font-bold text-[#f5f5f5]">{formatINR(d.value)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3 Financial Rules */}
      <div className="bg-[#141414] border border-[#262626] rounded-2xl p-5">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-9 h-9 rounded-xl bg-[#FD1C00]/15 border border-[#FD1C00]/30 text-[#FD1C00] flex items-center justify-center">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-[#f5f5f5]">
              3 Non-Negotiable Financial Rules
            </h2>
            <p className="text-xs text-[#a3a3a3]">
              Core principles protecting Aashish's financial foundation
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {FINANCIAL_RULES.map((rule) => (
            <div
              key={rule.number}
              className="bg-[#1c1c1c] border border-[#262626] rounded-xl p-4 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span
                    className="text-xs font-bold px-2.5 py-1 rounded-lg bg-[#0a0a0a] border border-[#262626]"
                    style={{ color: rule.accent }}
                  >
                    RULE {rule.number}
                  </span>
                  <span className="text-[11px] text-[#a3a3a3]">{rule.badge}</span>
                </div>
                <h3 className="text-sm font-semibold text-[#f5f5f5] mb-1.5">{rule.title}</h3>
                <p className="text-xs text-[#a3a3a3] leading-relaxed">{rule.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Backup & Storage */}
      <div className="bg-[#141414] border border-[#262626] rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-semibold text-[#f5f5f5]">Data Backup & Storage</h2>
          <p className="text-xs text-[#a3a3a3] mt-0.5">
            All transactions and goal balances are auto-saved in your browser's localStorage.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={store.handleExportJSON}
            className="px-3.5 py-2 rounded-xl bg-[#1c1c1c] hover:bg-[#262626] border border-[#262626] text-xs font-medium text-[#f5f5f5] flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            Export JSON
          </button>
          <button
            type="button"
            onClick={onImportClick}
            className="px-3.5 py-2 rounded-xl bg-[#1c1c1c] hover:bg-[#262626] border border-[#262626] text-xs font-medium text-[#f5f5f5] flex items-center gap-1.5"
          >
            <Upload className="w-3.5 h-3.5" />
            Import JSON
          </button>
          <button
            type="button"
            onClick={onResetClick}
            className="px-3.5 py-2 rounded-xl bg-[#FD1C00]/10 hover:bg-[#FD1C00]/20 border border-[#FD1C00]/30 text-xs font-medium text-[#FD1C00] flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset to Nov 2026 Defaults
          </button>
        </div>
      </div>
    </div>
  );
}
