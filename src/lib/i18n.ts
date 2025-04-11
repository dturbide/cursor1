import { locales } from '@/config/i18n';

export function generateI18nStaticParams() {
  return locales.map((locale) => ({ locale }));
} 