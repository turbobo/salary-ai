'use client';

import { useState } from 'react';
import type { Calculation } from '@/lib/supabase/types';

interface HistoryCardProps {
  calculation: Calculation;
  onLoad: (data: Record<string, unknown>) => void;
  onDelete: (id: string) => void;
}

export default function HistoryCard({
  calculation,
  onLoad,
  onDelete,
}: HistoryCardProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatMoney = (amount: number | null) => {
    if (amount == null) return '--';
    return amount.toLocaleString('zh-CN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const handleLoad = () => {
    onLoad(calculation as unknown as Record<string, unknown>);
  };

  const handleDelete = () => {
    if (confirmDelete) {
      onDelete(calculation.id);
      setConfirmDelete(false);
    } else {
      setConfirmDelete(true);
      // Auto-cancel after 3 seconds
      setTimeout(() => setConfirmDelete(false), 3000);
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-3 space-y-2">
      <div className="flex items-start justify-between">
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-medium text-zinc-800 dark:text-zinc-100 truncate">
            {calculation.name || '未命名'}
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            {calculation.city}
          </p>
        </div>
        <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 whitespace-nowrap ml-2">
          {formatMoney(calculation.total_net)}
        </span>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-xs text-zinc-400 dark:text-zinc-500">
          {formatDate(calculation.updated_at)}
        </span>
        <div className="flex gap-2">
          <button
            onClick={handleLoad}
            className="text-xs px-2 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors"
          >
            加载
          </button>
          <button
            onClick={handleDelete}
            className={`text-xs px-2 py-1 rounded transition-colors ${
              confirmDelete
                ? 'bg-red-500 text-white'
                : 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50'
            }`}
          >
            {confirmDelete ? '确认删除' : '删除'}
          </button>
        </div>
      </div>
    </div>
  );
}
