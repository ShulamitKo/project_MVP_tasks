import type { Environment } from '../types/environment';

function validateEnvironmentVariable(key: string, value: string | undefined): string {
  if (!value) {
    throw new Error(`חסר משתנה סביבה הכרחי: ${key}`);
  }
  
  if (value.length < 10) { // בדיקה בסיסית לתקינות
    throw new Error(`משתנה הסביבה ${key} נראה לא תקין`);
  }
  
  return value;
}

function createEnvironment(): Environment {
  // בדיקת סביבת הריצה
  const isProduction = import.meta.env.MODE === 'production';
  
  // בדיקת תקינות משתני הסביבה
  const supabaseUrl = validateEnvironmentVariable(
    'VITE_SUPABASE_URL',
    import.meta.env.VITE_SUPABASE_URL
  );
  
  const supabaseAnonKey = validateEnvironmentVariable(
    'VITE_SUPABASE_ANON_KEY',
    import.meta.env.VITE_SUPABASE_ANON_KEY
  );

  const apiUrl = validateEnvironmentVariable(
    'VITE_API_URL',
    import.meta.env.VITE_API_URL
  );
  
  return {
    isProduction,
    supabase: {
      url: supabaseUrl,
      anonKey: supabaseAnonKey,
    },
    api: {
      baseUrl: apiUrl
    }
  };
}

export const environment = createEnvironment(); 