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