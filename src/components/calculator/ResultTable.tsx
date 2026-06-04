'use client';

import type { CalculationResults } from '@/lib/calculation/salary';
import { formatCurrency } from '@/lib/calculation/utils';

interface ResultTableProps {
  results: CalculationResults;
  bonusTaxMethod: string;
  annualBonus: number;
  bonusTax: number;
}

export default function ResultTable({
  results,
  bonusTaxMethod,
  annualBonus,
  bonusTax,
}: ResultTableProps) {
  const enabledResults = results.monthResults.filter((r) => r.enabled);
  const hasNegativeNet = enabledResults.some((r) => r.netSalary < 0);

  const totals = {
    salary: enabledResults.reduce((s, r) => s + r.salary, 0),
    subsidy: enabledResults.reduce((s, r) => s + r.subsidy, 0),
    bonus: enabledResults.reduce((s, r) => s + r.bonus + r.bonusInThisMonth, 0),
    totalSI: enabledResults.reduce((s, r) => s + r.totalSI, 0),
    housingFund: enabledResults.reduce((s, r) => s + r.housingFund, 0),
    monthTax: enabledResults.reduce((s, r) => s + r.monthTax, 0),
    netSalary: enabledResults.reduce((s, r) => s + r.netSalary, 0),
  };

  return (
    <div className="bg-bg-card rounded-xl p-6 shadow-sm border border-border">
      <h3 className="text-base font-semibold text-text mb-4">月度明细</h3>

      <div className="overflow-x-auto -mx-6 px-6">
        <table className="w-full text-sm border-collapse min-w-[900px]">
          <thead>
            <tr className="border-b-2 border-border">
              <th className="text-left py-3 px-2 text-text-secondary font-medium sticky left-0 bg-bg-card z-10 min-w-[60px]">
                月份
              </th>
              <th className="text-right py-3 px-2 text-text-secondary font-medium">税前工资</th>
              <th className="text-right py-3 px-2 text-text-secondary font-medium">补贴</th>
              <th className="text-right py-3 px-2 text-text-secondary font-medium">奖金</th>
              <th className="text-right py-3 px-2 text-text-secondary font-medium">社保扣除</th>
              <th className="text-right py-3 px-2 text-text-secondary font-medium">公积金扣除</th>
              <th className="text-right py-3 px-2 text-text-secondary font-medium">累计应纳税所得额</th>
              <th className="text-right py-3 px-2 text-text-secondary font-medium">本月个税</th>
              <th className="text-right py-3 px-2 text-text-secondary font-medium">累计个税</th>
              <th className="text-right py-3 px-2 text-text-secondary font-medium">实发工资</th>
            </tr>
          </thead>
          <tbody>
            {results.monthResults.map((r) => {
              if (!r.enabled) {
                return (
                  <tr key={r.month} className="border-b border-border/50 text-text-tertiary">
                    <td className="py-2.5 px-2 sticky left-0 bg-bg-card z-10">{r.month}月</td>
                    <td colSpan={9} className="py-2.5 px-2 text-center text-xs">
                      -- 未启用 --
                    </td>
                  </tr>
                );
              }

              return (
                <tr
                  key={r.month}
                  className={`border-b border-border/50 hover:bg-bg-hover transition-colors ${
                    r.bracketChanged ? 'border-l-3 border-l-orange-400' : ''
                  }`}
                >
                  <td className="py-2.5 px-2 sticky left-0 bg-bg-card z-10 font-medium">
                    <span className="flex items-center gap-1">
                      {r.month}月
                      {r.bracketChanged && (
                        <span className="inline-block px-1.5 py-0.5 text-[10px] rounded bg-orange-100 text-orange-600 font-medium">
                          跳档
                        </span>
                      )}
                    </span>
                  </td>
                  <td className="py-2.5 px-2 text-right">{formatCurrency(r.salary)}</td>
                  <td className="py-2.5 px-2 text-right">{formatCurrency(r.subsidy)}</td>
                  <td className="py-2.5 px-2 text-right">
                    {formatCurrency(r.bonus + r.bonusInThisMonth)}
                  </td>
                  <td className="py-2.5 px-2 text-right">{formatCurrency(r.totalSI)}</td>
                  <td className="py-2.5 px-2 text-right">{formatCurrency(r.housingFund)}</td>
                  <td className="py-2.5 px-2 text-right">{formatCurrency(r.cumulativeTaxableIncome)}</td>
                  <td className="py-2.5 px-2 text-right">{formatCurrency(r.monthTax)}</td>
                  <td className="py-2.5 px-2 text-right">{formatCurrency(r.cumulativeTax)}</td>
                  <td
                    className={`py-2.5 px-2 text-right font-medium ${
                      r.netSalary < 0 ? 'text-danger' : 'text-text'
                    }`}
                  >
                    {formatCurrency(r.netSalary)}
                  </td>
                </tr>
              );
            })}

            {/* Separate bonus row */}
            {bonusTaxMethod === 'separate' && annualBonus > 0 && (
              <tr className="border-b border-border/50 bg-blue-50/50">
                <td className="py-2.5 px-2 sticky left-0 bg-blue-50/50 z-10 font-medium text-blue-600">
                  年终奖
                </td>
                <td className="py-2.5 px-2 text-right">{formatCurrency(annualBonus)}</td>
                <td className="py-2.5 px-2 text-right">-</td>
                <td className="py-2.5 px-2 text-right">-</td>
                <td className="py-2.5 px-2 text-right">-</td>
                <td className="py-2.5 px-2 text-right">-</td>
                <td className="py-2.5 px-2 text-right">-</td>
                <td className="py-2.5 px-2 text-right">{formatCurrency(bonusTax)}</td>
                <td className="py-2.5 px-2 text-right">-</td>
                <td className="py-2.5 px-2 text-right font-medium">
                  {formatCurrency(annualBonus - bonusTax)}
                </td>
              </tr>
            )}

            {/* Total row */}
            <tr className="border-t-2 border-border bg-bg font-semibold">
              <td className="py-3 px-2 sticky left-0 bg-bg z-10">合计</td>
              <td className="py-3 px-2 text-right">{formatCurrency(totals.salary)}</td>
              <td className="py-3 px-2 text-right">{formatCurrency(totals.subsidy)}</td>
              <td className="py-3 px-2 text-right">
                {formatCurrency(
                  totals.bonus +
                    (bonusTaxMethod === 'separate' ? annualBonus : 0)
                )}
              </td>
              <td className="py-3 px-2 text-right">{formatCurrency(totals.totalSI)}</td>
              <td className="py-3 px-2 text-right">{formatCurrency(totals.housingFund)}</td>
              <td className="py-3 px-2 text-right">-</td>
              <td className="py-3 px-2 text-right">{formatCurrency(results.totalTax)}</td>
              <td className="py-3 px-2 text-right">-</td>
              <td className="py-3 px-2 text-right text-success">
                {formatCurrency(results.totalNet)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {hasNegativeNet && (
        <p className="mt-3 text-xs text-danger">
          注意：存在实发工资为负数的月份，可能是社保扣除和个税超过了当月收入，请检查参数设置。
        </p>
      )}
    </div>
  );
}
