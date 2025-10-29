import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, distinctUntilChanged } from 'rxjs';
import { Itinerary, ItineraryItem } from '../models/itinerary.model';
import { FriendlyError } from '../supabase/supabase-helpers';
import { ItineraryService } from '../services/itinerary.service';

/**
 * PUBLIC_INTERFACE
 * ItineraryStore keeps a user's itineraries with loading/error flags.
 * Exposes:
 * - selectors: itineraries$, loading$, error$
 * - actions: load(userId), create(), update(), delete(), addItem(), removeItem()
 */
@Injectable({ providedIn: 'root' })
export class ItineraryStore {
  private service = inject(ItineraryService);

  private itinerariesSubject = new BehaviorSubject<Itinerary[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private errorSubject = new BehaviorSubject<FriendlyError | null>(null);

  // PUBLIC_INTERFACE
  readonly itineraries$ = this.itinerariesSubject.asObservable();
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
      this.itinerariesSubject.next([]);
    } else {
      this.itinerariesSubject.next(res.data ?? []);
    }
    this.loadingSubject.next(false);
  }

  // PUBLIC_INTERFACE
  async create(payload: Omit<Itinerary, 'id' | 'items' | 'created_at' | 'updated_at'>): Promise<void> {
    this.loadingSubject.next(true);
    const res = await this.service.create(payload);
    if (res.error) {
      this.errorSubject.next(res.error);
    } else if (res.data) {
      this.itinerariesSubject.next([res.data, ...this.itinerariesSubject.value]);
    }
    this.loadingSubject.next(false);
  }

  // PUBLIC_INTERFACE
  async update(id: string, changes: Partial<Omit<Itinerary, 'id' | 'user_id' | 'items'>>): Promise<void> {
    this.loadingSubject.next(true);
    const res = await this.service.update(id, changes);
    if (res.error) {
      this.errorSubject.next(res.error);
    } else if (res.data) {
      const items = this.itinerariesSubject.value.map((it) => (it.id === id ? { ...it, ...res.data } : it));
      this.itinerariesSubject.next(items);
    }
    this.loadingSubject.next(false);
  }

  // PUBLIC_INTERFACE
  async delete(id: string): Promise<void> {
    this.loadingSubject.next(true);
    const res = await this.service.delete(id);
    if (res.error) {
      this.errorSubject.next(res.error);
    } else {
      this.itinerariesSubject.next(this.itinerariesSubject.value.filter((it) => it.id !== id));
    }
    this.loadingSubject.next(false);
  }

  // PUBLIC_INTERFACE
  async addItem(itineraryId: string, item: Omit<ItineraryItem, 'id' | 'itinerary_id' | 'created_at' | 'updated_at'>): Promise<void> {
    this.loadingSubject.next(true);
    const res = await this.service.addItem(itineraryId, item);
    if (res.error) {
      this.errorSubject.next(res.error);
    } else if (res.data) {
      const updated = this.itinerariesSubject.value.map((it) =>
        it.id === itineraryId ? { ...it, items: [ ...(it.items ?? []), res.data ] } : it,
      );
      this.itinerariesSubject.next(updated);
    }
    this.loadingSubject.next(false);
  }

  // PUBLIC_INTERFACE
  async removeItem(itemId: string): Promise<void> {
    this.loadingSubject.next(true);
    const res = await this.service.removeItem(itemId);
    if (res.error) {
      this.errorSubject.next(res.error);
    } else {
      const updated = this.itinerariesSubject.value.map((it) => ({
        ...it,
        items: (it.items ?? []).filter((item) => item.id !== itemId),
      }));
      this.itinerariesSubject.next(updated);
    }
    this.loadingSubject.next(false);
  }
}
