import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { createServerActionClient } from '@/lib/supabase/server';
import { DashboardShell } from '@/components/dashboard-shell';
import { DashboardHeader } from '@/components/dashboard-header';
import { BellRing, Mail } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default async function SuperAdminSettingsPage() {
  const cookieStore = cookies();
  const supabase = createServerActionClient(cookieStore);
  
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
  const { data: userProfile } = await supabase
    .from('user_profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (!userProfile || userProfile.role !== 'superadmin') {
    redirect('/dashboard');
  }

  // Récupérer les paramètres système depuis Supabase
  const { data: systemSettings, error: settingsError } = await supabase
    .from('system_settings')
    .select('*')
    .single();

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Paramètres"
        text="Configuration système et paramètres de l'application."
      />
      <div className="grid gap-10">
        <div className="flex flex-col gap-8">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold tracking-tight">Paramètres Système</h2>
          </div>

          <Tabs defaultValue="general">
            <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
              <aside className="-mx-4 lg:w-1/5">
                <TabsList className="flex flex-col justify-start items-start h-auto p-0 bg-transparent">
                  <TabsTrigger 
                    value="general" 
                    className="w-full justify-start px-4 py-2 font-normal"
                  >
                    Général
                  </TabsTrigger>
                  <TabsTrigger 
                    value="appearance" 
                    className="w-full justify-start px-4 py-2 font-normal"
                  >
                    Apparence
                  </TabsTrigger>
                  <TabsTrigger 
                    value="notifications" 
                    className="w-full justify-start px-4 py-2 font-normal"
                  >
                    Notifications
                  </TabsTrigger>
                  <TabsTrigger 
                    value="billing" 
                    className="w-full justify-start px-4 py-2 font-normal"
                  >
                    Facturation
                  </TabsTrigger>
                  <TabsTrigger 
                    value="api" 
                    className="w-full justify-start px-4 py-2 font-normal"
                  >
                    API
                  </TabsTrigger>
                </TabsList>
              </aside>
              
              <div className="flex-1 lg:max-w-3xl">
                {settingsError ? (
                  <Card>
                    <CardHeader>
                      <CardTitle>Erreur</CardTitle>
                      <CardDescription>
                        Impossible de charger les paramètres système
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Une erreur est survenue lors du chargement des paramètres. Veuillez réessayer plus tard.
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <>
                    <TabsContent value="general" className="mt-0">
                      <Card>
                        <CardHeader>
                          <CardTitle>Paramètres Généraux</CardTitle>
                          <CardDescription>
                            Configurez les paramètres généraux de la plateforme
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="site-name">Nom du site</Label>
                              <Input 
                                id="site-name" 
                                defaultValue={systemSettings?.site_name || "Cursor1 - Gestion d'entreprise"} 
                                className="mt-1" 
                              />
                            </div>
                            
                            <div>
                              <Label htmlFor="site-description">Description</Label>
                              <Textarea 
                                id="site-description" 
                                defaultValue={systemSettings?.site_description || "Plateforme SaaS pour la gestion d'entreprise"} 
                                className="mt-1" 
                              />
                            </div>
                            
                            <div>
                              <Label htmlFor="contact-email">Email de contact</Label>
                              <Input 
                                id="contact-email" 
                                type="email"
                                defaultValue={systemSettings?.contact_email || "contact@cursor1.com"} 
                                className="mt-1" 
                              />
                            </div>
                            
                            <div className="flex items-center justify-between space-x-2">
                              <div className="space-y-0.5">
                                <Label>Maintenance programmée</Label>
                                <p className="text-sm text-muted-foreground">
                                  Activer le mode maintenance
                                </p>
                              </div>
                              <Switch defaultChecked={systemSettings?.maintenance_mode || false} />
                            </div>
                            
                            <div>
                              <Label htmlFor="timezone">Fuseau horaire par défaut</Label>
                              <Input 
                                id="timezone" 
                                defaultValue={systemSettings?.default_timezone || "Europe/Paris"} 
                                className="mt-1" 
                              />
                            </div>
                            
                            <div className="flex items-center justify-between space-x-2">
                              <div className="space-y-0.5">
                                <Label>Inscription publique</Label>
                                <p className="text-sm text-muted-foreground">
                                  Autoriser les utilisateurs à s&apos;inscrire eux-mêmes
                                </p>
                              </div>
                              <Switch defaultChecked={systemSettings?.allow_public_registration || true} />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                    
                    <TabsContent value="appearance" className="mt-0">
                      <Card>
                        <CardHeader>
                          <CardTitle>Apparence</CardTitle>
                          <CardDescription>
                            Personnalisez l&apos;apparence de l&apos;application
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          <div className="space-y-4">
                            <div>
                              <Label>Thème par défaut</Label>
                              <RadioGroup defaultValue={systemSettings?.default_theme || "system"} className="mt-2">
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="light" id="theme-light" />
                                  <Label htmlFor="theme-light">Clair</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="dark" id="theme-dark" />
                                  <Label htmlFor="theme-dark">Sombre</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="system" id="theme-system" />
                                  <Label htmlFor="theme-system">Système</Label>
                                </div>
                              </RadioGroup>
                            </div>
                            
                            <Separator />
                            
                            <div>
                              <Label htmlFor="primary-color">Couleur principale</Label>
                              <div className="flex items-center gap-2 mt-1">
                                <Input id="primary-color" type="color" defaultValue={systemSettings?.primary_color || "#6D28D9"} className="w-12 h-8 p-0 border-0" />
                                <Input defaultValue={systemSettings?.primary_color || "#6D28D9"} className="w-32" />
                              </div>
                            </div>
                            
                            <div>
                              <Label htmlFor="logo-url">URL du logo</Label>
                              <Input id="logo-url" defaultValue={systemSettings?.logo_url || "/logo.png"} className="mt-1" />
                            </div>
                            
                            <div>
                              <Label htmlFor="favicon-url">URL du favicon</Label>
                              <Input id="favicon-url" defaultValue={systemSettings?.favicon_url || "/favicon.ico"} className="mt-1" />
                            </div>
                            
                            <div className="flex items-center justify-between space-x-2">
                              <div className="space-y-0.5">
                                <Label>Animations</Label>
                                <p className="text-sm text-muted-foreground">
                                  Activer les animations d&apos;interface
                                </p>
                              </div>
                              <Switch defaultChecked={systemSettings?.enable_animations || true} />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                    
                    <TabsContent value="notifications" className="mt-0">
                      <Card>
                        <CardHeader>
                          <CardTitle>Notifications</CardTitle>
                          <CardDescription>
                            Configurez les paramètres de notification
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          <div className="space-y-4">
                            <div className="flex items-center justify-between space-x-2">
                              <div className="flex flex-col">
                                <Label>Notifications par email</Label>
                                <p className="text-sm text-muted-foreground">
                                  Envoyer des notifications par email
                                </p>
                              </div>
                              <Switch defaultChecked={systemSettings?.email_notifications || true} />
                            </div>
                            
                            <div>
                              <Label htmlFor="smtp-host">Serveur SMTP</Label>
                              <Input id="smtp-host" defaultValue={systemSettings?.smtp_host || "smtp.example.com"} className="mt-1" />
                            </div>
                            
                            <div>
                              <Label htmlFor="smtp-port">Port SMTP</Label>
                              <Input id="smtp-port" defaultValue={systemSettings?.smtp_port || "587"} className="mt-1" />
                            </div>
                            
                            <div className="flex items-center justify-between space-x-2">
                              <div className="flex flex-col">
                                <Label>Notifications push</Label>
                                <p className="text-sm text-muted-foreground">
                                  Envoyer des notifications push aux appareils mobiles
                                </p>
                              </div>
                              <Switch defaultChecked={systemSettings?.push_notifications || false} />
                            </div>
                            
                            <div className="grid gap-4 grid-cols-2">
                              <div className="flex items-center gap-2">
                                <BellRing className="h-4 w-4 text-muted-foreground" />
                                <div className="space-y-0.5">
                                  <Label>Notifications système</Label>
                                  <p className="text-xs text-muted-foreground">
                                    Alertes de sécurité, maintenance
                                  </p>
                                </div>
                                <Switch className="ml-auto" defaultChecked={true} />
                              </div>
                              
                              <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4 text-muted-foreground" />
                                <div className="space-y-0.5">
                                  <Label>Messages</Label>
                                  <p className="text-xs text-muted-foreground">
                                    Nouveaux messages
                                  </p>
                                </div>
                                <Switch className="ml-auto" defaultChecked={true} />
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                    
                    <TabsContent value="billing" className="mt-0">
                      <Card>
                        <CardHeader>
                          <CardTitle>Facturation</CardTitle>
                          <CardDescription>
                            Configurez les paramètres de facturation
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="default-currency">Devise par défaut</Label>
                              <Input id="default-currency" defaultValue={systemSettings?.default_currency || "EUR"} className="mt-1" />
                            </div>
                            
                            <div>
                              <Label htmlFor="payment-gateway">Passerelle de paiement</Label>
                              <RadioGroup defaultValue={systemSettings?.payment_gateway || "stripe"} className="mt-2">
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="stripe" id="provider-stripe" />
                                  <Label htmlFor="provider-stripe">Stripe</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="paypal" id="provider-paypal" />
                                  <Label htmlFor="provider-paypal">PayPal</Label>
                                </div>
                              </RadioGroup>
                            </div>
                            
                            <div className="flex items-center justify-between space-x-2">
                              <div className="space-y-0.5">
                                <Label>Factures automatiques</Label>
                                <p className="text-sm text-muted-foreground">
                                  Générer automatiquement les factures
                                </p>
                              </div>
                              <Switch defaultChecked={systemSettings?.auto_invoicing || true} />
                            </div>
                            
                            <div>
                              <Label htmlFor="invoice-prefix">Préfixe des factures</Label>
                              <Input id="invoice-prefix" defaultValue={systemSettings?.invoice_prefix || "INV-"} className="mt-1" />
                            </div>
                            
                            <div>
                              <Label htmlFor="tax-rate">Taux de TVA par défaut (%)</Label>
                              <Input id="tax-rate" type="number" defaultValue={systemSettings?.default_tax_rate || "20"} className="mt-1" />
                            </div>
                            
                            <div className="flex items-center justify-between space-x-2">
                              <div className="space-y-0.5">
                                <Label>Période d&apos;essai</Label>
                                <p className="text-sm text-muted-foreground">
                                  Proposer une période d&apos;essai gratuite
                                </p>
                              </div>
                              <Switch defaultChecked={systemSettings?.enable_trial_period || true} />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                    
                    <TabsContent value="api" className="mt-0">
                      <Card>
                        <CardHeader>
                          <CardTitle>API</CardTitle>
                          <CardDescription>
                            Gérez l&apos;accès API
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          <div className="space-y-4">
                            <div className="flex items-center justify-between space-x-2">
                              <div className="space-y-0.5">
                                <Label>API publique</Label>
                                <p className="text-sm text-muted-foreground">
                                  Activer l&apos;API publique
                                </p>
                              </div>
                              <Switch defaultChecked={systemSettings?.enable_public_api || true} />
                            </div>
                            
                            <div>
                              <Label htmlFor="api-key">Clé API</Label>
                              <div className="flex mt-1">
                                <Input id="api-key" 
                                  type="password" 
                                  defaultValue="xxxx_api_key_placeholder_xxxx" 
                                  className="rounded-r-none" 
                                  readOnly 
                                />
                                <Button className="rounded-l-none">Réinitialiser</Button>
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">
                                La clé API est utilisée pour accéder à l&apos;API depuis des applications externes
                              </p>
                            </div>
                            
                            <div>
                              <Label htmlFor="rate-limit">Limite de requêtes (par minute)</Label>
                              <Input id="rate-limit" type="number" defaultValue={systemSettings?.api_rate_limit || "60"} className="mt-1" />
                            </div>
                            
                            <div className="flex items-center justify-between space-x-2">
                              <div className="space-y-0.5">
                                <Label>Journalisation des requêtes API</Label>
                                <p className="text-sm text-muted-foreground">
                                  Enregistrer toutes les requêtes API
                                </p>
                              </div>
                              <Switch defaultChecked={systemSettings?.log_api_requests || true} />
                            </div>
                            
                            <div className="flex items-center justify-between space-x-2">
                              <div className="space-y-0.5">
                                <Label>CORS</Label>
                                <p className="text-sm text-muted-foreground">
                                  Autoriser les requêtes cross-origin
                                </p>
                              </div>
                              <Switch defaultChecked={systemSettings?.enable_cors || false} />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </>
                )}
                
                <div className="mt-6">
                  <Button className="mr-2">Enregistrer</Button>
                  <Button variant="outline">Annuler</Button>
                </div>
              </div>
            </div>
          </Tabs>
        </div>
      </div>
    </DashboardShell>
  );
} 