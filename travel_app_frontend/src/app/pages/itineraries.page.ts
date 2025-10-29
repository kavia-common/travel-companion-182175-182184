import { Component } from '@angular/core';
import { StateWrapperComponent } from '../shared/ui/state-wrapper.component';
import { EmptyStateComponent } from '../shared/ui/empty-state.component';

/**
 * PUBLIC_INTERFACE
 * ItinerariesPageComponent placeholder for itinerary list.
 */
@Component({
  standalone: true,
  imports: [StateWrapperComponent, EmptyStateComponent],
  template: `
    <ui-state-wrapper [loading]="false" [error]="false" [empty]="true" [emptyTitle]="'Your Itineraries'" [emptyDescription]="'No itineraries yet.'">
      <!-- Future itineraries list goes here -->
      <ui-empty-state title="Your Itineraries" description="No itineraries yet." actionLabel="Create Itinerary"></ui-empty-state>
    </ui-state-wrapper>
  `
})
export class ItinerariesPageComponent {}
