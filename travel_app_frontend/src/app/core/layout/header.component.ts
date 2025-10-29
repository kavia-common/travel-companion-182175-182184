import { Component, HostListener } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

/**
 * PUBLIC_INTERFACE
 * HeaderComponent renders the top navigation bar with brand and primary routes.
 */
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <header class="header">
      <div class="container">
        <a class="brand" routerLink="/">Travel Companion</a>

        <button class="nav-toggle" (click)="toggleMobileNav()" aria-label="Toggle navigation">
          <span></span><span></span><span></span>
        </button>

        <nav [class.open]="mobileOpen">
          <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact:true}">Home</a>
          <a routerLink="/search" routerLinkActive="active">Search</a>
          <a routerLink="/itineraries" routerLinkActive="active">Itineraries</a>
          <a routerLink="/bookings" routerLinkActive="active">Bookings</a>
        </nav>
      </div>
    </header>
  `,
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  mobileOpen = false;

  // PUBLIC_INTERFACE
  toggleMobileNav(): void {
    /** Toggles the mobile navigation drawer. */
    this.mobileOpen = !this.mobileOpen;
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
