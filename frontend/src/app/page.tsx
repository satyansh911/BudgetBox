'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { LottieSafeWrapper } from '@/components/LottieWrapper';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('hire-me@anshumat.org');
  const [password, setPassword] = useState('HireMe@2025!');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      router.push('/dashboard');
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await api.login(email, password);
      localStorage.setItem('token', result.token);
      localStorage.setItem('userId', result.user.id);
      localStorage.setItem('userEmail', result.user.email);
      router.push('/dashboard');
    } catch (err) {
      setError('Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        '--s': '25px',
        '--c1': '#257148',
        '--c2': '#171717',
        '--c': '#0000 71%, var(--c1) 0 79%, #0000 0',
        '--_s': 'calc(var(--s) / 2) / calc(2 * var(--s)) calc(2 * var(--s))',
        background: `
          linear-gradient(45deg, var(--c)) calc(var(--s) / -2) var(--_s),
          linear-gradient(135deg, var(--c)) calc(var(--s) / 2) var(--_s),
          radial-gradient(var(--c1) 35%, var(--c2) 37%) 0 0 / var(--s) var(--s)
        `,
      } as any}
    >
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <LottieSafeWrapper
            src="/budgetIcon1.json"
            size={80}
            autoplay
            loop
            fallbackIcon="🔍"
          />
          <h1 className="text-4xl font-bold text-gray-800 mb-2">BudgetBox</h1>
          <p className="text-gray-600">Offline-First Personal Budgeting</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#16a34a] text-white rounded-lg font-medium hover:bg-[#16c72e] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="mt-6 p-4 bg-green-100 rounded-lg">
          <p className="text-xs text-[#16a34a] font-medium mb-2">Demo Credentials:</p>
          <p className="text-xs text-[#16a34a]">Email: hire-me@anshumat.org</p>
          <p className="text-xs text-[#16a34a]">Password: HireMe@2025!</p>
        </div>
      </div>
    </div>
  );
}