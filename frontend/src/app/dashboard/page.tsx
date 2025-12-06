'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useBudgetStore } from '@/stores/budgetStore';
import BudgetForm from '@/components/BudgetForm';
import Dashboard from '@/components/Dashboard';
import { LogOut } from 'lucide-react';
import { LottieSafeWrapper } from '@/components/LottieWrapper';

export default function DashboardPage() {
  const router = useRouter();
  const { loadBudget, setOnlineStatus, reset } = useBudgetStore();
  const [currentMonth, setCurrentMonth] = useState('');
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/');
      return;
    }
    const now = new Date();
    const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    setCurrentMonth(month);
    loadBudget(month);
    const handleOnline = () => setOnlineStatus(true);
    const handleOffline = () => setOnlineStatus(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [loadBudget, setOnlineStatus, router]);

  const handleLogout = () => {
    localStorage.clear();
    reset();
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
    <div className="flex items-center justify-between gap-6">
      <div className="flex items-center gap-4">
        <LottieSafeWrapper
          src="/budgetIcon1.json"
          size={80}
          autoplay
          loop
          fallbackIcon="🔍"
        />
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold text-gray-800">BudgetBox</h1>
          <p className="text-sm text-gray-600">
            {currentMonth
              ? new Date(currentMonth + '-01').toLocaleDateString('en-US', {
                  month: 'long',
                  year: 'numeric',
                })
              : ''}
          </p>
        </div>
      </div>

      <button
        onClick={handleLogout}
        className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <LottieSafeWrapper
          src="/logout.json"
          size={80}
          autoplay
          loop
          fallbackIcon="🔍"
        />
        Logout
      </button>
    </div>
  </div>
</nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <BudgetForm />
          </div>
          <div>
            <Dashboard />
          </div>
        </div>
      </main>
    </div>
  );
}