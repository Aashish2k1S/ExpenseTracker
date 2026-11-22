import { useState, useEffect, useMemo, useRef } from 'react';
import {
  LayoutDashboard,
  Receipt,
  Target,
  Landmark,
  BarChart3,
  Plus,
  Trash2,
  Download,
  Upload,
  RotateCcw,
  AlertTriangle,
  ShieldAlert,
  CheckCircle2,
  Circle,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  Search,
  Edit3,
  Wallet,
  PiggyBank,
  Calendar,
  ChevronLeft,
  ChevronRight,
  X,
  Zap,
  Coffee,
  Utensils,
  Car,
  ShoppingBag,
  Lock,
  // TrendingUp,
  // Check,
  Info,
  CreditCard,
  Banknote,
  Smartphone,
  Building2,
} from 'lucide-react';
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

// ============================================================================
// CONSTANTS & INITIAL NOVEMBER 2026 CONFIGURATION
// ============================================================================

const STORAGE_KEY = 'aashish_financial_dashboard_v1';

const DEFAULT_MONTH = '2026-11';

const BUDGET_BREAKDOWN_ROWS = [
  { id: 'family', category: 'Family contribution', monthly: 10000, allocation: '31.25%', account: 'SBI', type: 'operating' },
  { id: 'personal', category: 'Personal expenses', monthly: 4000, allocation: '12.50%', account: 'SBI', type: 'operating' },
  { id: 'emergency', category: 'Emergency fund', monthly: 8000, allocation: '25.00%', account: 'UBI', type: 'savings' },
  { id: 'macbook', category: 'MacBook fund', monthly: 5000, allocation: '15.63%', account: 'UBI', type: 'savings' },
  { id: 'home', category: 'Home down-payment fund', monthly: 2500, allocation: '7.81%', account: 'UBI', type: 'savings' },
  { id: 'ppf', category: 'PPF', monthly: 500, allocation: '1.56%', account: 'PPF', type: 'savings' },
  { id: 'misc', category: 'Miscellaneous buffer', monthly: 2000, allocation: '6.25%', account: 'SBI', type: 'operating' },
];

const SBI_BUDGET_CATEGORIES = [
  { id: 'family', name: 'Family contribution', monthlyBudget: 10000, allocation: 31.25, color: '#3b82f6' },
  { id: 'personal', name: 'Personal expenses', monthlyBudget: 4000, allocation: 12.5, color: '#FD1C00' },
  { id: 'misc', name: 'Miscellaneous buffer', monthlyBudget: 2000, allocation: 6.25, color: '#f59e0b' },
];

const QUICK_PRESETS = [
  { label: 'Chai', amount: 20, categoryId: 'personal', paymentMode: 'UPI', icon: 'coffee' },
  { label: 'Snacks', amount: 30, categoryId: 'personal', paymentMode: 'UPI', icon: 'utensils' },
  { label: 'Auto / Rapido', amount: 50, categoryId: 'personal', paymentMode: 'UPI', icon: 'car' },
  { label: 'Lunch', amount: 100, categoryId: 'personal', paymentMode: 'UPI', icon: 'utensils' },
  { label: 'Groceries', amount: 150, categoryId: 'misc', paymentMode: 'UPI', icon: 'bag' },
];

const PAYMENT_MODES = ['UPI', 'Cash', 'Card', 'NetBanking'];

const FINANCIAL_RULES = [
  {
    number: '01',
    title: 'No consumer EMI',
    description:
      "Don't finance the MacBook or iPhone while building your financial foundation. Save up in your UBI bucket and buy outright.",
    badge: 'Debt-Free Foundation',
    accent: '#FD1C00',
  },
  {
    number: '02',
    title: "Don't touch emergency savings",
    description:
      'Only genuine emergencies qualify. Every withdrawal from the Emergency Fund triggers a guardrail confirmation.',
    badge: 'Protected Capital',
    accent: '#f59e0b',
  },
  {
    number: '03',
    title: 'Review every salary cycle',
    description:
      'Update your balances and actual expenses once a month. Compare real spending against the ₹32,000 plan and adjust based on facts.',
    badge: 'Monthly Discipline',
    accent: '#10b981',
  },
];

const createDefaultState = () => ({
  profile: {
    name: 'Aashish',
    grossSalary: 36000,
    inHandSalary: 32000,
    deductions: 4000,
  },
  sbiBalance: 1032,
  goals: [
    {
      id: 'emergency',
      name: 'Emergency fund',
      horizon: 'short',
      saved: 0,
      target: 100000,
      monthlyContribution: 8000,
      account: 'UBI',
      expectedTime: '13 months',
      milestoneTip:
        'Once your emergency fund reaches ₹1,00,000, redirect part of this ₹8,000/month contribution towards your Home down-payment fund.',
    },
    {
      id: 'macbook',
      name: 'MacBook fund',
      horizon: 'short',
      saved: 0,
      target: 115000,
      monthlyContribution: 5000,
      account: 'UBI',
      expectedTime: '23 months',
      milestoneTip: 'Follow Rule #1: No consumer EMI. Buy outright when you hit ₹1,15,000.',
    },
    {
      id: 'home',
      name: 'Home down-payment fund',
      horizon: 'long',
      saved: 0,
      target: 300000,
      monthlyContribution: 2500,
      account: 'UBI',
      expectedTime: '10 years',
      milestoneTip:
        'Initial ₹3,00,000 milestone. Accelerate after Emergency Fund reaches ₹1,00,000.',
    },
    {
      id: 'ppf',
      name: 'PPF',
      horizon: 'long',
      saved: 1000,
      target: 100000,
      monthlyContribution: 500,
      account: 'PPF',
      expectedTime: '15 years',
      milestoneTip:
        'Long-term 15-year tax-free compounding. Tracked separately from bank balances.',
    },
  ],
  transactions: [],
  salaryRoutineByMonth: {
    '2026-11': {
      step1: false,
      step2: false,
      step3: false,
      step4: false,
      executedAt: null,
    },
  },
});

// ============================================================================
// UTILITY FUNCTIONS (INDIAN NUMBERING & DATE HELPERS)
// ============================================================================

/**
 * Format numeric values into Indian Rupees using the Indian numbering system (en-IN).
 * Example: 100000 -> ₹1,00,000, 32000 -> ₹32,000
 */
const formatINR = (value) => {
  const num = Number(value) || 0;
  const isWhole = Math.abs(num - Math.round(num)) < 0.001;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: isWhole ? 0 : 2,
    maximumFractionDigits: isWhole ? 0 : 2,
  }).format(num);
};

