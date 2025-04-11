import { Metadata } from 'next';
import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import { DashboardShell } from '@/components/dashboard-shell';
import { DashboardHeader } from '@/components/dashboard-header';
import { generateI18nStaticParams } from '@/lib/i18n';

export const metadata: Metadata = {
  title: 'Security',
  description: 'Security settings',
};

export async function generateStaticParams() {
  return generateI18nStaticParams();
}

type Props = {
  params: { locale: string }
};

export default async function SecurityPage({ params: { locale } }: Props) {
  unstable_setRequestLocale(locale);
  const t = await getTranslations('Security');

  return (
    <DashboardShell>
      <DashboardHeader
        heading={t('title')}
        text={t('description')}
      />
      <div className="grid gap-10">
        {/* Security content */}
      </div>
    </DashboardShell>
  );
} 