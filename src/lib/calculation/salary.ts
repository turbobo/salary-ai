import { CITY_PRESETS } from './constants';
import { roundToFen, clamp } from './utils';
import { calcTax, getTaxBracketIndex, calcBonusTaxSeparate } from './tax';

export interface MonthData {
  salary: number | null;
  bonus: number;
  subsidy: number;
  socialInsuranceBase: number | null;
  pensionRate: number | null;
  medicalRate: number | null;
  unemploymentRate: number | null;
  housingFundBase: number | null;
  housingFundRate: number | null;
}

export interface GlobalParams {
  salary: number;
  socialInsuranceBase: number;
  pensionRate: number;
  medicalRate: number;
  unemploymentRate: number;
  housingFundBase: number;
  housingFundRate: number;
}

export interface MonthResult {
  month: number;
  enabled: boolean;
  salary: number;
  subsidy: number;
  bonus: number;
  bonusInThisMonth: number;
  pension: number;
  medical: number;
  unemployment: number;
  totalSI: number;
  housingFund: number;
  totalDeductions: number;
  taxableIncome: number;
  cumulativeTaxableIncome: number;
  monthTax: number;
  cumulativeTax: number;
  netSalary: number;
  bracketChanged: boolean;
  bracketIndex?: number;
}

export interface CalculationResults {
  monthResults: MonthResult[];
  bonusTax: number;
  totalGross: number;
  totalSI: number;
  totalHF: number;
  totalTax: number;
  totalNet: number;
  annualBonus: number;
}

export interface CalculationInput {
  monthlyData: Record<number, MonthData>;
  city: string;
  annualBonus: number;
  bonusTaxMethod: string;
  bonusMonth: number;
  specialDeduction: number;
  enabledMonths: Record<number, boolean>;
  globalParams: GlobalParams;
}

export function calculateMonthlyResults(input: CalculationInput): CalculationResults {
  const { monthlyData, city, annualBonus, bonusTaxMethod, bonusMonth, specialDeduction, enabledMonths, globalParams } = input;
  const monthResults: MonthResult[] = [];
  let cumulativeTaxableIncome = 0;
  let cumulativeTaxPaid = 0;
  let prevBracketIndex = 0;

  for (let month = 1; month <= 12; month++) {
    if (!enabledMonths[month]) {
      monthResults.push({ month, enabled: false, salary: 0, subsidy: 0, bonus: 0, bonusInThisMonth: 0, pension: 0, medical: 0, unemployment: 0, totalSI: 0, housingFund: 0, totalDeductions: 0, taxableIncome: 0, cumulativeTaxableIncome: 0, monthTax: 0, cumulativeTax: 0, netSalary: 0, bracketChanged: false });
      continue;
    }

    const data = monthlyData[month];
    const preset = CITY_PRESETS[city];

    const getParam = (field: keyof MonthData & keyof GlobalParams) => {
      const v = data[field];
      return (v !== null && v !== undefined) ? v : globalParams[field];
    };

    const salary = Number(getParam('salary')) || 0;
    const pensionRate = (Number(getParam('pensionRate')) || 0) / 100;
    const medicalRate = (Number(getParam('medicalRate')) || 0) / 100;
    const unemploymentRate = (Number(getParam('unemploymentRate')) || 0) / 100;
    const housingFundRate = (Number(getParam('housingFundRate')) || 0) / 100;
    const siBaseInput = Number(getParam('socialInsuranceBase')) || 0;
    const hfBaseInput = Number(getParam('housingFundBase')) || 0;

    let pension = 0, medical = 0, unemployment = 0, totalSI = 0, housingFund = 0, totalDeductions = 0;
    if (salary > 0) {
      const siBase = siBaseInput > 0 ? siBaseInput : salary;
      const clampedSIBase = (city !== 'custom' && preset.socialInsurance.pension.max > 0)
        ? clamp(siBase, preset.socialInsurance.pension.min, preset.socialInsurance.pension.max)
        : siBase;

      pension = roundToFen(clampedSIBase * pensionRate);
      medical = roundToFen(clampedSIBase * medicalRate + (preset.socialInsurance.medical.addition || 0));
      unemployment = roundToFen(clampedSIBase * unemploymentRate);
      totalSI = roundToFen(pension + medical + unemployment);

      const hfBase = hfBaseInput > 0 ? hfBaseInput : salary;
      const clampedHFBase = (city !== 'custom' && preset.housingFund.max > 0)
        ? clamp(hfBase, preset.housingFund.min, preset.housingFund.max)
        : hfBase;
      housingFund = roundToFen(clampedHFBase * housingFundRate);

      totalDeductions = roundToFen(totalSI + housingFund);
    }

    const subsidy = Number(data.subsidy) || 0;
    let monthTaxableIncome = 0;
    if (salary > 0 || subsidy > 0) {
      monthTaxableIncome = roundToFen(salary + subsidy - totalDeductions - preset.taxThreshold - specialDeduction);
    }

    let bonusInThisMonth = 0;
    if (bonusTaxMethod === 'combined' && month === bonusMonth) {
      bonusInThisMonth = annualBonus;
      monthTaxableIncome = roundToFen(monthTaxableIncome + annualBonus);
    }

    cumulativeTaxableIncome += monthTaxableIncome;
    const effectiveCumTaxable = Math.max(0, roundToFen(cumulativeTaxableIncome));
    const cumulativeTax = calcTax(effectiveCumTaxable);
    const monthTax = roundToFen(Math.max(0, cumulativeTax - cumulativeTaxPaid));
    cumulativeTaxPaid = roundToFen(cumulativeTaxPaid + monthTax);

    const monthBonus = Number(data.bonus) || 0;
    const netSalary = roundToFen(salary + subsidy + monthBonus + bonusInThisMonth - totalDeductions - monthTax);

    const currentBracketIndex = getTaxBracketIndex(effectiveCumTaxable);
    const bracketChanged = month > 1 && currentBracketIndex > prevBracketIndex && effectiveCumTaxable > 0;
    prevBracketIndex = effectiveCumTaxable > 0 ? currentBracketIndex : prevBracketIndex;

    monthResults.push({
      month, enabled: true, salary, subsidy, bonus: monthBonus,
      bonusInThisMonth, pension, medical, unemployment, totalSI,
      housingFund, totalDeductions, taxableIncome: monthTaxableIncome,
      cumulativeTaxableIncome: effectiveCumTaxable,
      monthTax, cumulativeTax: cumulativeTaxPaid, netSalary,
      bracketChanged, bracketIndex: currentBracketIndex,
    });
  }

  let bonusTax = 0;
  if (bonusTaxMethod === 'separate' && annualBonus > 0) {
    bonusTax = calcBonusTaxSeparate(annualBonus);
  }

  const enabledResults = monthResults.filter(r => r.enabled);
  const totalGross = roundToFen(enabledResults.reduce((s, r) => s + r.salary + r.subsidy + r.bonus + r.bonusInThisMonth, 0));
  const totalSI = roundToFen(enabledResults.reduce((s, r) => s + r.totalSI, 0));
  const totalHF = roundToFen(enabledResults.reduce((s, r) => s + r.housingFund, 0));
  const totalTax = roundToFen(cumulativeTaxPaid + bonusTax);
  const totalNet = roundToFen(
    enabledResults.reduce((s, r) => s + r.netSalary, 0)
    + (bonusTaxMethod === 'separate' ? annualBonus - bonusTax : 0)
  );

  return { monthResults, bonusTax, totalGross, totalSI, totalHF, totalTax, totalNet, annualBonus };
}

