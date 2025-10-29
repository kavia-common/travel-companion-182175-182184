/* global jasmine */
import { TestBed } from '@angular/core/testing';
import { AuthStore } from './auth.store';
import { UserService } from '../services/user.service';

describe('AuthStore', () => {
  let userService: jasmine.SpyObj<UserService>;

  beforeEach(() => {
    userService = jasmine.createSpyObj<UserService>('UserService', ['getCurrentSession', 'signInWithOAuth', 'signOut']);

    TestBed.configureTestingModule({
      providers: [
        AuthStore,
        { provide: UserService, useValue: userService },
      ],
    });
  });

  it('loadSession success sets session and resets error/loading', async () => {
    userService.getCurrentSession.and.resolveTo({ data: { user: { id: 'u1' } }, error: null });

    const store = TestBed.inject(AuthStore);
    const loadingStates: boolean[] = [];
    store.loading$.subscribe(l => loadingStates.push(l));

    await store.loadSession();

    expect(store.isAuthenticated).toBeTrue();
    expect(store.user?.id).toBe('u1');
    expect(loadingStates[loadingStates.length - 1]).toBeFalse();
  });

  it('loadSession failure sets error and clears session', async () => {
    userService.getCurrentSession.and.resolveTo({ data: null, error: { message: 'failed' } as any });

    const store = TestBed.inject(AuthStore);
    await store.loadSession();

    expect(store.isAuthenticated).toBeFalse();
  });

  it('signInWithOAuth updates loading and surfaces error on failure', async () => {
    userService.signInWithOAuth.and.resolveTo({ data: null, error: { message: 'auth error' } as any });
    const store = TestBed.inject(AuthStore);

    const loading: boolean[] = [];
    store.loading$.subscribe(l => loading.push(l));

    await store.signInWithOAuth('google');

    expect(loading[0]).toBeTrue();
    expect(loading[loading.length - 1]).toBeFalse();
  });

  it('signOut clears session on success', async () => {
    userService.getCurrentSession.and.resolveTo({ data: { user: { id: 'u1' } }, error: null });
    userService.signOut.and.resolveTo({ data: true, error: null });

    const store = TestBed.inject(AuthStore);
    await store.loadSession();
    expect(store.isAuthenticated).toBeTrue();

    await store.signOut();
    expect(store.isAuthenticated).toBeFalse();
    expect(store.user).toBeNull();
  });
});
