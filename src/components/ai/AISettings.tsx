'use client';

import { useState } from 'react';
import { saveApiKey as persistApiKey } from '@/lib/storage';

interface AISettingsProps {
  apiKey: string;
  setApiKey: (key: string) => void;
}

export default function AISettings({ apiKey, setApiKey }: AISettingsProps) {
  const [inputKey, setInputKey] = useState(apiKey);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    const trimmed = inputKey.trim();
    setApiKey(trimmed);
    persistApiKey(trimmed);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const connected = !!apiKey;

  return (
    <div className="flex items-center gap-3 rounded-lg bg-gradient-to-br from-[#667eea]/5 to-[#764ba2]/5 border border-[#667eea]/20 px-4 py-2.5">
      <span className="inline-flex items-center rounded-full bg-gradient-to-br from-[#667eea] to-[#764ba2] px-2 py-0.5 text-xs font-semibold text-white shrink-0">
        AI
      </span>
      <label className="text-sm text-text-secondary whitespace-nowrap">DashScope API Key:</label>
      <input
        type="password"
        value={inputKey}
        onChange={(e) => setInputKey(e.target.value)}
        placeholder="sk-..."
        className="flex-1 min-w-0 rounded-md border border-border bg-white px-3 py-1.5 text-sm outline-none focus:border-[#667eea] focus:ring-1 focus:ring-[#667eea]/30 transition-colors"
      />
      <button
        onClick={handleSave}
        className="shrink-0 rounded-md bg-gradient-to-br from-[#667eea] to-[#764ba2] px-4 py-1.5 text-sm font-medium text-white hover:opacity-90 transition-opacity"
      >
        {saved ? '已保存' : '保存'}
      </button>
      <div className="flex items-center gap-1.5 shrink-0">
        <span
          className={`inline-block h-2 w-2 rounded-full ${
            connected ? 'bg-success' : 'bg-warning'
          }`}
        />
        <span className="text-xs text-text-tertiary">
          {connected ? '已连接' : '演示模式'}
        </span>
      </div>
    </div>
  );
}
