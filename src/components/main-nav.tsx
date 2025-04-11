'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';

export function MainNav() {
  const pathname = usePathname();
  const t = useTranslations('navigation');

  const items = [
    {
      title: t('dashboard'),
      href: '/dashboard',
    },
    {
      title: t('companies'),
      href: '/companies',
    },
    {
      title: t('users'),
      href: '/users',
    },
    {
      title: t('settings'),
      href: '/settings',
    },
  ];

  return (
    <div className="mr-4 hidden md:flex">
      <Link href="/" className="mr-6 flex items-center space-x-2">
        <span className="hidden font-bold sm:inline-block">
          Cursor1
        </span>
      </Link>
      <nav className="flex items-center space-x-6 text-sm font-medium">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'transition-colors hover:text-foreground/80',
              pathname === item.href ? 'text-foreground' : 'text-foreground/60'
            )}
          >
            {item.title}
          </Link>
        ))}
      </nav>
    </div>
  );
} 