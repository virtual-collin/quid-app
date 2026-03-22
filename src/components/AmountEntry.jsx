/**
 * AmountEntry.jsx
 *
 * Withdrawal amount selection screen.
 *
 * Two input methods are supported:
 * 1. Preset buttons — common amounts for quick selection
 * 2. Custom input — free text entry for any amount
 *
 * Validation runs before confirming:
 * - Amount must be a positive multiple of £5 (smallest note)
 * - Amount must not exceed balance + overdraft limit
 * - Machine must have enough notes to make the exact amount
 *
 * The dispenseNotes algorithm runs here so we can show a
 * "machine can't make that amount" error before committing
 * to the withdrawal.
 */

import { useState } from 'react'
import BottomNav from './BottomNav'
import dispenseNotes from '../utils/dispenseNotes'
import './AmountEntry.css'

/**
 * Preset withdrawal amounts in pounds.
 * Chosen to cover common ATM withdrawal amounts.
 */
const PRESET_AMOUNTS = [10, 20, 50, 100, 150, 200]

/**
 * Formats a number as a GBP string — e.g. 220 → "£220.00"
 * @param {number} amount
 * @returns {string}
 */
function formatCurrency(amount) {
  return `£${Math.abs(amount).toFixed(2)}`
}

/**
 * @param {Object}   props
 * @param {number}   props.balance          - Current account balance
 * @param {number}   props.overdraftLimit   - Maximum overdraft allowed
 * @param {Object}   props.stock            - Current note stock in machine
 * @param {Function} props.onConfirm        - Called with (amount, notes) on success
 * @param {Function} props.onBack           - Navigate back to dashboard
 * @param {Function} props.onSignOut        - End session
 */
export default function AmountEntry({
  balance,
  overdraftLimit,
  stock,
  onConfirm,
  onBack,
  onSignOut,
}) {
  /** Currently selected preset amount, or null if custom input is active */
  const [selectedPreset, setSelectedPreset] = useState(null)

  /** Value of the custom amount input field */
  const [customAmount, setCustomAmount] = useState('')

  /** Validation error message shown above the confirm button */
  const [error, setError] = useState('')

  /** The amount currently selected — derived from preset or custom input */
  const activeAmount = customAmount !== ''
    ? parseInt(customAmount, 10)
    : selectedPreset

  /** Maximum the user can withdraw — balance plus overdraft */
  const maxWithdrawal = balance + overdraftLimit

  /**
   * Handles preset button selection.
   * Clears custom input when a preset is chosen so they don't conflict.
   *
   * @param {number} amount
   */
  function handlePresetSelect(amount) {
    setSelectedPreset(amount)
    setCustomAmount('')
    setError('')
  }

  /**
   * Handles custom amount input changes.
   * Clears preset selection when the user types a custom amount.
   *
   * @param {string} value - Raw input value
   */
  function handleCustomInput(value) {
    setCustomAmount(value)
    setSelectedPreset(null)
    setError('')
  }

  /**
   * Validates the selected amount and runs the note dispense algorithm.
   * Shows a specific error message for each failure case so the user
   * knows exactly what to do next.
   */
  function handleConfirm() {
    if (!activeAmount || activeAmount <= 0) {
      setError('Please select or enter an amount.')
      return
    }

    if (activeAmount % 5 !== 0) {
      setError('Amount must be a multiple of £5.')
      return
    }

    if (activeAmount > maxWithdrawal) {
      setError(`Maximum you can withdraw is ${formatCurrency(maxWithdrawal)}.`)
      return
    }

    const notes = dispenseNotes(activeAmount, stock)

    if (!notes) {
      setError("The machine can't make that exact amount with the remaining notes. Please try a different amount.")
      return
    }

    onConfirm(activeAmount, notes)
  }

  /**
   * Derives the label for the confirm button based on current state.
   */
  function getButtonLabel() {
    if (!activeAmount || activeAmount <= 0) return 'Select an amount'
    return `Withdraw ${formatCurrency(activeAmount)}`
  }

  return (
    <div className="screen fade-in">

      {/* ── Header ── */}
      <header className="screen__header">
        <span className="screen__logo">
          QUID <em>×</em> SC
        </span>
        <button className="btn-signout" onClick={onSignOut} aria-label="Sign out">
          <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M8 1h2a1 1 0 011 1v8a1 1 0 01-1 1H8M5 9l-4-3 4-3M1 6h7"
              stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Sign out
        </button>
      </header>

      {/* ── Scrollable content ── */}
      <main className="screen__scroll">
        <h2 className="page-title">How much?</h2>
        <p className="page-subtitle">
          Balance: {formatCurrency(balance)} · Max: {formatCurrency(maxWithdrawal)}
        </p>

        {/* Preset amount buttons */}
        <div
          className="amount-entry__presets"
          role="group"
          aria-label="Preset withdrawal amounts"
        >
          {PRESET_AMOUNTS.map(amount => (
            <button
              key={amount}
              className={`amount-entry__preset ${selectedPreset === amount ? 'amount-entry__preset--active' : ''}`}
              onClick={() => handlePresetSelect(amount)}
              aria-pressed={selectedPreset === amount}
            >
              {formatCurrency(amount).replace('.00', '')}
            </button>
          ))}
        </div>

        {/* Custom amount input */}
        <div className={`amount-entry__custom ${customAmount ? 'amount-entry__custom--active' : ''}`}>
          <span className="amount-entry__currency" aria-hidden="true">£</span>
          <input
            type="number"
            className="amount-entry__input"
            placeholder="Enter another amount"
            value={customAmount}
            onChange={e => handleCustomInput(e.target.value)}
            min="0"
            step="5"
            aria-label="Custom withdrawal amount in pounds"
          />
        </div>

      </main>

      {/* Error sits here — above buttons, always visible */}
      {error && (
        <p className="amount-entry__error" role="alert">
          {error}
        </p>
      )}

      {/* ── Actions ── */}
      <div className="screen__actions">
        <button
          className="btn btn--primary"
          onClick={handleConfirm}
          disabled={!activeAmount || activeAmount <= 0}
        >
          {getButtonLabel()}
        </button>
        <button className="btn btn--secondary" onClick={onBack}>
          Back to home
        </button>
      </div>

      {/* ── Bottom navigation ── */}
      <BottomNav
        active="withdraw"
        onHome={onBack}
        onWithdraw={() => {}}
        onDeposit={() => {}}
      />

    </div>
  )
}