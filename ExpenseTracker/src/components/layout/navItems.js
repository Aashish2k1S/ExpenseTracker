import { LayoutDashboard, Receipt, Target, Landmark, BarChart3 } from 'lucide-react';

export const NAV_ITEMS = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'transactions', label: 'Micro-Tx', fullLabel: 'Micro-Transactions', icon: Receipt },
  { id: 'goals', label: 'Goals', icon: Target },
  { id: 'accounts', label: 'Accounts', fullLabel: 'Accounts & Routine', icon: Landmark },
  { id: 'review', label: 'Review', fullLabel: 'Monthly Review', icon: BarChart3 },
];
