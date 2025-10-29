import { inject } from '@angular/core';
import { SUPABASE_CLIENT } from './supabase.tokens';

/**
 * PUBLIC_INTERFACE
 * FriendlyError represents a normalized, user-friendly error response used throughout the app.
 */
export interface FriendlyError {
  message: string;
  code?: string;
  details?: unknown;
}

/**
 * PUBLIC_INTERFACE
 * Result type for service methods. Ensures consistent error surfaces.
 */
export type ServiceResult<T> = { data: T; error: null } | { data: null; error: FriendlyError };

/**
 * PUBLIC_INTERFACE
 * Returns the injected Supabase client instance from DI.
 */
export function getSupabaseClient(): any {
  const client = inject(SUPABASE_CLIENT, { optional: true });
  if (!client) {
    throw new Error(
      'Supabase client is not available. Ensure provideSupabaseClient() is included in app providers and environment variables are configured.',
    );
  }
  return client;
}

/**
 * Normalize various kinds of thrown or returned errors into a user-friendly error.
 */
export function toFriendlyError(err: unknown, fallbackMessage = 'Something went wrong. Please try again.'): FriendlyError {
  // Supabase error shape: { message, status, code, details, hint }
  if (typeof err === 'object' && err !== null) {
    const anyErr = err as any;
    if (typeof anyErr.message === 'string') {
      return {
        message: anyErr.message || fallbackMessage,
        code: anyErr.code,
        details: { status: anyErr.status, details: anyErr.details, hint: anyErr.hint },
      };
    }
  }

  if (typeof err === 'string') {
    return { message: err };
  }

  return { message: fallbackMessage };
}

/**
 * PUBLIC_INTERFACE
 * Helper to execute an async Supabase operation and standardize the returned result.
 * It catches exceptions and converts Supabase errors to FriendlyError.
 */
export async function run<T>(fn: () => Promise<{ data: T; error?: any } | { data?: T; error: any }>, fallbackMessage?: string): Promise<ServiceResult<T>> {
  try {
    const { data, error } = await fn();
    if (error) {
      return { data: null, error: toFriendlyError(error, fallbackMessage) };
    }
    return { data: data as T, error: null };
  } catch (e) {
    return { data: null, error: toFriendlyError(e, fallbackMessage) };
  }
}

/**
 * PUBLIC_INTERFACE
 * Convenience guard to throw on error in places where exceptions are desired.
 */
export function throwIfError<T>(res: ServiceResult<T>): T {
  if (res.error) {
    const err = new Error(res.error.message);
    (err as any).code = res.error.code;
    (err as any).details = res.error.details;
    throw err;
  }
  return res.data as T;
}
