import { generateI18nStaticParams } from '@/lib/i18n';
import { unstable_setRequestLocale } from 'next-intl/server';
import { createServerComponentClient } from '@/lib/supabase/config';
import { DashboardShell } from '@/components/dashboard-shell';
import { SuperAdminNav } from '@/components/superadmin-nav';

// Generate static params for i18n
export async function generateStaticParams() {
  return generateI18nStaticParams();
}

type Props = {
  children: React.ReactNode;
  params: { locale: string };
};

export default async function SuperAdminLayout({ children, params: { locale } }: Props) {
  // Set the locale for the request
  unstable_setRequestLocale(locale);

  // Get the session - this is safe because middleware ensures we have a valid superadmin session
  const supabase = createServerComponentClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  return (
    <div className="flex min-h-screen flex-col space-y-6">
      <SuperAdminNav user={session?.user} locale={locale} />
      <div className="container grid flex-1 gap-12 md:grid-cols-[200px_1fr]">
        <aside className="hidden w-[200px] flex-col md:flex">
          <nav className="flex flex-col space-y-2">
            {/* Add your navigation items here */}
          </nav>
        </aside>
        <main className="flex w-full flex-1 flex-col overflow-hidden">
          <DashboardShell>
            {children}
          </DashboardShell>
        </main>
      </div>
    </div>
  );
} 