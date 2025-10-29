import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, debounceTime, distinctUntilChanged, switchMap, of } from 'rxjs';
import { Destination } from '../models/destination.model';
import { DestinationService } from '../services/destination.service';
import { FriendlyError } from '../supabase/supabase-helpers';

/**
 * PUBLIC_INTERFACE
 * SearchStore manages search query and results for destinations.
 * Exposes:
 * - selectors: query$, results$, loading$, error$
 * - actions: setQuery(), search()
 */
@Injectable({ providedIn: 'root' })
export class SearchStore {
  private destinationService = inject(DestinationService);

  private querySubject = new BehaviorSubject<string>('');
  private resultsSubject = new BehaviorSubject<Destination[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private errorSubject = new BehaviorSubject<FriendlyError | null>(null);

  // PUBLIC_INTERFACE
  readonly query$ = this.querySubject.asObservable().pipe(distinctUntilChanged());
  // PUBLIC_INTERFACE
  readonly results$ = this.resultsSubject.asObservable();
  // PUBLIC_INTERFACE
  readonly loading$ = this.loadingSubject.asObservable().pipe(distinctUntilChanged());
  // PUBLIC_INTERFACE
  readonly error$ = this.errorSubject.asObservable().pipe(distinctUntilChanged());

  constructor() {
    // Auto-perform search when query changes with debounce
    this.query$
      .pipe(
        debounceTime(250),
        distinctUntilChanged(),
        switchMap((q) => {
          this.loadingSubject.next(true);
          this.errorSubject.next(null);
          return this.performSearch(q);
        }),
      )
      .subscribe({
        next: (res) => {
          this.resultsSubject.next(res);
          this.loadingSubject.next(false);
        },
        error: () => {
          // Should not reach here as performSearch handles errors, but keep as safeguard
          this.loadingSubject.next(false);
        },
      });
  }

  // PUBLIC_INTERFACE
  setQuery(q: string): void {
    this.querySubject.next(q ?? '');
  }

  // PUBLIC_INTERFACE
  async search(query?: string): Promise<void> {
    if (typeof query === 'string') {
      this.querySubject.next(query);
      return;
    }
    // If no query provided, trigger with current value
    this.querySubject.next(this.querySubject.value);
  }

  private async performSearchOnce(q: string): Promise<Destination[]> {
    const res = await this.destinationService.searchDestinations(q);
    if (res.error) {
      this.errorSubject.next(res.error);
      return [];
    }
    return res.data ?? [];
  }

  private performSearch(q: string) {
    return of(q).pipe(
      switchMap(async (query) => {
        return this.performSearchOnce(query);
      }),
    );
  }
}
