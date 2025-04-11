export type Locale = 'fr' | 'en';
export type UserRole = 'user' | 'admin' | 'superadmin';

export interface UserProfile {
  id: string;
  email: string;
  role: UserRole;
  organization_id?: string;
  first_name?: string;
  last_name?: string;
  created_at: string;
  updated_at: string;
  is_blocked?: boolean;
  blocked_at?: string;
  block_reason?: string;
  is_active?: boolean;
  deleted?: boolean;
  deleted_at?: string;
  preferred_language: Locale;
}

export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: UserProfile;
        Insert: Omit<UserProfile, 'created_at' | 'updated_at'>;
        Update: Partial<Omit<UserProfile, 'id'>>;
      };
    };
  };
} 