-- Cette migration crée une fonction pour récupérer la définition détaillée d'une table
-- Utile pour l'intégration avec l'IA MPC Server de Supabase

CREATE OR REPLACE FUNCTION get_table_definition(schema_name text, table_name text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result jsonb;
BEGIN
  SELECT jsonb_build_object(
    'table_name', table_name,
    'schema', schema_name,
    'columns', jsonb_agg(
      jsonb_build_object(
        'column_name', column_name,
        'data_type', data_type,
        'is_nullable', is_nullable,
        'column_default', column_default,
        'character_maximum_length', character_maximum_length,
        'numeric_precision', numeric_precision,
        'numeric_scale', numeric_scale,
        'is_identity', is_identity,
        'is_primary_key', (
          SELECT count(*) > 0 
          FROM information_schema.table_constraints tc
          JOIN information_schema.constraint_column_usage ccu 
            ON tc.constraint_name = ccu.constraint_name
            AND tc.table_schema = ccu.table_schema
          WHERE tc.constraint_type = 'PRIMARY KEY'
            AND tc.table_schema = schema_name
            AND tc.table_name = table_name
            AND ccu.column_name = c.column_name
        ),
        'description', col_description(
          (schema_name || '.' || table_name)::regclass::oid, 
          ordinal_position
        )
      )
    ),
    'constraints', (
      SELECT jsonb_agg(
        jsonb_build_object(
          'constraint_name', tc.constraint_name,
          'constraint_type', tc.constraint_type,
          'columns', (
            SELECT jsonb_agg(ccu.column_name)
            FROM information_schema.constraint_column_usage ccu
            WHERE ccu.constraint_name = tc.constraint_name
              AND ccu.table_schema = tc.table_schema
          )
        )
      )
      FROM information_schema.table_constraints tc
      WHERE tc.table_schema = schema_name
        AND tc.table_name = table_name
    ),
    'foreign_keys', (
      SELECT jsonb_agg(
        jsonb_build_object(
          'constraint_name', rc.constraint_name,
          'column_name', kcu.column_name,
          'referenced_table_schema', ccu.table_schema,
          'referenced_table', ccu.table_name,
          'referenced_column', ccu.column_name
        )
      )
      FROM information_schema.referential_constraints rc
      JOIN information_schema.key_column_usage kcu
        ON kcu.constraint_name = rc.constraint_name
        AND kcu.constraint_schema = rc.constraint_schema
      JOIN information_schema.constraint_column_usage ccu
        ON ccu.constraint_name = rc.unique_constraint_name
        AND ccu.constraint_schema = rc.unique_constraint_schema
      WHERE rc.constraint_schema = schema_name
        AND kcu.table_name = table_name
    ),
    'indexes', (
      SELECT jsonb_agg(
        jsonb_build_object(
          'index_name', i.indexname,
          'is_unique', i.indexisunique,
          'definition', pg_get_indexdef(i.indexrelid)
        )
      )
      FROM pg_indexes i
      WHERE i.schemaname = schema_name
        AND i.tablename = table_name
    ),
    'table_description', obj_description(
      (schema_name || '.' || table_name)::regclass::oid, 
      'pg_class'
    )
  ) INTO result
  FROM information_schema.columns c
  WHERE c.table_schema = schema_name
    AND c.table_name = table_name;

  RETURN result;
END;
$$;

-- Ajout des autorisations nécessaires
GRANT EXECUTE ON FUNCTION get_table_definition(text, text) TO service_role;
GRANT EXECUTE ON FUNCTION get_table_definition(text, text) TO authenticated;

-- Commentaire pour la documentation
COMMENT ON FUNCTION get_table_definition(text, text) IS 
'Récupère une définition détaillée d''une table, y compris les colonnes, contraintes, 
clés étrangères et index. Utilisée par l''intégration IA pour fournir le contexte 
nécessaire pour les opérations de modification de schéma.'; 