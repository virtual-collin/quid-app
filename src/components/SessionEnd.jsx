/**
 * SessionEnd.jsx
 *
 * Final screen shown when the user chooses to end their session.
 *
 * Simple confirmation screen with a success state and a prompt
 * to return to the start. No navigation bar — the session is
 * over so there's nothing to navigate to.
 *
 * The Nintendo Switch reference is intentional — it's a nod to
 * the brief and adds a bit of personality to the end state.
 */

import './SessionEnd.css'

/**
 * @param {Object}   props
 * @param {Function} props.onRestart - Resets session and returns to PIN screen
 */
export default function SessionEnd({ onRestart }) {
  return (
    <div className="session-end fade-in">

      {/* Success icon */}
      <div className="session-end__icon" aria-hidden="true">
        <svg
          viewBox="0 0 28 28"
          fill="none"
          aria-hidden="true"
        >
          <polyline
            points="6,14 11,20 22,9"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Message */}
      <div className="session-end__content">
        <h1 className="session-end__title">All done, Michael!</h1>
        <p className="session-end__message">
          Thanks for using QUID. Your cash is ready —
          enjoy that Switch!
        </p>
      </div>

      {/* Return to start */}
      <button
        className="btn btn--primary session-end__btn"
        onClick={onRestart}
      >
        Back to start
      </button>

    </div>
  )
}