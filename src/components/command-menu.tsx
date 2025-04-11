'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { useRouter } from 'next/navigation';

export function CommandMenu() {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();
  const t = useTranslations('navigation');

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const runCommand = React.useCallback((command: () => void) => {
    setOpen(false);
    command();
  }, []);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
      >
        <span className="hidden lg:inline-flex">{t('search')}</span>
        <span className="inline-flex lg:hidden">{t('search')}</span>
        <kbd className="pointer-events-none ml-2 inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder={t('searchPlaceholder')} />
        <CommandList>
          <CommandEmpty>{t('noResults')}</CommandEmpty>
          <CommandGroup heading={t('navigation')}>
            <CommandItem
              onSelect={() => runCommand(() => router.push('/dashboard'))}
            >
              {t('dashboard')}
            </CommandItem>
            <CommandItem
              onSelect={() => runCommand(() => router.push('/companies'))}
            >
              {t('companies')}
            </CommandItem>
            <CommandItem
              onSelect={() => runCommand(() => router.push('/users'))}
            >
              {t('users')}
            </CommandItem>
            <CommandItem
              onSelect={() => runCommand(() => router.push('/settings'))}
            >
              {t('settings')}
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
} 