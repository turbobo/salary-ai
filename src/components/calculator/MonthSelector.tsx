'use client';

import type { MonthData } from '@/lib/calculation/salary';

interface MonthSelectorProps {
  enabledMonths: Record<number, boolean>;
  toggleMonth: (m: number) => void;
  selectAllMonths: () => void;
  selectNoneMonths: () => void;
  monthlyData: Record<number, MonthData>;
  enabledCount: number;
}

export default function MonthSelector({
  enabledMonths,
  toggleMonth,
  selectAllMonths,
  selectNoneMonths,
  monthlyData,
  enabledCount,
}: MonthSelectorProps) {
  const hasData = (month: number): boolean => {
    const data = monthlyData[month];
    if (!data) return false;
    return (
      data.salary !== null ||
      data.bonus > 0 ||
      data.subsidy > 0 ||
      data.socialInsuranceBase !== null ||
      data.housingFundBase !== null ||
      data.housingFundRate !== null
    );
  };

  return (
    <div className="bg-bg-card rounded-xl p-6 shadow-sm border border-border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-text">月份选择</h3>
        <div className="flex gap-2">
          <button
            onClick={selectAllMonths}
            className="px-3 py-1 text-xs rounded-md border border-border text-text-secondary
                       hover:bg-bg-hover transition-colors cursor-pointer"
          >
            全选
          </button>
          <button
            onClick={selectNoneMonths}
            className="px-3 py-1 text-xs rounded-md border border-border text-text-secondary
                       hover:bg-bg-hover transition-colors cursor-pointer"
          >
            全不选
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => {
          const enabled = enabledMonths[month];
          const withData = hasData(month);

          return (
            <button
              key={month}
              onClick={() => toggleMonth(month)}
              className={`
                px-3 py-1.5 rounded-lg text-sm font-medium transition-all cursor-pointer
                ${
                  enabled
                    ? withData
                      ? 'bg-primary text-white shadow-sm'
                      : 'bg-primary/10 text-primary border border-primary/30'
                    : 'bg-bg text-text-tertiary border border-border hover:border-primary/30'
                }
              `}
            >
              {month}月
            </button>
          );
        })}
      </div>

      <p className="mt-3 text-xs text-text-tertiary">
        已选择 {enabledCount} 个月份，未选中的月份不参与计税计算
      </p>
    </div>
  );
}
