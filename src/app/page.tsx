'use client';

import { useState } from 'react';

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Sample local state for demo testing
  const [transactions, setTransactions] = useState([
    { id: '1', type: 'INCOME', amount: 5000, category: 'Salary', description: 'Monthly stipend' },
    { id: '2', type: 'EXPENSE', amount: 150, category: 'Food', description: 'Groceries' },
  ]);

  const [type, setType] = useState<'INCOME' | 'EXPENSE'>('EXPENSE');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  const [description, setDescription] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      setIsLoggedIn(true);
    }
  };

  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount) return;

    const newTx = {
      id: Date.now().toString(),
      type,
      amount: parseFloat(amount),
      category,
      description,
    };

    setTransactions([newTx, ...transactions]);
    setAmount('');
    setDescription('');
  };

  const totalIncome = transactions
    .filter((t) => t.type === 'INCOME')
    .reduce((acc, t) => acc + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === 'EXPENSE')
    .reduce((acc, t) => acc + t.amount, 0);

  const balance = totalIncome - totalExpense;

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Expense Manager</h1>
            <p className="text-slate-400 text-sm mt-2">Sign in to manage your budget</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <button
              type="submit"
              className="w-full mt-2 py-3 px-4 bg-indigo-600 hover:bg-indigo-500 font-semibold rounded-xl text-white transition-all shadow-lg shadow-indigo-600/30"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center bg-slate-900 p-6 rounded-2xl border border-slate-800">
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-slate-400 text-sm">Welcome back, {email}</p>
          </div>
          <button
            onClick={() => setIsLoggedIn(false)}
            className="px-4 py-2 text-sm bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 text-slate-300 transition"
          >
            Sign Out
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
            <p className="text-xs font-semibold text-slate-400 uppercase">Total Balance</p>
            <p className={`text-2xl font-bold mt-2 ${balance >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              ${balance.toFixed(2)}
            </p>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
            <p className="text-xs font-semibold text-slate-400 uppercase">Income</p>
            <p className="text-2xl font-bold mt-2 text-emerald-400">+${totalIncome.toFixed(2)}</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
            <p className="text-xs font-semibold text-slate-400 uppercase">Expenses</p>
            <p className="text-2xl font-bold mt-2 text-rose-400">-${totalExpense.toFixed(2)}</p>
          </div>
        </div>

        {/* Form and List Container */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Add Form */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl h-fit">
            <h2 className="text-lg font-semibold mb-4">Add Transaction</h2>
            <form onSubmit={handleAddTransaction} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as 'INCOME' | 'EXPENSE')}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
                >
                  <option value="EXPENSE">Expense</option>
                  <option value="INCOME">Income</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Amount ($)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Category</label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="e.g. Food, Salary"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Description</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Notes..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 font-medium rounded-xl text-sm transition"
              >
                Add Transaction
              </button>
            </form>
          </div>

          {/* Transactions List */}
          <div className="md:col-span-2 bg-slate-900 border border-slate-800 p-6 rounded-2xl">
            <h2 className="text-lg font-semibold mb-4">Recent Transactions</h2>
            <div className="space-y-3">
              {transactions.length === 0 ? (
                <p className="text-slate-500 text-sm py-4">No transactions added yet.</p>
              ) : (
                transactions.map((t) => (
                  <div
                    key={t.id}
                    className="flex justify-between items-center p-3.5 bg-slate-800/50 border border-slate-800 rounded-xl"
                  >
                    <div>
                      <p className="font-medium text-sm">{t.description || t.category}</p>
                      <p className="text-xs text-slate-400">{t.category}</p>
                    </div>
                    <span
                      className={`font-semibold text-sm ${
                        t.type === 'INCOME' ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {t.type === 'INCOME' ? '+' : '-'}${t.amount.toFixed(2)}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
