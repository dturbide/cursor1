-- Supposons que nous avons un identifiant d'organisation existant
-- Remplacez cette valeur par un identifiant réel de votre table organizations
-- Créons d'abord une organisation de test si elle n'existe pas déjà
DO $$
DECLARE
    test_org_id UUID;
BEGIN
    -- Vérifier si la table organizations existe
    IF EXISTS (SELECT FROM information_schema.tables 
               WHERE table_schema = 'public' 
               AND table_name = 'organizations') THEN
        
        -- Chercher une organisation existante ou en créer une nouvelle
        SELECT id INTO test_org_id FROM public.organizations LIMIT 1;
        
        IF test_org_id IS NULL THEN
            -- Créer une nouvelle organisation de test
            INSERT INTO public.organizations (
                name, 
                description, 
                created_at, 
                updated_at
            ) VALUES (
                'Organisation Test', 
                'Organisation créée pour les tests', 
                now(), 
                now()
            ) RETURNING id INTO test_org_id;
        END IF;
        
        -- Maintenant nous avons un test_org_id, insérons des factures

-- Ajouter des factures de test
        INSERT INTO public.invoices (
            organization_id,
            amount,
            status,
            invoice_number,
            description,
            created_at,
            due_date,
            paid_at
        ) VALUES 
        (
            test_org_id,
            1250.00,
            'paid',
            'INV-00001',
            'Abonnement mensuel - Janvier 2023',
            now() - interval '45 days',
            now() - interval '30 days',
            now() - interval '25 days'
        ),
        (
            test_org_id,
            1250.00,
            'paid',
            'INV-00002',
            'Abonnement mensuel - Février 2023',
            now() - interval '15 days',
            now() + interval '15 days',
            now() - interval '5 days'
        ),
        (
            test_org_id,
            1250.00,
            'pending',
            'INV-00003',
            'Abonnement mensuel - Mars 2023',
            now() - interval '5 days',
            now() + interval '25 days',
            NULL
        ),
        (
            test_org_id,
            500.00,
            'overdue',
            'INV-00004',
            'Services supplémentaires',
            now() - interval '60 days',
            now() - interval '30 days',
            NULL
        ),
        (
            test_org_id,
            2500.00,
            'pending',
            'INV-00005',
            'Mise à niveau du plan',
            now() - interval '2 days',
            now() + interval '28 days',
            NULL
        );
    END IF;
END $$;

-- Insérer des logs de sécurité de test
INSERT INTO public.security_logs (
    event_type,
    user_email,
    ip_address,
    user_agent,
    created_at,
    metadata
) VALUES 
(
    'login',
    'admin@cursor1.com',
    '192.168.1.1',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    now() - interval '2 hours',
    '{"location": "Paris, France", "device": "Desktop"}'::jsonb
),
(
    'failed_login',
    'user@example.com',
    '192.168.1.2',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1',
    now() - interval '3 hours',
    '{"location": "Lyon, France", "device": "Mobile", "reason": "Invalid password", "attempts": 1}'::jsonb
),
(
    'failed_login',
    'user@example.com',
    '192.168.1.2',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1',
    now() - interval '2 hours 55 minutes',
    '{"location": "Lyon, France", "device": "Mobile", "reason": "Invalid password", "attempts": 2}'::jsonb
),
(
    'account_locked',
    'user@example.com',
    '192.168.1.2',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1',
    now() - interval '2 hours 50 minutes',
    '{"location": "Lyon, France", "device": "Mobile", "reason": "Too many failed login attempts", "attempts": 3}'::jsonb
),
(
    'password_reset',
    'user@example.com',
    '192.168.1.3',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Safari/605.1.15',
    now() - interval '1 hour',
    '{"location": "Paris, France", "device": "Desktop", "requested_by": "user"}'::jsonb
),
(
    'account_unlocked',
    'user@example.com',
    '192.168.1.4',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    now() - interval '30 minutes',
    '{"location": "Paris, France", "device": "Desktop", "unlocked_by": "admin@cursor1.com"}'::jsonb
),
(
    'login',
    'user@example.com',
    '192.168.1.3',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Safari/605.1.15',
    now() - interval '20 minutes',
    '{"location": "Paris, France", "device": "Desktop"}'::jsonb
),
(
    'login',
    'admin@cursor1.com',
    '192.168.1.5',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    now() - interval '10 minutes',
    '{"location": "Marseille, France", "device": "Desktop"}'::jsonb
);

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