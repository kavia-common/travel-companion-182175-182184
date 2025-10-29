/* global jasmine */
import { TestBed } from '@angular/core/testing';
import { SearchStore } from './search.store';
import { DestinationService } from '../services/destination.service';
import { fakeAsync, tick } from '@angular/core/testing';

describe('SearchStore', () => {
  let destinationService: jasmine.SpyObj<DestinationService>;

  beforeEach(() => {
    destinationService = jasmine.createSpyObj<DestinationService>('DestinationService', ['searchDestinations']);

    TestBed.configureTestingModule({
      providers: [
        SearchStore,
        { provide: DestinationService, useValue: destinationService },
      ],
    });
  });

  it('setQuery triggers debounced search and updates results', fakeAsync(() => {
    destinationService.searchDestinations.and.resolveTo({ data: [{ id: 'd1', name: 'Paris' } as any], error: null });

    const store = TestBed.inject(SearchStore);

    const results: any[] = [];
    store.results$.subscribe(r => results.push(r));

    store.setQuery('Par');
    tick(260); // debounceTime 250ms + buffer

    // Resolve async pipeline microtasks
    tick();
    expect(results[results.length - 1]?.[0]?.id).toBe('d1');
  }));

  it('search() without param re-triggers with current query', fakeAsync(() => {
    destinationService.searchDestinations.and.resolveTo({ data: [{ id: 'd2', name: 'Tokyo' } as any], error: null });

    const store = TestBed.inject(SearchStore);
    const results: any[] = [];
    store.results$.subscribe(r => results.push(r));

    store.setQuery('Tok');
    tick(260);
    tick();

    // now call search without changing query
    store.search();
    tick(260);
    tick();

    expect(results[results.length - 1]?.[0]?.id).toBe('d2');
  }));
});
