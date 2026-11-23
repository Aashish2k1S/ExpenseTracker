export const STORAGE_KEY = 'aashish_financial_dashboard_v1';

export const DEFAULT_MONTH = '2026-11';

export const BUDGET_BREAKDOWN_ROWS = [
  { id: 'family', category: 'Family contribution', monthly: 10000, allocation: '31.25%', account: 'SBI', type: 'operating' },
  { id: 'personal', category: 'Personal expenses', monthly: 4000, allocation: '12.50%', account: 'SBI', type: 'operating' },
  { id: 'emergency', category: 'Emergency fund', monthly: 8000, allocation: '25.00%', account: 'UBI', type: 'savings' },
  { id: 'macbook', category: 'MacBook fund', monthly: 5000, allocation: '15.63%', account: 'UBI', type: 'savings' },
  { id: 'home', category: 'Home down-payment fund', monthly: 2500, allocation: '7.81%', account: 'UBI', type: 'savings' },
  { id: 'ppf', category: 'PPF', monthly: 500, allocation: '1.56%', account: 'PPF', type: 'savings' },
  { id: 'misc', category: 'Miscellaneous buffer', monthly: 2000, allocation: '6.25%', account: 'SBI', type: 'operating' },
];

export const SBI_BUDGET_CATEGORIES = [
  { id: 'family', name: 'Family contribution', monthlyBudget: 10000, allocation: 31.25, color: '#3b82f6' },
  { id: 'personal', name: 'Personal expenses', monthlyBudget: 4000, allocation: 12.5, color: '#FD1C00' },
  { id: 'misc', name: 'Miscellaneous buffer', monthlyBudget: 2000, allocation: 6.25, color: '#f59e0b' },
];

export const QUICK_PRESETS = [
  { label: 'Chai', amount: 20, categoryId: 'personal', paymentMode: 'UPI', icon: 'coffee' },
  { label: 'Snacks', amount: 30, categoryId: 'personal', paymentMode: 'UPI', icon: 'utensils' },
  { label: 'Auto / Rapido', amount: 50, categoryId: 'personal', paymentMode: 'UPI', icon: 'car' },
  { label: 'Lunch', amount: 100, categoryId: 'personal', paymentMode: 'UPI', icon: 'utensils' },
  { label: 'Groceries', amount: 150, categoryId: 'misc', paymentMode: 'UPI', icon: 'bag' },
];

export const PAYMENT_MODES = ['UPI', 'Cash', 'Card', 'NetBanking'];

export const FINANCIAL_RULES = [
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

export const createDefaultState = () => ({
  profile: {
    name: 'Aashish',
    grossSalary: 36000,
    inHandSalary: 32000,
    deductions: 4000,
  },
  sbiBalance: 0,
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
      saved: 0,
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
