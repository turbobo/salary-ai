'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import HistoryList from '@/components/history/HistoryList';

export default function HistoryPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  const handleLoad = (data: Record<string, unknown>) => {
    // Store the calculation data in localStorage so the main page can pick it up
    localStorage.setItem('loadCalculation', JSON.stringify(data));
    router.push('/');
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <p className="text-sm text-zinc-500">加载中...</p>
      </main>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 px-4 py-8">
      <div className="max-w-lg mx-auto">
        <HistoryList onLoad={handleLoad} />
      </div>
    </main>
  );
}
