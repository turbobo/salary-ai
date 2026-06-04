'use client';

import { TAX_BRACKETS } from '@/lib/calculation/constants';
import { formatCurrency } from '@/lib/calculation/utils';

export default function TaxRateTable() {
  return (
    <div className="bg-bg-card rounded-xl p-6 shadow-sm border border-border">
      <h3 className="text-base font-semibold text-text mb-4">个人所得税税率表（综合所得）</h3>

      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b-2 border-border">
              <th className="text-left py-3 px-3 text-text-secondary font-medium">级数</th>
              <th className="text-left py-3 px-3 text-text-secondary font-medium">累计应纳税所得额</th>
              <th className="text-right py-3 px-3 text-text-secondary font-medium">税率</th>
              <th className="text-right py-3 px-3 text-text-secondary font-medium">速算扣除数</th>
            </tr>
          </thead>
          <tbody>
            {TAX_BRACKETS.map((bracket, index) => (
              <tr
                key={index}
                className="border-b border-border/50 hover:bg-bg-hover transition-colors"
              >
                <td className="py-2.5 px-3 text-text">{index + 1}</td>
                <td className="py-2.5 px-3 text-text">
                  {bracket.max === Infinity
                    ? `超过 ${formatCurrency(bracket.min)} 元`
                    : `${formatCurrency(bracket.min)} - ${formatCurrency(bracket.max)} 元`}
                </td>
                <td className="py-2.5 px-3 text-right font-medium text-primary">
                  {(bracket.rate * 100).toFixed(0)}%
                </td>
                <td className="py-2.5 px-3 text-right text-text-secondary">
                  {formatCurrency(bracket.deduction)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