/**
 * Convert YYYY-MM into readable Month Year (e.g. "November 2026")
 */
const formatMonthLabel = (monthKey) => {
  if (!monthKey || !monthKey.includes('-')) return 'November 2026';
  const [y, m] = monthKey.split('-').map(Number);
  const date = new Date(y, m - 1, 1);
  return date.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
};

/**
 * Shift YYYY-MM by delta months (-1 or +1)
 */
const shiftMonth = (monthKey, delta) => {
  const [y, m] = monthKey.split('-').map(Number);
  const d = new Date(y, m - 1 + delta, 1);
  const nextY = d.getFullYear();
  const nextM = String(d.getMonth() + 1).padStart(2, '0');
  return `${nextY}-${nextM}`;
};

/**
 * Calculate remaining days in a YYYY-MM cycle for Daily Safe Spend.
 */
const getRemainingDaysInMonth = (monthKey) => {
  const [y, m] = monthKey.split('-').map(Number);
  const daysInMonth = new Date(y, m, 0).getDate();
  const now = new Date();
  const currentKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  if (monthKey === currentKey) {
    return Math.max(1, daysInMonth - now.getDate() + 1);
  }
  return daysInMonth;
};

/**
 * Generate a local datetime-local input value for a given monthKey
 */
const getDefaultDateTimeForMonth = (monthKey) => {
  const now = new Date();
  const currentKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const hh = String(now.getHours()).padStart(2, '0');
  const mm = String(now.getMinutes()).padStart(2, '0');
  if (monthKey === currentKey) {
    const dd = String(now.getDate()).padStart(2, '0');
    return `${monthKey}-${dd}T${hh}:${mm}`;
  }
  return `${monthKey}-01T10:00`;
};

/**
 * Format ISO or datetime-local string into readable date header (e.g. "Sat, 21 Nov 2026")
 */
