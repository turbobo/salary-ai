'use client';

import { useState } from 'react';
import { CITY_PRESETS } from '@/lib/calculation/constants';
import { CalculationResults, GlobalParams } from '@/lib/calculation/salary';
import { formatCurrency } from '@/lib/calculation/utils';
import { parseAIJson } from '@/lib/ai/parse';
import { getMockAnalysis, AnalysisData } from '@/lib/ai/mock';
import { getAnalysisSystemPrompt } from '@/lib/ai/prompts';
import AISkeleton from './AISkeleton';

interface AIAnalysisPanelProps {
  apiKey: string;
  city: string;
  globalParams: GlobalParams;
  results: CalculationResults;
  enabledCount: number;
  callAI: (system: string, user: string) => Promise<string>;
}

function getScoreColor(score: number): string {
  if (score >= 80) return 'text-success';
  if (score >= 60) return 'text-[#667eea]';
  if (score >= 40) return 'text-warning';
  return 'text-danger';
}

function getScoreRingColor(score: number): string {
  if (score >= 80) return 'border-success';
  if (score >= 60) return 'border-[#667eea]';
  if (score >= 40) return 'border-warning';
  return 'border-danger';
}

export default function AIAnalysisPanel({
  apiKey,
  city,
  globalParams,
  results,
  enabledCount,
  callAI,
}: AIAnalysisPanelProps) {
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);

  const handleAnalyze = async () => {
    setLoading(true);
    setAnalysis(null);

    const cityName = CITY_PRESETS[city]?.name || city;
    const userPrompt = `城市：${cityName}\n月薪：${globalParams.salary}元\n年终奖：${results.annualBonus}元\n${enabledCount}个月工资\n年度税前总收入：${results.totalGross}元\n年度到手：${results.totalNet}元\n年度个税：${results.totalTax}元\n社保公积金年缴：${results.totalSI + results.totalHF}元`;

    try {
      if (apiKey) {
        const response = await callAI(getAnalysisSystemPrompt(), userPrompt);
        const parsed = parseAIJson(response);
        if (parsed) {
          setAnalysis(parsed as unknown as AnalysisData);
        } else {
          setAnalysis(
            getMockAnalysis(city, globalParams.salary, results.totalGross, results.totalNet, results.totalTax)
          );
        }
      } else {
        await new Promise((r) => setTimeout(r, 1500));
        setAnalysis(
          getMockAnalysis(city, globalParams.salary, results.totalGross, results.totalNet, results.totalTax)
        );
      }
    } catch {
      setAnalysis(
        getMockAnalysis(city, globalParams.salary, results.totalGross, results.totalNet, results.totalTax)
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {!apiKey && (
        <div className="rounded-lg bg-warning/10 border border-warning/30 px-4 py-2.5 text-sm text-warning">
          当前为演示模式，设置 API Key 可获取真实 AI 分析
        </div>
      )}

      <button
        onClick={handleAnalyze}
        disabled={globalParams.salary <= 0 || loading}
        className="w-full rounded-lg bg-gradient-to-br from-[#667eea] to-[#764ba2] px-4 py-2.5 text-sm font-medium text-white hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
      >
        AI分析薪资
      </button>

      {loading && <AISkeleton />}

      {analysis && (
        <div className="space-y-4">
          {/* Score circle */}
          <div className="flex justify-center">
            <div
              className={`flex h-24 w-24 items-center justify-center rounded-full border-4 ${getScoreRingColor(analysis.competitiveness_score)}`}
            >
              <div className="text-center">
                <div className={`text-2xl font-bold ${getScoreColor(analysis.competitiveness_score)}`}>
                  {analysis.competitiveness_score}
                </div>
                <div className="text-xs text-text-tertiary">竞争力</div>
              </div>
            </div>
          </div>

          {/* Metrics */}
          <div className="space-y-2 rounded-lg border border-border bg-white p-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-text-secondary">城市平均薪资</span>
              <span className="font-medium text-text">
                ¥{formatCurrency(analysis.city_average_salary)}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-text-secondary">您的月薪</span>
              <span className="font-medium text-text">
                ¥{formatCurrency(globalParams.salary)}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-text-secondary">超过同城</span>
              <span className="font-medium text-[#667eea]">{analysis.percentile}%</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-text-secondary">实际税负率</span>
              <span className="font-medium text-text">{analysis.effective_tax_rate}%</span>
            </div>
          </div>

          {/* Summary */}
          <div className="rounded-lg border border-border bg-white p-4">
            <p className="text-sm text-text leading-relaxed">{analysis.analysis_summary}</p>
          </div>

          {/* Suggestions */}
          {analysis.suggestions && analysis.suggestions.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-text">建议</h4>
              <div className="space-y-2">
                {analysis.suggestions.map((suggestion, i) => (
                  <div key={i} className="flex gap-3 rounded-lg border border-border bg-white p-3">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#667eea] to-[#764ba2] text-xs font-bold text-white">
                      {i + 1}
                    </span>
                    <p className="text-sm text-text-secondary leading-relaxed">{suggestion}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
