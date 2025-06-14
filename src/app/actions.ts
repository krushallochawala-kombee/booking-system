
'use server';

import type { Booking, Listing } from '@/types';
import { mockListings } from '@/data/mock';
import { revalidatePath } from 'next/cache';
import { generateBookingConfirmationEmail, type BookingConfirmationInput } from '@/ai/flows/send-booking-confirmation-flow';
import { format, parseISO } from 'date-fns';

// This is a mock in-memory store for bookings. In a real app, this would be a database.
let serverBookings: Booking[] = [];

export async function createBookingAction(formData: FormData): Promise<{ success: boolean; message: string; booking?: Booking, emailContent?: {subject: string, body: string} }> {
  try {
    const listingId = formData.get('listingId') as string;
    const listingName = formData.get('listingName') as string;
    const userName = formData.get('userName') as string;
    const userEmail = formData.get('userEmail') as string;
    const bookingDateString = formData.get('bookingDate') as string; // ISO string like "2024-07-27"
    const bookingTime = formData.get('bookingTime') as string | undefined;
    // const notes = formData.get('notes') as string | undefined; // We'll use this later

    if (!listingId || !listingName || !userName || !userEmail || !bookingDateString) {
      return { success: false, message: 'Missing required fields.' };
    }
    
    if (!/\S+@\S+\.\S+/.test(userEmail)) {
        return { success: false, message: 'Invalid email address.' };
    }

    const bookingDateObj = parseISO(bookingDateString);
    if (isNaN(bookingDateObj.getTime())) {
        return { success: false, message: 'Invalid booking date format.' };
    }

    const listingDetails = await getListingByIdAction(listingId);
    if (!listingDetails) {
        return { success: false, message: 'Listing not found. Cannot create booking.' };
    }


    const newBooking: Booking = {
      id: Math.random().toString(36).substr(2, 9),
      listingId,
      listingName,
      userName,
      userEmail,
      bookingDate: bookingDateString, 
      bookingTime: bookingTime || undefined,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    };

    serverBookings.push(newBooking);
    
    revalidatePath('/bookings');
    revalidatePath(`/book/${listingId}`);

    // Generate confirmation email content
    let emailConfirmationContent;
    try {
      const confirmationInput: BookingConfirmationInput = {
        listingName: newBooking.listingName,
        listingCategory: listingDetails.category,
        userName: newBooking.userName,
        bookingDate: format(bookingDateObj, 'PPP'), // Format date for email e.g. "July 20, 2024"
        bookingTime: newBooking.bookingTime,
      };
      emailConfirmationContent = await generateBookingConfirmationEmail(confirmationInput);
      // In a real app, you would now send this email using an email service.
      // For this demo, we'll just return the content.
      console.log('Generated Email Subject:', emailConfirmationContent.emailSubject);
      console.log('Generated Email Body:', emailConfirmationContent.emailBody);
    } catch (emailError) {
      console.error('Error generating booking confirmation email:', emailError);
      // Non-critical error, booking is still made.
    }

    const successMessage = `Booking confirmed successfully for ${listingName}! ${emailConfirmationContent ? 'A confirmation email would be sent.' : 'Could not generate confirmation email content.'}`;

    return { 
      success: true, 
      message: successMessage, 
      booking: newBooking,
      emailContent: emailConfirmationContent 
    };
  } catch (error)
 {
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
    
    const bookingDate = parseISO(serverBookings[bookingIndex].bookingDate);
    if (bookingDate < new Date(new Date().setHours(0,0,0,0)) && serverBookings[bookingIndex].status !== 'confirmed') {
        // More specific check for past non-confirmed bookings if needed
    }


    serverBookings[bookingIndex].status = 'cancelled';
    
    revalidatePath('/bookings'); 

    return { success: true, message: 'Booking cancelled successfully.' };
  } catch (error) {
    console.error('Error cancelling booking:', error);
    return { success: false, message: 'Failed to cancel booking. Please try again.' };
  }
}

export async function getBookingsAction(): Promise<Booking[]> {
  return JSON.parse(JSON.stringify(serverBookings));
}

export async function getListingByIdAction(id: string): Promise<Listing | undefined> {
  return mockListings.find(listing => listing.id === id);
}

export async function getBookedDatesForListingAction(listingId: string): Promise<string[]> {
  return serverBookings
    .filter(booking => booking.listingId === listingId && booking.status === 'confirmed')
    .map(booking => booking.bookingDate); // Ensure these are 'yyyy-MM-dd'
}
