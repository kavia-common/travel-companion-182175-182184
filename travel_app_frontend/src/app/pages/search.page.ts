import { Component } from '@angular/core';
import { StateWrapperComponent } from '../shared/ui/state-wrapper.component';
import { EmptyStateComponent } from '../shared/ui/empty-state.component';

/**
 * PUBLIC_INTERFACE
 * SearchPageComponent placeholder for search functionality.
 */
@Component({
  standalone: true,
  imports: [StateWrapperComponent, EmptyStateComponent],
  template: `
    <ui-state-wrapper [loading]="false" [error]="false" [empty]="true" [emptyTitle]="'Search trips'" [emptyDescription]="'Search UI will appear here soon.'">
      <section class="stack">
        <!-- Future search form and results go here -->
      </section>
    </ui-state-wrapper>
  `,
  styles: [`.stack{display:grid;gap:1rem;}`]
})
export class SearchPageComponent {}
