'use client';

interface BonusSettingsProps {
  annualBonus: number;
  setAnnualBonus: (n: number) => void;
  bonusMonth: number;
  setBonusMonth: (n: number) => void;
  bonusTaxMethod: string;
  setBonusTaxMethod: (m: string) => void;
  enabledMonths: Record<number, boolean>;
}

export default function BonusSettings({
  annualBonus,
  setAnnualBonus,
  bonusMonth,
  setBonusMonth,
  bonusTaxMethod,
  setBonusTaxMethod,
  enabledMonths,
}: BonusSettingsProps) {
  const showWarning = bonusTaxMethod === 'combined' && !enabledMonths[bonusMonth];

  return (
    <div id="bonus-settings" className="bg-bg-card rounded-xl p-6 shadow-sm border border-border">
      <h3 className="text-base font-semibold text-text mb-4">年终奖设置</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        {/* Annual bonus amount */}
        <div className="flex flex-col gap-1">
          <label className="text-sm text-text-secondary">年终奖金额</label>
          <input
            type="number"
            value={annualBonus || ''}
            onChange={(e) => setAnnualBonus(Number(e.target.value) || 0)}
            placeholder="0"
            className="h-9 px-3 rounded-lg border border-border bg-bg-card text-sm text-text
                       focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary
                       transition-colors"
          />
        </div>

        {/* Bonus month */}
        <div className="flex flex-col gap-1">
          <label className="text-sm text-text-secondary">发放月份</label>
          <select
            value={bonusMonth}
            onChange={(e) => setBonusMonth(Number(e.target.value))}
            className="h-9 px-3 rounded-lg border border-border bg-bg-card text-sm text-text
                       focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary
                       transition-colors"
          >
            {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
              <option key={m} value={m}>
                {m}月
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tax method radio */}
      <div className="flex flex-col gap-2">
        <label className="text-sm text-text-secondary">计税方式</label>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="bonusTaxMethod"
              value="separate"
              checked={bonusTaxMethod === 'separate'}
              onChange={() => setBonusTaxMethod('separate')}
              className="w-4 h-4 text-primary focus:ring-primary/30"
            />
            <span className="text-sm text-text">单独计税</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="bonusTaxMethod"
              value="combined"
              checked={bonusTaxMethod === 'combined'}
              onChange={() => setBonusTaxMethod('combined')}
              className="w-4 h-4 text-primary focus:ring-primary/30"
            />
            <span className="text-sm text-text">并入综合所得</span>
          </label>
        </div>
      </div>

      {/* Warning */}
      {showWarning && (
        <div className="mt-3 px-3 py-2 rounded-lg bg-danger/10 border border-danger/20">
          <p className="text-xs text-danger">
            注意：{bonusMonth}月未启用，年终奖将无法并入该月计税，请启用该月份或更换发放月份。
          </p>
        </div>
      )}
    </div>
  );
}
