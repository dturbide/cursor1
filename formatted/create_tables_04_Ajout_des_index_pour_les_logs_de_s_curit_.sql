-- Ajout des index pour les logs de sécurité
CREATE INDEX IF NOT EXISTS security_logs_event_type_idx ON public.security_logs(event_type);
CREATE INDEX IF NOT EXISTS security_logs_user_id_idx ON public.security_logs(user_id);
CREATE INDEX IF NOT EXISTS security_logs_created_at_idx ON public.security_logs(created_at);