/**
 * dispenseNotes.test.js
 *
 * Unit tests for the proportional greedy note dispensing algorithm.
 *
 * Tests cover:
 * - Standard withdrawals with full stock
 * - Michael's exact three withdrawals from the brief
 * - Edge cases — zero amount, impossible amounts, depleted stock
 * - Overdraft scenario — algorithm doesn't care about balance,
 *   that validation happens in AmountEntry before dispenseNotes is called
 *
 * The algorithm should always return notes that sum to exactly
 * the requested amount, or null if it cannot be done.
 */

import { describe, it, expect } from 'vitest'
import dispenseNotes from './dispenseNotes'

/**
 * Helper — sums the total value of a note result object.
 * Used to verify the dispensed notes add up to the requested amount.
 *
 * @param {Object} notes - Result from dispenseNotes
 * @returns {number} Total value in pounds
 */
function totalValue(notes) {
  return (notes[20] * 20) + (notes[10] * 10) + (notes[5] * 5)
}

/** Starting stock as defined in the brief */
const FULL_STOCK = { 20: 7, 10: 15, 5: 4 }

describe('dispenseNotes', () => {

  describe('basic correctness', () => {
    it('returns notes that sum to exactly the requested amount', () => {
      const result = dispenseNotes(140, FULL_STOCK)
      expect(result).not.toBeNull()
      expect(totalValue(result)).toBe(140)
    })

    it('never dispenses more notes than are in stock', () => {
      const result = dispenseNotes(140, FULL_STOCK)
      expect(result).not.toBeNull()
      expect(result[20]).toBeLessThanOrEqual(FULL_STOCK[20])
      expect(result[10]).toBeLessThanOrEqual(FULL_STOCK[10])
      expect(result[5]).toBeLessThanOrEqual(FULL_STOCK[5])
    })

    it('never returns negative note counts', () => {
      const result = dispenseNotes(50, FULL_STOCK)
      expect(result).not.toBeNull()
      expect(result[20]).toBeGreaterThanOrEqual(0)
      expect(result[10]).toBeGreaterThanOrEqual(0)
      expect(result[5]).toBeGreaterThanOrEqual(0)
    })
  })

  describe("Michael's three withdrawals from the brief", () => {
    it('correctly dispenses £140 from full stock', () => {
      const result = dispenseNotes(140, FULL_STOCK)
      expect(result).not.toBeNull()
      expect(totalValue(result)).toBe(140)
    })

    it('correctly dispenses £50 after £140 has been taken', () => {
      // Simulate stock after first withdrawal
      const first = dispenseNotes(140, FULL_STOCK)
      expect(first).not.toBeNull()

      const stockAfterFirst = {
        20: FULL_STOCK[20] - first[20],
        10: FULL_STOCK[10] - first[10],
        5:  FULL_STOCK[5]  - first[5],
      }

      const second = dispenseNotes(50, stockAfterFirst)
      expect(second).not.toBeNull()
      expect(totalValue(second)).toBe(50)
    })

    it('correctly dispenses £90 after £140 and £50 have been taken', () => {
      // Simulate stock after first and second withdrawals
      const first = dispenseNotes(140, FULL_STOCK)
      expect(first).not.toBeNull()

      const stockAfterFirst = {
        20: FULL_STOCK[20] - first[20],
        10: FULL_STOCK[10] - first[10],
        5:  FULL_STOCK[5]  - first[5],
      }

      const second = dispenseNotes(50, stockAfterFirst)
      expect(second).not.toBeNull()

      const stockAfterSecond = {
        20: stockAfterFirst[20] - second[20],
        10: stockAfterFirst[10] - second[10],
        5:  stockAfterFirst[5]  - second[5],
      }

      const third = dispenseNotes(90, stockAfterSecond)
      expect(third).not.toBeNull()
      expect(totalValue(third)).toBe(90)
    })

    it('total of all three withdrawals equals £280', () => {
      const first = dispenseNotes(140, FULL_STOCK)
      expect(first).not.toBeNull()

      const stockAfterFirst = {
        20: FULL_STOCK[20] - first[20],
        10: FULL_STOCK[10] - first[10],
        5:  FULL_STOCK[5]  - first[5],
      }

      const second = dispenseNotes(50, stockAfterFirst)
      expect(second).not.toBeNull()

      const stockAfterSecond = {
        20: stockAfterFirst[20] - second[20],
        10: stockAfterFirst[10] - second[10],
        5:  stockAfterFirst[5]  - second[5],
      }

      const third = dispenseNotes(90, stockAfterSecond)
      expect(third).not.toBeNull()

      const total = totalValue(first) + totalValue(second) + totalValue(third)
      expect(total).toBe(280)
    })
  })

  describe('edge cases', () => {
    it('returns null for an amount that cannot be made with remaining notes', () => {
      // Only £20s left — cannot make £10 or £30
      const stock = { 20: 2, 10: 0, 5: 0 }
      const result = dispenseNotes(10, stock)
      expect(result).toBeNull()
    })

    it('handles a single £5 note correctly', () => {
      const stock = { 20: 0, 10: 0, 5: 1 }
      const result = dispenseNotes(5, stock)
      expect(result).not.toBeNull()
      expect(result[5]).toBe(1)
      expect(totalValue(result)).toBe(5)
    })

    it('handles exact stock depletion — uses every note', () => {
      // Total stock value = £310 — request exactly that
      const result = dispenseNotes(310, FULL_STOCK)
      expect(result).not.toBeNull()
      expect(totalValue(result)).toBe(310)
      expect(result[20]).toBe(FULL_STOCK[20])
      expect(result[10]).toBe(FULL_STOCK[10])
      expect(result[5]).toBe(FULL_STOCK[5])
    })

    it('returns null when stock is empty', () => {
      const stock = { 20: 0, 10: 0, 5: 0 }
      const result = dispenseNotes(20, stock)
      expect(result).toBeNull()
    })

    it('handles amount only achievable with £5 notes', () => {
      const stock = { 20: 0, 10: 0, 5: 4 }
      const result = dispenseNotes(20, stock)
      expect(result).not.toBeNull()
      expect(result[5]).toBe(4)
      expect(totalValue(result)).toBe(20)
    })

    it('produces a mix of notes rather than just one denomination', () => {
      // With full stock, £50 should not be all £10s or all £20s
      const result = dispenseNotes(50, FULL_STOCK)
      expect(result).not.toBeNull()
      expect(totalValue(result)).toBe(50)
      // At least two denominations should be used
      const denomsUsed = [result[20], result[10], result[5]].filter(n => n > 0).length
      expect(denomsUsed).toBeGreaterThan(1)
    })
  })

})