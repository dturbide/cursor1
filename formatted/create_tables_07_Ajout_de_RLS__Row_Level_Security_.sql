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