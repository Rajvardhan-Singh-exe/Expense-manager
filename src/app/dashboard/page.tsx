'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import AddTransaction from '@/components/ui/AddTransaction'

export default function DashboardPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [transactions, setTransactions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login')
      return
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('username')
      .eq('id', user.id)
      .single()

    if (profile) setUsername(profile.username)

    const { data: txs } = await supabase
      .from('transactions')
      .select('*, categories(category_name, associated_entity_id)')
      .eq('user_id', user.id)
      .order('exact_timestamp', { ascending: false })

    if (txs) setTransactions(txs)
    setLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [])

  const totalIncome = transactions
    .filter((t) => t.type === 'INCOME')
    .reduce((acc, curr) => acc + Number(curr.amount), 0)

  const totalExpense = transactions
    .filter((t) => t.type === 'EXPENSE')
    .reduce((acc, curr) => acc + Number(curr.amount), 0)

  const netBalance = totalIncome - totalExpense

  if (loading) {
    return <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">Loading Dashboard...</div>
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6 max-w-6xl mx-auto space-y-8">
      <div className="flex justify-between items-center border-b border-gray-800 pb-4">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-sm text-gray-400">Welcome, <span className="text-blue-400 font-semibold">@{username}</span></p>
        </div>
        <button
          onClick={async () => {
            await supabase.auth.signOut()
            router.push('/login')
          }}
          className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg text-sm font-semibold"
        >
          Log Out
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-900 border border-gray-800 p-5 rounded-xl">
          <p className="text-xs uppercase font-semibold text-gray-400">Total Income</p>
          <p className="text-2xl font-bold text-green-400 mt-1">₹{totalIncome.toFixed(2)}</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 p-5 rounded-xl">
          <p className="text-xs uppercase font-semibold text-gray-400">Total Expenses</p>
          <p className="text-2xl font-bold text-red-400 mt-1">₹{totalExpense.toFixed(2)}</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 p-5 rounded-xl">
          <p className="text-xs uppercase font-semibold text-gray-400">Net Balance</p>
          <p className={`text-2xl font-bold mt-1 ${netBalance >= 0 ? 'text-blue-400' : 'text-orange-400'}`}>
            ₹{netBalance.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <AddTransaction onTransactionAdded={fetchData} />

        <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl space-y-4">
          <h3 className="text-lg font-bold">Recent Activity</h3>
          {transactions.length === 0 ? (
            <p className="text-sm text-gray-500">No transactions recorded yet.</p>
          ) : (
            <div className="space-y-3 max-h-[450px] overflow-y-auto pr-2">
              {transactions.map((tx) => (
                <div key={tx.id} className="flex justify-between items-center bg-gray-800/50 p-3 rounded-lg border border-gray-800">
                  <div>
                    <p className="font-semibold text-sm">{tx.description || 'Untitled Transaction'}</p>
                    <p className="text-xs text-gray-400">
                      {tx.categories?.category_name || 'Uncategorized'}
                      {tx.categories?.associated_entity_id && (
                        <span className="text-blue-400 ml-1">({tx.categories.associated_entity_id})</span>
                      )}
                      <span className="ml-2 text-gray-500">
                        {new Date(tx.exact_timestamp).toLocaleString()}
                      </span>
                    </p>
                  </div>
                  <span className={`font-bold text-sm ${tx.type === 'INCOME' ? 'text-green-400' : 'text-red-400'}`}>
                    {tx.type === 'INCOME' ? '+' : '-'}₹{Number(tx.amount).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}