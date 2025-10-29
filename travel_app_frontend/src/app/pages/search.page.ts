import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { StateWrapperComponent } from '../shared/ui/state-wrapper.component';
import { CardComponent } from '../shared/ui/card.component';
import { ButtonComponent } from '../shared/ui/button.component';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { SearchStore } from '../core/store/search.store';
import { RouterLink } from '@angular/router';

/**
 * PUBLIC_INTERFACE
 * SearchPageComponent wires up to SearchStore to perform queries and render results.
 * - Provides a reactive input bound to the query with debounce via store.
 * - Renders results as cards linking to destination details.
 * - Surfaces loading and error state using StateWrapperComponent.
 */
@Component({
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    StateWrapperComponent,
    CardComponent,
    ButtonComponent,
    RouterLink,
    NgIf,
    NgFor
  ],
  template: `
    <section class="stack">
      <div class="search-bar">
        <input
          [formControl]="queryCtrl"
          type="search"
          placeholder="Search destinations, cities, countries..."
          aria-label="Search destinations"
        />
        <ui-button (click)="triggerSearch()" variant="primary">Search</ui-button>
      </div>

      <ui-state-wrapper
        [loading]="loading()"
        [error]="!!error()"
        [errorMessage]="error()?.message"
        [empty]="!loading() && !error() && results().length === 0"
        [emptyTitle]="'Search trips'"
        [emptyDescription]="'Try a destination like “Tokyo”, “New York”, or “Alps”.'"
      >
        <div class="results" *ngIf="results().length">
          <ui-card
            *ngFor="let d of results()"
            [title]="d.name"
            [clickable]="true"
          >
            <p *ngIf="d.city || d.country" style="color: var(--muted); margin-bottom:.4rem;">
              {{ d.city || '' }}<span *ngIf="d.city && d.country">, </span>{{ d.country || '' }}
            </p>
            <p>{{ d.description || 'Explore this destination.' }}</p>
            <div card-actions>
              <a [routerLink]="['/destinations', d.id]"><ui-button variant="secondary">View</ui-button></a>
            </div>
          </ui-card>
        </div>
      </ui-state-wrapper>
    </section>
  `,
  styles: [`
    .stack{display:grid;gap:1rem;}
    .search-bar{display:flex;gap:.5rem;align-items:center;}
    .search-bar input{
      flex: 1;
      padding: .6rem .75rem;
      border-radius: var(--radius-md);
      border: 1px solid var(--border);
      background: var(--surface);
      outline: none;
    }
    .search-bar input:focus{
      border-color: var(--primary-300);
      box-shadow: 0 0 0 3px var(--primary-100);
    }
    .results{display:grid;gap:.75rem;}
  `]
})
export class SearchPageComponent {
  private store = inject(SearchStore);

  // PUBLIC_INTERFACE
  queryCtrl = new FormControl<string>('', { nonNullable: true });

  loading = signal(false);
  error = signal<{ message: string } | null>(null);
  results = signal<any[]>([]);

  constructor() {
    // Hook store streams to signals for template via async-less usage.
    this.store.loading$.subscribe(l => this.loading.set(l));
    this.store.error$.subscribe(e => this.error.set(e));
    this.store.results$.subscribe(r => this.results.set(r));

    // Update store query as user types
    this.queryCtrl.valueChanges.subscribe(v => this.store.setQuery(v ?? ''));

    // Trigger initial search to show suggestions or featured
    this.store.search('');
  }

  // PUBLIC_INTERFACE
  triggerSearch(): void {
    this.store.search(this.queryCtrl.value);
  }
}
