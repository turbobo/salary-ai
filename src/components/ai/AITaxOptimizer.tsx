'use client';

import { useState, useMemo } from 'react';
import { CITY_PRESETS } from '@/lib/calculation/constants';
import {
  CalculationResults,
  GlobalParams,
  MonthData,
  calculateMonthlyResults,
} from '@/lib/calculation/salary';
import { formatCurrency } from '@/lib/calculation/utils';
import { simpleMarkdown } from '@/lib/ai/parse';
import { getMockTaxSuggestion } from '@/lib/ai/mock';
import { getTaxOptimizerSystemPrompt } from '@/lib/ai/prompts';
import AILoading from './AILoading';

interface AITaxOptimizerProps {
  apiKey: string;
  city: string;
  globalParams: GlobalParams;
  results: CalculationResults;
  annualBonus: number;
  bonusTaxMethod: string;
  bonusMonth: number;
  specialDeduction: number;
  enabledMonths: Record<number, boolean>;
  monthlyData: Record<number, MonthData>;
  onBonusTaxMethodChange: (method: string) => void;
  callAI: (system: string, user: string) => Promise<string>;
}

export default function AITaxOptimizer({
  apiKey,
  city,
  globalParams,
  results,
  annualBonus,
  bonusTaxMethod,
  bonusMonth,
  specialDeduction,
  enabledMonths,
  monthlyData,
  onBonusTaxMethodChange,
  callAI,
}: AITaxOptimizerProps) {
  const [loading, setLoading] = useState(false);
  const [suggestion, setSuggestion] = useState<string | null>(null);

  const separateResult = useMemo(
    () =>
      calculateMonthlyResults({
        monthlyData,
        city,
        annualBonus,
        bonusTaxMethod: 'separate',
        bonusMonth,
        specialDeduction,
        enabledMonths,
        globalParams,
      }),
    [monthlyData, city, annualBonus, bonusMonth, specialDeduction, enabledMonths, globalParams]
  );

  const combinedResult = useMemo(
    () =>
      calculateMonthlyResults({
        monthlyData,
        city,
        annualBonus,
        bonusTaxMethod: 'combined',
        bonusMonth,
        specialDeduction,
        enabledMonths,
        globalParams,
      }),
    [monthlyData, city, annualBonus, bonusMonth, specialDeduction, enabledMonths, globalParams]
  );

  const separateTax = separateResult.totalTax;
  const combinedTax = combinedResult.totalTax;
  const betterMethod = separateTax <= combinedTax ? 'separate' : 'combined';
  const savings = Math.abs(separateTax - combinedTax);

  const handleGetSuggestion = async () => {
    setLoading(true);
    setSuggestion(null);

    const cityName = CITY_PRESETS[city]?.name || city;
    const userPrompt = `城市：${cityName}\n月薪：${globalParams.salary}元\n年终奖：${annualBonus}元\n专项附加扣除：${specialDeduction}元/月\n单独计税总税额：${separateTax}元\n合并计税总税额：${combinedTax}元\n当前方式：${bonusTaxMethod === 'separate' ? '单独计税' : '合并计税'}\n社保年缴：${results.totalSI}元\n公积金年缴：${results.totalHF}元`;

    try {
      if (apiKey) {
        const response = await callAI(getTaxOptimizerSystemPrompt(), userPrompt);
        setSuggestion(response);
      } else {
        await new Promise((r) => setTimeout(r, 1200));
        setSuggestion(
          getMockTaxSuggestion(
            city,
            globalParams.salary,
            annualBonus,
            specialDeduction,
            separateTax,
            combinedTax,
            betterMethod,
            savings,
            results.totalSI,
            results.totalHF
          )
        );
      }
    } catch {
      setSuggestion(
        getMockTaxSuggestion(
          city,
          globalParams.salary,
          annualBonus,
          specialDeduction,
          separateTax,
          combinedTax,
          betterMethod,
          savings,
          results.totalSI,
          results.totalHF
        )
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Comparison columns */}
      <div className="grid grid-cols-[1fr_auto_1fr] items-stretch gap-0 rounded-lg border border-border overflow-hidden">
        {/* Separate */}
        <div
          className={`p-4 text-center ${
            betterMethod === 'separate'
              ? 'bg-success/5 border-r border-success/20'
              : 'bg-white border-r border-border'
          }`}
        >
          <div className="text-xs text-text-tertiary mb-1">单独计税</div>
          <div
            className={`text-lg font-bold ${
              betterMethod === 'separate' ? 'text-success' : 'text-text'
            }`}
          >
            ¥{formatCurrency(separateTax)}
          </div>
          {betterMethod === 'separate' && (
            <span className="mt-1.5 inline-block rounded-full bg-success/10 px-2 py-0.5 text-xs font-medium text-success">
              节省 ¥{formatCurrency(savings)}
            </span>
          )}
        </div>

        {/* VS divider */}
        <div className="flex items-center justify-center bg-gray-50 px-3">
          <span className="text-xs font-bold text-text-tertiary">VS</span>
        </div>

        {/* Combined */}
        <div
          className={`p-4 text-center ${
            betterMethod === 'combined'
              ? 'bg-success/5 border-l border-success/20'
              : 'bg-white border-l border-border'
          }`}
        >
          <div className="text-xs text-text-tertiary mb-1">合并计税</div>
          <div
            className={`text-lg font-bold ${
              betterMethod === 'combined' ? 'text-success' : 'text-text'
            }`}
          >
            ¥{formatCurrency(combinedTax)}
          </div>
          {betterMethod === 'combined' && (
            <span className="mt-1.5 inline-block rounded-full bg-success/10 px-2 py-0.5 text-xs font-medium text-success">
              节省 ¥{formatCurrency(savings)}
            </span>
          )}
        </div>
      </div>

      {/* Switch button */}
      {bonusTaxMethod !== betterMethod && savings > 0 && (
        <button
          onClick={() => onBonusTaxMethodChange(betterMethod)}
          className="w-full rounded-lg border border-success bg-success/5 px-4 py-2 text-sm font-medium text-success hover:bg-success/10 transition-colors"
        >
          切换为更优方式（{betterMethod === 'separate' ? '单独计税' : '合并计税'}）
        </button>
      )}

      {/* AI suggestion button */}
      <button
        onClick={handleGetSuggestion}
        disabled={loading}
        className="w-full rounded-lg bg-gradient-to-br from-[#667eea] to-[#764ba2] px-4 py-2.5 text-sm font-medium text-white hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
      >
        AI税务优化建议
      </button>

      {loading && <AILoading text="正在生成税务优化建议..." />}

      {suggestion && (
        <div
          className="prose prose-sm max-w-none rounded-lg border border-[#667eea]/20 bg-gradient-to-br from-[#667eea]/5 to-[#764ba2]/5 p-4 text-text-secondary [&_h2]:text-base [&_h2]:font-semibold [&_h2]:text-text [&_h2]:mt-3 [&_h2]:mb-1 [&_h3]:text-sm [&_h3]:font-semibold [&_h3]:text-text [&_h3]:mt-2 [&_h3]:mb-1 [&_strong]:text-text [&_li]:my-0.5 [&_ul]:my-1 [&_p]:my-1"
          dangerouslySetInnerHTML={{ __html: simpleMarkdown(suggestion) }}
        />
      )}
    </div>
  );
}
