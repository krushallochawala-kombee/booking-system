export interface Listing {
  id: string;
  name: string;
  description: string;
  category: 'Service' | 'Product' | 'Appointment';
  price: number;
  imageUrl: string;
  dataAiHint?: string; // For placeholder image keyword hint
  // For simplicity, we'll manage availability dynamically or assume general availability.
  // Specific available dates or slots can be added here if needed for more complex logic.
  // For example: availableSlots?: { date: string; times: string[] }[];
}

export interface Booking {
  id: string;
  listingId: string;
  listingName: string;
  userName: string;
  userEmail: string;
  bookingDate: string; // ISO string for date
  bookingTime?: string; // e.g., "10:00 AM"
  status: 'confirmed' | 'cancelled' | 'completed';
  createdAt: string; // ISO string
}
