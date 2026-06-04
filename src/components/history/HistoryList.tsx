'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { createClient } from '@/lib/supabase/client';
import type { Calculation } from '@/lib/supabase/types';
import HistoryCard from './HistoryCard';

interface HistoryListProps {
  onLoad: (data: Record<string, unknown>) => void;
}

export default function HistoryList({ onLoad }: HistoryListProps) {
  const { user } = useAuth();
  const [calculations, setCalculations] = useState<Calculation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchCalculations = async () => {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('calculations')
          .select('*')
          .order('updated_at', { ascending: false });

        if (error) {
          console.error('Error fetching calculations:', error);
          return;
        }

        setCalculations(data as Calculation[]);
      } catch (err) {
        console.error('Error fetching calculations:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCalculations();
  }, [user]);

  const handleDelete = async (id: string) => {
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('calculations')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting calculation:', error);
        return;
      }

      setCalculations((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error('Error deleting calculation:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-sm text-zinc-500 dark:text-zinc-400">
          加载中...
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-12 text-sm text-zinc-500 dark:text-zinc-400">
        请先登录以查看历史记录
      </div>
    );
  }

  if (calculations.length === 0) {
    return (
      <div className="text-center py-12 text-sm text-zinc-500 dark:text-zinc-400">
        暂无保存的计算记录
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-100">
        历史记录
      </h2>
      <div className="space-y-2">
        {calculations.map((calc) => (
          <HistoryCard
            key={calc.id}
            calculation={calc}
            onLoad={onLoad}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
}
