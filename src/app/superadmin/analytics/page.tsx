import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AnalyticsPage() {
  const supabase = createServerComponentClient({ cookies });
  
  const {
    data: { session },
  } = await supabase.auth.getSession();
  
  if (!session) {
    redirect('/auth/login');
  }
  
  // Récupérer les informations utilisateur
  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;
  
  if (!user) {
    redirect('/auth/login');
  }
  
  // Vérifier si l'utilisateur a le rôle superadmin
  const userRole = user.user_metadata?.role;
  
  if (userRole !== 'superadmin') {
    redirect('/dashboard');
  }

  // Récupérer les statistiques depuis Supabase
  const { data: userStats, error: userError } = await supabase
    .from('user_profiles')
    .select('role')
    .is('is_active', true);

  const { data: orgStats, error: orgError } = await supabase
    .from('organizations')
    .select('*');

  // Calculer quelques statistiques de base
  const userCount = userStats?.length || 0;
  const orgCount = orgStats?.length || 0;
  
  const usersByRole = userStats?.reduce((acc, user) => {
    acc[user.role] = (acc[user.role] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Analytiques</h2>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Utilisateurs</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userCount}</div>
            <p className="text-xs text-muted-foreground">
              Utilisateurs actifs dans le système
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Organisations</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orgCount}</div>
            <p className="text-xs text-muted-foreground">
              Organisations enregistrées
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">SuperAdmins</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M12 4.5 1.5 9l10.5 4.5L22.5 9 12 4.5z" />
              <path d="M1.5 9v10.5L12 19" />
              <path d="M22.5 9v10.5L12 19" />
              <path d="M12 4.5v15" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{usersByRole?.superadmin || 0}</div>
            <p className="text-xs text-muted-foreground">
              Administrateurs système
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Admins</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{usersByRole?.admin || 0}</div>
            <p className="text-xs text-muted-foreground">
              Administrateurs d'organisation
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Vue d&apos;ensemble du système</CardTitle>
            <CardDescription>
              Affichage des statistiques principales de la plateforme
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            {userError || orgError ? (
              <div className="flex h-[350px] w-full items-center justify-center">
                <p className="text-sm text-muted-foreground">
                  Une erreur est survenue lors du chargement des données
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="rounded-lg border p-3">
                    <div className="text-sm font-medium text-muted-foreground">SuperAdmins</div>
                    <div className="text-2xl font-bold">{usersByRole?.superadmin || 0}</div>
                  </div>
                  <div className="rounded-lg border p-3">
                    <div className="text-sm font-medium text-muted-foreground">Admins</div>
                    <div className="text-2xl font-bold">{usersByRole?.admin || 0}</div>
                  </div>
                  <div className="rounded-lg border p-3">
                    <div className="text-sm font-medium text-muted-foreground">Employés</div>
                    <div className="text-2xl font-bold">{usersByRole?.employee || 0}</div>
                  </div>
                </div>
                
                <div className="rounded-lg border p-4">
                  <h4 className="mb-4 text-sm font-medium">Utilisateurs par rôle</h4>
                  <div className="space-y-2">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="col-span-2 flex items-center">
                        <span className="mr-2 h-2 w-2 rounded-full bg-primary"></span>
                        <span className="text-sm font-medium">SuperAdmin</span>
                      </div>
                      <div className="text-right text-sm">{Math.round(((usersByRole?.superadmin || 0) / userCount) * 100)}%</div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="col-span-2 flex items-center">
                        <span className="mr-2 h-2 w-2 rounded-full bg-blue-500"></span>
                        <span className="text-sm font-medium">Admin</span>
                      </div>
                      <div className="text-right text-sm">{Math.round(((usersByRole?.admin || 0) / userCount) * 100)}%</div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="col-span-2 flex items-center">
                        <span className="mr-2 h-2 w-2 rounded-full bg-green-500"></span>
                        <span className="text-sm font-medium">Employé</span>
                      </div>
                      <div className="text-right text-sm">{Math.round(((usersByRole?.employee || 0) / userCount) * 100)}%</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Activité récente</CardTitle>
            <CardDescription>
              Dernières connexions et activités
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              <div className="flex items-center">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">
                    Connexion administrateur
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Dernier accès il y a 10 minutes
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">
                    Nouvelle organisation créée
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Une nouvelle entreprise a été ajoutée il y a 3 heures
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">
                    Compte utilisateur mis à jour
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Un compte a été modifié il y a 5 heures
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 