export function exportCSV(results: CalculationResults, bonusTaxMethod: string, annualBonus: number, bonusTax: number): void {
  const headers = ['月份', '税前工资', '补贴(计税)', '奖金(免税)', '社保扣除', '公积金扣除', '累计应纳税所得额', '本月个税', '累计个税', '实发工资'];
  const rows = results.monthResults.map(r => {
    if (!r.enabled) return [r.month + '月(跳过)', '-', '-', '-', '-', '-', '-', '-', '-', '-'];
    return [
      r.month + '月',
      r.salary.toFixed(2), r.subsidy.toFixed(2),
      (r.bonus + r.bonusInThisMonth).toFixed(2),
      r.totalSI.toFixed(2), r.housingFund.toFixed(2),
      r.cumulativeTaxableIncome.toFixed(2),
      r.monthTax.toFixed(2), r.cumulativeTax.toFixed(2),
      r.netSalary.toFixed(2),
    ];
  });

  if (bonusTaxMethod === 'separate' && annualBonus > 0) {
    rows.push(['年终奖(单独计税)', annualBonus.toFixed(2), '-', '-', '-', '-', '-', bonusTax.toFixed(2), '-', (annualBonus - bonusTax).toFixed(2)]);
  }

  const csvContent = '﻿' + [headers, ...rows].map(row => row.join(',')).join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = '薪资明细.csv';
  a.click();
  URL.revokeObjectURL(url);
}

export function defaultMonthData(): MonthData {
  return {
    salary: null, bonus: 0, subsidy: 0,
    socialInsuranceBase: null, pensionRate: null, medicalRate: null,
    unemploymentRate: null, housingFundBase: null, housingFundRate: null,
  };
}

export function defaultGlobalParams(): GlobalParams {
  return {
    salary: 0, socialInsuranceBase: 0, pensionRate: 8, medicalRate: 2,
    unemploymentRate: 0.5, housingFundBase: 0, housingFundRate: 12,
  };
}
