const { deferral, termExtension } = require('../src');

describe('deferral', () => {
  const base = { balance: 8000, annualRate: 0.0899, remainingMonths: 36 };

  test('capitalizes accrued interest and shortens the term', () => {
    const d = deferral({ ...base, deferMonths: 3 });
    expect(d.newTerm).toBe(33);
    expect(d.accruedInterest).toBeGreaterThan(0);
    expect(d.capitalizedBalance).toBeCloseTo(8000 + d.accruedInterest, 2);
  });

  test('rejects deferrals over 6 months', () => {
    expect(() => deferral({ ...base, deferMonths: 7 })).toThrow(RangeError);
  });

  test('rejects deferral covering the whole term', () => {
    expect(() => deferral({ ...base, remainingMonths: 3, deferMonths: 3 })).toThrow(RangeError);
  });
});

describe('termExtension', () => {
  test('lowers the monthly payment', () => {
    const t = termExtension({ balance: 8000, annualRate: 0.0899, remainingMonths: 36, extraMonths: 12 });
    expect(t.newPayment).toBeLessThan(t.oldPayment);
    expect(t.monthlySavings).toBeCloseTo(t.oldPayment - t.newPayment, 2);
  });
});
