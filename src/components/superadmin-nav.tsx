'use client';

import Link from 'next/link';
import { User } from '@supabase/supabase-js';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

interface SuperAdminNavProps {
  user: User | undefined;
  locale: string;
}

export function SuperAdminNav({ user, locale }: SuperAdminNavProps) {
  const pathname = usePathname();

  const items = [
    {
      title: 'Dashboard',
      href: `/${locale}/superadmin/dashboard`,
    },
    {
      title: 'Organizations',
      href: `/${locale}/superadmin/organizations`,
    },
    {
      title: 'Users',
      href: `/${locale}/superadmin/users`,
    },
    {
      title: 'Settings',
      href: `/${locale}/superadmin/settings`,
    },
    {
      title: 'Security',
      href: `/${locale}/superadmin/security`,
    },
    {
      title: 'Logs',
      href: `/${locale}/superadmin/logs`,
    },
  ];

  return (
    <nav className="border-b bg-background">
      <div className="container flex h-16 items-center px-4">
        <div className="mr-8">
          <Link href={`/${locale}/superadmin`} className="flex items-center space-x-2">
            <span className="font-bold">SuperAdmin</span>
          </Link>
        </div>
        <div className="flex flex-1 items-center space-x-4 lg:space-x-6">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'text-sm font-medium transition-colors hover:text-primary',
                pathname === item.href
                  ? 'text-foreground'
                  : 'text-foreground/60'
              )}
            >
              {item.title}
            </Link>
          ))}
        </div>
        <div className="flex items-center space-x-4">
          {user && (
            <span className="text-sm text-foreground/60">
              {user.email}
            </span>
          )}
        </div>
      </div>
    </nav>
  );
} 