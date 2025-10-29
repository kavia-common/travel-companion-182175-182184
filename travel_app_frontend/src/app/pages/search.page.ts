import { Component } from '@angular/core';
import { EmptyStateComponent } from '../shared/ui/empty-state.component';

/**
 * PUBLIC_INTERFACE
 * SearchPageComponent placeholder for search functionality.
 */
@Component({
  standalone: true,
  imports: [EmptyStateComponent],
  template: `
    <section class="stack">
      <ui-empty-state title="Search trips" description="Search UI will appear here soon."></ui-empty-state>
    </section>
  `,
  styles: [`.stack{display:grid;gap:1rem;}`]
})
export class SearchPageComponent {}
