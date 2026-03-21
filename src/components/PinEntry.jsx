/**
 * PinEntry.jsx
 *
 * The login screen. Handles PIN input, API verification,
 * and error states.
 *
 * PIN input is managed as a string array rather than a single
 * string so each dot maps directly to an index — makes the
 * filled/empty state trivial to derive without string manipulation.
 *
 * The keypad is built from a data array rather than hardcoded JSX
 * so the layout is easy to change without touching render logic.
 *
 * No form element is used — the keypad intercepts all input
 * directly, which is the correct pattern for a PIN pad where
 * the user should never see their digits as text.
 */

import { useState } from 'react'
import checkPin from '../utils/pinApi'
import './PinEntry.css'

/** PIN length is fixed at 4 digits */
const PIN_LENGTH = 4

/**
 * Keypad layout — null renders an empty cell, 'clear' and 'back'
 * are action keys. Defined as data so the grid renders from a map.
 */
const KEYPAD_KEYS = [
  '1', '2', '3',
  '4', '5', '6',
  '7', '8', '9',
  'clear', '0', 'back',
]

/**
 * @param {Object}   props
 * @param {Function} props.onSuccess - Called with balance when PIN is verified
 */
export default function PinEntry({ onSuccess }) {
  /** Current PIN digits — max length PIN_LENGTH */
  const [digits, setDigits] = useState([])

  /** Error message shown below the dots on failed attempts */
  const [error, setError] = useState('')

  /** Prevents double-submission while the API call is in flight */
  const [isLoading, setIsLoading] = useState(false)
  const [shake, setShake] = useState(false)


  /**
   * Handles a keypad key press.
   * Digit keys append to the array, back removes the last digit,
   * clear resets everything. Auto-submits when PIN_LENGTH is reached.
   *
   * @param {string} key - The key that was pressed
   */
  function handleKey(key) {
    // Ignore input while loading or if PIN is already full (except clear/back)
    if (isLoading) return

    if (key === 'clear') {
      setDigits([])
      setError('')
      return
    }

    if (key === 'back') {
      setDigits(prev => prev.slice(0, -1))
      setError('')
      return
    }

    // Ignore digit presses if already at max length
    if (digits.length >= PIN_LENGTH) return

    const next = [...digits, key]
    setDigits(next)
    setError('')

    // Auto-submit once the user has entered all digits
    if (next.length === PIN_LENGTH) {
      submitPin(next.join(''))
    }
  }

  /**
   * Submits the PIN to the API.
   * On success, calls onSuccess with the returned balance.
   * On failure, clears the digits and shows the error message.
   *
   * @param {string} pin - The 4-digit PIN string to verify
   */
  async function submitPin(pin) {
    setIsLoading(true)
    setError('')

    try {
      const { currentBalance } = await checkPin(pin)
      onSuccess(currentBalance)
    } catch (err) {
        setError(err.message)
        setDigits([])
        // Trigger shake animation then remove class so it can retrigger
        setShake(true)
        setTimeout(() => setShake(false), 500)
      } finally {
      setIsLoading(false)
    }
  }

  /**
   * Derives the label shown on the login button.
   * Gives the user clear feedback about what will happen next.
   */
  function getButtonLabel() {
    if (isLoading) return 'Verifying...'
    if (digits.length < PIN_LENGTH) return `Enter ${PIN_LENGTH - digits.length} more digit${PIN_LENGTH - digits.length !== 1 ? 's' : ''}`
    return 'Login'
  }

  return (
    <div className="pin-entry">

      {/* ── Brand block ── */}
      <div className="pin-entry__brand">
        <div className="pin-entry__logo-mark" aria-hidden="true">
          <span className="pin-entry__logo-symbol">£</span>
        </div>
        <h1 className="pin-entry__brand-name">
          QUID <em>×</em> ScreenCloud
        </h1>
        <p className="pin-entry__brand-tag">Secure cash · Anytime</p>
      </div>

      {/* ── PIN block ── */}
      <div className="pin-entry__pin-block">

        <h2 className="pin-entry__heading">Enter your PIN</h2>
        <p className="pin-entry__subheading">
          Your 4-digit PIN keeps your account safe
        </p>

        {/* Dot indicators — one per PIN digit */}
        <div
            className={`pin-entry__dots ${shake ? 'shake' : ''}`}
            role="status"
            aria-label={`${digits.length} of ${PIN_LENGTH} digits entered`}
            aria-live="polite"
        >
          {Array.from({ length: PIN_LENGTH }, (_, i) => (
            <span
              key={i}
              className={`pin-entry__dot ${i < digits.length ? 'pin-entry__dot--filled' : ''}`}
            />
          ))}
        </div>

        {/* Error message — only rendered when there is one */}
        {error && (
          <p className="pin-entry__error" role="alert">
            {error}
          </p>
        )}

        {/* Keypad grid */}
        <div
          className="pin-entry__keypad"
          role="group"
          aria-label="PIN keypad"
        >
          {KEYPAD_KEYS.map((key) => (
            <button
              key={key}
              className={`pin-entry__key ${key === 'clear' || key === 'back' ? 'pin-entry__key--action' : ''}`}
              onClick={() => handleKey(key)}
              aria-label={
                key === 'back' ? 'Delete last digit' :
                key === 'clear' ? 'Clear PIN' :
                `Digit ${key}`
              }
              disabled={isLoading}
            >
              {key === 'back' ? '⌫' : key === 'clear' ? 'Clear' : key}
            </button>
          ))}
        </div>

        {/* Login button */}
        <button
        className="pin-entry__submit btn btn--primary"
        onClick={() => digits.length === PIN_LENGTH && submitPin(digits.join(''))}
        disabled={isLoading || digits.length < PIN_LENGTH}
        aria-busy={isLoading}
        >
  {isLoading ? (
    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
      <span className="spinner" />
      Verifying...
    </span>
  ) : (
    getButtonLabel()
  )}
</button>

      </div>
    </div>
  )
}