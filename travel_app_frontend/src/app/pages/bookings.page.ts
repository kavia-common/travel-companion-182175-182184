import { Component } from '@angular/core';
import { EmptyStateComponent } from '../shared/ui/empty-state.component';

/**
 * PUBLIC_INTERFACE
 * BookingsPageComponent placeholder for bookings management.
 */
@Component({
  standalone: true,
  imports: [EmptyStateComponent],
  template: `
    <ui-empty-state title="Bookings" description="You don't have any bookings yet."></ui-empty-state>
  `
})
export class BookingsPageComponent {}
