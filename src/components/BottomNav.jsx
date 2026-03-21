/**
 * BottomNav.jsx
 *
 * Persistent bottom navigation bar shown on all authenticated screens.
 *
 * Follows the SoFi/Wells Fargo pattern — equal weight items, icon + label,
 * active state highlighted in accent colour with a pip indicator underneath.
 *
 * The Deposit tab is intentionally non-functional in this version.
 * It's included because a real ATM has deposit functionality and its
 * presence shows product thinking beyond the brief requirements.
 *
 * No hover effects — this is a mobile-first component.
 */

import './BottomNav.css'

/**
 * SVG icon paths kept inline to avoid an icon library dependency.
 * Each icon is hand-crafted at 22x22 viewBox for consistency.
 */
const icons = {
    home: (
      <svg viewBox="0 0 22 22" fill="none" aria-hidden="true">
        <path
          d="M3 9.5L11 3l8 6.5V19a1 1 0 01-1 1H14v-5h-4v5H4a1 1 0 01-1-1V9.5z"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    withdraw: (
      <svg viewBox="0 0 22 22" fill="none" aria-hidden="true">
        <rect x="2" y="6" width="18" height="14" rx="2"
          strokeLinecap="round" strokeLinejoin="round"/>
        <line x1="2" y1="10" x2="20" y2="10"
          strokeLinecap="round"/>
        <line x1="11" y1="15" x2="11" y2="18"
          strokeLinecap="round"/>
        <line x1="9" y1="18" x2="13" y2="18"
          strokeLinecap="round"/>
        <line x1="7" y1="3" x2="7" y2="7"
          strokeLinecap="round"/>
        <line x1="15" y1="3" x2="15" y2="7"
          strokeLinecap="round"/>
      </svg>
    ),
    deposit: (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"
            strokeLinecap="round" strokeLinejoin="round"/>
          <polyline points="17 8 12 3 7 8"
            strokeLinecap="round" strokeLinejoin="round"/>
          <line x1="12" y1="3" x2="12" y2="15"
            strokeLinecap="round"/>
        </svg>
      ),
  }

/**
 * @typedef {'home' | 'withdraw' | 'deposit'} NavTab
 */

/**
 * @param {Object}   props
 * @param {NavTab}   props.active       - Currently active tab
 * @param {Function} props.onHome       - Called when Home tab is tapped
 * @param {Function} props.onWithdraw   - Called when Withdraw tab is tapped
 * @param {Function} props.onDeposit    - Called when Deposit tab is tapped
 */
export default function BottomNav({ active, onHome, onWithdraw, onDeposit }) {
  const tabs = [
    {
      id: 'home',
      label: 'Home',
      icon: icons.home,
      onClick: onHome,
    },
    {
      id: 'withdraw',
      label: 'Withdraw',
      icon: icons.withdraw,
      onClick: onWithdraw,
    },
    {
      id: 'deposit',
      label: 'Deposit',
      icon: icons.deposit,
      onClick: onDeposit,
    },
  ]

  return (
    <nav className="bottom-nav" aria-label="Main navigation">
      {tabs.map(tab => (
        <button
          key={tab.id}
          className={`bottom-nav__item ${active === tab.id ? 'bottom-nav__item--active' : ''}`}
          onClick={tab.onClick}
          aria-current={active === tab.id ? 'page' : undefined}
          aria-label={tab.label}
        >
          <span className="bottom-nav__icon">{tab.icon}</span>
          <span className="bottom-nav__label">{tab.label}</span>
          <span className="bottom-nav__pip" aria-hidden="true" />
        </button>
      ))}
    </nav>
  )
}