import { Injectable } from '@angular/core';
import { Itinerary, ItineraryItem } from '../models/itinerary.model';
import { getSupabaseClient, run, ServiceResult } from '../supabase/supabase-helpers';

/**
 * PUBLIC_INTERFACE
 * ItineraryService manages itineraries and items for a user.
 * Methods:
 * - listByUser(userId)
 * - create/update/delete
 * - addItem/removeItem
 */
@Injectable({ providedIn: 'root' })
export class ItineraryService {
  private supabase = getSupabaseClient();

  // PUBLIC_INTERFACE
  async listByUser(userId: string): Promise<ServiceResult<Itinerary[]>> {
    return run<Itinerary[]>(async () => {
      const { data, error } = await this.supabase
        .from('itineraries')
        .select('*, items:itinerary_items(*)')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      return { data: (data ?? []) as Itinerary[], error };
    }, 'Failed to load your itineraries.');
  }

  // PUBLIC_INTERFACE
  async create(payload: Omit<Itinerary, 'id' | 'items' | 'created_at' | 'updated_at'>): Promise<ServiceResult<Itinerary>> {
    return run<Itinerary>(async () => {
      const { data, error } = await this.supabase.from('itineraries').insert(payload).select('*').single();
      return { data: data as Itinerary, error };
    }, 'Failed to create itinerary.');
  }

  // PUBLIC_INTERFACE
  async update(id: string, changes: Partial<Omit<Itinerary, 'id' | 'user_id' | 'items'>>): Promise<ServiceResult<Itinerary>> {
    return run<Itinerary>(async () => {
      const { data, error } = await this.supabase.from('itineraries').update(changes).eq('id', id).select('*').single();
      return { data: data as Itinerary, error };
    }, 'Failed to update itinerary.');
  }

  // PUBLIC_INTERFACE
  async delete(id: string): Promise<ServiceResult<true>> {
    return run<true>(async () => {
      const { error } = await this.supabase.from('itineraries').delete().eq('id', id);
      return { data: true, error };
    }, 'Failed to delete itinerary.');
  }

  // PUBLIC_INTERFACE
  async addItem(itineraryId: string, item: Omit<ItineraryItem, 'id' | 'itinerary_id' | 'created_at' | 'updated_at'>): Promise<ServiceResult<ItineraryItem>> {
    return run<ItineraryItem>(async () => {
      const payload = { ...item, itinerary_id: itineraryId };
      const { data, error } = await this.supabase.from('itinerary_items').insert(payload).select('*').single();
      return { data: data as ItineraryItem, error };
    }, 'Failed to add item to itinerary.');
  }

  // PUBLIC_INTERFACE
  async removeItem(itemId: string): Promise<ServiceResult<true>> {
    return run<true>(async () => {
      const { error } = await this.supabase.from('itinerary_items').delete().eq('id', itemId);
      return { data: true, error };
    }, 'Failed to remove item from itinerary.');
  }
}
