import { ErrorHandler, Injectable, inject } from '@angular/core';
import { ToastService } from '../services/toast.service';
import { toFriendlyError } from '../supabase/supabase-helpers';

/**
 * PUBLIC_INTERFACE
 * GlobalErrorHandler captures uncaught errors and notifies the user via toasts.
 * It keeps console.error logging for developer diagnostics (non-intrusive to end users).
 */
@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  private toast = inject(ToastService);

  handleError(error: unknown): void {
    // Log for devs
    console.error(error);

    // Normalize and surface to user as a non-blocking toast
    const friendly = toFriendlyError(error, 'An unexpected error occurred.');
    this.toast.error(friendly.message, 5000);
  }
}
