import { ApplicationConfig, ErrorHandler, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { environment } from '../environments/environment';
import { SUPABASE_CONFIG } from './core/supabase/supabase.tokens';
import { provideSupabaseClient } from './core/supabase/supabase.client';
import { GlobalErrorHandler } from './core/errors/error-handler';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    // Provide Supabase configuration and client
    {
      provide: SUPABASE_CONFIG,
      useFactory: () => {
        const supabaseUrl = environment.supabaseUrl;
        const supabaseKey = environment.supabaseKey;

        const isBrowser = typeof globalThis !== 'undefined' && typeof (globalThis as any).window !== 'undefined';
        // Minimal diagnostics once on boot
        try {
          const src = isBrowser ? 'browser-global/window' : 'process.env';
          if (!supabaseUrl || !supabaseKey) {
            console.warn(`[Supabase] Missing credentials from ${src}. Ensure NG_APP_SUPABASE_URL and NG_APP_SUPABASE_KEY are set.`);
          } else {
            console.info('[Supabase] Credentials detected from', src);
          }
        } catch {
          // silent
        }

        return {
          supabaseUrl: supabaseUrl ?? '',
          supabaseKey: supabaseKey ?? '',
        };
      },
    },
    provideSupabaseClient(),
    // Global error handling -> toasts
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
  ],
};
