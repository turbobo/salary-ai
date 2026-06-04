'use client';

import type { MonthData, GlobalParams } from '@/lib/calculation/salary';

interface MonthCardProps {
  month: number;
  enabled: boolean;
  data: MonthData;
  globalParams: GlobalParams;
  toggleMonth: (m: number) => void;
  updateMonthField: (month: number, field: string, value: unknown) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

const monthFields: { key: keyof MonthData; label: string; placeholder: string; globalKey?: keyof GlobalParams }[] = [
  { key: 'salary', label: '月工资', placeholder: '使用全局', globalKey: 'salary' },
  { key: 'subsidy', label: '补贴(计税)', placeholder: '0' },
  { key: 'bonus', label: '奖金(免税)', placeholder: '0' },
  { key: 'socialInsuranceBase', label: '社保基数', placeholder: '使用全局', globalKey: 'socialInsuranceBase' },
  { key: 'housingFundBase', label: '公积金基数', placeholder: '使用全局', globalKey: 'housingFundBase' },
  { key: 'housingFundRate', label: '公积金比例(%)', placeholder: '使用全局', globalKey: 'housingFundRate' },
];

export default function MonthCard({
  month,
  enabled,
  data,
  globalParams,
  toggleMonth,
  updateMonthField,
  collapsed,
  onToggleCollapse,
}: MonthCardProps) {
  const getDisplayValue = (field: { key: keyof MonthData; globalKey?: keyof GlobalParams }) => {
    const val = data[field.key];
    if (val !== null && val !== undefined) return val;
    return '';
  };

  const getPlaceholder = (field: { key: keyof MonthData; placeholder: string; globalKey?: keyof GlobalParams }) => {
    if (field.globalKey && globalParams[field.globalKey]) {
      return String(globalParams[field.globalKey]);
    }
    return field.placeholder;
  };

  return (
    <div
      className={`bg-bg-card rounded-xl shadow-sm border transition-all ${
        enabled ? 'border-border' : 'border-border opacity-50'
      }`}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3 cursor-pointer select-none"
        onClick={onToggleCollapse}
      >
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={enabled}
            onChange={(e) => {
              e.stopPropagation();
              toggleMonth(month);
            }}
            onClick={(e) => e.stopPropagation()}
            className="w-4 h-4 rounded border-border text-primary focus:ring-primary/30 cursor-pointer"
          />
          <span className="text-sm font-semibold text-text">{month}月</span>
          {data.salary !== null && (
            <span className="text-xs text-text-tertiary">
              工资: {data.salary}
            </span>
          )}
        </div>
        <button
          className="text-text-tertiary hover:text-text transition-colors p-1 cursor-pointer"
          aria-label={collapsed ? '展开' : '收起'}
        >
          <svg
            className={`w-4 h-4 transition-transform ${collapsed ? '' : 'rotate-180'}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Body */}
      {!collapsed && (
        <div className={`px-4 pb-4 ${!enabled ? 'pointer-events-none' : ''}`}>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {monthFields.map((field) => (
              <div key={field.key} className="flex flex-col gap-1">
                <label className="text-xs text-text-secondary">{field.label}</label>
                <input
                  type="number"
                  value={getDisplayValue(field)}
                  onChange={(e) => {
                    const raw = e.target.value;
                    updateMonthField(
                      month,
                      field.key,
                      raw === '' ? null : Number(raw)
                    );
                  }}
                  placeholder={getPlaceholder(field)}
                  disabled={!enabled}
                  className="h-8 px-2.5 rounded-lg border border-border bg-bg-card text-sm text-text
                             placeholder:text-text-tertiary
                             focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary
                             disabled:bg-bg disabled:cursor-not-allowed
                             transition-colors"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
