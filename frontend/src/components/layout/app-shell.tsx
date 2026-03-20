'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/shared/helpers/cn';
import { clearToken } from '@/lib/auth';

const items = [
  { href: '/dashboard', label: 'Кабинет' },
  { href: '/tests', label: 'Опросники' }
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <img src="/logo.svg" alt="ProfDNA" width={120} height={32} />
        <nav>
          {items.map((item) => (
            <Link key={item.href} href={item.href} className={cn('sidebar-link', pathname.startsWith(item.href) && 'active')}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div style={{ marginTop: 24 }}>
          <button
            className="btn btn-ghost"
            style={{ width: '100%' }}
            onClick={() => {
              clearToken();
              router.push('/login');
            }}
          >
            Выйти
          </button>
        </div>
      </aside>

      <main className="main-content">{children}</main>
    </div>
  );
}
