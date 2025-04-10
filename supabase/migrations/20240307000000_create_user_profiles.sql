-- Create enum for user roles
CREATE TYPE user_role AS ENUM ('superadmin', 'admin', 'employee');

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    role user_role NOT NULL DEFAULT 'employee',
    organization_id UUID,
    first_name TEXT,
    last_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create RLS policies
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Policy for users to view their own profile
CREATE POLICY "Users can view own profile"
    ON user_profiles FOR SELECT
    TO authenticated
    USING (auth.uid() = id);

-- Policy for superadmins to view all profiles
CREATE POLICY "Superadmins can view all profiles"
    ON user_profiles FOR ALL
    TO authenticated
    USING (
        auth.jwt() ->> 'role' = 'superadmin'
    );

-- Function to handle user creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO user_profiles (id, email, role)
    VALUES (new.id, new.email, 'employee');
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user creation
CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Insert initial superadmin if not exists
INSERT INTO user_profiles (id, email, role)
SELECT id, email, 'superadmin'::user_role
FROM auth.users
WHERE email = 'denturbide@gmail.com'
ON CONFLICT (id) DO UPDATE
SET role = 'superadmin'
WHERE user_profiles.email = 'denturbide@gmail.com'; 