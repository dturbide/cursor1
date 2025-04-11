import { getRequestConfig } from 'next-intl/server';
import { locales, Locale } from './config';

export default getRequestConfig(async ({ locale }) => {
  if (!locales.includes(locale as Locale)) {
    throw new Error(`Locale ${locale} not supported.`);
  }
  
  return {
    messages: (await import(`../messages/${locale}.json`)).default,
  };
}); 