'use client';

interface AILoadingProps {
  text?: string;
}

export default function AILoading({ text = 'AI 分析中...' }: AILoadingProps) {
  return (
    <div className="flex items-center gap-3 py-4">
      <div className="flex items-center gap-1">
        <span className="ai-loading-dot inline-block h-2 w-2 rounded-full bg-gradient-to-br from-[#667eea] to-[#764ba2]" />
        <span className="ai-loading-dot inline-block h-2 w-2 rounded-full bg-gradient-to-br from-[#667eea] to-[#764ba2]" />
        <span className="ai-loading-dot inline-block h-2 w-2 rounded-full bg-gradient-to-br from-[#667eea] to-[#764ba2]" />
      </div>
      <span className="text-sm text-text-secondary">{text}</span>
    </div>
  );
}
