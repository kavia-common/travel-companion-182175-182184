import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { environment } from '../environments/environment';
import { SUPABASE_CONFIG } from './core/supabase/supabase.tokens';
import { provideSupabaseClient } from './core/supabase/supabase.client';

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

        if (!supabaseUrl || !supabaseKey) {
          // Do not throw here to allow the app to render; the client factory will throw when used.
          console.warn(
            'Supabase env variables are not set. Set NG_APP_SUPABASE_URL and NG_APP_SUPABASE_KEY in your .env or environment.',
          );
        }

        return {
          supabaseUrl: supabaseUrl ?? '',
          supabaseKey: supabaseKey ?? '',
        };
      },
    },
    provideSupabaseClient(),
  ],
};
