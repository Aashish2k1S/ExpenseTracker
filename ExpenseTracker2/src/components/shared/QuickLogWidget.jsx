import { useState, useEffect } from 'react';
import { Zap, Plus, Coffee, Utensils, Car, ShoppingBag } from 'lucide-react';
import {
  QUICK_PRESETS,
  PAYMENT_MODES,
  SBI_BUDGET_CATEGORIES,
} from '../../constants/financeConfig';
import { getDefaultDateTimeForMonth } from '../../utils/formatters';

const renderPresetIcon = (iconName) => {
  switch (iconName) {
    case 'coffee':
      return <Coffee className="w-3.5 h-3.5" />;
    case 'utensils':
      return <Utensils className="w-3.5 h-3.5" />;
    case 'car':
      return <Car className="w-3.5 h-3.5" />;
    default:
      return <ShoppingBag className="w-3.5 h-3.5" />;
  }
};

export default function QuickLogWidget({
  compact = false,
  selectedMonth,
  goals,
  onPresetTap,
  onCommitTransaction,
  onTriggerEmergencyGuardrail,
  onError,
}) {
  const [txForm, setTxForm] = useState(() => ({
    amount: '',
    description: '',
    type: 'expense',
    categoryId: 'personal',
    goalId: 'emergency',
    account: 'SBI',
    paymentMode: 'UPI',
    timestamp: getDefaultDateTimeForMonth(selectedMonth),
  }));

  useEffect(() => {
    setTxForm((prev) => ({
      ...prev,
      timestamp: getDefaultDateTimeForMonth(selectedMonth),
    }));
  }, [selectedMonth]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const amount = parseFloat(txForm.amount);
    if (!amount || amount <= 0) {
      onError?.('Enter an amount greater than ₹0', 'error');
      return;
    }

    let finalType = txForm.type;
    let finalAccount = txForm.account;
    let finalGoalId = null;
    let categoryLabel = '';

    if (txForm.type === 'expense') {
      if (txForm.categoryId === 'emergency_withdrawal') {
        finalType = 'goal_withdrawal';
        finalAccount = 'UBI';
        finalGoalId = 'emergency';
        categoryLabel = 'Emergency Withdrawal';
      } else {
        finalAccount = 'SBI';
        const catObj = SBI_BUDGET_CATEGORIES.find((c) => c.id === txForm.categoryId);
        categoryLabel = catObj ? catObj.name : 'Personal expenses';
      }
    } else if (txForm.type === 'income') {
      finalAccount = 'SBI';
      categoryLabel = txForm.categoryId === 'salary' ? 'Monthly Salary' : 'Other Income';
    } else if (txForm.type === 'goal_deposit') {
      const targetGoal = goals.find((g) => g.id === txForm.goalId) || goals[0];
      finalGoalId = targetGoal.id;
      finalAccount = targetGoal.account;
      categoryLabel = `${targetGoal.name} Deposit`;
    }

    const txPayload = {
      amount,
      description: txForm.description.trim() || categoryLabel,
      type: finalType,
      categoryId: txForm.categoryId,
      categoryLabel,
      goalId: finalGoalId,
      account: finalAccount,
      paymentMode: txForm.paymentMode,
      timestamp: txForm.timestamp,
      deductFromSbi: false,
    };

    if (finalType === 'goal_withdrawal' && finalGoalId === 'emergency') {
      onTriggerEmergencyGuardrail(txPayload, () =>
        setTxForm((prev) => ({ ...prev, amount: '', description: '' }))
      );
      return;
    }

    onCommitTransaction(txPayload);
    setTxForm((prev) => ({ ...prev, amount: '', description: '' }));
  };

  return (
    <div className="bg-[#141414] border border-[#262626] rounded-2xl p-5 shadow-lg">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#FD1C00]/15 border border-[#FD1C00]/30 flex items-center justify-center text-[#FD1C00]">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-[#f5f5f5]">Quick Log Micro-Transaction</h2>
            <p className="text-xs text-[#a3a3a3]">1-tap presets or custom entry</p>
          </div>
        </div>
        <div className="flex items-center bg-[#0a0a0a] border border-[#262626] rounded-lg p-0.5 text-xs">
          {[
            { id: 'expense', label: 'Expense' },
            { id: 'goal_deposit', label: 'Goal Save' },
            { id: 'income', label: 'Income' },
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() =>
                setTxForm((prev) => ({
                  ...prev,
                  type: t.id,
                  categoryId:
                    t.id === 'expense'
                      ? 'personal'
                      : t.id === 'income'
                      ? 'salary'
                      : prev.goalId || 'emergency',
                }))
              }
              className={`px-2.5 py-1.5 rounded-md font-medium transition-all ${
                txForm.type === t.id
                  ? t.id === 'expense'
                    ? 'bg-[#FD1C00] text-white shadow'
                    : 'bg-[#10b981] text-[#0a0a0a] font-semibold'
                  : 'text-[#a3a3a3] hover:text-[#f5f5f5]'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {txForm.type === 'expense' && (
        <div className="mb-4">
          <p className="text-[11px] uppercase tracking-wider text-[#a3a3a3] mb-2 font-medium">
            Instant Micro-Spends (SBI • UPI)
          </p>
          <div className="flex flex-wrap gap-2">
            {QUICK_PRESETS.map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => onPresetTap(preset)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1c1c1c] hover:bg-[#262626] border border-[#262626] hover:border-[#FD1C00]/50 text-xs text-[#f5f5f5] transition-all active:scale-95"
              >
                <span className="text-[#FD1C00]">{renderPresetIcon(preset.icon)}</span>
                <span>{preset.label}</span>
                <span className="font-semibold text-[#a3a3a3]">₹{preset.amount}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className={`grid grid-cols-1 ${compact ? 'sm:grid-cols-2' : 'sm:grid-cols-4'} gap-3`}>
          <div>
            <label className="block text-[11px] text-[#a3a3a3] mb-1">Amount (₹)</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a3a3a3] text-sm font-semibold">
                ₹
              </span>
              <input
                type="number"
                step="any"
                min="1"
                required
                placeholder="0"
                value={txForm.amount}
                onChange={(e) => setTxForm((p) => ({ ...p, amount: e.target.value }))}
                className="w-full bg-[#0a0a0a] border border-[#262626] focus:border-[#FD1C00] rounded-xl pl-7 pr-3 py-2.5 text-sm text-[#f5f5f5] outline-none transition-colors"
              />
            </div>
          </div>

          <div className={compact ? '' : 'sm:col-span-2'}>
            <label className="block text-[11px] text-[#a3a3a3] mb-1">Description / Note</label>
            <input
              type="text"
              placeholder={
                txForm.type === 'expense'
                  ? 'e.g. Evening coffee, metro ticket...'
                  : txForm.type === 'goal_deposit'
                  ? 'e.g. Extra MacBook savings'
                  : 'e.g. November salary, freelance...'
              }
              value={txForm.description}
              onChange={(e) => setTxForm((p) => ({ ...p, description: e.target.value }))}
              className="w-full bg-[#0a0a0a] border border-[#262626] focus:border-[#FD1C00] rounded-xl px-3 py-2.5 text-sm text-[#f5f5f5] outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-[11px] text-[#a3a3a3] mb-1">
              {txForm.type === 'goal_deposit' ? 'Target Goal Bucket' : 'Budget Category'}
            </label>
            {txForm.type === 'expense' && (
              <select
                value={txForm.categoryId}
                onChange={(e) => setTxForm((p) => ({ ...p, categoryId: e.target.value }))}
                className="w-full bg-[#0a0a0a] border border-[#262626] focus:border-[#FD1C00] rounded-xl px-3 py-2.5 text-sm text-[#f5f5f5] outline-none"
              >
                <option value="personal">Personal expenses (SBI)</option>
                <option value="family">Family contribution (SBI)</option>
                <option value="misc">Miscellaneous buffer (SBI)</option>
                <option value="emergency_withdrawal">⚠ Emergency Withdrawal (UBI)</option>
              </select>
            )}
            {txForm.type === 'goal_deposit' && (
              <select
                value={txForm.goalId}
                onChange={(e) => setTxForm((p) => ({ ...p, goalId: e.target.value }))}
                className="w-full bg-[#0a0a0a] border border-[#262626] focus:border-[#10b981] rounded-xl px-3 py-2.5 text-sm text-[#f5f5f5] outline-none"
              >
                {goals.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name} ({g.account})
                  </option>
                ))}
              </select>
            )}
            {txForm.type === 'income' && (
              <select
                value={txForm.categoryId}
                onChange={(e) => setTxForm((p) => ({ ...p, categoryId: e.target.value }))}
                className="w-full bg-[#0a0a0a] border border-[#262626] focus:border-[#10b981] rounded-xl px-3 py-2.5 text-sm text-[#f5f5f5] outline-none"
              >
                <option value="salary">Monthly Salary (SBI)</option>
                <option value="other_income">Other Income / Refund (SBI)</option>
              </select>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
          <div>
            <label className="block text-[11px] text-[#a3a3a3] mb-1">Payment Mode</label>
            <div className="grid grid-cols-4 gap-1 bg-[#0a0a0a] border border-[#262626] rounded-xl p-1">
              {PAYMENT_MODES.map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setTxForm((p) => ({ ...p, paymentMode: mode }))}
                  className={`py-1.5 rounded-lg text-[11px] font-medium transition-colors ${
                    txForm.paymentMode === mode
                      ? 'bg-[#262626] text-[#f5f5f5]'
                      : 'text-[#a3a3a3] hover:text-[#f5f5f5]'
                  }`}
                >
                  {mode === 'NetBanking' ? 'Bank' : mode}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[11px] text-[#a3a3a3] mb-1">Date & Time</label>
            <input
              type="datetime-local"
              value={txForm.timestamp}
              onChange={(e) => setTxForm((p) => ({ ...p, timestamp: e.target.value }))}
              className="w-full bg-[#0a0a0a] border border-[#262626] focus:border-[#FD1C00] rounded-xl px-3 py-2 text-xs text-[#f5f5f5] outline-none"
            />
          </div>

          <button
            type="submit"
            className={`w-full py-2.5 px-4 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${
              txForm.type === 'expense'
                ? 'bg-[#FD1C00] hover:bg-[#e01800] text-white shadow-lg shadow-[#FD1C00]/20'
                : 'bg-[#10b981] hover:bg-[#059669] text-[#0a0a0a] shadow-lg shadow-[#10b981]/20'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>
              {txForm.type === 'expense'
                ? 'Log Expense'
                : txForm.type === 'goal_deposit'
                ? 'Add to Goal'
                : 'Log Income'}
            </span>
          </button>
        </div>
      </form>
    </div>
  );
}
