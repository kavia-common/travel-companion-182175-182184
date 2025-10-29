import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { BehaviorSubject, distinctUntilChanged } from 'rxjs';
import { FriendlyError } from '../supabase/supabase-helpers';
import { SessionInfo, UserProfile } from '../models/user.model';
import { UserService } from '../services/user.service';

/**
 * PUBLIC_INTERFACE
 * AuthStore provides a minimal RxJS/signal based state for authentication.
 * Exposes:
 * - selectors: session$, user$, isAuthenticated$, loading$, error$
 * - actions: loadSession(), signInWithOAuth(), signOut()
 */
@Injectable({ providedIn: 'root' })
export class AuthStore {
  private userService = inject(UserService);

  private sessionSubject = new BehaviorSubject<SessionInfo | null>(null);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private errorSubject = new BehaviorSubject<FriendlyError | null>(null);

  // PUBLIC_INTERFACE
  readonly session$ = this.sessionSubject.asObservable().pipe(distinctUntilChanged());
  // PUBLIC_INTERFACE
  readonly user$ = this.session$.pipe(distinctUntilChanged());
  // PUBLIC_INTERFACE
  readonly isAuthenticated$ = computed(() => !!this.sessionSubject.value?.user);
  // PUBLIC_INTERFACE
  readonly loading$ = this.loadingSubject.asObservable().pipe(distinctUntilChanged());
  // PUBLIC_INTERFACE
  readonly error$ = this.errorSubject.asObservable().pipe(distinctUntilChanged());

  // Also provide signal getters for template or imperative usage
  private sessionSig = signal<SessionInfo | null>(null);
  private loadingSig = signal<boolean>(false);
  private errorSig = signal<FriendlyError | null>(null);

  constructor() {
    // Keep signals in sync with subjects for convenience
    effect(() => {
      const session = this.sessionSubject.value;
      this.sessionSig.set(session);
    });
    effect(() => {
      const loading = this.loadingSubject.value;
      this.loadingSig.set(loading);
    });
    effect(() => {
      const err = this.errorSubject.value;
      this.errorSig.set(err);
    });
  }

  // PUBLIC_INTERFACE
  get session(): SessionInfo | null {
    return this.sessionSig();
  }

  // PUBLIC_INTERFACE
  get user(): UserProfile | null {
    return this.sessionSig()?.user ?? null;
  }

  // PUBLIC_INTERFACE
  get isAuthenticated(): boolean {
    return !!this.sessionSig()?.user;
  }

  // PUBLIC_INTERFACE
  async loadSession(): Promise<void> {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);
    const result = await this.userService.getCurrentSession();
    if (result.error) {
      this.errorSubject.next(result.error);
      this.sessionSubject.next(null);
    } else {
      this.sessionSubject.next(result.data);
    }
    this.loadingSubject.next(false);
  }

  // PUBLIC_INTERFACE
  async signInWithOAuth(provider: 'google' | 'github' | 'gitlab' | 'bitbucket' | string, redirectTo?: string): Promise<void> {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);
    const result = await this.userService.signInWithOAuth(provider, redirectTo);
    if (result.error) {
      this.errorSubject.next(result.error);
    }
    this.loadingSubject.next(false);
  }

  // PUBLIC_INTERFACE
  async signOut(): Promise<void> {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);
    const result = await this.userService.signOut();
    if (result.error) {
      this.errorSubject.next(result.error);
    } else {
      this.sessionSubject.next({ user: null });
    }
    this.loadingSubject.next(false);
  }
}
