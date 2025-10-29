/**
 * Test helper: provides a mock Supabase client and config for DI.
 * Ensures tests do not require real Supabase credentials or network.
 */
import { Provider } from '@angular/core';
import { SUPABASE_CLIENT, SUPABASE_CONFIG, SupabaseConfig } from '../app/core/supabase/supabase.tokens';

export type PartialDeep<T> = {
  [K in keyof T]?: T[K] extends object ? PartialDeep<T[K]> : T[K];
};

// A very loose mock to satisfy code paths used by services.
export function createSupabaseClientMock(overrides: any = {}) {
  const base = {
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
      signInWithOAuth: async (_: any) => ({ data: null, error: null }),
      signOut: async () => ({ error: null }),
    },
  };
  return { ...base, ...overrides };
}

export function provideMockSupabase(clientMock?: any, cfg?: PartialDeep<SupabaseConfig>): Provider[] {
  const mock = clientMock ?? createSupabaseClientMock();
  const config: SupabaseConfig = {
    supabaseUrl: (cfg?.supabaseUrl as string) ?? 'http://example.supabase.co',
    supabaseKey: (cfg?.supabaseKey as string) ?? 'test-anon-key',
  };
  return [
    { provide: SUPABASE_CONFIG, useValue: config },
    { provide: SUPABASE_CLIENT, useValue: mock },
  ];
}
