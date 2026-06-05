'use client';

import { CITY_PRESETS } from '@/lib/calculation/constants';

interface CitySettingsProps {
  city: string;
  specialDeduction: number;
  setSpecialDeduction: (n: number) => void;
  applyCityPreset: (city: string) => void;
}

export default function CitySettings({
  city,
  specialDeduction,
  setSpecialDeduction,
  applyCityPreset,
}: CitySettingsProps) {
  const cityPreset = CITY_PRESETS[city];

  return (
    <div id="city-settings" className="bg-bg-card rounded-xl p-6 shadow-sm border border-border">
      <h3 className="text-base font-semibold text-text mb-4">城市与扣除设置</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* City select */}
        <div className="flex flex-col gap-1">
          <label className="text-sm text-text-secondary">城市</label>
          <select
            value={city}
            onChange={(e) => applyCityPreset(e.target.value)}
            className="h-9 px-3 rounded-lg border border-border bg-bg-card text-sm text-text
                       focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary
                       transition-colors"
          >
            {Object.entries(CITY_PRESETS).map(([key, preset]) => (
              <option key={key} value={key}>
                {preset.name}
              </option>
            ))}
          </select>
        </div>

        {/* Tax threshold (read-only) */}
        <div className="flex flex-col gap-1">
          <label className="text-sm text-text-secondary">个税起征点</label>
          <input
            type="number"
            value={cityPreset.taxThreshold}
            disabled
            className="h-9 px-3 rounded-lg border border-border bg-bg text-sm text-text-tertiary
                       cursor-not-allowed"
          />
        </div>

        {/* Special deduction */}
        <div className="flex flex-col gap-1">
          <label className="text-sm text-text-secondary">专项附加扣除(月)</label>
          <input
            type="number"
            value={specialDeduction || ''}
            onChange={(e) => setSpecialDeduction(Number(e.target.value) || 0)}
            placeholder="0"
            className="h-9 px-3 rounded-lg border border-border bg-bg-card text-sm text-text
                       focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary
                       transition-colors"
          />
        </div>
      </div>

      {cityPreset.year && (
        <p className="mt-3 text-xs text-text-tertiary">
          当前使用 {cityPreset.name} {cityPreset.year} 年社保公积金基数上下限
        </p>
      )}

      <p className="mt-2 text-xs text-text-tertiary">
        专项附加扣除包含：子女教育、继续教育、大病医疗、住房贷款利息、住房租金、赡养老人、3岁以下婴幼儿照护等
      </p>
    </div>
  );
}
