'use server';

import type { Booking, Listing } from '@/types';
import { mockListings } from '@/data/mock'; // Assuming mockListings might be needed for context
import { revalidatePath } from 'next/cache';

// This is a mock in-memory store for bookings. In a real app, this would be a database.
let serverBookings: Booking[] = [];

export async function createBookingAction(formData: FormData): Promise<{ success: boolean; message: string; booking?: Booking }> {
  try {
    const listingId = formData.get('listingId') as string;
    const listingName = formData.get('listingName') as string;
    const userName = formData.get('userName') as string;
    const userEmail = formData.get('userEmail') as string;
    const bookingDate = formData.get('bookingDate') as string;
    const bookingTime = formData.get('bookingTime') as string | undefined;

    if (!listingId || !listingName || !userName || !userEmail || !bookingDate) {
      return { success: false, message: 'Missing required fields.' };
    }
    
    // Basic email validation
    if (!/\S+@\S+\.\S+/.test(userEmail)) {
        return { success: false, message: 'Invalid email address.' };
    }

    // Basic date validation (check if it's a valid date string)
    if (isNaN(new Date(bookingDate).getTime())) {
        return { success: false, message: 'Invalid booking date.' };
    }


    const newBooking: Booking = {
      id: Math.random().toString(36).substr(2, 9), // Simple unique ID
      listingId,
      listingName,
      userName,
      userEmail,
      bookingDate,
      bookingTime: bookingTime || undefined,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    };

    serverBookings.push(newBooking);
    
    revalidatePath('/bookings'); // Revalidate bookings page to show new booking
    revalidatePath(`/book/${listingId}`); // Revalidate booking page (e.g., for availability)

    return { success: true, message: 'Booking confirmed successfully!', booking: newBooking };
  } catch (error) {
    console.error('Error creating booking:', error);
    return { success: false, message: 'Failed to create booking. Please try again.' };
  }
}

export async function cancelBookingAction(bookingId: string): Promise<{ success: boolean; message: string }> {
  try {
    const bookingIndex = serverBookings.findIndex(b => b.id === bookingId);

    if (bookingIndex === -1) {
      return { success: false, message: 'Booking not found.' };
    }

    if (serverBookings[bookingIndex].status === 'cancelled') {
      return { success: false, message: 'Booking is already cancelled.' };
    }
    
    // Check if booking is in the past (example policy: cannot cancel past bookings)
    const bookingDate = new Date(serverBookings[bookingIndex].bookingDate);
    if (bookingDate < new Date()) {
        // Allow cancellation for demo purposes even if past. In a real app, add stricter policy.
        // return { success: false, message: 'Cannot cancel past bookings.' };
    }


    serverBookings[bookingIndex].status = 'cancelled';
    
    revalidatePath('/bookings'); // Revalidate bookings page to reflect cancellation

    return { success: true, message: 'Booking cancelled successfully.' };
  } catch (error) {
    console.error('Error cancelling booking:', error);
    return { success: false, message: 'Failed to cancel booking. Please try again.' };
  }
}

export async function getBookingsAction(): Promise<Booking[]> {
  // In a real app, you'd fetch this from a database
  // For this mock, we return a copy to prevent direct mutation if ever passed to client components
  return JSON.parse(JSON.stringify(serverBookings));
}

export async function getListingByIdAction(id: string): Promise<Listing | undefined> {
  return mockListings.find(listing => listing.id === id);
}

// Helper to get booked dates for a specific listing (for calendar disabling)
export async function getBookedDatesForListingAction(listingId: string): Promise<string[]> {
  return serverBookings
    .filter(booking => booking.listingId === listingId && booking.status === 'confirmed')
    .map(booking => booking.bookingDate);
}
