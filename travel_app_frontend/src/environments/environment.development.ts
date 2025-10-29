import type { Environment } from './environment';

/**
 * PUBLIC_INTERFACE
 * Development environment configuration.
 * Reads NG_APP_SUPABASE_URL and NG_APP_SUPABASE_KEY from the environment.
 */
export const environment: Environment = {
  production: false,
  supabaseUrl: (typeof process !== 'undefined' && process?.env && (process.env as any)['NG_APP_SUPABASE_URL']) || undefined,
  supabaseKey: (typeof process !== 'undefined' && process?.env && (process.env as any)['NG_APP_SUPABASE_KEY']) || undefined,
};
