import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CardComponent } from '../shared/ui/card.component';
import { StateWrapperComponent } from '../shared/ui/state-wrapper.component';
import { Destination } from '../core/models/destination.model';

/**
 * PUBLIC_INTERFACE
 * DestinationPageComponent displays details for a resolved destination.
 * It expects the route to provide a resolved 'destination' via DestinationResolver.
 */
@Component({
  standalone: true,
  imports: [CardComponent, StateWrapperComponent],
  template: `
    <ui-state-wrapper [loading]="false" [error]="false" [empty]="!destination()">
      <ng-container *ngIf="destination() as dest">
        <ui-card [title]="dest.name">
          <p *ngIf="dest.city || dest.country" style="color: var(--muted); margin-bottom:.5rem;">
            {{ dest.city || '' }}<span *ngIf="dest.city && dest.country">, </span>{{ dest.country || '' }}
          </p>
          <p>{{ dest.description || 'Coming soon: destination insights, highlights, and activities.' }}</p>
        </ui-card>
      </ng-container>
    </ui-state-wrapper>
  `
})
export class DestinationPageComponent {
  private route = inject(ActivatedRoute);
  private destinationSig = signal<Destination | null>(null);

  constructor() {
    const data = this.route.snapshot.data?.['destination'] as Destination | null | undefined;
    this.destinationSig.set(data ?? null);
  }

  // PUBLIC_INTERFACE
  destination = computed(() => this.destinationSig());
}
