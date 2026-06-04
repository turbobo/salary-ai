'use client';

import { useState } from 'react';
import { CITY_PRESETS } from '@/lib/calculation/constants';
import { parseAIJson } from '@/lib/ai/parse';
import { getMockSmartInput, SmartInputData } from '@/lib/ai/mock';
import { SMART_INPUT_SYSTEM_PROMPT } from '@/lib/ai/prompts';
import AILoading from './AILoading';

interface AISmartInputProps {
  apiKey: string;
  onApply: (data: SmartInputData) => void;
  callAI: (system: string, user: string) => Promise<string>;
}

const LABEL_MAP: Record<string, string> = {
  city: '城市',
  salary: '月薪',
  housingFundRate: '公积金比例',
  annualBonus: '年终奖',
  specialDeduction: '专项附加扣除',
  socialInsuranceBase: '社保基数',
  housingFundBase: '公积金基数',
};

function formatValue(key: string, value: unknown): string {
  if (value === null || value === undefined) return '未提及';
  if (key === 'city') {
    const preset = CITY_PRESETS[value as string];
    return preset ? preset.name : String(value);
  }
  if (key === 'housingFundRate') return `${value}%`;
  if (typeof value === 'number') return `¥${value.toLocaleString()}`;
  return String(value);
}

export default function AISmartInput({ apiKey, onApply, callAI }: AISmartInputProps) {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SmartInputData | null>(null);

  const handleParse = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setResult(null);

    try {
      if (apiKey) {
        const response = await callAI(SMART_INPUT_SYSTEM_PROMPT, input.trim());
        const parsed = parseAIJson(response);
        if (parsed) {
          setResult(parsed as unknown as SmartInputData);
        } else {
          setResult(getMockSmartInput(input.trim()));
        }
      } else {
        await new Promise((r) => setTimeout(r, 1000));
        setResult(getMockSmartInput(input.trim()));
      }
    } catch {
      setResult(getMockSmartInput(input.trim()));
    } finally {
      setLoading(false);
    }
  };

  const handleApply = () => {
    if (result) {
      onApply(result);
      setResult(null);
      setInput('');
    }
  };

  const handleCancel = () => {
    setResult(null);
  };

  return (
    <div className="space-y-4">
      <div>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={"例如：\n我在上海工作，月薪3万，公积金12%，年终奖6万，有房贷每月还5000"}
          rows={4}
          className="w-full rounded-lg border border-border bg-white px-4 py-3 text-sm outline-none resize-none focus:border-[#667eea] focus:ring-1 focus:ring-[#667eea]/30 transition-colors"
        />
      </div>

      <button
        onClick={handleParse}
        disabled={!input.trim() || loading}
        className="w-full rounded-lg bg-gradient-to-br from-[#667eea] to-[#764ba2] px-4 py-2.5 text-sm font-medium text-white hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
      >
        AI解析
      </button>

      {loading && <AILoading text="正在智能解析..." />}

      {result && (
        <div className="rounded-lg border border-[#667eea]/20 bg-gradient-to-br from-[#667eea]/5 to-[#764ba2]/5 p-4 space-y-3">
          <h4 className="text-sm font-semibold text-text">提取的信息</h4>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(LABEL_MAP).map(([key, label]) => {
              const value = result[key as keyof SmartInputData];
              return (
                <div key={key} className="flex items-center gap-2 text-sm">
                  <span className="text-text-tertiary">{label}:</span>
                  <span className="font-medium text-text">{formatValue(key, value)}</span>
                </div>
              );
            })}
          </div>
          <div className="flex gap-3 pt-2">
            <button
              onClick={handleApply}
              className="flex-1 rounded-lg bg-gradient-to-br from-[#667eea] to-[#764ba2] px-4 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity"
            >
              确认应用
            </button>
            <button
              onClick={handleCancel}
              className="flex-1 rounded-lg border border-border bg-white px-4 py-2 text-sm font-medium text-text-secondary hover:bg-bg-hover transition-colors"
            >
              取消
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
