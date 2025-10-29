/* global jasmine */
import { TestBed } from '@angular/core/testing';
import { DestinationPageComponent } from './destination.page';
import { ActivatedRoute } from '@angular/router';
import { ItineraryStore } from '../core/store/itinerary.store';
import { AuthStore } from '../core/store/auth.store';

class ActivatedRouteStub {
  snapshot = {
    data: {
      destination: { id: 'd1', name: 'Paris' }
    }
  };
}

class ItineraryStoreStub {
  create = jasmine.createSpy('create');
}

class AuthStoreStub {
  user = { id: 'u1', email: 'u@example.com' };
  isAuthenticated = true;
}

describe('DestinationPageComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DestinationPageComponent],
      providers: [
        { provide: ActivatedRoute, useClass: ActivatedRouteStub },
        { provide: ItineraryStore, useClass: ItineraryStoreStub },
        { provide: AuthStore, useClass: AuthStoreStub },
      ],
    }).compileComponents();
  });

  it('should render resolved destination name', () => {
    const fixture = TestBed.createComponent(DestinationPageComponent);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent || '').toContain('Paris');
  });
});
