/**
 * Dashboard.jsx
 *
 * The home screen shown after successful login.
 *
 * Displays the user's current balance, overdraft availability,
 * quick stat cards, and a recent activity list.
 *
 * Recent activity is hardcoded for this version as the API only
 * returns a balance — in a real product this would come from a
 * transactions endpoint.
 */

import BottomNav from './BottomNav'
import './Dashboard.css'

/**
 * Formats a number as a GBP currency string.
 * Always shows 2 decimal places — e.g. 220 → "£220.00"
 *
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
 * @param {Function} props.onWithdraw       - Navigate to amount entry
 * @param {Function} props.onSignOut        - End session and return to PIN
 */
export default function Dashboard({
    balance,
    overdraftLimit,
    onWithdraw,
    onSignOut,
    onEnd,
  }) {
  const totalAvailable = balance + overdraftLimit
  const isOverdrawn = balance < 0

  /**
   * Hardcoded recent transactions.
   * Gives the screen context and makes it feel like a real banking app.
   * A real implementation would fetch these from an API.
   */
  const recentActivity = [
    { id: 1, name: 'Cash withdrawal', date: 'Today · 10:24am', amount: -140, type: 'withdrawal' },
    { id: 2, name: 'Cash withdrawal', date: 'Yesterday · 3:15pm', amount: -60, type: 'withdrawal' },
    { id: 3, name: 'Salary deposit', date: 'Mon 17 Mar', amount: 420, type: 'deposit' },
  ]

  return (
    <div className="screen">

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

        {/* Balance hero card */}
        <div className="dashboard__balance-card">
          <p className="dashboard__balance-greeting">Good morning, Michael</p>
          <p className="dashboard__balance-amount">
            {isOverdrawn ? '-' : ''}{formatCurrency(balance)}
          </p>
          <div className="dashboard__balance-row">
            <span className="dashboard__balance-sub">Overdraft available</span>
            <span className="dashboard__balance-badge">
              {formatCurrency(overdraftLimit)}
            </span>
          </div>
        </div>

        {/* Quick stat cards */}
        <div className="dashboard__stats">
          <div className="dashboard__stat">
            <span className="section-label">Total available</span>
            <span className={`dashboard__stat-value ${totalAvailable >= 0 ? 'dashboard__stat-value--positive' : 'dashboard__stat-value--negative'}`}>
              {formatCurrency(totalAvailable)}
            </span>
          </div>
          <div className="dashboard__stat">
            <span className="section-label">Overdraft limit</span>
            <span className="dashboard__stat-value dashboard__stat-value--accent">
              {formatCurrency(overdraftLimit)}
            </span>
          </div>
        </div>

        {/* Recent activity */}
        <p className="section-label">Recent activity</p>
        <ul className="dashboard__activity" aria-label="Recent transactions">
          {recentActivity.map(txn => (
            <li key={txn.id} className="dashboard__txn">
              <div className="dashboard__txn-icon" aria-hidden="true">
                {txn.type === 'deposit' ? (
                  <svg viewBox="0 0 18 18" fill="none">
                    <line x1="9" y1="14" x2="9" y2="4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                    <polyline points="5,8 9,4 13,8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                    <line x1="4" y1="14" x2="14" y2="14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                  </svg>
                ) : (
                  <svg viewBox="0 0 18 18" fill="none">
                    <rect x="2" y="5" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.8"/>
                    <path d="M5 5V4a4 4 0 018 0v1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                    <circle cx="9" cy="10" r="1.5" fill="currentColor"/>
                  </svg>
                )}
              </div>
              <div className="dashboard__txn-info">
                <span className="dashboard__txn-name">{txn.name}</span>
                <span className="dashboard__txn-date">{txn.date}</span>
              </div>
              <span className={`dashboard__txn-amount ${txn.amount >= 0 ? 'dashboard__txn-amount--positive' : 'dashboard__txn-amount--negative'}`}>
                {txn.amount >= 0 ? '+' : '−'}{formatCurrency(txn.amount)}
              </span>
            </li>
          ))}
        </ul>

{/* ── Actions ── */}
<div className="dashboard__actions">
          <button className="btn btn--secondary" onClick={onEnd}>
            I'm done for now
          </button>
        </div>

      </main>

      {/* ── Bottom navigation ── */}
        <BottomNav
         active="home"
        onHome={() => {}}
        onWithdraw={onWithdraw}
        onDeposit={() => alert('Deposits coming soon!')}
    />

    </div>
  )
}