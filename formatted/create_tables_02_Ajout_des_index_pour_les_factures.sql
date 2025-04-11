-- Ajout des index pour les factures
CREATE INDEX IF NOT EXISTS invoices_organization_id_idx ON public.invoices(organization_id);
CREATE INDEX IF NOT EXISTS invoices_status_idx ON public.invoices(status);
CREATE INDEX IF NOT EXISTS invoices_due_date_idx ON public.invoices(due_date);