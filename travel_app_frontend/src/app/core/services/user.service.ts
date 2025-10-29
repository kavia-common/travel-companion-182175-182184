import { Injectable } from '@angular/core';
import { getSupabaseClient, run, ServiceResult } from '../supabase/supabase-helpers';
import { SessionInfo, UserProfile } from '../models/user.model';

/**
 * PUBLIC_INTERFACE
 * UserService provides methods to manage authentication and session:
 * - getCurrentSession()
 * - signInWithOAuth(provider)
 * - signOut()
 */
@Injectable({ providedIn: 'root' })
export class UserService {
  private supabase = getSupabaseClient();

  // PUBLIC_INTERFACE
  async getCurrentSession(): Promise<ServiceResult<SessionInfo>> {
    return run<SessionInfo>(async () => {
      const { data, error } = await this.supabase.auth.getSession();
      const session = data?.session;
      const user = session?.user
        ? ({
            id: session.user.id,
            email: session.user.email ?? undefined,
            full_name: session.user.user_metadata?.full_name,
            avatar_url: session.user.user_metadata?.avatar_url,
          } as UserProfile)
        : null;

      return {
        data: {
          user,
          access_token: session?.access_token,
          expires_at: session?.expires_at,
        },
        error,
      };
    }, 'Failed to get current session.');
  }

  // PUBLIC_INTERFACE
  async signInWithOAuth(provider: 'google' | 'github' | 'gitlab' | 'bitbucket' | string, redirectTo?: string): Promise<ServiceResult<true>> {
    return run<true>(async () => {
      const origin =
        redirectTo ??
        (typeof globalThis !== 'undefined' && (globalThis as any).window && (globalThis as any).window.location
          ? (globalThis as any).window.location.origin
          : undefined);

      const { error } = await this.supabase.auth.signInWithOAuth({
        provider: provider as any,
        options: {
          redirectTo: origin,
        },
      });
      return { data: true, error };
    }, 'Failed to sign in.');
  }

  // PUBLIC_INTERFACE
  async signOut(): Promise<ServiceResult<true>> {
    return run<true>(async () => {
      const { error } = await this.supabase.auth.signOut();
      return { data: true, error };
    }, 'Failed to sign out.');
  }
}
