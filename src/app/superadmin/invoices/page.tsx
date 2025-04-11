import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { CalendarDays, Download, EyeIcon, FileText, Search } from 'lucide-react';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default async function InvoicesPage() {
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

  // Récupérer les factures depuis Supabase
  const { data: invoices, error: invoicesError } = await supabase
    .from('invoices')
    .select(`
      *,
      organizations(name)
    `)
    .order('created_at', { ascending: false });

  // Récupérer les statistiques de facturation
  const { data: stats } = await supabase
    .from('invoices')
    .select('status');

  // Calculer les statistiques
  const totalInvoices = invoices?.length || 0;
  const totalPaid = stats?.filter(inv => inv.status === 'paid').length || 0;
  const totalPending = stats?.filter(inv => inv.status === 'pending').length || 0;
  const totalOverdue = stats?.filter(inv => inv.status === 'overdue').length || 0;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Gestion des Factures</h2>
        <Button>
          <FileText className="mr-2 h-4 w-4" />
          Nouvelle Facture
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Factures</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalInvoices}</div>
            <p className="text-xs text-muted-foreground">
              Nombre total de factures
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Factures Payées</CardTitle>
            <Badge variant="success" className="text-white">Payées</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPaid}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((totalPaid / (totalInvoices || 1)) * 100)}% du total
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En Attente</CardTitle>
            <Badge variant="outline">En attente</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPending}</div>
            <p className="text-xs text-muted-foreground">
              Factures en attente de paiement
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En Retard</CardTitle>
            <Badge variant="destructive">En retard</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOverdue}</div>
            <p className="text-xs text-muted-foreground">
              Factures avec paiement en retard
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Liste des Factures</CardTitle>
              <CardDescription>
                Historique complet des factures émises
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  type="search" 
                  placeholder="Rechercher..." 
                  className="pl-8 w-[250px] bg-muted/30"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {invoicesError ? (
            <div className="flex h-[350px] w-full items-center justify-center">
              <p className="text-sm text-muted-foreground">
                Une erreur est survenue lors du chargement des factures
              </p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>N° Facture</TableHead>
                    <TableHead>Organisation</TableHead>
                    <TableHead>Montant</TableHead>
                    <TableHead>Date d&apos;émission</TableHead>
                    <TableHead>Échéance</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices && invoices.length > 0 ? (
                    invoices.map((invoice) => (
                      <TableRow key={invoice.id}>
                        <TableCell className="font-medium">INV-{String(invoice.id).padStart(5, '0')}</TableCell>
                        <TableCell>{invoice.organizations?.name || 'Organisation inconnue'}</TableCell>
                        <TableCell>{invoice.amount?.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <CalendarDays className="h-4 w-4 text-muted-foreground" />
                            {invoice.created_at && format(new Date(invoice.created_at), 'dd MMM yyyy', { locale: fr })}
                          </div>
                        </TableCell>
                        <TableCell>
                          {invoice.due_date && format(new Date(invoice.due_date), 'dd MMM yyyy', { locale: fr })}
                        </TableCell>
                        <TableCell>
                          <InvoiceStatusBadge status={invoice.status} />
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="icon">
                              <EyeIcon className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="icon">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                        Aucune facture trouvée
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function InvoiceStatusBadge({ status }: { status: string }) {
  switch (status) {
    case 'paid':
      return <Badge variant="success" className="text-white">Payée</Badge>
    case 'pending':
      return <Badge variant="outline">En attente</Badge>
    case 'overdue':
      return <Badge variant="destructive">En retard</Badge>
    default:
      return <Badge variant="secondary">{status}</Badge>
  }
} 