const formatDateHeader = (isoStr) => {
  const d = new Date(isoStr);
  if (Number.isNaN(d.getTime())) return isoStr;
  return d.toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

const formatTimeOnly = (isoStr) => {
  const d = new Date(isoStr);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
};

const generateId = () => `tx_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

// ============================================================================
// MAIN APPLICATION COMPONENT
// ============================================================================

export default function App() {
  // Load persisted state from localStorage safely
  const [state, setState] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && Array.isArray(parsed.goals) && typeof parsed.sbiBalance === 'number') {
          return {
            ...createDefaultState(),
            ...parsed,
          };
        }
      }
    } catch (err) {
      console.error('Failed to read localStorage:', err);
    }
    return createDefaultState();
  });

  // UI Navigation & Active Month
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedMonth, setSelectedMonth] = useState(DEFAULT_MONTH);

  // Toast Notification
  const [toast, setToast] = useState(null);
  const toastTimerRef = useRef(null);

  // Modals State
  const [emergencyModalTx, setEmergencyModalTx] = useState(null);
  const [emergencyConfirmedCheck, setEmergencyConfirmedCheck] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [showSalaryConfirmModal, setShowSalaryConfirmModal] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [showNewGoalModal, setShowNewGoalModal] = useState(false);
  const [showSbiEditModal, setShowSbiEditModal] = useState(false);
  const [sbiEditValue, setSbiEditValue] = useState('');

  // Quick Log Form State
  const [txForm, setTxForm] = useState(() => ({
    amount: '',
    description: '',
    type: 'expense', // 'expense' | 'income' | 'goal_deposit'
    categoryId: 'personal', // 'personal' | 'family' | 'misc' | 'emergency_withdrawal' | 'salary' | 'other_income'
    goalId: 'emergency',
    account: 'SBI',
    paymentMode: 'UPI',
    timestamp: getDefaultDateTimeForMonth(DEFAULT_MONTH),
  }));

  // Transaction Ledger Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [filterPayment, setFilterPayment] = useState('all');

  // File Input ref for JSON import
  const fileInputRef = useRef(null);

  // Persist to localStorage on every state update
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (err) {
      console.error('Failed to save to localStorage:', err);
    }
  }, [state]);

  // Update default timestamp when selectedMonth changes
  useEffect(() => {
    setTxForm((prev) => ({
      ...prev,
      timestamp: getDefaultDateTimeForMonth(selectedMonth),
    }));
  }, [selectedMonth]);

  // Toast helper
  const showToast = (message, tone = 'success') => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast({ message, tone });
    toastTimerRef.current = setTimeout(() => setToast(null), 3600);
  };

  // ============================================================================
  // DERIVED METRICS & CALCULATIONS
  // ============================================================================

  const ubiBalance = useMemo(
    () => state.goals.filter((g) => g.account === 'UBI').reduce((sum, g) => sum + (Number(g.saved) || 0), 0),
    [state.goals]
  );

  const ppfBalance = useMemo(
    () => state.goals.filter((g) => g.account === 'PPF').reduce((sum, g) => sum + (Number(g.saved) || 0), 0),
    [state.goals]
  );

  // Total Tracked Savings = all Goals + PPF (kept strictly separate from SBI operating balance)
  const totalTrackedSavings = useMemo(
    () => state.goals.reduce((sum, g) => sum + (Number(g.saved) || 0), 0),
    [state.goals]
  );

  // Monthly savings goals target (UBI buckets = ₹15,500)
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

  // Transactions filtered to selectedMonth
  const monthTransactions = useMemo(() => {
    return state.transactions
      .filter((tx) => (tx.timestamp || '').startsWith(selectedMonth))
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }, [state.transactions, selectedMonth]);

  // Real-time SBI budget consumption per category for selectedMonth
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

  // Filtered ledger transactions
  const filteredTransactions = useMemo(() => {
    return monthTransactions.filter((tx) => {
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
  }, [monthTransactions, filterType, filterCategory, filterPayment, searchQuery]);

  // Group filtered transactions by YYYY-MM-DD
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

  // Active month salary checklist
  const activeChecklist = state.salaryRoutineByMonth[selectedMonth] || {
    step1: false,
    step2: false,
    step3: false,
    step4: false,
    executedAt: null,
  };

  // ============================================================================
  // CORE TRANSACTION & GOAL HANDLERS
  // ============================================================================

  /**
   * Commit a validated transaction and atomically update account / goal balances
   */
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
      `${newTx.type === 'income' ? 'Logged income' : newTx.type === 'goal_deposit' ? 'Saved' : 'Logged'} ${formatINR(amount)}`,
      newTx.type === 'goal_withdrawal' ? 'warn' : 'success'
    );
  };

  /**
   * Handle Quick Log form submission with Rule #2 Emergency Fund Guardrail
   */
  const handleQuickLogSubmit = (e) => {
    e.preventDefault();
    const amount = parseFloat(txForm.amount);
    if (!amount || amount <= 0) {
      showToast('Enter an amount greater than ₹0', 'error');
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
      const targetGoal = state.goals.find((g) => g.id === txForm.goalId) || state.goals[0];
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

    // Rule #2 Guardrail: Intercept any Emergency Fund withdrawal
    if (finalType === 'goal_withdrawal' && finalGoalId === 'emergency') {
      setEmergencyConfirmedCheck(false);
      setEmergencyModalTx(txPayload);
      return;
    }

    commitTransaction(txPayload);
    setTxForm((prev) => ({
      ...prev,
      amount: '',
      description: '',
    }));
  };

  /**
   * Instant 1-tap preset pill logging (Chai ₹20, Snacks ₹30, etc.)
   */
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

  /**
   * Delete a transaction and cleanly reverse its balance effect
   */
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

  /**
   * "+ Add monthly saving" button on a Goal Card
   */
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

  /**
   * 1-Click "Execute Salary Day Routine"
   * Credits ₹32,000 to SBI, transfers ₹15,500 to UBI (₹8k Emergency, ₹5k MacBook, ₹2.5k Home),
   * deposits ₹500 to PPF, leaving net +₹16,000 in SBI.
   */
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
      // +32,000 salary - 15,500 UBI - 500 PPF = +16,000 net in SBI
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

    setShowSalaryConfirmModal(false);
    showToast('Salary-Day Routine executed! +₹16,000 SBI, +₹15,500 UBI, +₹500 PPF', 'success');
  };

  /**
   * Toggle individual Salary-Day checklist step
   */
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

  /**
   * Export all dashboard data as JSON
   */
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
    } catch (err) {
      showToast('Failed to export JSON backup', 'error');
    }
  };

  /**
   * Import dashboard data from JSON file
   */
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
        setState({
          ...createDefaultState(),
          ...parsed,
        });
        showToast('Imported financial backup successfully', 'success');
      } catch (err) {
        showToast('Could not parse JSON file', 'error');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  /**
   * Reset to November 2026 Defaults
   */
  const handleResetDefaults = () => {
    const fresh = createDefaultState();
    setState(fresh);
    setSelectedMonth(DEFAULT_MONTH);
    setShowResetModal(false);
    showToast('Reset to November 2026 defaults', 'info');
  };

  // ============================================================================
  // CHART DATA FOR MONTHLY REVIEW
  // ============================================================================

  const plannedVsActualData = useMemo(() => {
    const sbiRows = categoryStats.map((c) => ({
      name: c.name.split(' ')[0],
      fullName: c.name,
      Planned: c.monthlyBudget,
      Actual: c.spent,
    }));

    const goalRows = state.goals.map((g) => {
      const actualSaved = monthTransactions
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
  }, [categoryStats, state.goals, monthTransactions]);

  const savingsVsExpensesPieData = useMemo(() => {
    const data = [
      { name: 'SBI Expenses', value: totalMonthSbiSpent, color: '#FD1C00' },
      { name: 'Goals & PPF Saved', value: totalMonthGoalDeposits, color: '#10b981' },
    ];
    if (totalMonthSbiSpent === 0 && totalMonthGoalDeposits === 0) {
      return [
        { name: 'Planned Operating (SBI)', value: 16000, color: '#FD1C00' },
        { name: 'Planned Savings (UBI + PPF)', value: 16000, color: '#10b981' },
      ];
    }
    return data.filter((d) => d.value > 0);
  }, [totalMonthSbiSpent, totalMonthGoalDeposits]);

  // ============================================================================
  // NAVIGATION ITEMS
  // ============================================================================

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'transactions', label: 'Micro-Tx', fullLabel: 'Micro-Transactions', icon: Receipt },
    { id: 'goals', label: 'Goals', icon: Target },
    { id: 'accounts', label: 'Accounts', fullLabel: 'Accounts & Routine', icon: Landmark },
    { id: 'review', label: 'Review', fullLabel: 'Monthly Review', icon: BarChart3 },
  ];

  // ============================================================================
  // REUSABLE SUB-COMPONENTS (INLINE FOR SINGLE-FILE ARCHITECTURE)
  // ============================================================================

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

  const renderQuickLogWidget = (compact = false) => (
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
              className={`px-2.5 py-1.5 rounded-md font-medium transition-all ${txForm.type === t.id
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

      {/* Quick-Tap Preset Pills */}
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
                onClick={() => handlePresetTap(preset)}
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

      {/* Custom Entry Form */}
      <form onSubmit={handleQuickLogSubmit} className="space-y-3">
        <div className={`grid grid-cols-1 ${compact ? 'sm:grid-cols-2' : 'sm:grid-cols-4'} gap-3`}>
          {/* Amount */}
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

          {/* Description */}
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

          {/* Category / Goal */}
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
                {state.goals.map((g) => (
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
          {/* Payment Mode */}
          <div>
            <label className="block text-[11px] text-[#a3a3a3] mb-1">Payment Mode</label>
            <div className="grid grid-cols-4 gap-1 bg-[#0a0a0a] border border-[#262626] rounded-xl p-1">
              {PAYMENT_MODES.map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setTxForm((p) => ({ ...p, paymentMode: mode }))}
                  className={`py-1.5 rounded-lg text-[11px] font-medium transition-colors ${txForm.paymentMode === mode
                      ? 'bg-[#262626] text-[#f5f5f5]'
                      : 'text-[#a3a3a3] hover:text-[#f5f5f5]'
                    }`}
                >
                  {mode === 'NetBanking' ? 'Bank' : mode}
                </button>
              ))}
            </div>
          </div>

          {/* Date & Time */}
          <div>
            <label className="block text-[11px] text-[#a3a3a3] mb-1">Date & Time</label>
            <input
              type="datetime-local"
              value={txForm.timestamp}
              onChange={(e) => setTxForm((p) => ({ ...p, timestamp: e.target.value }))}
              className="w-full bg-[#0a0a0a] border border-[#262626] focus:border-[#FD1C00] rounded-xl px-3 py-2 text-xs text-[#f5f5f5] outline-none"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className={`w-full py-2.5 px-4 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${txForm.type === 'expense'
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

  const renderBudgetBars = () => (
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
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: cat.color }}
                />
                <span className="text-sm font-medium text-[#f5f5f5]">{cat.name}</span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#0a0a0a] border border-[#262626] text-[#a3a3a3]">
                  {cat.allocation}%
                </span>
              </div>
              <div className="text-right">
                <span
                  className={`text-sm font-semibold ${cat.isOver ? 'text-[#FD1C00]' : cat.isWarn ? 'text-[#f59e0b]' : 'text-[#f5f5f5]'
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
              <span
                className={
                  cat.isOver ? 'text-[#FD1C00] font-medium' : 'text-[#a3a3a3]'
                }
              >
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

  const renderGoalCard = (goal) => {
    const pct = goal.target > 0 ? Math.min(100, Math.round((goal.saved / goal.target) * 100)) : 0;
    const remainingAmt = Math.max(0, goal.target - goal.saved);
    const dynamicMonths =
      goal.monthlyContribution > 0 ? Math.ceil(remainingAmt / goal.monthlyContribution) : 0;
    const isCompleted = remainingAmt === 0;

    return (
      <div
        key={goal.id}
        className="bg-[#141414] border border-[#262626] hover:border-[#363636] rounded-2xl p-5 flex flex-col justify-between transition-all"
      >
        <div>
          <div className="flex items-start justify-between gap-3 mb-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-base font-semibold text-[#f5f5f5]">{goal.name}</h3>
                <span
                  className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full font-semibold border ${goal.account === 'PPF'
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
                className={`text-sm font-bold px-2.5 py-1 rounded-lg ${isCompleted
                    ? 'bg-[#10b981]/20 text-[#10b981]'
                    : 'bg-[#1c1c1c] text-[#f5f5f5] border border-[#262626]'
                  }`}
              >
                {pct}%
              </span>
              <button
                type="button"
                onClick={() => setEditingGoal({ ...goal })}
                title="Edit balance or target"
                className="p-2 rounded-lg bg-[#1c1c1c] hover:bg-[#262626] text-[#a3a3a3] hover:text-[#f5f5f5] border border-[#262626] transition-colors"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Saved vs Target */}
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

          {/* Progress Bar */}
          <div className="w-full h-2.5 bg-[#0a0a0a] border border-[#262626] rounded-full overflow-hidden mb-3">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${pct}%`,
                backgroundColor: isCompleted ? '#10b981' : goal.account === 'PPF' ? '#10b981' : '#FD1C00',
              }}
            />
          </div>

          {/* Timeline Info */}
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

          {/* Milestone Tip */}
          {goal.milestoneTip && (
            <div className="bg-[#1c1c1c] border border-[#262626] rounded-xl p-2.5 mb-4 flex items-start gap-2">
              <Sparkles className="w-3.5 h-3.5 text-[#f59e0b] shrink-0 mt-0.5" />
              <p className="text-[11px] text-[#a3a3a3] leading-relaxed">{goal.milestoneTip}</p>
            </div>
          )}
        </div>

        {/* Action Button */}
        <button
          type="button"
          onClick={() => handleAddMonthlySaving(goal)}
          className="w-full py-2.5 px-3 rounded-xl bg-[#1c1c1c] hover:bg-[#10b981] text-[#f5f5f5] hover:text-[#0a0a0a] border border-[#262626] hover:border-[#10b981] text-xs font-semibold flex items-center justify-center gap-1.5 transition-all active:scale-[0.98]"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add monthly saving ({formatINR(goal.monthlyContribution)})</span>
        </button>
      </div>
    );
  };

  // ============================================================================
  // TAB CONTENT RENDERERS
  // ============================================================================

  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* Top KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Monthly Income */}
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

        {/* Monthly Savings Goals */}
        <div className="bg-[#141414] border border-[#262626] rounded-2xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-[#a3a3a3]">Monthly savings goals</span>
            <Target className="w-4 h-4 text-[#10b981]" />
          </div>
          <p className="text-2xl font-bold text-[#10b981]">{formatINR(monthlyUbiSavingsTarget)}</p>
          <p className="text-[11px] text-[#a3a3a3] mt-1">
            UBI buckets + ₹500 PPF (50% w/ buffer)
          </p>
        </div>

        {/* Current Bank Balance (SBI) */}
        <div className="bg-[#141414] border border-[#262626] rounded-2xl p-4 relative group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-[#a3a3a3]">Current bank balance</span>
            <button
              type="button"
              onClick={() => {
                setSbiEditValue(String(state.sbiBalance));
                setShowSbiEditModal(true);
              }}
              className="text-[#a3a3a3] hover:text-[#f5f5f5] transition-colors"
              title="Adjust SBI balance"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-2xl font-bold text-[#f5f5f5]">{formatINR(state.sbiBalance)}</p>
          <p className="text-[11px] text-[#a3a3a3] mt-1">SBI operating (separate from goals)</p>
        </div>

        {/* Current PPF */}
        <div className="bg-[#141414] border border-[#262626] rounded-2xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-[#a3a3a3]">Current PPF</span>
            <Lock className="w-4 h-4 text-[#10b981]" />
          </div>
          <p className="text-2xl font-bold text-[#f5f5f5]">{formatINR(ppfBalance)}</p>
          <p className="text-[11px] text-[#a3a3a3] mt-1">15-year long-term account</p>
        </div>

        {/* Total Tracked Savings */}
        <div className="bg-linear-to-br from-[#141414] to-[#1c1c1c] border border-[#FD1C00]/40 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-[#f5f5f5] font-medium">Total tracked savings</span>
            <PiggyBank className="w-4 h-4 text-[#FD1C00]" />
          </div>
          <p className="text-2xl font-bold text-[#f5f5f5]">{formatINR(totalTrackedSavings)}</p>
          <p className="text-[11px] text-[#a3a3a3] mt-1">
            UBI ({formatINR(ubiBalance)}) + PPF ({formatINR(ppfBalance)})
          </p>
        </div>
      </div>

      {/* Quick Log + SBI Budget Consumption */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">{renderQuickLogWidget(true)}</div>
        <div className="lg:col-span-5">{renderBudgetBars()}</div>
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
          {state.goals.map((goal) => renderGoalCard(goal))}
        </div>
      </div>

      {/* Recent Micro-Transactions */}
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
            View full ledger ({monthTransactions.length})
          </button>
        </div>
        {monthTransactions.length === 0 ? (
          <div className="text-center py-8 border border-dashed border-[#262626] rounded-xl">
            <Receipt className="w-8 h-8 text-[#a3a3a3] mx-auto mb-2 opacity-60" />
            <p className="text-sm text-[#f5f5f5] font-medium">No transactions logged yet</p>
            <p className="text-xs text-[#a3a3a3] mt-1">
              Tap a quick preset above (like Chai ₹20) or execute your Salary-Day Routine to begin.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[#262626]">
            {monthTransactions.slice(0, 6).map((tx) => (
              <div
                key={tx.id}
                className="py-3 flex items-center justify-between gap-3 hover:bg-[#1c1c1c]/50 px-2 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${tx.type === 'income' || tx.type === 'goal_deposit'
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
                    className={`text-sm font-semibold ${tx.type === 'income' || tx.type === 'goal_deposit'
                        ? 'text-[#10b981]'
                        : 'text-[#f5f5f5]'
                      }`}
                  >
                    {tx.type === 'income' || tx.type === 'goal_deposit' ? '+' : '-'}
                    {formatINR(tx.amount)}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleDeleteTransaction(tx.id)}
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

  const renderTransactionsTab = () => (
    <div className="space-y-6">
      {renderQuickLogWidget(false)}
      {renderBudgetBars()}

      {/* Search & Filters */}
      <div className="bg-[#141414] border border-[#262626] rounded-2xl p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-5">
          <div>
            <h2 className="text-base font-semibold text-[#f5f5f5]">
              Transaction Ledger — {formatMonthLabel(selectedMonth)}
            </h2>
            <p className="text-xs text-[#a3a3a3]">
              Showing {filteredTransactions.length} of {monthTransactions.length} entries
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Search */}
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

            {/* Type Filter */}
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

            {/* Category Filter */}
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

            {/* Payment Mode */}
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

        {/* Grouped Ledger by Date */}
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
                          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${tx.type === 'income' || tx.type === 'goal_deposit'
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
                          className={`text-sm font-bold ${tx.type === 'income' || tx.type === 'goal_deposit'
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
                          onClick={() => handleDeleteTransaction(tx.id)}
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

  const renderGoalsTab = () => {
    const shortTermGoals = state.goals.filter((g) => g.horizon === 'short');
    const longTermGoals = state.goals.filter((g) => g.horizon === 'long');
    const totalTarget = state.goals.reduce((s, g) => s + Number(g.target || 0), 0);
    const overallPct = totalTarget > 0 ? Math.round((totalTrackedSavings / totalTarget) * 100) : 0;

    return (
      <div className="space-y-6">
        {/* Goals Header Summary */}
        <div className="bg-[#141414] border border-[#262626] rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 flex-1">
            <div>
              <p className="text-xs text-[#a3a3a3]">Total Tracked Savings</p>
              <p className="text-2xl font-bold text-[#10b981] mt-0.5">
                {formatINR(totalTrackedSavings)}
              </p>
            </div>
            <div>
              <p className="text-xs text-[#a3a3a3]">Combined Target</p>
              <p className="text-2xl font-bold text-[#f5f5f5] mt-0.5">{formatINR(totalTarget)}</p>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <p className="text-xs text-[#a3a3a3]">Monthly Committed</p>
              <p className="text-2xl font-bold text-[#f5f5f5] mt-0.5">
                {formatINR(monthlyTotalGoalContributions)}
                <span className="text-xs font-normal text-[#a3a3a3] ml-1">({overallPct}%)</span>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowNewGoalModal(true)}
            className="px-4 py-2.5 rounded-xl bg-[#FD1C00] hover:bg-[#e01800] text-white text-sm font-semibold flex items-center justify-center gap-2 transition-all shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>New Goal</span>
          </button>
        </div>

        {/* Short-Term Goals */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-[#FD1C00]" />
            <h2 className="text-base font-semibold text-[#f5f5f5]">Short-Term Goals</h2>
            <span className="text-xs text-[#a3a3a3]">(1–2 Years Horizon)</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {shortTermGoals.map((g) => renderGoalCard(g))}
          </div>
        </div>

        {/* Long-Term Goals */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-[#10b981]" />
            <h2 className="text-base font-semibold text-[#f5f5f5]">Long-Term Goals</h2>
            <span className="text-xs text-[#a3a3a3]">(10–15 Years Horizon)</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {longTermGoals.map((g) => renderGoalCard(g))}
          </div>
        </div>
      </div>
    );
  };

  const renderAccountsTab = () => {
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
        {/* Account Architecture Cards */}
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
                  onClick={() => {
                    setSbiEditValue(String(state.sbiBalance));
                    setShowSbiEditModal(true);
                  }}
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

          {/* UBI Virtual Buckets */}
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
              <p className="text-3xl font-bold text-[#f5f5f5] mb-1">{formatINR(ubiBalance)}</p>
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
              <p className="text-3xl font-bold text-[#10b981] mb-1">{formatINR(ppfBalance)}</p>
              <p className="text-xs text-[#a3a3a3] mb-4">Monthly deposit: ₹500 (1.56%)</p>
            </div>
            <div className="bg-[#1c1c1c] border border-[#262626] rounded-xl p-3 text-xs text-[#a3a3a3]">
              Shown separately because PPF is not a liquid bank-account balance. 15-year compounding
              horizon.
            </div>
          </div>
        </div>

        {/* Interactive Salary-Day Routine */}
        <div className="bg-[#141414] border border-[#262626] rounded-2xl p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-semibold text-[#f5f5f5]">
                  Salary-Day Routine ({formatMonthLabel(selectedMonth)})
                </h2>
                {activeChecklist.executedAt && (
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
              onClick={() => setShowSalaryConfirmModal(true)}
              className="px-4 py-2.5 rounded-xl bg-[#FD1C00] hover:bg-[#e01800] text-white text-sm font-semibold flex items-center justify-center gap-2 shadow-lg shadow-[#FD1C00]/20 transition-all active:scale-[0.98]"
            >
              <Zap className="w-4 h-4" />
              <span>Execute Salary Day Routine</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {routineSteps.map((step, idx) => {
              const checked = Boolean(activeChecklist[step.key]);
              return (
                <button
                  key={step.key}
                  type="button"
                  onClick={() => toggleChecklistStep(step.key)}
                  className={`text-left p-4 rounded-xl border transition-all flex items-start gap-3 ${checked
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
                        className={`text-sm font-semibold ${checked ? 'text-[#10b981] line-through' : 'text-[#f5f5f5]'
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

        {/* Locked Monthly Salary Breakdown Table */}
        <div className="bg-[#141414] border border-[#262626] rounded-2xl p-5 overflow-x-auto">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
            <div>
              <h2 className="text-base font-semibold text-[#f5f5f5]">
                Confirmed Monthly Salary Breakdown
              </h2>
              <p className="text-xs text-[#a3a3a3]">
                In-Hand: ₹32,000 | Gross: ₹36,000 | Savings Rate: 50% (₹16,000 incl. buffer)
              </p>
            </div>
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
  };

  const renderReviewTab = () => (
    <div className="space-y-6">
      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Planned vs Actual Bar Chart */}
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

        {/* Savings vs Expenses Donut */}
        <div className="lg:col-span-5 bg-[#141414] border border-[#262626] rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <h2 className="text-base font-semibold text-[#f5f5f5]">Savings vs Expenses</h2>
            <p className="text-xs text-[#a3a3a3]">
              {totalMonthSbiSpent === 0 && totalMonthGoalDeposits === 0
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

      {/* 3 Non-Negotiable Financial Rules */}
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

      {/* Data Backup & Reset */}
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
            onClick={handleExportJSON}
            className="px-3.5 py-2 rounded-xl bg-[#1c1c1c] hover:bg-[#262626] border border-[#262626] text-xs font-medium text-[#f5f5f5] flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            Export JSON
          </button>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-3.5 py-2 rounded-xl bg-[#1c1c1c] hover:bg-[#262626] border border-[#262626] text-xs font-medium text-[#f5f5f5] flex items-center gap-1.5"
          >
            <Upload className="w-3.5 h-3.5" />
            Import JSON
          </button>
          <button
            type="button"
            onClick={() => setShowResetModal(true)}
            className="px-3.5 py-2 rounded-xl bg-[#FD1C00]/10 hover:bg-[#FD1C00]/20 border border-[#FD1C00]/30 text-xs font-medium text-[#FD1C00] flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset to Nov 2026 Defaults
          </button>
        </div>
      </div>
    </div>
  );

  // ============================================================================
  // MAIN RENDER
  // ============================================================================

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f5f5f5] font-sans selection:bg-[#FD1C00]/30 selection:text-white pb-20 md:pb-8">
      {/* Custom Scrollbar & Dark Input Styles */}
      <style>{`
        input[type="datetime-local"]::-webkit-calendar-picker-indicator {
          filter: invert(1);
          opacity: 0.6;
          cursor: pointer;
        }
        ::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        ::-webkit-scrollbar-track {
          background: #0a0a0a;
        }
        ::-webkit-scrollbar-thumb {
          background: #262626;
          border-radius: 9999px;
        }
      `}</style>

      {/* Hidden File Input for JSON Import */}
      <input
        ref={fileInputRef}
        type="file"
        accept="application/json"
        onChange={handleImportJSON}
        className="hidden"
      />

      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 max-w-sm bg-[#1c1c1c] border border-[#262626] shadow-2xl rounded-xl px-4 py-3 flex items-center gap-2.5 animate-fade-in">
          {toast.tone === 'error' ? (
            <AlertTriangle className="w-4 h-4 text-[#FD1C00] shrink-0" />
          ) : toast.tone === 'warn' ? (
            <AlertTriangle className="w-4 h-4 text-[#f59e0b] shrink-0" />
          ) : toast.tone === 'info' ? (
            <Info className="w-4 h-4 text-blue-400 shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-[#10b981] shrink-0" />
          )}
          <span className="text-xs font-medium text-[#f5f5f5]">{toast.message}</span>
        </div>
      )}

      {/* Desktop + Mobile Shell */}
      <div className="max-w-360 mx-auto flex flex-col md:flex-row min-h-screen">
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex flex-col w-64 shrink-0 border-r border-[#262626] bg-[#0a0a0a] p-5 sticky top-0 h-screen justify-between">
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-[#FD1C00] flex items-center justify-center text-white font-black text-lg shadow-lg shadow-[#FD1C00]/25">
                A
              </div>
              <div>
                <h1 className="text-sm font-bold text-[#f5f5f5] leading-tight">
                  Aashish's Finance
                </h1>
                <p className="text-[11px] text-[#a3a3a3]">Personal Dashboard</p>
              </div>
            </div>

            <nav className="space-y-1.5">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${active
                        ? 'bg-[#1c1c1c] text-[#f5f5f5] border border-[#262626] shadow-sm'
                        : 'text-[#a3a3a3] hover:text-[#f5f5f5] hover:bg-[#141414]'
                      }`}
                  >
                    <Icon className={`w-4 h-4 ${active ? 'text-[#FD1C00]' : ''}`} />
                    <span>{item.fullLabel || item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Sidebar Footer Summary */}
          <div className="bg-[#141414] border border-[#262626] rounded-xl p-3.5 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#a3a3a3]">SBI Operating</span>
              <span className="font-semibold text-[#f5f5f5]">{formatINR(state.sbiBalance)}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#a3a3a3]">Tracked Savings</span>
              <span className="font-semibold text-[#10b981]">{formatINR(totalTrackedSavings)}</span>
            </div>
            <div className="pt-2 border-t border-[#262626] flex items-center justify-between gap-1">
              <button
                type="button"
                onClick={handleExportJSON}
                className="flex-1 py-1.5 rounded-lg bg-[#1c1c1c] hover:bg-[#262626] text-[11px] text-[#a3a3a3] hover:text-[#f5f5f5] flex items-center justify-center gap-1"
                title="Export JSON"
              >
                <Download className="w-3 h-3" /> Export
              </button>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 py-1.5 rounded-lg bg-[#1c1c1c] hover:bg-[#262626] text-[11px] text-[#a3a3a3] hover:text-[#f5f5f5] flex items-center justify-center gap-1"
                title="Import JSON"
              >
                <Upload className="w-3 h-3" /> Import
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content Column */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8">
          {/* Top Header */}
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

              <button
                type="button"
                onClick={() => setShowResetModal(true)}
                className="p-2.5 rounded-xl bg-[#141414] hover:bg-[#1c1c1c] border border-[#262626] text-[#a3a3a3] hover:text-[#FD1C00] transition-colors"
                title="Reset to Nov 2026 Defaults"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </header>

          {/* Active Tab View */}
          {activeTab === 'overview' && renderOverviewTab()}
          {activeTab === 'transactions' && renderTransactionsTab()}
          {activeTab === 'goals' && renderGoalsTab()}
          {activeTab === 'accounts' && renderAccountsTab()}
          {activeTab === 'review' && renderReviewTab()}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#141414]/95 backdrop-blur-md border-t border-[#262626] px-2 py-1.5 flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center gap-1 px-2.5 py-1.5 rounded-xl text-[10px] font-medium transition-colors ${active ? 'text-[#FD1C00]' : 'text-[#a3a3a3]'
                }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* ========================================================================
          MODALS (NO NATIVE ALERT / CONFIRM)
          ======================================================================== */}

      {/* 1. Rule #2 Emergency Fund Guardrail Modal */}
      {emergencyModalTx && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#141414] border border-[#f59e0b]/50 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-xl bg-[#f59e0b]/15 border border-[#f59e0b]/40 text-[#f59e0b] flex items-center justify-center shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] uppercase tracking-wider font-bold text-[#f59e0b]">
                  Financial Rule #2 Guardrail
                </span>
                <h3 className="text-base font-bold text-[#f5f5f5]">
                  Don't touch emergency savings
                </h3>
              </div>
            </div>

            <p className="text-xs text-[#a3a3a3] leading-relaxed mb-4">
              You are about to withdraw{' '}
              <span className="text-[#f5f5f5] font-bold">
                {formatINR(emergencyModalTx.amount)}
              </span>{' '}
              from your <span className="text-[#f5f5f5] font-semibold">Emergency Fund (UBI)</span>.
              Only genuine emergencies (medical, urgent unforeseen crisis, income loss) qualify.
            </p>

            <label className="flex items-start gap-2.5 bg-[#1c1c1c] border border-[#262626] rounded-xl p-3 mb-5 cursor-pointer">
              <input
                type="checkbox"
                checked={emergencyConfirmedCheck}
                onChange={(e) => setEmergencyConfirmedCheck(e.target.checked)}
                className="mt-0.5 accent-[#f59e0b]"
              />
              <span className="text-xs text-[#f5f5f5]">
                I confirm this is a genuine emergency and not a discretionary expense.
              </span>
            </label>

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setEmergencyModalTx(null)}
                className="px-4 py-2 rounded-xl bg-[#1c1c1c] hover:bg-[#262626] text-xs font-medium text-[#f5f5f5]"
              >
                Cancel (Keep Protected)
              </button>
              <button
                type="button"
                disabled={!emergencyConfirmedCheck}
                onClick={() => {
                  commitTransaction(emergencyModalTx);
                  setEmergencyModalTx(null);
                  setTxForm((p) => ({ ...p, amount: '', description: '' }));
                }}
                className="px-4 py-2 rounded-xl bg-[#f59e0b] disabled:opacity-40 text-[#0a0a0a] text-xs font-bold transition-opacity"
              >
                Confirm Withdrawal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Execute Salary-Day Routine Confirmation Modal */}
      {showSalaryConfirmModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#141414] border border-[#262626] rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-[#f5f5f5]">
                Execute Salary-Day Routine?
              </h3>
              <button
                type="button"
                onClick={() => setShowSalaryConfirmModal(false)}
                className="text-[#a3a3a3] hover:text-[#f5f5f5]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-[#a3a3a3] mb-4">
              For <span className="text-[#f5f5f5] font-semibold">{formatMonthLabel(selectedMonth)}</span>,
              this 1-click action will automatically:
            </p>
            <ul className="space-y-2 text-xs text-[#f5f5f5] bg-[#1c1c1c] border border-[#262626] rounded-xl p-3.5 mb-5">
              <li className="flex justify-between">
                <span>1. Credit Salary to SBI</span>
                <span className="text-[#10b981] font-semibold">+₹32,000</span>
              </li>
              <li className="flex justify-between">
                <span>2. Transfer to UBI (3 buckets)</span>
                <span className="font-semibold">₹15,500</span>
              </li>
              <li className="flex justify-between">
                <span>3. Deposit into PPF</span>
                <span className="font-semibold">₹500</span>
              </li>
              <li className="flex justify-between border-t border-[#262626] pt-2">
                <span>Net retained in SBI</span>
                <span className="text-[#10b981] font-bold">+₹16,000</span>
              </li>
            </ul>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowSalaryConfirmModal(false)}
                className="px-4 py-2 rounded-xl bg-[#1c1c1c] text-xs font-medium text-[#f5f5f5]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={executeSalaryDayRoutine}
                className="px-4 py-2 rounded-xl bg-[#FD1C00] hover:bg-[#e01800] text-xs font-semibold text-white"
              >
                Execute Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Edit Goal Balance / Target Modal */}
      {editingGoal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#141414] border border-[#262626] rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-[#f5f5f5]">Edit {editingGoal.name}</h3>
              <button
                type="button"
                onClick={() => setEditingGoal(null)}
                className="text-[#a3a3a3] hover:text-[#f5f5f5]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setState((prev) => ({
                  ...prev,
                  goals: prev.goals.map((g) =>
                    g.id === editingGoal.id
                      ? {
                        ...g,
                        saved: Math.max(0, Number(editingGoal.saved) || 0),
                        target: Math.max(1, Number(editingGoal.target) || 1),
                        monthlyContribution: Math.max(
                          0,
                          Number(editingGoal.monthlyContribution) || 0
                        ),
                      }
                      : g
                  ),
                }));
                setEditingGoal(null);
                showToast(`Updated ${editingGoal.name}`, 'success');
              }}
              className="space-y-3"
            >
              <div>
                <label className="block text-xs text-[#a3a3a3] mb-1">Current Saved Balance (₹)</label>
                <input
                  type="number"
                  min="0"
                  value={editingGoal.saved}
                  onChange={(e) => setEditingGoal({ ...editingGoal, saved: e.target.value })}
                  className="w-full bg-[#0a0a0a] border border-[#262626] focus:border-[#FD1C00] rounded-xl px-3 py-2 text-sm text-[#f5f5f5] outline-none"
                />
              </div>
              <div>
                <label className="block text-xs text-[#a3a3a3] mb-1">Target Amount (₹)</label>
                <input
                  type="number"
                  min="1"
                  value={editingGoal.target}
                  onChange={(e) => setEditingGoal({ ...editingGoal, target: e.target.value })}
                  className="w-full bg-[#0a0a0a] border border-[#262626] focus:border-[#FD1C00] rounded-xl px-3 py-2 text-sm text-[#f5f5f5] outline-none"
                />
              </div>
              <div>
                <label className="block text-xs text-[#a3a3a3] mb-1">Monthly Contribution (₹)</label>
                <input
                  type="number"
                  min="0"
                  value={editingGoal.monthlyContribution}
                  onChange={(e) =>
                    setEditingGoal({ ...editingGoal, monthlyContribution: e.target.value })
                  }
                  className="w-full bg-[#0a0a0a] border border-[#262626] focus:border-[#FD1C00] rounded-xl px-3 py-2 text-sm text-[#f5f5f5] outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setEditingGoal(null)}
                  className="px-4 py-2 rounded-xl bg-[#1c1c1c] text-xs font-medium text-[#f5f5f5]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#10b981] text-[#0a0a0a] text-xs font-bold"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. Create New Goal Modal */}
      {showNewGoalModal && (
        <NewGoalModal
          onClose={() => setShowNewGoalModal(false)}
          onCreate={(newGoal) => {
            setState((prev) => ({
              ...prev,
              goals: [...prev.goals, newGoal],
            }));
            setShowNewGoalModal(false);
            showToast(`Created goal "${newGoal.name}"`, 'success');
          }}
        />
      )}

      {/* 5. Edit SBI Balance Modal */}
      {showSbiEditModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#141414] border border-[#262626] rounded-2xl max-w-sm w-full p-6 shadow-2xl">
            <h3 className="text-base font-bold text-[#f5f5f5] mb-1">Adjust SBI Bank Balance</h3>
            <p className="text-xs text-[#a3a3a3] mb-4">
              Sync your actual SBI operating balance (kept separate from UBI goals & PPF).
            </p>
            <input
              type="number"
              min="0"
              value={sbiEditValue}
              onChange={(e) => setSbiEditValue(e.target.value)}
              className="w-full bg-[#0a0a0a] border border-[#262626] focus:border-[#FD1C00] rounded-xl px-3 py-2.5 text-sm text-[#f5f5f5] outline-none mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowSbiEditModal(false)}
                className="px-4 py-2 rounded-xl bg-[#1c1c1c] text-xs font-medium text-[#f5f5f5]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setState((prev) => ({
                    ...prev,
                    sbiBalance: Math.max(0, Number(sbiEditValue) || 0),
                  }));
                  setShowSbiEditModal(false);
                  showToast('Updated SBI operating balance', 'success');
                }}
                className="px-4 py-2 rounded-xl bg-[#FD1C00] text-white text-xs font-semibold"
              >
                Update Balance
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. Reset to November 2026 Defaults Modal */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#141414] border border-[#FD1C00]/40 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-base font-bold text-[#f5f5f5] mb-2">
              Reset to November 2026 Defaults?
            </h3>
            <p className="text-xs text-[#a3a3a3] leading-relaxed mb-5">
              This will restore SBI balance to ₹1,032, PPF to ₹1,000, UBI goal buckets to ₹0, and
              clear all logged transactions. Consider exporting a JSON backup first.
            </p>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowResetModal(false)}
                className="px-4 py-2 rounded-xl bg-[#1c1c1c] text-xs font-medium text-[#f5f5f5]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleResetDefaults}
                className="px-4 py-2 rounded-xl bg-[#FD1C00] hover:bg-[#e01800] text-white text-xs font-semibold"
              >
                Reset Dashboard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// NEW GOAL MODAL COMPONENT
// ============================================================================

function NewGoalModal({ onClose, onCreate }) {
  const [name, setName] = useState('');
  const [horizon, setHorizon] = useState('short');
  const [target, setTarget] = useState('');
  const [saved, setSaved] = useState('0');
  const [monthly, setMonthly] = useState('');
  const [account, setAccount] = useState('UBI');

  const handleSubmit = (e) => {
    e.preventDefault();
    const targetNum = Number(target);
    const monthlyNum = Number(monthly) || 0;
    if (!name.trim() || !targetNum || targetNum <= 0) return;

    const estMonths = monthlyNum > 0 ? Math.ceil(targetNum / monthlyNum) : 0;
    const expectedTime =
      estMonths > 24 ? `${(estMonths / 12).toFixed(1)} years` : `${estMonths || 12} months`;

    onCreate({
      id: `goal_${Date.now()}`,
      name: name.trim(),
      horizon,
      saved: Math.max(0, Number(saved) || 0),
      target: targetNum,
      monthlyContribution: monthlyNum,
      account,
      expectedTime,
      milestoneTip:
        horizon === 'short'
          ? 'Stay consistent every salary cycle to hit your short-term milestone.'
          : 'Long-term wealth goal. Review allocation once short-term goals complete.',
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#141414] border border-[#262626] rounded-2xl max-w-md w-full p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-[#f5f5f5]">Create Financial Goal</h3>
          <button type="button" onClick={onClose} className="text-[#a3a3a3] hover:text-[#f5f5f5]">
            <X className="w-4 h-4" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs text-[#a3a3a3] mb-1">Goal Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Travel Fund, Bike Upgrade..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#0a0a0a] border border-[#262626] focus:border-[#FD1C00] rounded-xl px-3 py-2 text-sm text-[#f5f5f5] outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-[#a3a3a3] mb-1">Horizon</label>
              <select
                value={horizon}
                onChange={(e) => setHorizon(e.target.value)}
                className="w-full bg-[#0a0a0a] border border-[#262626] rounded-xl px-3 py-2 text-sm text-[#f5f5f5] outline-none"
              >
                <option value="short">Short-Term</option>
                <option value="long">Long-Term</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-[#a3a3a3] mb-1">Account Bucket</label>
              <select
                value={account}
                onChange={(e) => setAccount(e.target.value)}
                className="w-full bg-[#0a0a0a] border border-[#262626] rounded-xl px-3 py-2 text-sm text-[#f5f5f5] outline-none"
              >
                <option value="UBI">UBI (Virtual Bucket)</option>
                <option value="PPF">PPF</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-[#a3a3a3] mb-1">Target (₹)</label>
              <input
                type="number"
                required
                min="1"
                placeholder="50000"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                className="w-full bg-[#0a0a0a] border border-[#262626] focus:border-[#FD1C00] rounded-xl px-3 py-2 text-sm text-[#f5f5f5] outline-none"
              />
            </div>
            <div>
              <label className="block text-xs text-[#a3a3a3] mb-1">Monthly Saving (₹)</label>
              <input
                type="number"
                required
                min="0"
                placeholder="2000"
                value={monthly}
                onChange={(e) => setMonthly(e.target.value)}
                className="w-full bg-[#0a0a0a] border border-[#262626] focus:border-[#FD1C00] rounded-xl px-3 py-2 text-sm text-[#f5f5f5] outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs text-[#a3a3a3] mb-1">Starting Saved Amount (₹)</label>
            <input
              type="number"
              min="0"
              value={saved}
              onChange={(e) => setSaved(e.target.value)}
              className="w-full bg-[#0a0a0a] border border-[#262626] focus:border-[#FD1C00] rounded-xl px-3 py-2 text-sm text-[#f5f5f5] outline-none"
            />
          </div>
          <div className="flex justify-end gap-2 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-[#1c1c1c] text-xs font-medium text-[#f5f5f5]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-[#FD1C00] hover:bg-[#e01800] text-white text-xs font-semibold"
            >
              Create Goal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}