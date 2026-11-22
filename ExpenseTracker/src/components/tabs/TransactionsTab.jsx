import { useState, useMemo } from 'react';
import {
  Search,
  Receipt,
  Smartphone,
  Banknote,
  CreditCard,
  Building2,
  Trash2,
} from 'lucide-react';
import { PAYMENT_MODES } from '../../constants/financeConfig';
import {
  formatINR,
  formatMonthLabel,
  formatDateHeader,
  formatTimeOnly,
} from '../../utils/formatters';
import QuickLogWidget from '../shared/QuickLogWidget';
import BudgetBars from '../shared/BudgetBars';

export default function TransactionsTab({ store, onTriggerEmergencyGuardrail }) {
  const { state, selectedMonth, metrics } = store;

  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [filterPayment, setFilterPayment] = useState('all');

  const filteredTransactions = useMemo(() => {
    return metrics.monthTransactions.filter((tx) => {
      if (filterType !== 'all' && tx.type !== filterType) return false;
      if (filterCategory !== 'all' && tx.categoryId !== filterCategory && tx.goalId !== filterCategory) {
        return false;
      }
      if (filterPayment !== 'all' && tx.paymentMode !== filterPayment) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchDesc = (tx.description || '').toLowerCase().includes(q);
        const matchCat = (tx.categoryLabel || '').toLowerCase().includes(q);
        const matchAmt = String(tx.amount).includes(q);
        if (!matchDesc && !matchCat && !matchAmt) return false;
      }
      return true;
    });
  }, [metrics.monthTransactions, filterType, filterCategory, filterPayment, searchQuery]);

  const groupedTransactions = useMemo(() => {
    const groups = {};
    filteredTransactions.forEach((tx) => {
      const dateKey = (tx.timestamp || '').slice(0, 10) || 'Unknown';
      if (!groups[dateKey]) {
        groups[dateKey] = { dateKey, items: [], dailyExpenseTotal: 0 };
      }
      groups[dateKey].items.push(tx);
      if (tx.type === 'expense' || tx.type === 'goal_withdrawal') {
        groups[dateKey].dailyExpenseTotal += Number(tx.amount || 0);
      }
    });
    return Object.values(groups).sort((a, b) => (a.dateKey < b.dateKey ? 1 : -1));
  }, [filteredTransactions]);

  return (
    <div className="space-y-6">
      <QuickLogWidget
        compact={false}
        selectedMonth={selectedMonth}
        goals={state.goals}
        onPresetTap={store.handlePresetTap}
        onCommitTransaction={store.commitTransaction}
        onTriggerEmergencyGuardrail={onTriggerEmergencyGuardrail}
        onError={store.showToast}
      />

      <BudgetBars
        categoryStats={metrics.categoryStats}
        totalMonthSbiSpent={metrics.totalMonthSbiSpent}
        selectedMonth={selectedMonth}
      />

      <div className="bg-[#141414] border border-[#262626] rounded-2xl p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-5">
          <div>
            <h2 className="text-base font-semibold text-[#f5f5f5]">
              Transaction Ledger — {formatMonthLabel(selectedMonth)}
            </h2>
            <p className="text-xs text-[#a3a3a3]">
              Showing {filteredTransactions.length} of {metrics.monthTransactions.length} entries
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative flex-1 sm:flex-initial">
              <Search className="w-3.5 h-3.5 text-[#a3a3a3] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search note or ₹..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-48 bg-[#0a0a0a] border border-[#262626] focus:border-[#FD1C00] rounded-xl pl-8 pr-3 py-2 text-xs text-[#f5f5f5] outline-none"
              />
            </div>

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-[#0a0a0a] border border-[#262626] rounded-xl px-3 py-2 text-xs text-[#f5f5f5] outline-none"
            >
              <option value="all">All Types</option>
              <option value="expense">Expenses</option>
              <option value="goal_deposit">Goal Deposits</option>
              <option value="income">Income</option>
              <option value="goal_withdrawal">Emergency Withdrawals</option>
            </select>

            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="bg-[#0a0a0a] border border-[#262626] rounded-xl px-3 py-2 text-xs text-[#f5f5f5] outline-none"
            >
              <option value="all">All Categories</option>
              <option value="personal">Personal expenses</option>
              <option value="family">Family contribution</option>
              <option value="misc">Misc buffer</option>
              {state.goals.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>

            <select
              value={filterPayment}
              onChange={(e) => setFilterPayment(e.target.value)}
              className="bg-[#0a0a0a] border border-[#262626] rounded-xl px-3 py-2 text-xs text-[#f5f5f5] outline-none"
            >
              <option value="all">All Modes</option>
              {PAYMENT_MODES.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
        </div>

        {groupedTransactions.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-[#262626] rounded-xl">
            <Receipt className="w-8 h-8 text-[#a3a3a3] mx-auto mb-2 opacity-60" />
            <p className="text-sm text-[#f5f5f5] font-medium">No matching transactions</p>
            <p className="text-xs text-[#a3a3a3] mt-1">
              Log your micro-transactions above or adjust your filters.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {groupedTransactions.map((group) => (
              <div
                key={group.dateKey}
                className="bg-[#1c1c1c] border border-[#262626] rounded-xl overflow-hidden"
              >
                <div className="px-4 py-2.5 bg-[#0a0a0a]/60 border-b border-[#262626] flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#f5f5f5]">
                    {formatDateHeader(group.dateKey + 'T12:00:00')}
                  </span>
                  <span className="text-xs text-[#a3a3a3]">
                    Daily spend:{' '}
                    <span className="text-[#f5f5f5] font-semibold">
                      {formatINR(group.dailyExpenseTotal)}
                    </span>
                  </span>
                </div>
                <div className="divide-y divide-[#262626]">
                  {group.items.map((tx) => (
                    <div
                      key={tx.id}
                      className="px-4 py-3 flex items-center justify-between gap-3 hover:bg-[#262626]/40 transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                            tx.type === 'income' || tx.type === 'goal_deposit'
                              ? 'bg-[#10b981]/15 text-[#10b981]'
                              : tx.type === 'goal_withdrawal'
                              ? 'bg-[#f59e0b]/15 text-[#f59e0b]'
                              : 'bg-[#FD1C00]/15 text-[#FD1C00]'
                          }`}
                        >
                          {tx.paymentMode === 'UPI' ? (
                            <Smartphone className="w-4 h-4" />
                          ) : tx.paymentMode === 'Cash' ? (
                            <Banknote className="w-4 h-4" />
                          ) : tx.paymentMode === 'Card' ? (
                            <CreditCard className="w-4 h-4" />
                          ) : (
                            <Building2 className="w-4 h-4" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-[#f5f5f5] truncate">
                            {tx.description}
                          </p>
                          <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-[#a3a3a3] mt-0.5">
                            <span className="px-1.5 py-0.5 rounded bg-[#0a0a0a] border border-[#262626]">
                              {tx.categoryLabel}
                            </span>
                            <span>{tx.account}</span>
                            <span>•</span>
                            <span>{tx.paymentMode}</span>
                            <span>•</span>
                            <span>{formatTimeOnly(tx.timestamp)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <span
                          className={`text-sm font-bold ${
                            tx.type === 'income' || tx.type === 'goal_deposit'
                              ? 'text-[#10b981]'
                              : tx.type === 'goal_withdrawal'
                              ? 'text-[#f59e0b]'
                              : 'text-[#f5f5f5]'
                          }`}
                        >
                          {tx.type === 'income' || tx.type === 'goal_deposit' ? '+' : '-'}
                          {formatINR(tx.amount)}
                        </span>
                        <button
                          type="button"
                          onClick={() => store.handleDeleteTransaction(tx.id)}
                          className="p-2 rounded-lg text-[#a3a3a3] hover:text-[#FD1C00] hover:bg-[#0a0a0a] transition-colors"
                          title="Delete transaction and reverse balance"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
