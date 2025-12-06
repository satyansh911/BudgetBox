export interface BudgetData {
  id?: string;
  userId: string;
  month: string;
  income: number;
  monthlyBills: number;
  food: number;
  transport: number;
  subscriptions: number;
  miscellaneous: number;
  createdAt?: Date;
  updatedAt?: Date;
  syncStatus: 'local' | 'pending' | 'synced';
  lastSyncedAt?: Date;
}

export interface BudgetAnalytics {
  totalExpenses: number;
  burnRate: number;
  savingsPotential: number;
  monthEndPrediction: number;
  categoryBreakdown: {
    label: string;
    value: number;
    percentage: number;
  }[];
  anomalies: string[];
}

export interface User {
  id: string;
  email: string;
  name: string;
}

export type SyncStatus = 'local' | 'pending' | 'synced';