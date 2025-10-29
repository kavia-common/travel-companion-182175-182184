import { Component, effect, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './core/layout/header.component';
import { FooterComponent } from './core/layout/footer.component';
import { AuthStore } from './core/store/auth.store';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  // PUBLIC_INTERFACE
  title = 'Travel Companion';

  // Initialize session on app startup; keep a minimal signal if other components want to bind
  private auth = inject(AuthStore);
  sessionLoading = signal<boolean>(false);

  constructor() {
    // Attempt to load session once on bootstrap (safe on SSR)
    Promise.resolve().then(async () => {
      this.sessionLoading.set(true);
      await this.auth.loadSession().catch(() => void 0);
      this.sessionLoading.set(false);
    });

    // Optional effect example; can be used for logging/debugging
    effect(() => {
      const isAuthed = this.auth.isAuthenticated;
      // No-op; placeholder to demonstrate reactivity on auth change
      void isAuthed;
    });
  }
}
