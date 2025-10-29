import { Component, HostListener, computed, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthStore } from '../store/auth.store';
import { ButtonComponent } from '../../shared/ui/button.component';

/**
 * PUBLIC_INTERFACE
 * HeaderComponent renders the top navigation bar with brand, primary routes,
 * and session controls (sign in/out). Sign in uses an OAuth placeholder (Google).
 */
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, ButtonComponent],
  template: `
    <header class="header">
      <div class="container">
        <a class="brand" routerLink="/">Travel Companion</a>

        <button
          class="nav-toggle"
          (click)="toggleMobileNav()"
          aria-label="Toggle navigation"
          [attr.aria-expanded]="mobileOpen"
          aria-controls="primary-navigation"
        >
          <span></span><span></span><span></span>
        </button>

        <nav [class.open]="mobileOpen" id="primary-navigation">
          <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact:true}">Home</a>
          <a routerLink="/search" routerLinkActive="active">Search</a>
          <a routerLink="/itineraries" routerLinkActive="active">Itineraries</a>
          <a routerLink="/bookings" routerLinkActive="active">Bookings</a>

          <span style="flex:1"></span>

          <ng-container *ngIf="isAuthenticated(); else guest">
            <span style="color: var(--muted); margin-right: .5rem;">
              {{ displayName() }}
            </span>
            <ui-button variant="ghost" (click)="signOut()" [disabled]="loading()">Sign out</ui-button>
          </ng-container>
          <ng-template #guest>
            <ui-button variant="secondary" (click)="signIn()" [disabled]="loading()">Sign in</ui-button>
          </ng-template>
        </nav>
      </div>
    </header>
  `,
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  private auth = inject(AuthStore);

  mobileOpen = false;

  // Keep a simple loading signal mirrored from store
  private loadingSig = signal<boolean>(false);

  constructor() {
    this.auth.loading$.subscribe(l => this.loadingSig.set(l));
  }

  // PUBLIC_INTERFACE
  toggleMobileNav(): void {
    /** Toggles the mobile navigation drawer. */
    this.mobileOpen = !this.mobileOpen;
  }

  // PUBLIC_INTERFACE
  isAuthenticated(): boolean {
    return this.auth.isAuthenticated;
  }

  // PUBLIC_INTERFACE
  displayName = computed(() => {
    const u = this.auth.user;
    return u?.full_name || u?.email || 'Signed in';
  });

  // PUBLIC_INTERFACE
  loading = computed(() => this.loadingSig());

  // PUBLIC_INTERFACE
  async signIn(): Promise<void> {
    // Use Google OAuth by default; redirect back to current origin
    await this.auth.signInWithOAuth('google');
  }

  // PUBLIC_INTERFACE
  async signOut(): Promise<void> {
    await this.auth.signOut();
  }

  @HostListener('window:resize')
  onResize(): void {
    // Guard against SSR and lint no-undef by using matchMedia which is optional in Node
    const canCheck = typeof globalThis !== 'undefined' && typeof (globalThis as any).matchMedia === 'function';
    if (canCheck) {
      const mq = (globalThis as any).matchMedia('(min-width: 769px)');
      if (mq.matches && this.mobileOpen) {
        this.mobileOpen = false;
      }
    }
  }
}
