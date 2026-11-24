'use strict';

const round2 = (n) => Math.round(n * 100) / 100;

/**
 * Monthly payment for a fully amortizing loan.
 * @param {number} principal  loan amount, > 0
 * @param {number} annualRate annual interest rate as a decimal (0.0899 = 8.99%)
 * @param {number} months     term in months, positive integer
 */
function monthlyPayment(principal, annualRate, months) {
  if (!(principal > 0)) throw new RangeError('principal must be > 0');
  if (!(annualRate >= 0)) throw new RangeError('annualRate must be >= 0');
  if (!Number.isInteger(months) || months <= 0) throw new RangeError('months must be a positive integer');

  const r = annualRate / 12;
  if (r === 0) return round2(principal / months);
  return round2((principal * r) / (1 - Math.pow(1 + r, -months)));
}

/**
 * Full amortization schedule. The final payment absorbs rounding so the
 * balance always ends at exactly 0.
 */
function schedule(principal, annualRate, months) {
  const payment = monthlyPayment(principal, annualRate, months);
  const r = annualRate / 12;
  let balance = principal;
  const rows = [];

  for (let period = 1; period <= months; period++) {
    const interest = round2(balance * r);
    let principalPaid = round2(payment - interest);
    if (period === months) principalPaid = round2(balance);
    balance = round2(balance - principalPaid);
    rows.push({ period, payment: round2(principalPaid + interest), interest, principal: principalPaid, balance });
  }
  return rows;
}

module.exports = { monthlyPayment, schedule, round2 };
