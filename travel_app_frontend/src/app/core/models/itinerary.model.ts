export interface ItineraryItem {
  id: string;
  itinerary_id: string;
  title: string;
  description?: string;
  date?: string; // ISO date
  sort_order?: number;
  created_at?: string;
  updated_at?: string;
}

export interface Itinerary {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  start_date?: string; // ISO date
  end_date?: string;   // ISO date
  items?: ItineraryItem[];
  created_at?: string;
  updated_at?: string;
}
