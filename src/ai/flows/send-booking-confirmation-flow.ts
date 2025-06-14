
'use server';
/**
 * @fileOverview A Genkit flow to generate booking confirmation email content.
 *
 * - generateBookingConfirmationEmail - A function that generates subject and body for a booking confirmation email.
 * - BookingConfirmationInput - The input type for the flow.
 * - BookingConfirmationOutput - The return type for the flow.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { format } from 'date-fns';

const BookingConfirmationInputSchema = z.object({
  listingName: z.string().describe('The name of the service, product, or appointment booked.'),
  listingCategory: z.enum(['Service', 'Product', 'Appointment']).describe('The category of the listing.'),
  userName: z.string().describe("The name of the user who made the booking."),
  bookingDate: z.string().describe("The date of the booking (e.g., 'July 20, 2024')."),
  bookingTime: z.string().optional().describe("The time of the booking (e.g., '10:00 AM'), if applicable."),
});
export type BookingConfirmationInput = z.infer<typeof BookingConfirmationInputSchema>;

const BookingConfirmationOutputSchema = z.object({
  emailSubject: z.string().describe('The subject line for the confirmation email.'),
  emailBody: z.string().describe('The full body content of the confirmation email. Should be friendly, well-formatted, and confirm all booking details.'),
});
export type BookingConfirmationOutput = z.infer<typeof BookingConfirmationOutputSchema>;

export async function generateBookingConfirmationEmail(input: BookingConfirmationInput): Promise<BookingConfirmationOutput> {
  return bookingConfirmationFlow(input);
}

const bookingConfirmationPrompt = ai.definePrompt({
  name: 'bookingConfirmationPrompt',
  input: {schema: BookingConfirmationInputSchema},
  output: {schema: BookingConfirmationOutputSchema},
  prompt: `You are a friendly and helpful assistant for ReserveEase, an online booking system.
Your task is to generate a booking confirmation email based on the details provided.
The email must have a clear subject line and a well-formatted body.

Booking Details:
- Item Name: {{{listingName}}}
- Category: {{{listingCategory}}}
- User Name: {{{userName}}}
- Booking Date: {{{bookingDate}}}
{{#if bookingTime}}
- Preferred Time: {{{bookingTime}}}
{{/if}}

Based on these details, generate:
1.  A suitable subject line for the confirmation email. It should clearly state that the booking is confirmed and mention ReserveEase.
2.  The body of the email. The email should be friendly, enthusiastic, and clearly confirm all the booking details.
    - Start with a greeting to the user (e.g., "Dear {{{userName}}},").
    - If the category is 'Product', mention that their order for '{{{listingName}}}' is confirmed and will be processed/prepared for shipping/collection.
    - If the category is 'Service' or 'Appointment', confirm their booking for '{{{listingName}}}' on {{{bookingDate}}}{{#if bookingTime}} at {{{bookingTime}}}{{/if}}.
    - Reiterate the key details in a clear, easy-to-read format.
    - Thank the user for choosing ReserveEase.
    - End with a positive closing (e.g., "We look forward to serving you!", "Best regards,").
    - Sign off as "The ReserveEase Team".
    - Do NOT include any placeholders like "[Your Company Address]" or generic legal disclaimers.
    - Do NOT ask the user to reply to the email for confirmation. The booking is already confirmed.
`,
});

const bookingConfirmationFlow = ai.defineFlow(
  {
    name: 'bookingConfirmationFlow',
    inputSchema: BookingConfirmationInputSchema,
    outputSchema: BookingConfirmationOutputSchema,
  },
  async (input) => {
    const {output} = await bookingConfirmationPrompt(input);
    if (!output) {
      throw new Error("Failed to generate booking confirmation email content.");
    }
    return output;
  }
);
