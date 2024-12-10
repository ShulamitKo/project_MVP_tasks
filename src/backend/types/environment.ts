export interface SupabaseConfig {
  url: string;
  anonKey: string;
}

export interface Environment {
  supabase: SupabaseConfig;
  isProduction: boolean;
} 