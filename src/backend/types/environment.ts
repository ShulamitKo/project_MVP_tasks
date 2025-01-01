export interface SupabaseConfig {
  url: string;
  anonKey: string;
}

export interface ApiConfig {
  baseUrl: string;
}

export interface Environment {
  supabase: SupabaseConfig;
  api: ApiConfig;
  isProduction: boolean;
} 