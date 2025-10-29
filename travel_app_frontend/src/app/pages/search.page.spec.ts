import { TestBed } from '@angular/core/testing';
import { SearchPageComponent } from './search.page';
import { SearchStore } from '../core/store/search.store';
import { of, Subject } from 'rxjs';

class SearchStoreStub {
  private resultsSub = new Subject<any[]>();
  private loadingSub = new Subject<boolean>();
  private errorSub = new Subject<any | null>();

  results$ = this.resultsSub.asObservable();
  loading$ = this.loadingSub.asObservable();
  error$ = this.errorSub.asObservable();

  setQuery(q: string) { /* no-op */ }
  search(q?: string) { /* no-op */ }

  // helpers
  pushResults(r: any[]) { this.resultsSub.next(r); }
  setLoading(v: boolean) { this.loadingSub.next(v); }
  setError(e: any | null) { this.errorSub.next(e); }
}

describe('SearchPageComponent', () => {
  let store: SearchStoreStub;

  beforeEach(async () => {
    store = new SearchStoreStub();

    await TestBed.configureTestingModule({
      imports: [SearchPageComponent],
      providers: [
        { provide: SearchStore, useValue: store }
      ],
    }).compileComponents();
  });

  it('should create and bind to store', () => {
    const fixture = TestBed.createComponent(SearchPageComponent);
    const comp = fixture.componentInstance;
    expect(comp).toBeTruthy();

    // Simulate store updates
    store.setLoading(true);
    store.pushResults([{ id: 'd1', name: 'Paris' }]);
    store.setLoading(false);

    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent || '').toContain('Paris');
  });
});
