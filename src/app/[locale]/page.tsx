import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import { Link } from '@/navigation';

type Props = {
  params: { locale: string }
};

export default async function LocalizedHome({ params: { locale } }: Props) {
  unstable_setRequestLocale(locale);
  const t = await getTranslations('Home');

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="max-w-3xl w-full space-y-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight">
          {t('title')}
        </h1>
        
        <p className="text-xl text-muted-foreground">
          {t('description')}
        </p>

        <div className="flex gap-4 justify-center mt-8">
          <Link
            href="/auth/login"
            locale={locale}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
          >
            {t('login')}
          </Link>
          <Link
            href="/auth/register"
            locale={locale}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
          >
            {t('register')}
          </Link>
        </div>
      </div>
    </div>
  );
} 