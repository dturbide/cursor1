-- Création de la table des factures
CREATE TABLE IF NOT EXISTS public.invoices (
    id SERIAL PRIMARY KEY,
    organization_id UUID NOT NULL REFERENCES public.organizations(id),
    amount DECIMAL(10, 2) NOT NULL CHECK (amount > 0),
    status VARCHAR(50) NOT NULL CHECK (status IN ('paid', 'pending', 'overdue', 'cancelled')),
    invoice_number VARCHAR(50) NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    due_date TIMESTAMPTZ NOT NULL,
    paid_at TIMESTAMPTZ,
    tax_rate DECIMAL(5, 2) DEFAULT 20.00,
    tax_amount DECIMAL(10, 2) GENERATED ALWAYS AS (amount * tax_rate / 100) STORED,
    total_amount DECIMAL(10, 2) GENERATED ALWAYS AS (amount + (amount * tax_rate / 100)) STORED
);