import { Component } from '@angular/core';
import { StateWrapperComponent } from '../shared/ui/state-wrapper.component';
import { EmptyStateComponent } from '../shared/ui/empty-state.component';

/**
 * PUBLIC_INTERFACE
 * BookingsPageComponent placeholder for bookings management.
 */
@Component({
  standalone: true,
  imports: [StateWrapperComponent, EmptyStateComponent],
  template: `
    <ui-state-wrapper [loading]="false" [error]="false" [empty]="true" [emptyTitle]="'Bookings'" [emptyDescription]="'You don\\'t have any bookings yet.'">
      <!-- Future bookings list and details go here -->
      <ui-empty-state title="Bookings" description="You don't have any bookings yet."></ui-empty-state>
    </ui-state-wrapper>
  `
})
export class BookingsPageComponent {}
