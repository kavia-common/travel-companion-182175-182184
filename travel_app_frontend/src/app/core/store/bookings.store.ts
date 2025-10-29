import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, distinctUntilChanged } from 'rxjs';
import { Booking } from '../models/booking.model';
import { FriendlyError } from '../supabase/supabase-helpers';
import { BookingService } from '../services/booking.service';

/**
 * PUBLIC_INTERFACE
 * BookingsStore manages user bookings with loading/error flags.
 * Exposes:
 * - selectors: bookings$, loading$, error$
 * - actions: load(userId), create(), cancel()
 */
@Injectable({ providedIn: 'root' })
export class BookingsStore {
  private service = inject(BookingService);

  private bookingsSubject = new BehaviorSubject<Booking[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private errorSubject = new BehaviorSubject<FriendlyError | null>(null);

  // PUBLIC_INTERFACE
  readonly bookings$ = this.bookingsSubject.asObservable();
  // PUBLIC_INTERFACE
  readonly loading$ = this.loadingSubject.asObservable().pipe(distinctUntilChanged());
  // PUBLIC_INTERFACE
  readonly error$ = this.errorSubject.asObservable().pipe(distinctUntilChanged());

  // PUBLIC_INTERFACE
  async load(userId: string): Promise<void> {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);
    const res = await this.service.listByUser(userId);
    if (res.error) {
      this.errorSubject.next(res.error);
      this.bookingsSubject.next([]);
    } else {
      this.bookingsSubject.next(res.data ?? []);
    }
    this.loadingSubject.next(false);
  }

  // PUBLIC_INTERFACE
  async create(payload: Omit<Booking, 'id' | 'status' | 'created_at' | 'updated_at'> & { status?: Booking['status'] }): Promise<void> {
    this.loadingSubject.next(true);
    const res = await this.service.create(payload);
    if (res.error) {
      this.errorSubject.next(res.error);
    } else if (res.data) {
      this.bookingsSubject.next([res.data, ...this.bookingsSubject.value]);
    }
    this.loadingSubject.next(false);
  }

  // PUBLIC_INTERFACE
  async cancel(bookingId: string): Promise<void> {
    this.loadingSubject.next(true);
    const res = await this.service.cancel(bookingId);
    if (res.error) {
      this.errorSubject.next(res.error);
    } else if (res.data) {
      const updated = this.bookingsSubject.value.map((b) => (b.id === bookingId ? res.data! : b));
      this.bookingsSubject.next(updated);
    }
    this.loadingSubject.next(false);
  }
}
