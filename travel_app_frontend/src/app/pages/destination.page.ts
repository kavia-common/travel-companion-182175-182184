import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CardComponent } from '../shared/ui/card.component';
import { StateWrapperComponent } from '../shared/ui/state-wrapper.component';

/**
 * PUBLIC_INTERFACE
 * DestinationPageComponent placeholder for destination details.
 */
@Component({
  standalone: true,
  imports: [CardComponent, StateWrapperComponent],
  template: `
    <ui-state-wrapper [loading]="false" [error]="false" [empty]="false">
      <ui-card [title]="'Destination ' + (id ?? '')">
        <p>Coming soon: destination insights, highlights, and activities.</p>
      </ui-card>
    </ui-state-wrapper>
  `
})
export class DestinationPageComponent {
  id: string | null = null;

  constructor(route: ActivatedRoute) {
    this.id = route.snapshot.paramMap.get('id');
  }
}
