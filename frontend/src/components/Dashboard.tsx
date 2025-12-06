'use client';

import { useEffect, useState } from 'react';
import { useBudgetStore } from '@/stores/budgetStore';
import { calculateAnalytics } from '@/lib/analytics';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { TrendingUp, TrendingDown, DollarSign, AlertTriangle } from 'lucide-react';
import { LottieSafeWrapper } from './LottieWrapper';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Dashboard() {
  const { currentBudget } = useBudgetStore();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient || !currentBudget) {
    return null;
  }

  const analytics = calculateAnalytics(currentBudget);

  const chartData = {
    labels: analytics.categoryBreakdown.map(cat => cat.label),
    datasets: [
      {
        data: analytics.categoryBreakdown.map(cat => cat.value),
        backgroundColor: [
          '#3b82f6',
          '#8b5cf6',
          '#10b981',
          '#f59e0b',
          '#ef4444',
        ],
        borderWidth: 2,
        borderColor: '#ffffff',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const label = context.label || '';
            const value = context.parsed || 0;
            const percentage = analytics.categoryBreakdown[context.dataIndex]?.percentage || 0;
            return `${label}: ₹${value.toFixed(2)} (${percentage.toFixed(1)}%)`;
          },
        },
      },
    },
  };

  return (
    <div className="space-y-6">
      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Burn Rate</h3>
            <LottieSafeWrapper 
                src="/profit growth.json"
                size={60}
                autoplay={true}
                loop={true}
                fallbackIcon="🔍"
            />
          </div>
          <p className="text-3xl font-bold text-gray-800">{analytics.burnRate.toFixed(1)}%</p>
          <p className="text-xs text-gray-500 mt-1">Total expenses / Income</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Savings Potential</h3>
            <LottieSafeWrapper 
                src="/money.json"
                size={60}
                autoplay={true}
                loop={true}
                fallbackIcon="🔍"
            />
          </div>
          <p className={`text-3xl font-bold ${analytics.savingsPotential < 0 ? 'text-red-600' : 'text-green-600'}`}>
            ₹{analytics.savingsPotential.toFixed(2)}
          </p>
          <p className="text-xs text-gray-500 mt-1">Income - Total Spend</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Month-End Prediction</h3>
            <LottieSafeWrapper 
                src="/prediction.json"
                size={60}
                autoplay={true}
                loop={true}
                fallbackIcon="🔍"
            />
          </div>
          <p className={`text-3xl font-bold ${analytics.monthEndPrediction < 0 ? 'text-red-600' : 'text-green-600'}`}>
            ₹{analytics.monthEndPrediction.toFixed(2)}
          </p>
          <p className="text-xs text-gray-500 mt-1">Based on current trend</p>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Category Breakdown</h3>
        <div className="max-w-md mx-auto">
          <Pie data={chartData} options={chartOptions} />
        </div>
      </div>

      {/* Anomalies */}
      {analytics.anomalies.length > 0 && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <LottieSafeWrapper 
                src="/ai.json"
                size={60}
                autoplay={true}
                loop={true}
                fallbackIcon="🔍"
            />
            <h3 className="text-xl font-bold text-gray-800">AI Suggestions</h3>
          </div>
          <div className="space-y-3">
            {analytics.anomalies.map((anomaly, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg ${
                  anomaly.includes('✅')
                    ? 'bg-green-50 border border-green-200'
                    : anomaly.includes('🚨')
                    ? 'bg-red-50 border border-red-200'
                    : 'bg-yellow-50 border border-yellow-200'
                }`}
              >
                <p className="text-sm text-gray-800">{anomaly}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Category Details */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Detailed Breakdown</h3>
        <div className="space-y-3">
          {analytics.categoryBreakdown.map((cat, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">{cat.label}</span>
                  <span className="text-sm text-gray-600">₹{cat.value.toFixed(2)} ({cat.percentage.toFixed(1)}%)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${Math.min(cat.percentage, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}