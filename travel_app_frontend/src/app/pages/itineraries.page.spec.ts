/* global jasmine */
import { TestBed } from '@angular/core/testing';
import { ItinerariesPageComponent } from './itineraries.page';
import { ItineraryStore } from '../core/store/itinerary.store';
import { AuthStore } from '../core/store/auth.store';
import { Subject } from 'rxjs';

class ItineraryStoreStub {
  private its = new Subject<any[]>();
  private loading = new Subject<boolean>();
  private error = new Subject<any | null>();

  itineraries$ = this.its.asObservable();
  loading$ = this.loading.asObservable();
  error$ = this.error.asObservable();

  load = jasmine.createSpy('load');
  create = jasmine.createSpy('create');
  update = jasmine.createSpy('update');
  delete = jasmine.createSpy('delete');
}

class AuthStoreStub {
  user = { id: 'u1', email: 'u@example.com' };
  isAuthenticated = true;
}

describe('ItinerariesPageComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItinerariesPageComponent],
      providers: [
        { provide: ItineraryStore, useClass: ItineraryStoreStub },
        { provide: AuthStore, useClass: AuthStoreStub },
      ],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(ItinerariesPageComponent);
    const comp = fixture.componentInstance;
    expect(comp).toBeTruthy();
  });
});
