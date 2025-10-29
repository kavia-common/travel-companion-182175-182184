export type BookingStatus = 'pending' | 'confirmed' | 'canceled';

export interface Booking {
  id: string;
  user_id: string;
  itinerary_id?: string;
  destination_id?: string;
  provider?: string; // e.g., airline/hotel/platform
  reference?: string;
  status: BookingStatus;
  check_in?: string;  // ISO datetime
  check_out?: string; // ISO datetime
  created_at?: string;
  updated_at?: string;
}
