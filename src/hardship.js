'use strict';

const { monthlyPayment, round2 } = require('./amortization');

/**
 * Payment deferral: no payments for `deferMonths`, interest accrues and is
 * capitalized, then the remaining balance re-amortizes over the remaining term.
 */
function deferral({ balance, annualRate, remainingMonths, deferMonths }) {
  if (!Number.isInteger(deferMonths) || deferMonths < 1 || deferMonths > 6) {
    throw new RangeError('deferMonths must be an integer between 1 and 6');
  }
  if (deferMonths >= remainingMonths) {
    throw new RangeError('deferral cannot cover the whole remaining term');
  }
  const r = annualRate / 12;
  const capitalized = round2(balance * Math.pow(1 + r, deferMonths));
  const newTerm = remainingMonths - deferMonths;
  return {
    capitalizedBalance: capitalized,
    accruedInterest: round2(capitalized - balance),
    newPayment: monthlyPayment(capitalized, annualRate, newTerm),
    newTerm,
  };
}

/**
 * Term extension: same balance, longer term, lower payment.
 */
function termExtension({ balance, annualRate, remainingMonths, extraMonths }) {
  if (!Number.isInteger(extraMonths) || extraMonths < 1 || extraMonths > 24) {
    throw new RangeError('extraMonths must be an integer between 1 and 24');
  }
  const oldPayment = monthlyPayment(balance, annualRate, remainingMonths);
  const newPayment = monthlyPayment(balance, annualRate, remainingMonths + extraMonths);
  return { oldPayment, newPayment, monthlySavings: round2(oldPayment - newPayment) };
}

module.exports = { deferral, termExtension };
