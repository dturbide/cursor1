import { Metadata } from 'next';
import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import { DashboardShell } from '@/components/dashboard-shell';
import { DashboardHeader } from '@/components/dashboard-header';
import { generateI18nStaticParams } from '@/lib/i18n';

export const metadata: Metadata = {
  title: 'Logs',
  description: 'System logs',
};

export async function generateStaticParams() {
  return generateI18nStaticParams();
}

type Props = {
  params: { locale: string }
};

export default async function LogsPage({ params: { locale } }: Props) {
  unstable_setRequestLocale(locale);
  const t = await getTranslations('Logs');

  return (
    <DashboardShell>
      <DashboardHeader
        heading={t('title')}
        text={t('description')}
      />
      <div className="grid gap-10">
        {/* Logs content */}
      </div>
    </DashboardShell>
  );
} 