import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthStore } from '../store/auth.store';

/**
 * PUBLIC_INTERFACE
 * AuthGuard checks if a user is authenticated.
 * - If session is unknown, tries to load it.
 * - If not authenticated, redirects to '/' and blocks navigation.
 */
export const AuthGuard: CanActivateFn = async () => {
  const auth = inject(AuthStore);
  const router = inject(Router);

  // If we don't have session info yet, try loading it
  if (auth.session === null) {
    try {
      await auth.loadSession();
    } catch {
      /* swallow */
    }
  }

  if (auth.isAuthenticated) {
    return true;
  }

  // Redirect to home (or login page if added later)
  await router.navigateByUrl('/');
  return false;
};
