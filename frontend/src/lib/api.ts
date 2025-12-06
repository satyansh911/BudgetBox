import { BudgetData } from '@/types/budget';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const api = {
  async syncBudget(budget: BudgetData): Promise<{ success: boolean; timestamp: Date }> {
    const response = await fetch(`${API_BASE_URL}/api/budget/sync`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(budget),
    });
    
    if (!response.ok) {
      throw new Error('Failed to sync budget');
    }
    
    return await response.json();
  },

  async getLatestBudget(month: string): Promise<BudgetData> {
    const response = await fetch(`${API_BASE_URL}/api/budget/latest?month=${month}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch budget');
    }
    
    return await response.json();
  },

  async login(email: string, password: string): Promise<{ token: string; user: any }> {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    
    if (!response.ok) {
      throw new Error('Login failed');
    }
    
    return await response.json();
  },
};