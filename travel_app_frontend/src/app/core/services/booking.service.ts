import { Injectable } from '@angular/core';
import { Booking } from '../models/booking.model';
import { getSupabaseClient, run, ServiceResult } from '../supabase/supabase-helpers';

/**
 * PUBLIC_INTERFACE
 * BookingService handles booking operations:
 * - listByUser(userId)
 * - create
 * - cancel
 */
@Injectable({ providedIn: 'root' })
export class BookingService {
  private supabase = getSupabaseClient();

  // PUBLIC_INTERFACE
  async listByUser(userId: string): Promise<ServiceResult<Booking[]>> {
    return run<Booking[]>(async () => {
      const { data, error } = await this.supabase
        .from('bookings')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      return { data: (data ?? []) as Booking[], error };
    }, 'Failed to load your bookings.');
  }

  // PUBLIC_INTERFACE
  async create(payload: Omit<Booking, 'id' | 'status' | 'created_at' | 'updated_at'> & { status?: Booking['status'] }): Promise<ServiceResult<Booking>> {
    return run<Booking>(async () => {
      const { data, error } = await this.supabase
        .from('bookings')
        .insert({ status: 'pending', ...payload })
        .select('*')
        .single();
      return { data: data as Booking, error };
    }, 'Failed to create booking.');
  }

  // PUBLIC_INTERFACE
  async cancel(bookingId: string): Promise<ServiceResult<Booking>> {
    return run<Booking>(async () => {
      const { data, error } = await this.supabase
        .from('bookings')
        .update({ status: 'canceled' })
        .eq('id', bookingId)
        .select('*')
        .single();
      return { data: data as Booking, error };
    }, 'Failed to cancel booking.');
  }
}
