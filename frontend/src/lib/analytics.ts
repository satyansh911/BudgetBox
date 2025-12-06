import { BudgetData, BudgetAnalytics } from '@/types/budget';

export function calculateAnalytics(budget: BudgetData): BudgetAnalytics {
  const { income, monthlyBills, food, transport, subscriptions, miscellaneous } = budget;
  
  const totalExpenses = monthlyBills + food + transport + subscriptions + miscellaneous;
  const burnRate = income > 0 ? (totalExpenses / income) * 100 : 0;
  const savingsPotential = income - totalExpenses;
  
  const monthEndPrediction = savingsPotential;
  
  const categories = [
    { label: 'Monthly Bills', value: monthlyBills },
    { label: 'Food', value: food },
    { label: 'Transport', value: transport },
    { label: 'Subscriptions', value: subscriptions },
    { label: 'Miscellaneous', value: miscellaneous },
  ];
  
  const categoryBreakdown = categories.map(cat => ({
    label: cat.label,
    value: cat.value,
    percentage: income > 0 ? (cat.value / income) * 100 : 0,
  }));
  
  const anomalies: string[] = [];
  
  if (income > 0) {
    const foodPercentage = (food / income) * 100;
    const subscriptionsPercentage = (subscriptions / income) * 100;
    const billsPercentage = (monthlyBills / income) * 100;
    
    if (foodPercentage > 40) {
      anomalies.push(`⚠️ Food expenses are ${foodPercentage.toFixed(1)}% of your income — too high! Consider meal planning.`);
    }
    
    if (subscriptionsPercentage > 30) {
      anomalies.push(`⚠️ Subscriptions are ${subscriptionsPercentage.toFixed(1)}% of your income — consider cancelling unused apps.`);
    }
    
    if (billsPercentage > 50) {
      anomalies.push(`⚠️ Monthly bills are ${billsPercentage.toFixed(1)}% of your income — explore ways to reduce fixed costs.`);
    }
    
    if (savingsPotential < 0) {
      anomalies.push(`🚨 Your expenses exceed income by ₹${Math.abs(savingsPotential).toFixed(2)}. You need to cut spending!`);
    }
    
    if (burnRate > 90 && savingsPotential >= 0) {
      anomalies.push(`⚠️ You're spending ${burnRate.toFixed(1)}% of your income. Very little room for savings!`);
    }
    
    if (savingsPotential > income * 0.5) {
      anomalies.push(`✅ Great job! You're saving ${((savingsPotential / income) * 100).toFixed(1)}% of your income.`);
    }
  }
  
  return {
    totalExpenses,
    burnRate,
    savingsPotential,
    monthEndPrediction,
    categoryBreakdown,
    anomalies,
  };
}