import { Component } from '@angular/core';
import { ButtonComponent } from '../shared/ui/button.component';
import { RouterLink } from '@angular/router';
import { StateWrapperComponent } from '../shared/ui/state-wrapper.component';

/**
 * PUBLIC_INTERFACE
 * NotFoundPageComponent displays for unknown routes.
 */
@Component({
  standalone: true,
  imports: [ButtonComponent, RouterLink, StateWrapperComponent],
  template: `
    <ui-state-wrapper [loading]="false" [error]="false" [empty]="false">
      <section class="not-found">
        <h1>404</h1>
        <p>We couldn’t find the page you’re looking for.</p>
        <ui-button routerLink="/" variant="primary">Go Home</ui-button>
      </section>
    </ui-state-wrapper>
  `,
  styles: [`
    .not-found {
      text-align: center;
      padding: 2rem 1rem;
      color: var(--muted);
    }
    h1 {
      color: var(--primary-700);
      font-size: 3rem;
      margin-bottom: .25rem;
    }
  `]
})
export class NotFoundPageComponent {}
