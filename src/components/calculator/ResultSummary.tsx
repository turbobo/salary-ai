'use client';

import type { CalculationResults } from '@/lib/calculation/salary';
import { formatCurrency } from '@/lib/calculation/utils';

interface ResultSummaryProps {
  results: CalculationResults;
  enabledCount: number;
  bonusTaxMethod: string;
  annualBonus: number;
  bonusTax: number;
}

interface SummaryCard {
  label: string;
  value: number;
  sub?: string;
  gradient: string;
  textColor: string;
}

export default function ResultSummary({
  results,
  enabledCount,
  bonusTaxMethod,
  annualBonus,
  bonusTax,
}: ResultSummaryProps) {
  const monthlyAvg = enabledCount > 0 ? results.totalNet / enabledCount : 0;

  const cards: SummaryCard[] = [
    {
      label: '税前总收入',
      value: results.totalGross,
      gradient: 'from-purple-500/10 to-purple-600/5',
      textColor: 'text-purple-600',
    },
    {
      label: '到手总额',
      value: results.totalNet,
      sub: `月均 ${formatCurrency(monthlyAvg)}`,
      gradient: 'from-green-500/10 to-green-600/5',
      textColor: 'text-green-600',
    },
    {
      label: '个税合计',
      value: results.totalTax,
      gradient: 'from-blue-500/10 to-blue-600/5',
      textColor: 'text-blue-600',
    },
    {
      label: '社保+公积金',
      value: results.totalSI + results.totalHF,
      gradient: 'from-orange-500/10 to-pink-500/5',
      textColor: 'text-orange-600',
    },
    {
      label: '月均到手',
      value: monthlyAvg,
      gradient: 'from-teal-500/10 to-teal-600/5',
      textColor: 'text-teal-600',
    },
  ];

  return (
    <div className="bg-bg-card rounded-xl p-6 shadow-sm border border-border">
      <h3 className="text-base font-semibold text-text mb-4">计算结果</h3>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {cards.map((card) => (
          <div
            key={card.label}
            className={`rounded-xl p-4 bg-gradient-to-br ${card.gradient} border border-border/50`}
          >
            <p className="text-xs text-text-secondary mb-1">{card.label}</p>
            <p className={`text-lg font-bold ${card.textColor}`}>
              {formatCurrency(card.value)}
            </p>
            {card.sub && (
              <p className="text-xs text-text-tertiary mt-1">{card.sub}</p>
            )}
          </div>
        ))}
      </div>

      {bonusTaxMethod === 'separate' && annualBonus > 0 && (
        <p className="mt-3 text-xs text-text-tertiary">
          年终奖 {formatCurrency(annualBonus)} 元采用单独计税，个税 {formatCurrency(bonusTax)} 元，
          到手 {formatCurrency(annualBonus - bonusTax)} 元（已包含在到手总额中）
        </p>
      )}
    </div>
  );
}
