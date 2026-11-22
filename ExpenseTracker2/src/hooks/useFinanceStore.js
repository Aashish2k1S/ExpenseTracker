import { useState, useEffect, useMemo, useRef } from 'react';
import {
  STORAGE_KEY,
  DEFAULT_MONTH,
  SBI_BUDGET_CATEGORIES,
  createDefaultState,
} from '../constants/financeConfig';
import {
  formatINR,
  formatMonthLabel,
  getRemainingDaysInMonth,
  getDefaultDateTimeForMonth,
  generateId,
} from '../utils/formatters';

export function useFinanceStore() {
  const [state, setState] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && Array.isArray(parsed.goals) && typeof parsed.sbiBalance === 'number') {
          return { ...createDefaultState(), ...parsed };
        }
      }
    } catch (err) {
      console.error('Failed to read localStorage:', err);
    }
    return createDefaultState();
  });

  const [selectedMonth, setSelectedMonth] = useState(DEFAULT_MONTH);
  const [toast, setToast] = useState(null);
  const toastTimerRef = useRef(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (err) {
      console.error('Failed to save to localStorage:', err);
    }
  }, [state]);

  const showToast = (message, tone = 'success') => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast({ message, tone });
    toastTimerRef.current = setTimeout(() => setToast(null), 3600);
  };

  const ubiBalance = useMemo(
    () =>
      state.goals
        .filter((g) => g.account === 'UBI')
        .reduce((sum, g) => sum + (Number(g.saved) || 0), 0),
    [state.goals]
  );

  const ppfBalance = useMemo(
    () =>
      state.goals
        .filter((g) => g.account === 'PPF')
        .reduce((sum, g) => sum + (Number(g.saved) || 0), 0),
    [state.goals]
  );

  const totalTrackedSavings = useMemo(
    () => state.goals.reduce((sum, g) => sum + (Number(g.saved) || 0), 0),
    [state.goals]
  );

  const monthlyUbiSavingsTarget = useMemo(
    () =>
      state.goals
        .filter((g) => g.account === 'UBI')
        .reduce((sum, g) => sum + (Number(g.monthlyContribution) || 0), 0),
    [state.goals]
  );

  const monthlyTotalGoalContributions = useMemo(
    () => state.goals.reduce((sum, g) => sum + (Number(g.monthlyContribution) || 0), 0),
    [state.goals]
  );

  const monthTransactions = useMemo(
    () =>
      state.transactions
        .filter((tx) => (tx.timestamp || '').startsWith(selectedMonth))
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)),
    [state.transactions, selectedMonth]
  );

  const categoryStats = useMemo(() => {
    const remainingDays = getRemainingDaysInMonth(selectedMonth);
    return SBI_BUDGET_CATEGORIES.map((cat) => {
      const spent = monthTransactions
        .filter((tx) => tx.type === 'expense' && tx.categoryId === cat.id)
        .reduce((sum, tx) => sum + Number(tx.amount || 0), 0);
      const remaining = cat.monthlyBudget - spent;
      const pct = cat.monthlyBudget > 0 ? Math.min(100, (spent / cat.monthlyBudget) * 100) : 0;
      const isOver = spent > cat.monthlyBudget;
      const isWarn = !isOver && pct >= 80;
      const dailySafeSpend = remaining > 0 ? Math.floor(remaining / remainingDays) : 0;
      return {
        ...cat,
        spent,
        remaining,
        pct,
        isOver,
        isWarn,
        dailySafeSpend,
        remainingDays,
      };
    });
  }, [monthTransactions, selectedMonth]);

  const totalMonthSbiSpent = useMemo(
    () =>
      monthTransactions
        .filter((tx) => tx.type === 'expense' && tx.account === 'SBI')
        .reduce((sum, tx) => sum + Number(tx.amount || 0), 0),
    [monthTransactions]
  );

  const totalMonthGoalDeposits = useMemo(
    () =>
      monthTransactions
        .filter((tx) => tx.type === 'goal_deposit')
        .reduce((sum, tx) => sum + Number(tx.amount || 0), 0),
    [monthTransactions]
  );

  const activeChecklist = state.salaryRoutineByMonth[selectedMonth] || {
    step1: false,
    step2: false,
    step3: false,
    step4: false,
    executedAt: null,
  };

  const commitTransaction = (payload) => {
    const amount = Number(payload.amount);
    if (!amount || amount <= 0) {
      showToast('Please enter a valid amount greater than ₹0', 'error');
      return;
    }

    const newTx = {
      id: generateId(),
      amount,
      description: payload.description.trim() || payload.categoryLabel || 'Micro-transaction',
      type: payload.type,
      categoryId: payload.categoryId,
      categoryLabel: payload.categoryLabel,
      goalId: payload.goalId || null,
      account: payload.account,
      paymentMode: payload.paymentMode || 'UPI',
      timestamp: payload.timestamp || new Date().toISOString(),
      deductFromSbi: Boolean(payload.deductFromSbi),
    };

    setState((prev) => {
      let nextSbi = prev.sbiBalance;
      let nextGoals = prev.goals;

      if (newTx.type === 'expense') {
        if (newTx.account === 'SBI') {
          nextSbi = Math.max(0, prev.sbiBalance - amount);
        } else if (newTx.goalId) {
          nextGoals = prev.goals.map((g) =>
            g.id === newTx.goalId ? { ...g, saved: Math.max(0, g.saved - amount) } : g
          );
        }
      } else if (newTx.type === 'goal_withdrawal') {
        nextGoals = prev.goals.map((g) =>
          g.id === newTx.goalId ? { ...g, saved: Math.max(0, g.saved - amount) } : g
        );
      } else if (newTx.type === 'income') {
        nextSbi = prev.sbiBalance + amount;
      } else if (newTx.type === 'goal_deposit') {
        nextGoals = prev.goals.map((g) =>
          g.id === newTx.goalId ? { ...g, saved: g.saved + amount } : g
        );
        if (newTx.deductFromSbi) {
          nextSbi = Math.max(0, prev.sbiBalance - amount);
        }
      }

      return {
        ...prev,
        sbiBalance: nextSbi,
        goals: nextGoals,
        transactions: [newTx, ...prev.transactions],
      };
    });

    showToast(
      `${
        newTx.type === 'income'
          ? 'Logged income'
          : newTx.type === 'goal_deposit'
          ? 'Saved'
          : 'Logged'
      } ${formatINR(amount)}`,
      newTx.type === 'goal_withdrawal' ? 'warn' : 'success'
    );
  };

  const handlePresetTap = (preset) => {
    const catObj = SBI_BUDGET_CATEGORIES.find((c) => c.id === preset.categoryId);
    commitTransaction({
      amount: preset.amount,
      description: preset.label,
      type: 'expense',
      categoryId: preset.categoryId,
      categoryLabel: catObj ? catObj.name : 'Personal expenses',
      goalId: null,
      account: 'SBI',
      paymentMode: preset.paymentMode,
      timestamp: getDefaultDateTimeForMonth(selectedMonth),
    });
  };

  const handleDeleteTransaction = (txId) => {
    const targetTx = state.transactions.find((t) => t.id === txId);
    if (!targetTx) return;

    setState((prev) => {
      let nextSbi = prev.sbiBalance;
      let nextGoals = prev.goals;
      const amt = Number(targetTx.amount || 0);

      if (targetTx.type === 'expense') {
        if (targetTx.account === 'SBI') {
          nextSbi = prev.sbiBalance + amt;
        } else if (targetTx.goalId) {
          nextGoals = prev.goals.map((g) =>
            g.id === targetTx.goalId ? { ...g, saved: g.saved + amt } : g
          );
        }
      } else if (targetTx.type === 'goal_withdrawal') {
        nextGoals = prev.goals.map((g) =>
          g.id === targetTx.goalId ? { ...g, saved: g.saved + amt } : g
        );
      } else if (targetTx.type === 'income') {
        nextSbi = Math.max(0, prev.sbiBalance - amt);
      } else if (targetTx.type === 'goal_deposit') {
        nextGoals = prev.goals.map((g) =>
          g.id === targetTx.goalId ? { ...g, saved: Math.max(0, g.saved - amt) } : g
        );
        if (targetTx.deductFromSbi) {
          nextSbi = prev.sbiBalance + amt;
        }
      }

      return {
        ...prev,
        sbiBalance: nextSbi,
        goals: nextGoals,
        transactions: prev.transactions.filter((t) => t.id !== txId),
      };
    });

    showToast(`Deleted "${targetTx.description}" and reversed balance`, 'info');
  };

  const handleAddMonthlySaving = (goal) => {
    commitTransaction({
      amount: goal.monthlyContribution,
      description: `Monthly saving: ${goal.name}`,
      type: 'goal_deposit',
      categoryId: goal.id,
      categoryLabel: `${goal.name} Deposit`,
      goalId: goal.id,
      account: goal.account,
      paymentMode: 'NetBanking',
      timestamp: getDefaultDateTimeForMonth(selectedMonth),
      deductFromSbi: false,
    });
  };

  const executeSalaryDayRoutine = () => {
    const baseTs = getDefaultDateTimeForMonth(selectedMonth);
    const routineTxs = [
      {
        id: generateId() + '_1',
        amount: 32000,
        description: `Monthly Salary Credited (${formatMonthLabel(selectedMonth)})`,
        type: 'income',
        categoryId: 'salary',
        categoryLabel: 'Monthly Salary',
        goalId: null,
        account: 'SBI',
        paymentMode: 'NetBanking',
        timestamp: baseTs,
        isSalaryRoutine: true,
      },
      {
        id: generateId() + '_2',
        amount: 8000,
        description: 'Salary Routine → Emergency Fund (UBI)',
        type: 'goal_deposit',
        categoryId: 'emergency',
        categoryLabel: 'Emergency fund Deposit',
        goalId: 'emergency',
        account: 'UBI',
        paymentMode: 'NetBanking',
        timestamp: baseTs,
        deductFromSbi: true,
        isSalaryRoutine: true,
      },
      {
        id: generateId() + '_3',
        amount: 5000,
        description: 'Salary Routine → MacBook Fund (UBI)',
        type: 'goal_deposit',
        categoryId: 'macbook',
        categoryLabel: 'MacBook fund Deposit',
        goalId: 'macbook',
        account: 'UBI',
        paymentMode: 'NetBanking',
        timestamp: baseTs,
        deductFromSbi: true,
        isSalaryRoutine: true,
      },
      {
        id: generateId() + '_4',
        amount: 2500,
        description: 'Salary Routine → Home Fund (UBI)',
        type: 'goal_deposit',
        categoryId: 'home',
        categoryLabel: 'Home down-payment fund Deposit',
        goalId: 'home',
        account: 'UBI',
        paymentMode: 'NetBanking',
        timestamp: baseTs,
        deductFromSbi: true,
        isSalaryRoutine: true,
      },
      {
        id: generateId() + '_5',
        amount: 500,
        description: 'Salary Routine → PPF Deposit',
        type: 'goal_deposit',
        categoryId: 'ppf',
        categoryLabel: 'PPF Deposit',
        goalId: 'ppf',
        account: 'PPF',
        paymentMode: 'NetBanking',
        timestamp: baseTs,
        deductFromSbi: true,
        isSalaryRoutine: true,
      },
    ];

    setState((prev) => {
      const nextSbi = prev.sbiBalance + 16000;
      const increments = { emergency: 8000, macbook: 5000, home: 2500, ppf: 500 };
      const nextGoals = prev.goals.map((g) =>
        increments[g.id] ? { ...g, saved: g.saved + increments[g.id] } : g
      );
      return {
        ...prev,
        sbiBalance: nextSbi,
        goals: nextGoals,
        transactions: [...routineTxs.reverse(), ...prev.transactions],
        salaryRoutineByMonth: {
          ...prev.salaryRoutineByMonth,
          [selectedMonth]: {
            step1: true,
            step2: true,
            step3: true,
            step4: true,
            executedAt: new Date().toISOString(),
          },
        },
      };
    });

    showToast('Salary-Day Routine executed! +₹16,000 SBI, +₹15,500 UBI, +₹500 PPF', 'success');
  };

  const toggleChecklistStep = (stepKey) => {
    setState((prev) => {
      const current = prev.salaryRoutineByMonth[selectedMonth] || {
        step1: false,
        step2: false,
        step3: false,
        step4: false,
        executedAt: null,
      };
      return {
        ...prev,
        salaryRoutineByMonth: {
          ...prev.salaryRoutineByMonth,
          [selectedMonth]: {
            ...current,
            [stepKey]: !current[stepKey],
          },
        },
      };
    });
  };

  const updateGoal = (updatedGoal) => {
    setState((prev) => ({
      ...prev,
      goals: prev.goals.map((g) =>
        g.id === updatedGoal.id
          ? {
              ...g,
              saved: Math.max(0, Number(updatedGoal.saved) || 0),
              target: Math.max(1, Number(updatedGoal.target) || 1),
              monthlyContribution: Math.max(0, Number(updatedGoal.monthlyContribution) || 0),
            }
          : g
      ),
    }));
    showToast(`Updated ${updatedGoal.name}`, 'success');
  };

  const addGoal = (newGoal) => {
    setState((prev) => ({
      ...prev,
      goals: [...prev.goals, newGoal],
    }));
    showToast(`Created goal "${newGoal.name}"`, 'success');
  };

  const updateSbiBalance = (newBalance) => {
    setState((prev) => ({
      ...prev,
      sbiBalance: Math.max(0, Number(newBalance) || 0),
    }));
    showToast('Updated SBI operating balance', 'success');
  };

  const handleExportJSON = () => {
    try {
      const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `aashish-finance-backup-${selectedMonth}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast('Exported JSON backup successfully', 'success');
    } catch {
      showToast('Failed to export JSON backup', 'error');
    }
  };

  const handleImportJSON = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const parsed = JSON.parse(evt.target.result);
        if (!parsed || !Array.isArray(parsed.goals) || typeof parsed.sbiBalance !== 'number') {
          showToast('Invalid backup file format', 'error');
          return;
        }
        setState({ ...createDefaultState(), ...parsed });
        showToast('Imported financial backup successfully', 'success');
      } catch {
        showToast('Could not parse JSON file', 'error');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleResetDefaults = () => {
    setState(createDefaultState());
    setSelectedMonth(DEFAULT_MONTH);
    showToast('Reset to November 2026 defaults', 'info');
  };

  return {
    state,
    selectedMonth,
    setSelectedMonth,
    toast,
    showToast,
    metrics: {
      ubiBalance,
      ppfBalance,
      totalTrackedSavings,
      monthlyUbiSavingsTarget,
      monthlyTotalGoalContributions,
      monthTransactions,
      categoryStats,
      totalMonthSbiSpent,
      totalMonthGoalDeposits,
      activeChecklist,
    },
    commitTransaction,
    handlePresetTap,
    handleDeleteTransaction,
    handleAddMonthlySaving,
    executeSalaryDayRoutine,
    toggleChecklistStep,
    updateGoal,
    addGoal,
    updateSbiBalance,
    handleExportJSON,
    handleImportJSON,
    handleResetDefaults,
  };
}
