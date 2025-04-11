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

-- Ajout des index pour les factures
CREATE INDEX IF NOT EXISTS invoices_organization_id_idx ON public.invoices(organization_id);
CREATE INDEX IF NOT EXISTS invoices_status_idx ON public.invoices(status);
CREATE INDEX IF NOT EXISTS invoices_due_date_idx ON public.invoices(due_date);

-- Création de la table des logs de sécurité
CREATE TABLE IF NOT EXISTS public.security_logs (
    id SERIAL PRIMARY KEY,
    event_type VARCHAR(50) NOT NULL CHECK (event_type IN ('login', 'failed_login', 'logout', 'password_reset', 'account_locked', 'account_unlocked')),
    user_id UUID REFERENCES auth.users(id),
    user_email VARCHAR(255),
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    metadata JSONB
);

-- Ajout des index pour les logs de sécurité
CREATE INDEX IF NOT EXISTS security_logs_event_type_idx ON public.security_logs(event_type);
CREATE INDEX IF NOT EXISTS security_logs_user_id_idx ON public.security_logs(user_id);
CREATE INDEX IF NOT EXISTS security_logs_created_at_idx ON public.security_logs(created_at);

-- Création de la table des paramètres système
CREATE TABLE IF NOT EXISTS public.system_settings (
    id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1), -- Assure qu'il n'y a qu'une seule ligne
    site_name VARCHAR(255) NOT NULL DEFAULT 'Cursor1 - Gestion d''entreprise',
    site_description TEXT DEFAULT 'Plateforme SaaS pour la gestion d''entreprise',
    contact_email VARCHAR(255) DEFAULT 'contact@cursor1.com',
    maintenance_mode BOOLEAN DEFAULT FALSE,
    default_timezone VARCHAR(50) DEFAULT 'Europe/Paris',
    allow_public_registration BOOLEAN DEFAULT TRUE,
    default_theme VARCHAR(20) DEFAULT 'system' CHECK (default_theme IN ('light', 'dark', 'system')),
    primary_color VARCHAR(20) DEFAULT '#6D28D9',
    logo_url VARCHAR(255) DEFAULT '/logo.png',
    favicon_url VARCHAR(255) DEFAULT '/favicon.ico',
    enable_animations BOOLEAN DEFAULT TRUE,
    email_notifications BOOLEAN DEFAULT TRUE,
    smtp_host VARCHAR(255) DEFAULT 'smtp.example.com',
    smtp_port VARCHAR(10) DEFAULT '587',
    push_notifications BOOLEAN DEFAULT FALSE,
    default_currency VARCHAR(10) DEFAULT 'EUR',
    payment_gateway VARCHAR(50) DEFAULT 'stripe' CHECK (payment_gateway IN ('stripe', 'paypal')),
    auto_invoicing BOOLEAN DEFAULT TRUE,
    invoice_prefix VARCHAR(20) DEFAULT 'INV-',
    default_tax_rate DECIMAL(5, 2) DEFAULT 20.00,
    enable_trial_period BOOLEAN DEFAULT TRUE,
    enable_public_api BOOLEAN DEFAULT TRUE,
    api_rate_limit INTEGER DEFAULT 60,
    log_api_requests BOOLEAN DEFAULT TRUE,
    enable_cors BOOLEAN DEFAULT FALSE,
    updated_at TIMESTAMPTZ DEFAULT now(),
    updated_by UUID REFERENCES auth.users(id)
);

-- Insertion d'une ligne par défaut pour system_settings
INSERT INTO public.system_settings (site_name, site_description, contact_email) 
VALUES ('Cursor1 - Gestion d''entreprise', 'Plateforme SaaS pour la gestion d''entreprise', 'contact@cursor1.com')
ON CONFLICT (id) DO NOTHING;

-- Ajout d'un champ is_blocked à la table user_profiles si elle existe déjà
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables 
                WHERE table_schema = 'public' 
                AND table_name = 'user_profiles') THEN
        BEGIN
            ALTER TABLE public.user_profiles 
            ADD COLUMN IF NOT EXISTS is_blocked BOOLEAN DEFAULT FALSE,
            ADD COLUMN IF NOT EXISTS blocked_at TIMESTAMPTZ,
            ADD COLUMN IF NOT EXISTS block_reason TEXT,
            ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;
        EXCEPTION
            WHEN duplicate_column THEN NULL;
        END;
    END IF;
END $$;

-- Ajout de RLS (Row Level Security)
-- Pour les factures
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can view all invoices" 
ON public.invoices FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM public.user_profiles 
        WHERE user_profiles.id = auth.uid() 
        AND (user_profiles.role = 'admin' OR user_profiles.role = 'superadmin')
    )
);

CREATE POLICY "Superadmins can manage all invoices" 
ON public.invoices FOR ALL 
USING (
    EXISTS (
        SELECT 1 FROM public.user_profiles 
        WHERE user_profiles.id = auth.uid() 
        AND user_profiles.role = 'superadmin'
    )
);

-- Pour les logs de sécurité
ALTER TABLE public.security_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Only superadmins can view security logs" 
ON public.security_logs FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM public.user_profiles 
        WHERE user_profiles.id = auth.uid() 
        AND user_profiles.role = 'superadmin'
    )
);

CREATE POLICY "Only superadmins can manage security logs" 
ON public.security_logs FOR ALL 
USING (
    EXISTS (
        SELECT 1 FROM public.user_profiles 
        WHERE user_profiles.id = auth.uid() 
        AND user_profiles.role = 'superadmin'
    )
);

-- Pour les paramètres système
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Only superadmins can manage system settings" 
ON public.system_settings FOR ALL 
USING (
    EXISTS (
        SELECT 1 FROM public.user_profiles 
        WHERE user_profiles.id = auth.uid() 
        AND user_profiles.role = 'superadmin'
    )
);

CREATE POLICY "Everyone can view system settings" 
ON public.system_settings FOR SELECT 
USING (true); 