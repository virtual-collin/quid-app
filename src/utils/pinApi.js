/**
 * pinApi.js
 *
 * Handles communication with the QUID PIN verification API.
 *
 * Kept as a standalone utility so the API logic stays completely
 * separate from UI components. If the endpoint ever changes,
 * this is the only file that needs updating.
 */

const PIN_API_URL = 'https://pinapi.screencloudsolutions.com/api/pin'

/**
 * @typedef {Object} PinResponse
 * @property {number} currentBalance - The user's current account balance in pounds
 */

/**
 * Verifies a user's PIN against the API and returns their account balance.
 *
 * Throws an error for both network failures and invalid PINs (403),
 * so the calling component can handle both cases the same way.
 *
 * @param {string} pin - The 4-digit PIN entered by the user
 * @returns {Promise<PinResponse>} Resolves with account data on success
 * @throws {Error} Rejects with a user-facing message on failure
 *
 * @example
 * const { currentBalance } = await checkPin('1111')
 */
async function checkPin(pin) {
  const response = await fetch(PIN_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pin })
  })

  const data = await response.json()

  // 403 means the PIN itself was wrong — surface a clear message
  if (response.status === 403) {
    throw new Error('Incorrect PIN. Please try again.')
  }

  // Catch any other non-2xx responses (network issues, server errors)
  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong. Please try again.')
  }

  return data
}

export default checkPin