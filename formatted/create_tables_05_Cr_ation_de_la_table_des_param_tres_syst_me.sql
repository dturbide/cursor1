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