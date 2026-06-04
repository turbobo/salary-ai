'use client';

export default function AISkeleton() {
  return (
    <div className="space-y-3 py-4">
      <div className="ai-skeleton h-5 w-1/3 rounded" />
      <div className="ai-skeleton h-4 w-full rounded" />
      <div className="ai-skeleton h-4 w-5/6 rounded" />
      <div className="ai-skeleton h-4 w-2/3 rounded" />
    </div>
  );
}
