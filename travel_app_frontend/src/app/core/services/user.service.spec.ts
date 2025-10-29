/* global jasmine */
import { TestBed } from '@angular/core/testing';
import { UserService } from './user.service';
import { provideMockSupabase, createSupabaseClientMock } from '../../../test-helpers/supabase-mock';

describe('UserService', () => {
  it('should get current session with null user when supabase returns null session', async () => {
    const supabase = createSupabaseClientMock({
      auth: {
        getSession: async () => ({ data: { session: null }, error: null }),
        signInWithOAuth: async () => ({ data: null, error: null }),
        signOut: async () => ({ error: null }),
      }
    });

    TestBed.configureTestingModule({
      providers: [
        UserService,
        ...provideMockSupabase(supabase),
      ],
    });

    const svc = TestBed.inject(UserService);
    const res = await svc.getCurrentSession();
    expect(res.error).toBeNull();
    expect(res.data?.user).toBeNull();
  });

  it('should map session user to UserProfile', async () => {
    const supabase = createSupabaseClientMock({
      auth: {
        getSession: async () => ({
          data: {
            session: {
              user: {
                id: 'u1',
                email: 'u@example.com',
                user_metadata: { full_name: 'User One', avatar_url: 'http://avatar' },
              },
              access_token: 'token',
              expires_at: 1234,
            }
          },
          error: null
        }),
        signInWithOAuth: async () => ({ data: null, error: null }),
        signOut: async () => ({ error: null }),
      }
    });

    TestBed.configureTestingModule({
      providers: [
        UserService,
        ...provideMockSupabase(supabase),
      ],
    });

    const svc = TestBed.inject(UserService);
    const res = await svc.getCurrentSession();
    expect(res.error).toBeNull();
    expect(res.data?.user?.id).toBe('u1');
    expect(res.data?.user?.email).toBe('u@example.com');
    expect(res.data?.user?.full_name).toBe('User One');
    expect(res.data?.access_token).toBe('token');
    expect(res.data?.expires_at).toBe(1234);
  });

  it('should call signInWithOAuth without error', async () => {
    const signInSpy = jasmine.createSpy('signInWithOAuth').and.resolveTo({ data: null, error: null });
    const supabase = createSupabaseClientMock({
      auth: {
        getSession: async () => ({ data: { session: null }, error: null }),
        signInWithOAuth: signInSpy,
        signOut: async () => ({ error: null }),
      }
    });

    TestBed.configureTestingModule({
      providers: [
        UserService,
        ...provideMockSupabase(supabase),
      ],
    });

    const svc = TestBed.inject(UserService);
    const res = await svc.signInWithOAuth('google', 'http://localhost');
    expect(signInSpy).toHaveBeenCalled();
    expect(res.error).toBeNull();
    expect(res.data).toBeTrue();
  });

  it('should sign out successfully', async () => {
    const signOutSpy = jasmine.createSpy('signOut').and.resolveTo({ error: null });
    const supabase = createSupabaseClientMock({
      auth: {
        getSession: async () => ({ data: { session: null }, error: null }),
        signInWithOAuth: async () => ({ data: null, error: null }),
        signOut: signOutSpy,
      }
    });

    TestBed.configureTestingModule({
      providers: [
        UserService,
        ...provideMockSupabase(supabase),
      ],
    });

    const svc = TestBed.inject(UserService);
    const res = await svc.signOut();
    expect(signOutSpy).toHaveBeenCalled();
    expect(res.error).toBeNull();
    expect(res.data).toBeTrue();
  });
});
