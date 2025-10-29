import { Component } from '@angular/core';
import { EmptyStateComponent } from '../shared/ui/empty-state.component';

/**
 * PUBLIC_INTERFACE
 * ItinerariesPageComponent placeholder for itinerary list.
 */
@Component({
  standalone: true,
  imports: [EmptyStateComponent],
  template: `
    <ui-empty-state title="Your Itineraries" description="No itineraries yet." actionLabel="Create Itinerary"></ui-empty-state>
  `
})
export class ItinerariesPageComponent {}
