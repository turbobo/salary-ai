'use client';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const navLinks = [
  { href: '#city-settings', icon: '🏙️', label: '城市设置' },
  { href: '#global-params', icon: '⚙️', label: '全局参数' },
  { href: '#monthly-settings', icon: '📅', label: '月度设置' },
  { href: '#bonus-settings', icon: '🎁', label: '年终奖' },
  { href: '#ai-assistant', icon: '🤖', label: 'AI助手', highlight: true },
  { href: '#results', icon: '📊', label: '计算结果' },
  { href: '#tax-table', icon: '📋', label: '税率表' },
];

export default function Sidebar({ open, onClose }: SidebarProps) {
  return (
    <>
      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/30 z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={`fixed left-0 top-0 h-full w-56 bg-white dark:bg-zinc-900 shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-200 dark:border-zinc-700">
          <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-100">
            导航
          </h2>
          <button
            onClick={onClose}
            className="text-2xl text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
            aria-label="关闭导航"
          >
            &times;
          </button>
        </div>

        {/* Nav links */}
        <nav className="py-2">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={onClose}
              className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                link.highlight
                  ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white mx-2 rounded-lg'
                  : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
              }`}
            >
              <span className="text-lg">{link.icon}</span>
              <span>{link.label}</span>
            </a>
          ))}
        </nav>
      </aside>
    </>
  );
}
