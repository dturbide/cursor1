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