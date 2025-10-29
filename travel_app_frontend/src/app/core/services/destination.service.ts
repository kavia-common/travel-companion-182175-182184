import { Injectable } from '@angular/core';
import { Destination } from '../models/destination.model';
import { getSupabaseClient, run, ServiceResult } from '../supabase/supabase-helpers';

/**
 * PUBLIC_INTERFACE
 * DestinationService provides read-only operations for destinations:
 * - searchDestinations(query)
 * - getDestinationById(id)
 * - getFeatured()
 */
@Injectable({ providedIn: 'root' })
export class DestinationService {
  private supabase = getSupabaseClient();

  // PUBLIC_INTERFACE
  async searchDestinations(query: string): Promise<ServiceResult<Destination[]>> {
    const q = query?.trim();
    return run<Destination[]>(async () => {
      const base = this.supabase.from('destinations').select('*').limit(50);
      if (!q) {
        const { data, error } = await base;
        return { data: (data ?? []) as Destination[], error };
      }
      // Using ilike to search name/city/country
      const { data, error } = await base.or(
        `name.ilike.%${q}%,city.ilike.%${q}%,country.ilike.%${q}%`,
      );
      return { data: (data ?? []) as Destination[], error };
    }, 'Failed to search destinations.');
  }

  // PUBLIC_INTERFACE
  async getDestinationById(id: string): Promise<ServiceResult<Destination>> {
    return run<Destination>(async () => {
      const { data, error } = await this.supabase.from('destinations').select('*').eq('id', id).single();
      return { data: data as Destination, error };
    }, 'Failed to load destination.');
  }

  // PUBLIC_INTERFACE
  async getFeatured(): Promise<ServiceResult<Destination[]>> {
    return run<Destination[]>(async () => {
      const { data, error } = await this.supabase.from('destinations').select('*').eq('featured', true).limit(10);
      return { data: (data ?? []) as Destination[], error };
    }, 'Failed to load featured destinations.');
  }
}
