'use client';

import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Languages } from 'lucide-react';
import { usePreferredLanguage } from '@/hooks/use-preferred-language';

export function LanguageSelector() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const { updatePreferredLanguage } = usePreferredLanguage();
  const t = useTranslations('languages');

  const changeLanguage = async (newLocale: string) => {
    // Mettre à jour la langue préférée dans la base de données
    await updatePreferredLanguage(newLocale);
    
    // Mettre à jour l'URL
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPath);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label={t('select')}>
          <Languages className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => changeLanguage('fr')}>
          {t('french')}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => changeLanguage('en')}>
          {t('english')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 