import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CardComponent } from '../shared/ui/card.component';

/**
 * PUBLIC_INTERFACE
 * DestinationPageComponent placeholder for destination details.
 */
@Component({
  standalone: true,
  imports: [CardComponent],
  template: `
    <ui-card [title]="'Destination ' + (id ?? '')">
      <p>Coming soon: destination insights, highlights, and activities.</p>
    </ui-card>
  `
})
export class DestinationPageComponent {
  id: string | null = null;

  constructor(route: ActivatedRoute) {
    this.id = route.snapshot.paramMap.get('id');
  }
}
