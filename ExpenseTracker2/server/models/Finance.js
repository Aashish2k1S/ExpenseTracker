import mongoose from 'mongoose';

const GoalSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    horizon: { type: String, default: 'short' },
    saved: { type: Number, default: 0 },
    target: { type: Number, default: 0 },
    monthlyContribution: { type: Number, default: 0 },
    account: { type: String, default: 'UBI' },
    expectedTime: { type: String, default: '' },
    milestoneTip: { type: String, default: '' },
  },
  { _id: false }
);

const TransactionSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    amount: { type: Number, required: true },
    description: { type: String, default: '' },
    type: {
      type: String,
      enum: ['expense', 'income', 'goal_deposit', 'goal_withdrawal'],
      required: true,
    },
    categoryId: { type: String, default: '' },
    categoryLabel: { type: String, default: '' },
    goalId: { type: String, default: null },
    account: { type: String, default: 'SBI' },
    paymentMode: { type: String, default: 'UPI' },
    timestamp: { type: String, default: () => new Date().toISOString() },
    deductFromSbi: { type: Boolean, default: false },
    isSalaryRoutine: { type: Boolean, default: false },
  },
  { _id: false }
);

const FinanceSchema = new mongoose.Schema(
  {
    userId: { type: String, default: 'default_user', unique: true, index: true },
    profile: {
      name: { type: String, default: 'Aashish' },
      grossSalary: { type: Number, default: 36000 },
      inHandSalary: { type: Number, default: 32000 },
      deductions: { type: Number, default: 4000 },
    },
    sbiBalance: { type: Number, default: 0 },
    goals: { type: [GoalSchema], default: [] },
    transactions: { type: [TransactionSchema], default: [] },
    salaryRoutineByMonth: {
      type: Map,
      of: new mongoose.Schema(
        {
          step1: { type: Boolean, default: false },
          step2: { type: Boolean, default: false },
          step3: { type: Boolean, default: false },
          step4: { type: Boolean, default: false },
          executedAt: { type: String, default: null },
        },
        { _id: false }
      ),
      default: {},
    },
  },
  { timestamps: true }
);

export const Finance = mongoose.model('Finance', FinanceSchema);
