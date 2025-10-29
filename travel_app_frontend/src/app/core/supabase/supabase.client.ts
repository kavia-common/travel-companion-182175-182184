import { inject } from '@angular/core';
import { SUPABASE_CLIENT, SUPABASE_CONFIG, type SupabaseConfig } from './supabase.tokens';

/**
 * PUBLIC_INTERFACE
 * Factory function that creates and returns a Supabase client instance.
 * Uses dynamic import to avoid build-time coupling if package is not yet installed.
 */
export async function createSupabaseClient() {
  const cfg = inject(SUPABASE_CONFIG) as SupabaseConfig;

  if (!cfg?.supabaseUrl || !cfg?.supabaseKey) {
    // Provide clear guidance for missing configuration.
    throw new Error(
      'Supabase configuration is missing. Ensure NG_APP_SUPABASE_URL and NG_APP_SUPABASE_KEY are set in your environment or .env file.',
    );
  }

  try {
    const { createClient } = await import('@supabase/supabase-js');
    return createClient(cfg.supabaseUrl, cfg.supabaseKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
  } catch (e) {
    // Helpful message if dependency is not installed.
    throw new Error(
      "@supabase/supabase-js is not installed. Install it with: npm install @supabase/supabase-js",
    );
  }
}

/**
 * PUBLIC_INTERFACE
 * Provider factory to plug into Angular DI for SUPABASE_CLIENT token.
 */
export const provideSupabaseClient = () => ({
  provide: SUPABASE_CLIENT,
  useFactory: createSupabaseClient,
});
