import localforage from 'localforage';
import { BudgetData } from '@/types/budget';

const budgetStore = localforage.createInstance({
  name: 'BudgetBox',
  storeName: 'budgets',
});

export const storage = {
  async saveBudget(budget: BudgetData): Promise<void> {
    await budgetStore.setItem(budget.month, budget);
  },

  async getBudget(month: string): Promise<BudgetData | null> {
    return await budgetStore.getItem<BudgetData>(month);
  },

  async getAllBudgets(): Promise<BudgetData[]> {
    const budgets: BudgetData[] = [];
    await budgetStore.iterate<BudgetData, void>((value) => {
      budgets.push(value);
    });
    return budgets;
  },

  async deleteBudget(month: string): Promise<void> {
    await budgetStore.removeItem(month);
  },

  async clearAll(): Promise<void> {
    await budgetStore.clear();
  },
};