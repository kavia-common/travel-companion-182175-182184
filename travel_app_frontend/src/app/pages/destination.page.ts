import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule, NgIf } from '@angular/common';
import { CardComponent } from '../shared/ui/card.component';
import { StateWrapperComponent } from '../shared/ui/state-wrapper.component';
import { ButtonComponent } from '../shared/ui/button.component';
import { Destination } from '../core/models/destination.model';
import { ItineraryStore, AuthStore } from '../core/store';

/**
 * PUBLIC_INTERFACE
 * DestinationPageComponent displays details for a resolved destination and allows adding it to an itinerary (stub).
 * It expects the route to provide a resolved 'destination' via DestinationResolver.
 */
@Component({
  standalone: true,
  imports: [CommonModule, NgIf, CardComponent, StateWrapperComponent, ButtonComponent],
  template: `
    <ui-state-wrapper [loading]="false" [error]="false" [empty]="!destination()">
      <ng-container *ngIf="destination() as dest">
        <ui-card [title]="dest.name">
          <p *ngIf="dest.city || dest.country" style="color: var(--muted); margin-bottom:.5rem;">
            {{ dest.city || '' }}<span *ngIf="dest.city && dest.country">, </span>{{ dest.country || '' }}
          </p>
          <p>{{ dest.description || 'Coming soon: destination insights, highlights, and activities.' }}</p>

          <div card-actions>
            <ui-button variant="primary" (click)="addToItinerary(dest.id)" [disabled]="!isAuthenticated()">Add to Itinerary</ui-button>
          </div>
        </ui-card>
      </ng-container>
    </ui-state-wrapper>
  `
})
export class DestinationPageComponent {
  private route = inject(ActivatedRoute);
  private itineraryStore = inject(ItineraryStore);
  private auth = inject(AuthStore);

  private destinationSig = signal<Destination | null>(null);

  constructor() {
    const data = this.route.snapshot.data?.['destination'] as Destination | null | undefined;
    this.destinationSig.set(data ?? null);
  }

  // PUBLIC_INTERFACE
  destination = computed(() => this.destinationSig());

  // PUBLIC_INTERFACE
  isAuthenticated(): boolean {
    return this.auth.isAuthenticated;
  }

  // PUBLIC_INTERFACE
  async addToItinerary(destinationId: string): Promise<void> {
    /**
     * Minimal stub to add a new itinerary with a single item referencing this destination.
     * In a full UX, we'd present a picker of itineraries; for now create a quick one.
     */
    const user = this.auth.user;
    if (!user) return;
    await this.itineraryStore.create({
      user_id: user.id,
      title: 'New Trip',
      description: 'Auto-created from destination page',
      start_date: undefined,
      end_date: undefined
    });
    // Optionally we could add an item; keep stub simple.
  }
}
