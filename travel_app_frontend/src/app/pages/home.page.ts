import { Component } from '@angular/core';
import { CardComponent } from '../shared/ui/card.component';
import { ButtonComponent } from '../shared/ui/button.component';
import { RouterLink } from '@angular/router';

/**
 * PUBLIC_INTERFACE
 * HomePageComponent serves as the landing screen.
 */
@Component({
  standalone: true,
  imports: [CardComponent, ButtonComponent, RouterLink],
  template: `
    <section class="stack">
      <ui-card title="Welcome to Travel Companion">
        <p>Plan itineraries, discover destinations, and manage bookings with an elegant, modern UI.</p>
        <div style="margin-top: .75rem; display:flex; gap:.5rem;">
          <ui-button routerLink="/search" variant="primary">Start Searching</ui-button>
          <ui-button routerLink="/itineraries" variant="ghost">View Itineraries</ui-button>
        </div>
      </ui-card>
    </section>
  `,
  styles: [`
    .stack { display: grid; gap: 1rem; }
  `]
})
export class HomePageComponent {}
