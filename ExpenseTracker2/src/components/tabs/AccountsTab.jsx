import { Edit3, Zap, CheckCircle2, Circle } from 'lucide-react';
import { BUDGET_BREAKDOWN_ROWS } from '../../constants/financeConfig';
import { formatINR, formatMonthLabel } from '../../utils/formatters';

export default function AccountsTab({ store, onEditSbi, onExecuteSalaryClick }) {
  const { state, selectedMonth, metrics } = store;
  const ubiGoals = state.goals.filter((g) => g.account === 'UBI');

  const routineSteps = [
    {
      key: 'step1',
      title: 'Salary of ₹32,000 arrives in SBI',
      detail: 'Confirmed in-hand salary credited (Gross ₹36,000, deductions ₹4,000).',
      amount: '₹32,000',
    },
    {
      key: 'step2',
      title: 'Transfer ₹15,500 to UBI for your three savings goals',
      detail: '₹8,000 Emergency + ₹5,000 MacBook + ₹2,500 Home down-payment virtual buckets.',
      amount: '₹15,500',
    },
    {
      key: 'step3',
      title: 'Keep ₹16,000 in SBI for operating expenses & buffer',
      detail: '₹10,000 Family contribution + ₹4,000 Personal expenses + ₹2,000 Misc buffer.',
      amount: '₹16,000',
    },
    {
      key: 'step4',
      title: 'Deposit ₹500 into PPF',
      detail: 'Long-term 15-year tax-free compounding (tracked separately from bank balance).',
      amount: '₹500',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* SBI */}
        <div className="bg-[#141414] border border-[#262626] rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/30 text-blue-400 flex items-center justify-center font-bold text-sm">
                  SBI
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-[#f5f5f5]">SBI Operating Account</h3>
                  <p className="text-xs text-[#a3a3a3]">Salary, family, personal, buffer</p>
                </div>
              </div>
              <button
                type="button"
                onClick={onEditSbi}
                className="p-2 rounded-lg bg-[#1c1c1c] border border-[#262626] text-[#a3a3a3] hover:text-[#f5f5f5]"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-3xl font-bold text-[#f5f5f5] mb-1">{formatINR(state.sbiBalance)}</p>
            <p className="text-xs text-[#a3a3a3] mb-4">Monthly retained: ₹16,000 (50%)</p>
          </div>
          <div className="space-y-1.5 text-xs border-t border-[#262626] pt-3">
            <div className="flex justify-between text-[#a3a3a3]">
              <span>Family contribution</span>
              <span className="text-[#f5f5f5] font-medium">₹10,000/mo</span>
            </div>
            <div className="flex justify-between text-[#a3a3a3]">
              <span>Personal expenses</span>
              <span className="text-[#f5f5f5] font-medium">₹4,000/mo</span>
            </div>
            <div className="flex justify-between text-[#a3a3a3]">
              <span>Miscellaneous buffer</span>
              <span className="text-[#f5f5f5] font-medium">₹2,000/mo</span>
            </div>
          </div>
        </div>

        {/* UBI */}
        <div className="bg-[#141414] border border-[#262626] rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-10 h-10 rounded-xl bg-[#FD1C00]/15 border border-[#FD1C00]/30 text-[#FD1C00] flex items-center justify-center font-bold text-sm">
                UBI
              </div>
              <div>
                <h3 className="text-sm font-semibold text-[#f5f5f5]">UBI Virtual Savings Buckets</h3>
                <p className="text-xs text-[#a3a3a3]">1 account, 3 tracked buckets</p>
              </div>
            </div>
            <p className="text-3xl font-bold text-[#f5f5f5] mb-1">{formatINR(metrics.ubiBalance)}</p>
            <p className="text-xs text-[#a3a3a3] mb-4">Monthly transfer: ₹15,500 (48.44%)</p>
          </div>
          <div className="space-y-1.5 text-xs border-t border-[#262626] pt-3">
            {ubiGoals.map((g) => (
              <div key={g.id} className="flex justify-between text-[#a3a3a3]">
                <span>{g.name}</span>
                <span className="text-[#f5f5f5] font-medium">
                  {formatINR(g.saved)}{' '}
                  <span className="text-[#a3a3a3]">({formatINR(g.monthlyContribution)}/mo)</span>
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* PPF */}
        <div className="bg-[#141414] border border-[#262626] rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-10 h-10 rounded-xl bg-[#10b981]/15 border border-[#10b981]/30 text-[#10b981] flex items-center justify-center font-bold text-sm">
                PPF
              </div>
              <div>
                <h3 className="text-sm font-semibold text-[#f5f5f5]">PPF Long-Term Account</h3>
                <p className="text-xs text-[#a3a3a3]">Separate from bank balance</p>
              </div>
            </div>
            <p className="text-3xl font-bold text-[#10b981] mb-1">{formatINR(metrics.ppfBalance)}</p>
            <p className="text-xs text-[#a3a3a3] mb-4">Monthly deposit: ₹500 (1.56%)</p>
          </div>
          <div className="bg-[#1c1c1c] border border-[#262626] rounded-xl p-3 text-xs text-[#a3a3a3]">
            Shown separately because PPF is not a liquid bank-account balance. 15-year compounding
            horizon.
          </div>
        </div>
      </div>

      {/* Salary-Day Routine */}
      <div className="bg-[#141414] border border-[#262626] rounded-2xl p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-semibold text-[#f5f5f5]">
                Salary-Day Routine ({formatMonthLabel(selectedMonth)})
              </h2>
              {metrics.activeChecklist.executedAt && (
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#10b981]/15 text-[#10b981] border border-[#10b981]/30 font-medium">
                  Executed
                </span>
              )}
            </div>
            <p className="text-xs text-[#a3a3a3] mt-0.5">
              Follow this 4-step flow on every salary day to keep savings automated.
            </p>
          </div>
          <button
            type="button"
            onClick={onExecuteSalaryClick}
            className="px-4 py-2.5 rounded-xl bg-[#FD1C00] hover:bg-[#e01800] text-white text-sm font-semibold flex items-center justify-center gap-2 shadow-lg shadow-[#FD1C00]/20 transition-all active:scale-[0.98]"
          >
            <Zap className="w-4 h-4" />
            <span>Execute Salary Day Routine</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {routineSteps.map((step, idx) => {
            const checked = Boolean(metrics.activeChecklist[step.key]);
            return (
              <button
                key={step.key}
                type="button"
                onClick={() => store.toggleChecklistStep(step.key)}
                className={`text-left p-4 rounded-xl border transition-all flex items-start gap-3 ${
                  checked
                    ? 'bg-[#10b981]/10 border-[#10b981]/40'
                    : 'bg-[#1c1c1c] border-[#262626] hover:border-[#363636]'
                }`}
              >
                <div className="mt-0.5 shrink-0">
                  {checked ? (
                    <CheckCircle2 className="w-5 h-5 text-[#10b981]" />
                  ) : (
                    <Circle className="w-5 h-5 text-[#a3a3a3]" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`text-sm font-semibold ${
                        checked ? 'text-[#10b981] line-through' : 'text-[#f5f5f5]'
                      }`}
                    >
                      {idx + 1}. {step.title}
                    </span>
                    <span className="text-xs font-bold text-[#f5f5f5] bg-[#0a0a0a] px-2 py-0.5 rounded border border-[#262626]">
                      {step.amount}
                    </span>
                  </div>
                  <p className="text-xs text-[#a3a3a3] mt-1">{step.detail}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Confirmed Salary Breakdown Table */}
      <div className="bg-[#141414] border border-[#262626] rounded-2xl p-5 overflow-x-auto">
        <div className="mb-4">
          <h2 className="text-base font-semibold text-[#f5f5f5]">
            Confirmed Monthly Salary Breakdown
          </h2>
          <p className="text-xs text-[#a3a3a3]">
            In-Hand: ₹32,000 | Gross: ₹36,000 | Savings Rate: 50% (₹16,000 incl. buffer)
          </p>
        </div>
        <table className="w-full text-left text-sm min-w-130">
          <thead>
            <tr className="border-b border-[#262626] text-xs text-[#a3a3a3]">
              <th className="pb-3 font-medium">Category</th>
              <th className="pb-3 font-medium">Account</th>
              <th className="pb-3 font-medium text-right">Monthly</th>
              <th className="pb-3 font-medium text-right">Allocation</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#262626]">
            {BUDGET_BREAKDOWN_ROWS.map((row) => (
              <tr key={row.id} className="hover:bg-[#1c1c1c]/60">
                <td className="py-3 text-[#f5f5f5] font-medium">{row.category}</td>
                <td className="py-3">
                  <span className="text-xs px-2 py-0.5 rounded bg-[#1c1c1c] border border-[#262626] text-[#a3a3a3]">
                    {row.account}
                  </span>
                </td>
                <td className="py-3 text-right text-[#f5f5f5] font-semibold">
                  {formatINR(row.monthly)}
                </td>
                <td className="py-3 text-right text-[#a3a3a3]">{row.allocation}</td>
              </tr>
            ))}
            <tr className="bg-[#1c1c1c] font-bold">
              <td className="py-3 pl-2 text-[#f5f5f5]">Total</td>
              <td className="py-3 text-xs text-[#a3a3a3]">SBI + UBI + PPF</td>
              <td className="py-3 text-right text-[#10b981]">₹32,000</td>
              <td className="py-3 pr-2 text-right text-[#f5f5f5]">100%</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
