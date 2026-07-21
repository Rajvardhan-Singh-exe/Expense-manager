'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function LoginPage() {
  // 1. React State to hold user inputs
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [message, setMessage] = useState('')

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('Processing...')

    // 2. THE SYNTHETIC EMAIL TRICK:
    // Convert 'raj123' -> 'raj123@expense.internal'
    const cleanUsername = username.trim().toLowerCase()
    const syntheticEmail = `${cleanUsername}@expense.internal`

    if (isSignUp) {
      // -----------------------------
      // SIGN UP FLOW
      // -----------------------------
      // Step A: Register user in Supabase Auth using the synthetic email
      const { data, error } = await supabase.auth.signUp({
        email: syntheticEmail,
        password: password,
      })

      if (error) {
        setMessage(`Sign Up Error: ${error.message}`)
        return
      }

      // Step B: Save raw username in the public 'profiles' table
      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([{ id: data.user.id, username: cleanUsername }])

        if (profileError) {
          setMessage(`Profile Error: ${profileError.message}`)
          return
        }
      }

      setMessage('Account created! Switching to login...')
      setIsSignUp(false)
    } else {
      // -----------------------------
      // LOG IN FLOW
      // -----------------------------
      const { error } = await supabase.auth.signInWithPassword({
        email: syntheticEmail,
        password: password,
      })

      if (error) {
        setMessage(`Login Failed: ${error.message}`)
      } else {
        setMessage('Successfully logged in!')
        // Redirect to dashboard (e.g. window.location.href = '/dashboard')
      }
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-950 text-white p-4">
      <div className="w-full max-w-md rounded-xl border border-gray-800 bg-gray-900 p-6 shadow-2xl">
        <h1 className="mb-2 text-2xl font-bold text-center">
          {isSignUp ? 'Create Expense Account' : 'Welcome Back'}
        </h1>
        <p className="mb-6 text-sm text-gray-400 text-center">
          {isSignUp ? 'Choose a unique Custom ID' : 'Enter your Custom ID and password'}
        </p>

        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">
              Custom User ID
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. raj123"
              className="w-full rounded-lg bg-gray-800 border border-gray-700 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-lg bg-gray-800 border border-gray-700 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 hover:bg-blue-500 py-2.5 font-semibold text-white transition-colors"
          >
            {isSignUp ? 'Sign Up' : 'Log In'}
          </button>
        </form>

        {message && (
          <p className="mt-4 text-center text-sm font-medium text-yellow-400">
            {message}
          </p>
        )}

        <div className="mt-6 text-center text-sm text-gray-400">
          {isSignUp ? 'Already have an ID? ' : "Don't have an ID yet? "}
          <button
            onClick={() => {
              setIsSignUp(!isSignUp)
              setMessage('')
            }}
            className="text-blue-400 underline hover:text-blue-300"
          >
            {isSignUp ? 'Log In' : 'Sign Up'}
          </button>
        </div>
      </div>
    </div>
  )
}