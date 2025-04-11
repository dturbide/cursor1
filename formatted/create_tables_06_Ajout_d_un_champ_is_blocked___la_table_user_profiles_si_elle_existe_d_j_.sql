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