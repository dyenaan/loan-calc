const { monthlyPayment, schedule } = require('../src');

describe('monthlyPayment', () => {
  test('standard 5-year personal loan', () => {
    expect(monthlyPayment(10000, 0.0899, 60)).toBeCloseTo(207.54, 2);
  });

  test('zero-interest loan splits evenly', () => {
    expect(monthlyPayment(1200, 0, 12)).toBe(100);
  });

  test.each([
    [0, 0.05, 12],
    [1000, -0.01, 12],
    [1000, 0.05, 0],
    [1000, 0.05, 12.5],
  ])('rejects invalid input (%p, %p, %p)', (p, r, m) => {
    expect(() => monthlyPayment(p, r, m)).toThrow(RangeError);
  });
});

describe('schedule', () => {
  test('ends at a zero balance', () => {
    const rows = schedule(10000, 0.0899, 60);
    expect(rows).toHaveLength(60);
    expect(rows[rows.length - 1].balance).toBe(0);
  });

  test('principal paid sums to the loan amount', () => {
    const total = schedule(5000, 0.12, 24).reduce((s, r) => s + r.principal, 0);
    expect(total).toBeCloseTo(5000, 2);
  });
});
