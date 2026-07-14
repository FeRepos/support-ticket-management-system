import { isValidTransition } from './stateMachine.js'

describe('isValidTransition', () => {
  describe('valid transitions', () => {
    it.each([
      ['Open', 'In Progress'],
      ['Open', 'Cancelled'],
      ['In Progress', 'Resolved'],
      ['In Progress', 'Cancelled'],
      ['Resolved', 'Closed'],
    ])('returns true for %s -> %s', (from, to) => {
      expect(isValidTransition(from, to)).toBe(true)
    })
  })

  describe('same-status transitions', () => {
    it.each([
      ['Open', 'Open'],
      ['In Progress', 'In Progress'],
      ['Resolved', 'Resolved'],
      ['Closed', 'Closed'],
      ['Cancelled', 'Cancelled'],
    ])('returns false for %s -> %s', (from, to) => {
      expect(isValidTransition(from, to)).toBe(false)
    })
  })

  describe('invalid transitions', () => {
    it.each([
      ['Resolved', 'In Progress'],
      ['Closed', 'Open'],
      ['Cancelled', 'Open'],
      ['In Progress', 'Open'],
      ['Closed', 'Resolved'],
    ])('returns false for %s -> %s', (from, to) => {
      expect(isValidTransition(from, to)).toBe(false)
    })
  })

  describe('unrecognized status strings', () => {
    it('returns false when from status is unrecognized', () => {
      expect(isValidTransition('NotAStatus', 'Open')).toBe(false)
    })

    it('returns false when to status is unrecognized', () => {
      expect(isValidTransition('Open', 'NotAStatus')).toBe(false)
    })

    it('returns false when both statuses are unrecognized', () => {
      expect(isValidTransition('Foo', 'Bar')).toBe(false)
    })

    it('does not throw for unrecognized statuses', () => {
      expect(() => isValidTransition('invalid', 'Open')).not.toThrow()
      expect(() => isValidTransition('Open', 'invalid')).not.toThrow()
    })
  })
})
