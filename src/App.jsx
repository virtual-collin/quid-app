/**
 * App.jsx
 *
 * Root component and single source of truth for application state.
 *
 * Acts as a lightweight state machine — the `screen` value determines
 * what the user sees, and all shared state (balance, note stock, session
 * history) lives here and is passed down as props.
 *
 * We deliberately avoid a router for this project. With a fixed linear
 * flow and no deep-linking requirements, a simple screen switcher is
 * cleaner and easier to reason about than URL-based routing.
 */

import { useState } from 'react'
import PinEntry from './components/PinEntry'
import Dashboard from './components/Dashboard'
import AmountEntry from './components/AmountEntry'
import NoteBreakdown from './components/NoteBreakdown'
import SessionEnd from './components/SessionEnd'
import './index.css'

/**
 * Initial note stock loaded into the machine at session start.
 * Defined here so it's easy to adjust for testing.
 */
const INITIAL_STOCK = { 20: 7, 10: 15, 5: 4 }

/**
 * Maximum overdraft the machine will allow in pounds.
 * Withdrawals that would exceed this are declined.
 */
const OVERDRAFT_LIMIT = 100

export default function App() {
  const [screen, setScreen] = useState('pin')
  const [balance, setBalance] = useState(0)
  const [stock, setStock] = useState(INITIAL_STOCK)
  const [lastTransaction, setLastTransaction] = useState(null)
  const [transactions, setTransactions] = useState([])

  /**
   * Called by PinEntry on successful API response.
   * Stores the balance returned by the API and moves to the dashboard.
   *
   * @param {number} currentBalance - Balance returned from the PIN API
   */
  function handleLoginSuccess(currentBalance) {
    setBalance(currentBalance)
    setScreen('dashboard')
  }

  /**
   * Called by AmountEntry after the user confirms a withdrawal amount.
   * Updates balance and stock, records the transaction, then navigates
   * to the breakdown screen.
   *
   * @param {number} amount - The amount being withdrawn
   * @param {Object} notes  - The note breakdown to dispense
   */
  function handleWithdrawal(amount, notes) {
    const balanceBefore = balance
    const balanceAfter = balance - amount
    const isOverdrawn = balanceAfter < 0

    // Deduct dispensed notes from machine stock
    const newStock = {
      20: stock[20] - (notes[20] ?? 0),
      10: stock[10] - (notes[10] ?? 0),
      5:  stock[5]  - (notes[5]  ?? 0),
    }

    setStock(newStock)
    setBalance(balanceAfter)

    const transaction = {
      amount,
      notes,
      balanceBefore,
      balanceAfter,
      isOverdrawn,
      date: new Date(),
      id: Date.now(),
    }

    setLastTransaction(transaction)

    // Add to transaction history — most recent first
    setTransactions(prev => [transaction, ...prev])

    setScreen('breakdown')
  }

  /**
   * Resets the entire session back to the PIN screen.
   * Stock is intentionally NOT reset — the machine has less cash
   * after real withdrawals.
   */
  function handleSignOut() {
    setBalance(0)
    setLastTransaction(null)
    setScreen('pin')
  }

  function renderScreen() {
    switch (screen) {
      case 'pin':
        return (
          <PinEntry
            onSuccess={handleLoginSuccess}
          />
        )

      case 'dashboard':
        return (
          <Dashboard
            balance={balance}
            overdraftLimit={OVERDRAFT_LIMIT}
            onWithdraw={() => setScreen('amount')}
            onSignOut={handleSignOut}
            onEnd={() => setScreen('end')}
            transactions={transactions}
          />
        )

      case 'amount':
        return (
          <AmountEntry
            balance={balance}
            overdraftLimit={OVERDRAFT_LIMIT}
            stock={stock}
            onConfirm={handleWithdrawal}
            onBack={() => setScreen('dashboard')}
            onSignOut={handleSignOut}
          />
        )

      case 'breakdown':
        return (
          <NoteBreakdown
            transaction={lastTransaction}
            stock={stock}
            onAnother={() => setScreen('amount')}
            onHome={() => setScreen('dashboard')}
            onSignOut={handleSignOut}
          />
        )

      case 'end':
        return (
          <SessionEnd
            onRestart={handleSignOut}
          />
        )

      default:
        return null
    }
  }

  return (
    <div className="app-shell">
      {renderScreen()}
    </div>
  )
}