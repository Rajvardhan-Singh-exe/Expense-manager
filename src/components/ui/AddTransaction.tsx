'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function AddTransaction({ onTransactionAdded }: { onTransactionAdded: () => void }) {
  const [amount, setAmount] = useState('')
  const [type, setType] = useState<'EXPENSE' | 'INCOME'>('EXPENSE')
  const [description, setDescription] = useState('')
  const [categoryName, setCategoryName] = useState('')
  const [associatedEntityId, setAssociatedEntityId] = useState('')
  const [exactTimestamp, setExactTimestamp] = useState(new Date().toISOString().slice(0, 16))
  const [isRecurring, setIsRecurring] = useState(false)
  const [recurrenceDays, setRecurrenceDays] = useState('30')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      alert('User not authenticated')
      setLoading(false)
      return
    }

    let categoryId = null

    if (categoryName.trim()) {
      const { data: existingCat } = await supabase
        .from('categories')
        .select('id')
        .eq('user_id', user.id)
        .eq('category_name', categoryName.trim())
        .single()

      if (existingCat) {
        categoryId = existingCat.id
      } else {
        const { data: newCat, error: catError } = await supabase
          .from('categories')
          .insert([{
            user_id: user.id,
            category_name: categoryName.trim(),
            associated_entity_id: associatedEntityId.trim() || null
          }])
          .select()
          .single()

        if (!catError && newCat) {
          categoryId = newCat.id
        }
      }
    }

    const { error } = await supabase.from('transactions').insert([{
      user_id: user.id,
      category_id: categoryId,
      type: type,
      amount: parseFloat(amount),
      description: description,
      exact_timestamp: new Date(exactTimestamp).toISOString(),
      is_recurring: isRecurring,
      recurrence_interval_days: isRecurring ? parseInt(recurrenceDays) : 0,
    }])

    setLoading(false)

    if (error) {
      alert(`Error saving transaction: ${error.message}`)
    } else {
      setAmount('')
      setDescription('')
      setCategoryName('')
      setAssociatedEntityId('')
      onTransactionAdded()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-gray-900 p-6 rounded-xl border border-gray-800 space-y-4">
      <h3 className="text-lg font-bold text-white">Add New Entry</h3>

      <div className="flex gap-4">
        <button
          type="button"
          onClick={() => setType('EXPENSE')}
          className={`flex-1 py-2 rounded-lg font-semibold ${type === 'EXPENSE' ? 'bg-red-600 text-white' : 'bg-gray-800 text-gray-400'}`}
        >
          Expense
        </button>
        <button
          type="button"
          onClick={() => setType('INCOME')}
          className={`flex-1 py-2 rounded-lg font-semibold ${type === 'INCOME' ? 'bg-green-600 text-white' : 'bg-gray-800 text-gray-400'}`}
        >
          Income
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-400 mb-1">Amount (₹)</label>
          <input
            type="number"
            step="0.01"
            required
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2.5 text-white"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-400 mb-1">Date & Time</label>
          <input
            type="datetime-local"
            required
            value={exactTimestamp}
            onChange={(e) => setExactTimestamp(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2.5 text-white"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-400 mb-1">Description</label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="e.g. Coffee at Starbucks"
          className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2.5 text-white"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-400 mb-1">Category</label>
          <input
            type="text"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            placeholder="e.g. Food, Tech"
            className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2.5 text-white"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-400 mb-1">Entity / ID Tag</label>
          <input
            type="text"
            value={associatedEntityId}
            onChange={(e) => setAssociatedEntityId(e.target.value)}
            placeholder="e.g. @starbucks"
            className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2.5 text-white"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <input
          type="checkbox"
          id="recurring"
          checked={isRecurring}
          onChange={(e) => setIsRecurring(e.target.checked)}
          className="w-4 h-4 rounded"
        />
        <label htmlFor="recurring" className="text-sm text-gray-300">Recurring Transaction?</label>
      </div>

      {isRecurring && (
        <div>
          <label className="block text-xs font-semibold text-gray-400 mb-1">Repeat Every (Days)</label>
          <input
            type="number"
            value={recurrenceDays}
            onChange={(e) => setRecurrenceDays(e.target.value)}
            placeholder="30"
            className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2.5 text-white"
          />
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-500 py-3 rounded-lg font-bold text-white transition-colors"
      >
        {loading ? 'Saving...' : 'Add Transaction'}
      </button>
    </form>
  )
}