'use client';

import { useState, useCallback } from 'react';
import { useCalculator } from '@/hooks/useCalculator';
import { useAI } from '@/hooks/useAI';
import { useAuth } from '@/contexts/AuthContext';
import { exportCSV } from '@/lib/calculation/salary';
import type { SmartInputData } from '@/lib/ai/mock';
import { CITY_PRESETS } from '@/lib/calculation/constants';
import { createClient } from '@/lib/supabase/client';

import Sidebar from '@/components/layout/Sidebar';
import Footer from '@/components/layout/Footer';
import AISettings from '@/components/ai/AISettings';
import CitySettings from '@/components/calculator/CitySettings';
import GlobalParams from '@/components/calculator/GlobalParams';
import MonthSelector from '@/components/calculator/MonthSelector';
import MonthCard from '@/components/calculator/MonthCard';
import BonusSettings from '@/components/calculator/BonusSettings';
import AIAssistant from '@/components/ai/AIAssistant';
import ResultSummary from '@/components/calculator/ResultSummary';
import ResultTable from '@/components/calculator/ResultTable';
import TaxRateTable from '@/components/calculator/TaxRateTable';
import AuthButton from '@/components/auth/AuthButton';

export default function Home() {
  const calc = useCalculator();
  const { apiKey, setApiKey, callAI } = useAI();
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');

  const handleExport = useCallback(() => {
    exportCSV(calc.results, calc.bonusTaxMethod, calc.annualBonus, calc.results.bonusTax);
  }, [calc.results, calc.bonusTaxMethod, calc.annualBonus]);

  const handleApplySmartInput = useCallback((data: SmartInputData) => {
    if (data.city && CITY_PRESETS[data.city]) {
      calc.applyCityPreset(data.city);
    }
    calc.setGlobalParams(prev => ({
      ...prev,
      salary: data.salary != null ? data.salary : prev.salary,
      socialInsuranceBase: data.socialInsuranceBase != null ? data.socialInsuranceBase : prev.socialInsuranceBase,
      housingFundBase: data.housingFundBase != null ? data.housingFundBase : prev.housingFundBase,
      housingFundRate: data.housingFundRate != null ? data.housingFundRate : prev.housingFundRate,
    }));
    if (data.annualBonus != null) calc.setAnnualBonus(data.annualBonus);
    if (data.specialDeduction != null) calc.setSpecialDeduction(data.specialDeduction);
  }, [calc]);

  const handleSaveToCloud = useCallback(async () => {
    if (!user) return;
    setSaving(true);
    setSaveMsg('');
    try {
      const supabase = createClient();
      const { error } = await supabase.from('calculations').insert({
        user_id: user.id,
        name: `${CITY_PRESETS[calc.city]?.name || calc.city} - ${new Date().toLocaleDateString('zh-CN')}`,
        city: calc.city,
        global_params: calc.globalParams,
        monthly_data: calc.monthlyData,
        enabled_months: calc.enabledMonths,
        annual_bonus: calc.annualBonus,
        bonus_month: calc.bonusMonth,
        bonus_tax_method: calc.bonusTaxMethod,
        special_deduction: calc.specialDeduction,
        total_gross: calc.results.totalGross,
        total_net: calc.results.totalNet,
        total_tax: calc.results.totalTax,
      });
      if (error) throw error;
      setSaveMsg('已保存到云端');
      setTimeout(() => setSaveMsg(''), 3000);
    } catch (err) {
      setSaveMsg('保存失败: ' + (err instanceof Error ? err.message : '未知错误'));
    } finally {
      setSaving(false);
    }
  }, [user, calc]);

  return (
    <div className="max-w-[1400px] mx-auto p-6">
      <button
        className="fixed top-4 left-4 z-[998] w-10 h-10 rounded-xl border-none bg-white shadow-md cursor-pointer flex flex-col items-center justify-center gap-1 transition-all hover:bg-blue-50 hover:shadow-lg"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        <span className={`block w-[18px] h-0.5 bg-[#333] rounded-sm transition-all ${sidebarOpen ? 'rotate-45 translate-x-[4px] translate-y-[4px]' : ''}`} />
        <span className={`block w-[18px] h-0.5 bg-[#333] rounded-sm transition-all ${sidebarOpen ? 'opacity-0' : ''}`} />
        <span className={`block w-[18px] h-0.5 bg-[#333] rounded-sm transition-all ${sidebarOpen ? '-rotate-45 translate-x-[4px] -translate-y-[4px]' : ''}`} />
      </button>
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="text-center mb-8">
        <div className="flex justify-end mb-2">
          <AuthButton />
        </div>
        <h1 className="text-[28px] font-bold text-[#1a1a1a] mb-2">AI薪资计算器</h1>
        <p className="text-[#666] text-sm">
          支持累计预扣预缴 · 自选计算月份 · 年终奖单独/合并计税 · 多城市社保公积金预设 · AI智能分析
        </p>
      </div>

      <AISettings apiKey={apiKey} setApiKey={setApiKey} />

      <CitySettings
        city={calc.city}
        specialDeduction={calc.specialDeduction}
        setSpecialDeduction={calc.setSpecialDeduction}
        applyCityPreset={calc.applyCityPreset}
      />

      <GlobalParams
        globalParams={calc.globalParams}
        setGlobalParams={calc.setGlobalParams}
        applyGlobalToAll={calc.applyGlobalToAll}
      />

      <div className="bg-white rounded-xl p-6 mb-5 shadow-sm" id="monthly-settings">
        <div className="text-lg font-semibold mb-4 text-[#1a1a1a] flex items-center gap-2">
          <span className="w-6 h-6 bg-blue-50 rounded-md flex items-center justify-center text-sm">💰</span>
          月度薪资设置
        </div>
        <MonthSelector
          enabledMonths={calc.enabledMonths}
          toggleMonth={calc.toggleMonth}
          selectAllMonths={calc.selectAllMonths}
          selectNoneMonths={calc.selectNoneMonths}
          monthlyData={calc.monthlyData}
          enabledCount={calc.enabledCount}
        />
        <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-4">
          {[1,2,3,4,5,6,7,8,9,10,11,12].map(m => (
            <MonthCard
              key={m}
              month={m}
              enabled={calc.enabledMonths[m]}
              data={calc.monthlyData[m]}
              globalParams={calc.globalParams}
              toggleMonth={calc.toggleMonth}
              updateMonthField={calc.updateMonthField}
              collapsed={calc.collapsedMonths[m]}
              onToggleCollapse={() => calc.toggleCollapseMonth(m)}
            />
          ))}
        </div>
      </div>

      <BonusSettings
        annualBonus={calc.annualBonus}
        setAnnualBonus={calc.setAnnualBonus}
        bonusMonth={calc.bonusMonth}
        setBonusMonth={calc.setBonusMonth}
        bonusTaxMethod={calc.bonusTaxMethod}
        setBonusTaxMethod={calc.setBonusTaxMethod}
        enabledMonths={calc.enabledMonths}
      />

      <AIAssistant
        apiKey={apiKey}
        city={calc.city}
        globalParams={calc.globalParams}
        results={calc.results}
        enabledCount={calc.enabledCount}
        annualBonus={calc.annualBonus}
        bonusTaxMethod={calc.bonusTaxMethod}
        bonusMonth={calc.bonusMonth}
        specialDeduction={calc.specialDeduction}
        enabledMonths={calc.enabledMonths}
        monthlyData={calc.monthlyData}
        onApplySmartInput={handleApplySmartInput}
        onBonusTaxMethodChange={calc.setBonusTaxMethod}
        callAI={callAI}
      />

      <div className="bg-white rounded-xl p-6 mb-5 shadow-sm" id="results">
        <div className="text-lg font-semibold mb-4 text-[#1a1a1a] flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 bg-blue-50 rounded-md flex items-center justify-center text-sm">📊</span>
            计算结果（已选 {calc.enabledCount} 个月）
          </div>
          <div className="flex gap-2 items-center flex-wrap">
            {user && (
              <button
                className="px-3 py-1.5 rounded-md border-none bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white text-xs font-medium cursor-pointer hover:opacity-90 disabled:opacity-50"
                onClick={handleSaveToCloud}
                disabled={saving}
              >
                {saving ? '保存中...' : '💾 保存到云端'}
              </button>
            )}
            {saveMsg && <span className="text-xs text-[#52c41a]">{saveMsg}</span>}
            <button className="px-3 py-1.5 rounded-md border-none bg-[#52c41a] text-white text-xs font-medium cursor-pointer hover:bg-[#43a814]" onClick={handleExport}>
              导出 CSV
            </button>
            <button className="px-3 py-1.5 rounded-md border-none bg-[#ff4d4f] text-white text-xs font-medium cursor-pointer hover:bg-[#d9363e]" onClick={calc.resetAll}>
              重置数据
            </button>
          </div>
        </div>

        <ResultSummary
          results={calc.results}
          enabledCount={calc.enabledCount}
          bonusTaxMethod={calc.bonusTaxMethod}
          annualBonus={calc.annualBonus}
          bonusTax={calc.results.bonusTax}
        />
        <ResultTable
          results={calc.results}
          bonusTaxMethod={calc.bonusTaxMethod}
          annualBonus={calc.annualBonus}
          bonusTax={calc.results.bonusTax}
        />
      </div>

      <TaxRateTable />
      <Footer />
    </div>
  );
}
