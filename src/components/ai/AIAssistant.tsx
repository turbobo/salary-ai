'use client';

import { useState } from 'react';
import { CalculationResults, GlobalParams, MonthData } from '@/lib/calculation/salary';
import { SmartInputData } from '@/lib/ai/mock';
import AISmartInput from './AISmartInput';
import AIAnalysisPanel from './AIAnalysisPanel';
import AITaxOptimizer from './AITaxOptimizer';
import AICareerPlanner from './AICareerPlanner';

interface AIAssistantProps {
  apiKey: string;
  city: string;
  globalParams: GlobalParams;
  results: CalculationResults;
  enabledCount: number;
  annualBonus: number;
  bonusTaxMethod: string;
  bonusMonth: number;
  specialDeduction: number;
  enabledMonths: Record<number, boolean>;
  monthlyData: Record<number, MonthData>;
  onApplySmartInput: (data: SmartInputData) => void;
  onBonusTaxMethodChange: (method: string) => void;
  callAI: (system: string, user: string) => Promise<string>;
}

const TABS = [
  { key: 'smart-input', label: '智能输入' },
  { key: 'analysis', label: '薪资分析' },
  { key: 'tax', label: '税务优化' },
  { key: 'career', label: '职业规划' },
] as const;

type TabKey = (typeof TABS)[number]['key'];

export default function AIAssistant({
  apiKey,
  city,
  globalParams,
  results,
  enabledCount,
  annualBonus,
  bonusTaxMethod,
  bonusMonth,
  specialDeduction,
  enabledMonths,
  monthlyData,
  onApplySmartInput,
  onBonusTaxMethodChange,
  callAI,
}: AIAssistantProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState<TabKey>('smart-input');

  return (
    <div className="rounded-xl border border-[#667eea]/20 bg-bg-card shadow-sm overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="flex w-full items-center justify-between bg-gradient-to-br from-[#667eea] to-[#764ba2] px-5 py-3.5 text-left"
      >
        <div className="flex items-center gap-2">
          <span className="text-lg">&#x2728;</span>
          <span className="text-base font-semibold text-white">AI智能助手</span>
        </div>
        <svg
          className={`h-5 w-5 text-white/80 transition-transform ${collapsed ? '' : 'rotate-180'}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {!collapsed && (
        <div>
          {/* Tabs */}
          <div className="flex border-b border-border">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 px-3 py-2.5 text-sm font-medium transition-colors ${
                  activeTab === tab.key
                    ? 'border-b-2 border-[#667eea] text-[#667eea]'
                    : 'text-text-secondary hover:text-text'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="p-5">
            {activeTab === 'smart-input' && (
              <AISmartInput apiKey={apiKey} onApply={onApplySmartInput} callAI={callAI} />
            )}
            {activeTab === 'analysis' && (
              <AIAnalysisPanel
                apiKey={apiKey}
                city={city}
                globalParams={globalParams}
                results={results}
                enabledCount={enabledCount}
                callAI={callAI}
              />
            )}
            {activeTab === 'tax' && (
              <AITaxOptimizer
                apiKey={apiKey}
                city={city}
                globalParams={globalParams}
                results={results}
                annualBonus={annualBonus}
                bonusTaxMethod={bonusTaxMethod}
                bonusMonth={bonusMonth}
                specialDeduction={specialDeduction}
                enabledMonths={enabledMonths}
                monthlyData={monthlyData}
                onBonusTaxMethodChange={onBonusTaxMethodChange}
                callAI={callAI}
              />
            )}
            {activeTab === 'career' && (
              <AICareerPlanner
                apiKey={apiKey}
                city={city}
                globalParams={globalParams}
                results={results}
                callAI={callAI}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
