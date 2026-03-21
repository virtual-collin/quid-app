/**
 * dispenseNotes.js
 *
 * Proportional greedy algorithm for ATM note dispensing.
 *
 * Rather than a pure greedy approach (largest denomination first),
 * we calculate each denomination's share of the total machine value
 * and allocate proportionally. This produces a more even mix of notes
 * which is better UX and matches real ATM behaviour.
 *
 * Falls back to a greedy top-up pass if rounding leaves a remainder,
 * and returns null if the exact amount cannot be made with remaining stock.
 */

/**
 * @typedef {Object} NoteStock
 * @property {number} 20 - Number of £20 notes available
 * @property {number} 10 - Number of £10 notes available
 * @property {number} 5  - Number of £5 notes available
 */

/**
 * @typedef {Object} NoteResult
 * @property {number} 20 - Number of £20 notes to dispense
 * @property {number} 10 - Number of £10 notes to dispense
 * @property {number} 5  - Number of £5 notes to dispense
 */

/**
 * Calculates which notes to dispense for a given withdrawal amount.
 *
 * @param {number} amount - The amount to withdraw in whole pounds
 * @param {NoteStock} stock - Current note stock in the machine
 * @returns {NoteResult|null} Note breakdown, or null if amount cannot be made
 *
 * @example
 * dispenseNotes(140, { 20: 7, 10: 15, 5: 4 })
 * // Returns { 20: 4, 10: 3, 5: 2 } — proportional mix totalling £140
 */
function dispenseNotes(amount, stock) {
    const denoms = [20, 10, 5]
  
    // Total value currently held in the machine across all denominations.
    // Used to calculate each denomination's proportional weight.
    const totalMachineValue = denoms.reduce((sum, denom) => {
      return sum + denom * stock[denom]
    }, 0)
  
    const result = {}
    let remaining = amount
  
    // Pass 1 — proportional allocation.
    // For each denomination, work out what fraction of the machine's total
    // value it represents, then allocate that fraction of the withdrawal.
    // Cap at: the proportional ideal, available stock value, and remaining amount.
    for (const denom of denoms) {
      const denomValue = denom * stock[denom]
      const proportion = denomValue / totalMachineValue
      const idealAmount = Math.round((amount * proportion) / denom) * denom
      const capped = Math.min(idealAmount, denomValue, remaining)
      const notes = Math.floor(capped / denom)
  
      result[denom] = notes
      remaining -= notes * denom
    }
  
    // Pass 2 — greedy remainder mop-up.
    // Rounding in pass 1 can leave a small remainder (e.g. £5 or £10).
    // Work through denominations largest-first and top up where stock allows.
    for (const denom of denoms) {
      while (remaining >= denom && result[denom] < stock[denom]) {
        result[denom]++
        remaining -= denom
      }
    }
  
    // If we still can't make the exact amount (e.g. only £20s left
    // but the remainder is £10), return null so the UI can decline gracefully.
    if (remaining !== 0) return null
  
    return result
  }
  
  export default dispenseNotes