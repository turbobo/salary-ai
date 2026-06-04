'use client';

interface AppHeaderProps {
  onMenuToggle: () => void;
  menuOpen: boolean;
}

export default function AppHeader({ onMenuToggle, menuOpen }: AppHeaderProps) {
  return (
    <header className="relative flex items-center justify-center py-4 px-4 border-b border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900">
      {/* Hamburger button */}
      <button
        onClick={onMenuToggle}
        className="fixed top-4 left-4 z-50 flex flex-col justify-center items-center w-8 h-8 gap-1.5"
        aria-label={menuOpen ? '关闭菜单' : '打开菜单'}
      >
        <span
          className={`block w-5 h-0.5 bg-zinc-700 dark:bg-zinc-200 transition-all duration-300 ${
            menuOpen ? 'rotate-45 translate-y-2' : ''
          }`}
        />
        <span
          className={`block w-5 h-0.5 bg-zinc-700 dark:bg-zinc-200 transition-all duration-300 ${
            menuOpen ? 'opacity-0' : ''
          }`}
        />
        <span
          className={`block w-5 h-0.5 bg-zinc-700 dark:bg-zinc-200 transition-all duration-300 ${
            menuOpen ? '-rotate-45 -translate-y-2' : ''
          }`}
        />
      </button>

      {/* Title */}
      <div className="text-center">
        <h1 className="text-xl font-bold text-zinc-800 dark:text-zinc-100">
          AI薪资计算器
        </h1>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
          智能薪资 & 个税计算工具
        </p>
      </div>
    </header>
  );
}
