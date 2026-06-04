'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function AuthButton() {
  const { user, loading, signOut } = useAuth();

  if (loading) return null;

  if (user) {
    return (
      <div className="flex items-center gap-2 text-sm">
        <span className="text-zinc-600 dark:text-zinc-400 truncate max-w-[140px]">
          {user.email}
        </span>
        <button
          onClick={() => signOut()}
          className="text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
        >
          退出
        </button>
      </div>
    );
  }

  return (
    <Link
      href="/auth/login"
      className="text-sm text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
    >
      登录
    </Link>
  );
}
