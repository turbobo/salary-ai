'use client';

import { useState } from 'react';
import { CITY_PRESETS } from '@/lib/calculation/constants';
import { CalculationResults, GlobalParams } from '@/lib/calculation/salary';
import { simpleMarkdown } from '@/lib/ai/parse';
import { getMockCareerPlan } from '@/lib/ai/mock';
import { getCareerPlannerSystemPrompt } from '@/lib/ai/prompts';
import AISkeleton from './AISkeleton';

interface AICareerPlannerProps {
  apiKey: string;
  city: string;
  globalParams: GlobalParams;
  results: CalculationResults;
  callAI: (system: string, user: string) => Promise<string>;
}

export default function AICareerPlanner({
  apiKey,
  city,
  globalParams,
  results,
  callAI,
}: AICareerPlannerProps) {
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<string | null>(null);

  const handlePlan = async () => {
    setLoading(true);
    setPlan(null);

    const cityName = CITY_PRESETS[city]?.name || city;
    const userPrompt = `城市：${cityName}\n月薪：${globalParams.salary}元\n年度税前总收入：${results.totalGross}元\n年度到手：${results.totalNet}元\n年度个税：${results.totalTax}元\n社保公积金年缴：${results.totalSI + results.totalHF}元`;

    try {
      if (apiKey) {
        const response = await callAI(getCareerPlannerSystemPrompt(), userPrompt);
        setPlan(response);
      } else {
        await new Promise((r) => setTimeout(r, 1500));
        setPlan(getMockCareerPlan(city, globalParams.salary));
      }
    } catch {
      setPlan(getMockCareerPlan(city, globalParams.salary));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {!apiKey && (
        <div className="rounded-lg bg-warning/10 border border-warning/30 px-4 py-2.5 text-sm text-warning">
          当前为演示模式，设置 API Key 可获取真实 AI 职业规划建议
        </div>
      )}

      <button
        onClick={handlePlan}
        disabled={globalParams.salary <= 0 || loading}
        className="w-full rounded-lg bg-gradient-to-br from-[#667eea] to-[#764ba2] px-4 py-2.5 text-sm font-medium text-white hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
      >
        AI职业规划
      </button>

      {loading && <AISkeleton />}

      {plan && (
        <div
          className="prose prose-sm max-w-none rounded-lg border border-[#667eea]/20 bg-gradient-to-br from-[#667eea]/5 to-[#764ba2]/5 p-4 text-text-secondary [&_h1]:text-lg [&_h1]:font-bold [&_h1]:text-text [&_h1]:mt-3 [&_h1]:mb-1 [&_h2]:text-base [&_h2]:font-semibold [&_h2]:text-text [&_h2]:mt-3 [&_h2]:mb-1 [&_h3]:text-sm [&_h3]:font-semibold [&_h3]:text-text [&_h3]:mt-2 [&_h3]:mb-1 [&_strong]:text-text [&_li]:my-0.5 [&_ul]:my-1 [&_p]:my-1 [&_blockquote]:border-l-2 [&_blockquote]:border-[#667eea]/40 [&_blockquote]:pl-3 [&_blockquote]:text-text-tertiary [&_blockquote]:italic"
          dangerouslySetInnerHTML={{ __html: simpleMarkdown(plan) }}
        />
      )}
    </div>
  );
}
