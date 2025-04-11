-- Ajouter un utilisateur bloqué fictif si la table user_profiles existe
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables 
                WHERE table_schema = 'public' 
                AND table_name = 'user_profiles') THEN
        
        UPDATE public.user_profiles
        SET is_blocked = TRUE,
            blocked_at = now() - interval '1 day',
            block_reason = 'Tentatives de connexion suspectes'
        WHERE email = 'user@example.com'
        AND NOT EXISTS (
            SELECT 1 FROM public.user_profiles
            WHERE is_blocked = TRUE
        )
        LIMIT 1;
        
        -- Si aucun utilisateur n'a été mis à jour, c'est qu'il n'y a pas d'utilisateur avec cet email
        -- Ou qu'il y a déjà un utilisateur bloqué
    END IF;
END $$;