import { inject } from '@angular/core';
import { SUPABASE_CLIENT, SUPABASE_CONFIG, type SupabaseConfig } from './supabase.tokens';

/**
 * PUBLIC_INTERFACE
 * Factory function that creates and returns a Supabase client instance.
 * Uses dynamic import to avoid build-time coupling if package is not yet installed.
 * During Angular prerender/build (SSR), returns a minimal no-op client to avoid env-related crashes.
 */
export async function createSupabaseClient() {
  const cfg = inject(SUPABASE_CONFIG) as SupabaseConfig;

  // Detect SSR/prerender build environment (no window) vs browser
  const isBrowser = typeof globalThis !== 'undefined' && typeof (globalThis as any).window !== 'undefined';
  const isNodeLike = !isBrowser;

  if (!cfg?.supabaseUrl || !cfg?.supabaseKey) {
    // One-time diagnostics: show where we looked and how to fix
    try {
      const g: any = typeof globalThis !== 'undefined' ? globalThis : undefined;
      const w = g && typeof g.window !== 'undefined' ? g.window : g;
      const sources: string[] = [];
      if (w && (typeof (w as any).NG_APP_SUPABASE_URL === 'string' || typeof (w as any).NG_APP_SUPABASE_KEY === 'string')) {
        sources.push('window.NG_APP_*');
      }
      // Only reference document in browsers to avoid no-undef in SSR
      const hasDocument = typeof g !== 'undefined' && g && typeof (g as any).document !== 'undefined';
      if (hasDocument) {
        const d = (g as any).document as any;
        const m1 = d.querySelector('meta[name="ng-app-supabase-url"]');
        const m2 = d.querySelector('meta[name="ng-app-supabase-key"]');
        if (m1 || m2) sources.push('meta tags');
      }
      if (typeof process !== 'undefined' && (process as any).env) {
        sources.push('process.env');
      }
      // eslint-disable-next-line no-console
      console.warn(
        '[Supabase] Missing credentials. Looked at:',
        sources.join(', ') || 'none',
        'Expected either window.NG_APP_SUPABASE_URL/KEY set by index.html injector, meta[name="ng-app-supabase-url|key"], or process.env NG_APP_SUPABASE_URL/KEY during SSR.',
      );
    } catch { /* ignore */ }

    if (isNodeLike) {
      // Return a no-op mock client to allow builds/prerendering without credentials.
      return {
        from: () => ({
          select: () => ({ single: async () => ({ data: null, error: null }), limit: () => ({ data: [], error: null }), order: () => ({ data: [], error: null }), eq: () => ({ data: [], error: null }), or: () => ({ data: [], error: null }) }),
          insert: () => ({ select: () => ({ single: async () => ({ data: null, error: null }) }) }),
          update: () => ({ eq: () => ({ select: () => ({ single: async () => ({ data: null, error: null }) }) }) }),
          delete: () => ({ eq: async () => ({ data: null, error: null }) }),
          order: () => ({ data: [], error: null }),
          eq: () => ({ data: [], error: null }),
        }),
        auth: {
          getSession: async () => ({ data: { session: null }, error: null }),
          signInWithOAuth: async () => ({ data: null, error: null }),
          signOut: async () => ({ error: null }),
        },
      };
    }
    // On browser at runtime, we want a clear error.
    throw new Error(
      'Supabase configuration is missing. Ensure NG_APP_SUPABASE_URL and NG_APP_SUPABASE_KEY are set. At runtime, index.html should inject window.NG_APP_* or meta[name=\"ng-app-supabase-*\"] values.',
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
