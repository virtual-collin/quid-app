/**
 * NoteBreakdown.jsx
 *
 * Post-transaction confirmation screen.
 *
 * Shown automatically after a successful withdrawal. Displays
 * the note breakdown, transaction summary, and overdraft warning
 * if the user has gone into negative balance.
 *
 * Also shows a low stock warning if any denomination is running
 * low — defined as 2 or fewer notes remaining.
 *
 * This screen is never accessed directly via navigation — it is
 * only reachable as a redirect after a completed transaction.
 */

import BottomNav from './BottomNav'
import './NoteBreakdown.css'

/**
 * Number of notes remaining at which we consider a denomination low.
 */
const LOW_STOCK_THRESHOLD = 2

/**
 * Formats a number as a GBP currency string.
 * @param {number} amount
 * @returns {string}
 */
function formatCurrency(amount) {
  return `£${Math.abs(amount).toFixed(2)}`
}

/**
 * @param {Object}   props
 * @param {Object}   props.transaction              - Last transaction details
 * @param {number}   props.transaction.amount       - Amount withdrawn
 * @param {Object}   props.transaction.notes        - Notes dispensed
 * @param {number}   props.transaction.balanceBefore - Balance before withdrawal
 * @param {number}   props.transaction.balanceAfter  - Balance after withdrawal
 * @param {boolean}  props.transaction.isOverdrawn  - Whether user is now overdrawn
 * @param {Object}   props.stock                    - Remaining note stock
 * @param {Function} props.onAnother                - Navigate to amount entry
 * @param {Function} props.onHome                   - Navigate to dashboard
 * @param {Function} props.onSignOut                - End session
 */
export default function NoteBreakdown({
  transaction,
  stock,
  onAnother,
  onHome,
  onSignOut,
}) {
  if (!transaction) return null

  const {
    amount,
    notes,
    balanceBefore,
    balanceAfter,
    isOverdrawn,
  } = transaction

  /**
   * Builds the list of dispensed note pills from the notes object.
   * Filters out denominations where 0 notes were given.
   */
  const notePills = [
    { denom: 20, count: notes[20], className: 'note-pill--20' },
    { denom: 10, count: notes[10], className: 'note-pill--10' },
    { denom: 5,  count: notes[5],  className: 'note-pill--5'  },
  ].filter(note => note.count > 0)

  /**
   * Check remaining stock for each denomination.
   * Flags any that are at or below the low stock threshold.
   */
  const lowStockWarnings = [20, 10, 5].filter(denom => {
    const remaining = stock ? stock[denom] : null
    return remaining !== null && remaining <= LOW_STOCK_THRESHOLD && remaining > 0
  })

  return (
    <div className="screen fade-in">

      {/* ── Header ── */}
      <header className="screen__header">
        <span className="screen__logo">
          QUID <em>×</em> SC
        </span>
        <button className="btn-signout" onClick={onSignOut} aria-label="Sign out">
          <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path
              d="M8 1h2a1 1 0 011 1v8a1 1 0 01-1 1H8M5 9l-4-3 4-3M1 6h7"
              stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
            />
          </svg>
          Sign out
        </button>
      </header>

      {/* ── Scrollable content ── */}
      <main className="screen__scroll">

        <p className={`note-breakdown__amount ${isOverdrawn ? 'note-breakdown__amount--overdrawn' : ''}`}>
          {formatCurrency(amount)}
        </p>
        <p className="note-breakdown__subtitle">
          {isOverdrawn
            ? "Withdrawn — but there's something to know"
            : 'Cash dispensed — collect your notes below'}
        </p>

        {/* Overdraft warning banner */}
        {isOverdrawn && (
          <div className="overdraft-banner" role="alert">
            <span className="overdraft-banner__dot" aria-hidden="true" />
            <p className="overdraft-banner__text">
              You're now overdrawn by {formatCurrency(Math.abs(balanceAfter))}.
              You've used {formatCurrency(Math.abs(balanceAfter))} of your overdraft.
              Interest may apply.
            </p>
          </div>
        )}

        {/* Low stock warning */}
        {lowStockWarnings.length > 0 && (
          <div className="low-stock-banner" role="status">
            <span className="low-stock-banner__dot" aria-hidden="true" />
            <p className="low-stock-banner__text">
              Running low on{' '}
              {lowStockWarnings.map(d => `£${d}`).join(' and ')} notes.
              Please visit another machine soon.
            </p>
          </div>
        )}

        {/* Note pills */}
        <div className="note-pills" aria-label="Notes dispensed">
          {notePills.map(({ denom, count, className }) => (
            <span key={denom} className={`note-pill ${className}`}>
              {count} × £{denom}
            </span>
          ))}
        </div>

        <hr className="divider" />

        {/* Transaction summary */}
        <dl className="note-breakdown__summary">
          <div className="info-row">
            <dt className="info-row__label">Balance before</dt>
            <dd className="info-row__value">
              {balanceBefore < 0 ? '-' : ''}{formatCurrency(balanceBefore)}
            </dd>
          </div>
          <div className="info-row">
            <dt className="info-row__label">Withdrawn</dt>
            <dd className="info-row__value">
              {formatCurrency(amount)}
            </dd>
          </div>
          <div className="info-row">
            <dt className="info-row__label">New balance</dt>
            <dd className={`info-row__value ${isOverdrawn ? 'info-row__value--negative' : 'info-row__value--positive'}`}>
              {balanceAfter < 0 ? '-' : ''}{formatCurrency(balanceAfter)}
            </dd>
          </div>
        </dl>

      </main>

      {/* ── Actions ── */}
      <div className="screen__actions">
        {!isOverdrawn && (
          <button className="btn btn--primary" onClick={onAnother}>
            Make another withdrawal
          </button>
        )}
        <button
          className={`btn ${isOverdrawn ? 'btn--primary' : 'btn--secondary'}`}
          onClick={onHome}
        >
          Back to home
        </button>
      </div>

      {/* ── Bottom navigation ── */}
      <BottomNav
        active="withdraw"
        onHome={onHome}
        onWithdraw={onAnother}
        onDeposit={() => {}}
      />

    </div>
  )
}