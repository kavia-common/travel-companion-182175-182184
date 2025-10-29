import { InjectionToken } from '@angular/core';

/**
 * PUBLIC_INTERFACE
 * Config shape for initializing the Supabase client.
 */
export interface SupabaseConfig {
  /** Supabase project URL (e.g. https://xyzcompany.supabase.co) */
  supabaseUrl: string;
  /** Supabase anon/public key */
  supabaseKey: string;
}

/**
 * PUBLIC_INTERFACE
 * Injection token for providing Supabase configuration from environment.
 */
export const SUPABASE_CONFIG = new InjectionToken<SupabaseConfig>('SUPABASE_CONFIG');

/**
 * PUBLIC_INTERFACE
 * Injection token for the Supabase client instance.
 * Keep the type as any to avoid directly importing supabase-js types until we add the package.
 */
export const SUPABASE_CLIENT = new InjectionToken<any>('SUPABASE_CLIENT');
