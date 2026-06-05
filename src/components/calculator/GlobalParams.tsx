'use client';

import React from 'react';
import type { GlobalParams as GlobalParamsType } from '@/lib/calculation/salary';

interface GlobalParamsProps {
  globalParams: GlobalParamsType;
  setGlobalParams: React.Dispatch<React.SetStateAction<GlobalParamsType>>;
  applyGlobalToAll: () => void;
}

const fields: { key: keyof GlobalParamsType; label: string; placeholder: string }[] = [
  { key: 'salary', label: '月基本工资', placeholder: '税前月薪' },
  { key: 'socialInsuranceBase', label: '社保基数', placeholder: '默认=工资' },
  { key: 'pensionRate', label: '养老保险(%)', placeholder: '8' },
  { key: 'medicalRate', label: '医疗保险(%)', placeholder: '2' },
  { key: 'unemploymentRate', label: '失业保险(%)', placeholder: '0.5' },
  { key: 'housingFundBase', label: '公积金基数', placeholder: '默认=工资' },
  { key: 'housingFundRate', label: '公积金比例(%)', placeholder: '12' },
];

export default function GlobalParams({
  globalParams,
  setGlobalParams,
  applyGlobalToAll,
}: GlobalParamsProps) {
  const updateField = (key: keyof GlobalParamsType, value: string) => {
    setGlobalParams((prev) => ({ ...prev, [key]: Number(value) || 0 }));
  };

  return (
    <div id="global-params" className="bg-bg-card rounded-xl p-6 shadow-sm border border-border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-text">全局参数</h3>
        <button
          onClick={applyGlobalToAll}
          className="px-4 py-1.5 text-sm rounded-lg bg-primary text-white
                     hover:bg-primary-hover transition-colors cursor-pointer"
        >
          一键应用到全部月份
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {fields.map(({ key, label, placeholder }) => (
          <div key={key} className="flex flex-col gap-1">
            <label className="text-sm text-text-secondary">{label}</label>
            <input
              type="number"
              value={globalParams[key] || ''}
              onChange={(e) => updateField(key, e.target.value)}
              placeholder={placeholder}
              className="h-9 px-3 rounded-lg border border-border bg-bg-card text-sm text-text
                         focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary
                         transition-colors"
            />
          </div>
        ))}
      </div>

      <p className="mt-3 text-xs text-text-tertiary">
        比例类参数请输入百分比数值，如养老保险 8 表示 8%。社保/公积金基数为 0 时默认使用月工资作为基数。
      </p>
    </div>
  );
}
