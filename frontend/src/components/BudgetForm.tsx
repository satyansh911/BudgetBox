'use client';

import { useEffect, useState } from 'react';
import { useBudgetStore } from '@/stores/budgetStore';
import { Wifi, WifiOff, Cloud, Check, Loader2 } from 'lucide-react';
import { LottieSafeWrapper } from './LottieWrapper';

export default function BudgetForm() {
  const { currentBudget, isOnline, isSyncing, updateBudgetField, syncToServer } = useBudgetStore();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleChange = (field: string, value: string) => {
    const numValue = parseFloat(value) || 0;
    updateBudgetField(field as any, numValue);
  };

  const getSyncStatusBadge = () => {
    if (!currentBudget) return null;

    if (isSyncing) {
      return (
        <span className="flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
          <Loader2 className="w-4 h-4 animate-spin" />
          Syncing...
        </span>
      );
    }

    switch (currentBudget.syncStatus) {
      case 'synced':
        return (
          <span className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
            <Check className="w-4 h-4" />
            Synced
          </span>
        );
      case 'pending':
        return (
          <span className="flex items-center gap-2 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
            <Cloud className="w-4 h-4" />
            Sync Pending
          </span>
        );
      case 'local':
        return (
          <span className="flex items-center gap-2 px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
            Local Only
          </span>
        );
    }
  };

  if (!isClient || !currentBudget) {
    return <div className="text-center py-8 text-gray-800">Loading...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Monthly Budget</h2>
        <div className="flex items-center gap-4">
          {getSyncStatusBadge()}
          <div className="flex items-center gap-2">
            {isOnline ? (
              <LottieSafeWrapper 
                              src="/wifion.json"
                              size={40}
                              autoplay={true}
                              loop={true}
                              fallbackIcon="🔍"
                          />
            ) : (
              <LottieSafeWrapper 
                src="/wifioff.json"
                size={60}
                autoplay={true}
                loop={true}
                fallbackIcon="🔍"
            />
            )}
            <span className="text-sm text-gray-600">
              {isOnline ? 'Online' : 'Offline'}
            </span>
          </div>
          {currentBudget.syncStatus === 'pending' && isOnline && (
            <button
              onClick={syncToServer}
              disabled={isSyncing}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
            >
              Sync Now
            </button>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Income
          </label>
          <input
            type="number"
            value={currentBudget.income > 0 ? currentBudget.income : ''}
            onChange={(e) => handleChange('income', e.target.value)}
            className="w-full px-4 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter monthly income"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Monthly Bills
          </label>
          <input
            type="number"
            value={currentBudget.monthlyBills > 0 ? currentBudget.monthlyBills : ''}
            onChange={(e) => handleChange('monthlyBills', e.target.value)}
            className="w-full px-4 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Rent, EMI, utilities"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Food
          </label>
          <input
            type="number"
            value={currentBudget.food > 0 ? currentBudget.food : ''}
            onChange={(e) => handleChange('food', e.target.value)}
            className="w-full px-4 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Groceries + dining"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Transport
          </label>
          <input
            type="number"
            value={currentBudget.transport > 0 ? currentBudget.transport : ''}
            onChange={(e) => handleChange('transport', e.target.value)}
            className="w-full px-4 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Fuel, cab, commute"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Subscriptions
          </label>
          <input
            type="number"
            value={currentBudget.subscriptions > 0 ? currentBudget.subscriptions : ''}
            onChange={(e) => handleChange('subscriptions', e.target.value)}
            className="w-full px-4 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="OTT, SaaS, apps"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Miscellaneous
          </label>
          <input
            type="number"
            value={currentBudget.miscellaneous > 0 ? currentBudget.miscellaneous : ''}
            onChange={(e) => handleChange('miscellaneous', e.target.value)}
            className="w-full px-4 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Others"
          />
        </div>
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-800 text-center">
           {<LottieSafeWrapper 
                src="/idea.json"
                size={100}
                autoplay={true}
                loop={true}
                fallbackIcon="🔍"
            />} All changes are auto-saved locally. {isOnline ? 'Changes will sync to server automatically.' : 'Changes will sync when you\'re back online.'}
        </p>
      </div>
    </div>
  );
}