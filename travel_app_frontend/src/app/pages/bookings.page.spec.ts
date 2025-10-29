/* global jasmine */
import { TestBed } from '@angular/core/testing';
import { BookingsPageComponent } from './bookings.page';
import { BookingsStore } from '../core/store/bookings.store';
import { AuthStore } from '../core/store/auth.store';
import { Subject } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';

class BookingsStoreStub {
  private list = new Subject<any[]>();
  private loading = new Subject<boolean>();
  private error = new Subject<any | null>();

  bookings$ = this.list.asObservable();
  loading$ = this.loading.asObservable();
  error$ = this.error.asObservable();

  load = jasmine.createSpy('load');
  create = jasmine.createSpy('create');
  cancel = jasmine.createSpy('cancel');
}

class AuthStoreStub {
  user = { id: 'u1', email: 'u@example.com' };
  isAuthenticated = true;
}

describe('BookingsPageComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookingsPageComponent, ReactiveFormsModule],
      providers: [
        { provide: BookingsStore, useClass: BookingsStoreStub },
        { provide: AuthStore, useClass: AuthStoreStub },
      ],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(BookingsPageComponent);
    const comp = fixture.componentInstance;
    expect(comp).toBeTruthy();
  });
});
