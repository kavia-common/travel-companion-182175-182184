import { Component } from '@angular/core';
import { CardComponent } from '../shared/ui/card.component';
import { ButtonComponent } from '../shared/ui/button.component';
import { RouterLink } from '@angular/router';
import { StateWrapperComponent } from '../shared/ui/state-wrapper.component';

/**
 * PUBLIC_INTERFACE
 * HomePageComponent serves as the landing screen.
 */
@Component({
  standalone: true,
  imports: [CardComponent, ButtonComponent, RouterLink, StateWrapperComponent],
  template: `
    <ui-state-wrapper [loading]="false" [error]="false" [empty]="false">
      <section class="stack">
        <ui-card title="Welcome to Travel Companion">
          <p>Plan itineraries, discover destinations, and manage bookings with an elegant, modern UI.</p>
          <div style="margin-top: .75rem; display:flex; gap:.5rem;">
            <ui-button routerLink="/search" variant="primary">Start Searching</ui-button>
            <ui-button routerLink="/itineraries" variant="ghost">View Itineraries</ui-button>
          </div>
        </ui-card>
      </section>
    </ui-state-wrapper>
  `,
  styles: [`
    .stack { display: grid; gap: 1rem; }
  `]
})
export class HomePageComponent {}
