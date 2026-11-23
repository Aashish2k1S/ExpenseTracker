export const DEFAULT_GOALS = [
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
    name: 'Public Provident Fund (PPF)',
    horizon: 'long',
    saved: 0,
    target: 150000,
    monthlyContribution: 500,
    account: 'PPF',
    expectedTime: '15 years',
    milestoneTip: 'Long-term compounding. Minimum ₹500/year to keep active.',
  },
];

export const getDefaultState = () => ({
  userId: 'default_user',
  profile: {
    name: 'Aashish',
    grossSalary: 36000,
    inHandSalary: 32000,
    deductions: 4000,
  },
  sbiBalance: 0,
  goals: DEFAULT_GOALS,
  transactions: [],
  salaryRoutineByMonth: {},
});
