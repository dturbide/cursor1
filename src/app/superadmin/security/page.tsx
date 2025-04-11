import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { AlertTriangle, Lock, LogIn, ShieldCheck, UserX } from 'lucide-react';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UnblockUserButton } from "@/components/security/unblock-user-button";

export default async function SecurityPage() {
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

  // Récupérer les tentatives de connexion échouées
  const { data: failedLogins, error: loginError } = await supabase
    .from('security_logs')
    .select('*')
    .eq('event_type', 'failed_login')
    .order('created_at', { ascending: false })
    .limit(5);

  // Récupérer les utilisateurs bloqués
  const { data: blockedUsers, error: blockedError } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('is_blocked', true)
    .limit(5);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Sécurité</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Authentifications récentes</CardTitle>
            <LogIn className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">127</div>
            <p className="text-xs text-muted-foreground">
              Connexions au cours des 7 derniers jours
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tentatives échouées</CardTitle>
            <UserX className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-500">12</div>
            <p className="text-xs text-muted-foreground">
              Échecs de connexion récents
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utilisateurs bloqués</CardTitle>
            <Lock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{blockedUsers?.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              Comptes bloqués pour des raisons de sécurité
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Niveau de sécurité</CardTitle>
            <ShieldCheck className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">Fort</div>
            <p className="text-xs text-muted-foreground">
              Toutes les vérifications sont activées
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="settings">
        <TabsList>
          <TabsTrigger value="settings">Paramètres</TabsTrigger>
          <TabsTrigger value="logs">Logs</TabsTrigger>
          <TabsTrigger value="blocked">Utilisateurs bloqués</TabsTrigger>
        </TabsList>
        
        <TabsContent value="settings" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres de sécurité</CardTitle>
              <CardDescription>
                Configurez les paramètres de sécurité de la plateforme
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between space-x-2">
                <div className="space-y-0.5">
                  <div className="font-medium">Authentification à deux facteurs (2FA)</div>
                  <div className="text-muted-foreground text-sm">
                    Exiger l&apos;authentification à deux facteurs pour tous les administrateurs
                  </div>
                </div>
                <Switch defaultChecked={true} />
              </div>
              
              <div className="flex items-center justify-between space-x-2">
                <div className="space-y-0.5">
                  <div className="font-medium">Alertes de connexion inhabituelle</div>
                  <div className="text-muted-foreground text-sm">
                    Envoyer des alertes lorsqu&apos;un utilisateur se connecte depuis un nouvel appareil
                  </div>
                </div>
                <Switch defaultChecked={true} />
              </div>
              
              <div className="flex items-center justify-between space-x-2">
                <div className="space-y-0.5">
                  <div className="font-medium">Verrouillage automatique des comptes</div>
                  <div className="text-muted-foreground text-sm">
                    Bloquer automatiquement un compte après 5 tentatives de connexion échouées
                  </div>
                </div>
                <Switch defaultChecked={true} />
              </div>
              
              <div className="flex items-center justify-between space-x-2">
                <div className="space-y-0.5">
                  <div className="font-medium">Exigences de mot de passe renforcées</div>
                  <div className="text-muted-foreground text-sm">
                    Exiger des mots de passe forts avec au moins 12 caractères et caractères spéciaux
                  </div>
                </div>
                <Switch defaultChecked={false} />
              </div>
              
              <div className="flex items-center justify-between space-x-2">
                <div className="space-y-0.5">
                  <div className="font-medium">Durée de session limitée</div>
                  <div className="text-muted-foreground text-sm">
                    Déconnecter automatiquement les utilisateurs après 2 heures d&apos;inactivité
                  </div>
                </div>
                <Switch defaultChecked={true} />
              </div>
            </CardContent>
            <CardFooter>
              <Button className="ml-auto">Enregistrer les modifications</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="logs" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Logs de sécurité récents</CardTitle>
              <CardDescription>
                Historique des événements de sécurité sur la plateforme
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loginError ? (
                <div className="flex h-[350px] w-full items-center justify-center">
                  <p className="text-sm text-muted-foreground">
                    Une erreur est survenue lors du chargement des logs
                  </p>
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Événement</TableHead>
                        <TableHead>Utilisateur</TableHead>
                        <TableHead>Adresse IP</TableHead>
                        <TableHead>Statut</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {failedLogins && failedLogins.length > 0 ? (
                        failedLogins.map((log) => (
                          <TableRow key={log.id}>
                            <TableCell>
                              {log.created_at && format(new Date(log.created_at), 'dd MMM yyyy HH:mm', { locale: fr })}
                            </TableCell>
                            <TableCell className="font-medium">
                              <div className="flex items-center gap-1">
                                <AlertTriangle className="h-4 w-4 text-amber-500" />
                                Tentative de connexion échouée
                              </div>
                            </TableCell>
                            <TableCell>{log.user_email || 'Inconnu'}</TableCell>
                            <TableCell>{log.ip_address}</TableCell>
                            <TableCell><Badge variant="destructive">Échouée</Badge></TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                            Aucun log de sécurité récent
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="ml-auto">Voir tous les logs</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="blocked" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Utilisateurs bloqués</CardTitle>
              <CardDescription>
                Comptes utilisateurs suspendus pour des raisons de sécurité
              </CardDescription>
            </CardHeader>
            <CardContent>
              {blockedError ? (
                <div className="flex h-[350px] w-full items-center justify-center">
                  <p className="text-sm text-muted-foreground">
                    Une erreur est survenue lors du chargement des utilisateurs bloqués
                  </p>
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Utilisateur</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Rôle</TableHead>
                        <TableHead>Date de blocage</TableHead>
                        <TableHead>Raison</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {blockedUsers && blockedUsers.length > 0 ? (
                        blockedUsers.map((user) => (
                          <TableRow key={user.id}>
                            <TableCell className="font-medium">{user.full_name || 'Utilisateur inconnu'}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{user.role || 'Utilisateur'}</Badge>
                            </TableCell>
                            <TableCell>
                              {user.blocked_at && format(new Date(user.blocked_at), 'dd MMM yyyy', { locale: fr })}
                            </TableCell>
                            <TableCell>{user.block_reason || 'Raisons de sécurité'}</TableCell>
                            <TableCell className="text-right">
                              <UnblockUserButton userId={user.id} />
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                            Aucun utilisateur bloqué
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 