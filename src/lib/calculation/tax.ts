import { TAX_BRACKETS, BONUS_TAX_BRACKETS } from './constants';
import { roundToFen } from './utils';

export function calcTax(taxableIncome: number): number {
  for (const bracket of TAX_BRACKETS) {
    if (taxableIncome <= bracket.max) {
      return roundToFen(taxableIncome * bracket.rate - bracket.deduction);
    }
  }
  const last = TAX_BRACKETS[TAX_BRACKETS.length - 1];
  return roundToFen(taxableIncome * last.rate - last.deduction);
}

export function getTaxBracketIndex(taxableIncome: number): number {
  for (let i = 0; i < TAX_BRACKETS.length; i++) {
    if (taxableIncome <= TAX_BRACKETS[i].max) return i;
  }
  return TAX_BRACKETS.length - 1;
}

export function calcBonusTaxSeparate(bonus: number): number {
  if (bonus <= 0) return 0;
  const monthlyAvg = bonus / 12;
  for (const bracket of BONUS_TAX_BRACKETS) {
    if (monthlyAvg <= bracket.max) {
      return roundToFen(bonus * bracket.rate - bracket.deduction);
    }
  }
  const last = BONUS_TAX_BRACKETS[BONUS_TAX_BRACKETS.length - 1];
  return roundToFen(bonus * last.rate - last.deduction);
}
