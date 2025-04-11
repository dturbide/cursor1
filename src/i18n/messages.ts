import { getRequestConfig } from 'next-intl/server';
import { locales, Locale, defaultLocale } from './config';

export default getRequestConfig(async ({ locale }) => {
  // If locale is undefined, use the default locale
  const resolvedLocale = locale || defaultLocale;
  
  if (!locales.includes(resolvedLocale as Locale)) {
    throw new Error(`Locale ${resolvedLocale} not supported.`);
  }
  
  return {
    messages: (await import(`../messages/${resolvedLocale}.json`)).default,
  };
}); 