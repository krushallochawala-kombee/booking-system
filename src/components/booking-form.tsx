'use client';

import type React from 'react';
import { useEffect, useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { useRouter } from 'next/navigation';
import type { Listing } from '@/types';
import { createBookingAction, getBookedDatesForListingAction } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from './ui/textarea'; // Assuming you might want a notes field

interface BookingFormProps {
  listing: Listing;
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      Confirm Booking
    </Button>
  );
}

const BookingForm: React.FC<BookingFormProps> = ({ listing }) => {
  const router = useRouter();
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [bookedDates, setBookedDates] = useState<Date[]>([]);
  
  const initialState = { success: false, message: '' };
  const [state, formAction] = useFormState(createBookingAction, initialState);

  useEffect(() => {
    if (state.success && state.message) {
      toast({
        title: 'Success!',
        description: state.message,
        variant: 'default',
      });
      router.push('/bookings');
    } else if (!state.success && state.message) {
      toast({
        title: 'Error',
        description: state.message,
        variant: 'destructive',
      });
    }
  }, [state, router, toast]);

  useEffect(() => {
    async function fetchBookedDates() {
      const dates = await getBookedDatesForListingAction(listing.id);
      setBookedDates(dates.map(d => new Date(d)));
    }
    fetchBookedDates();
  }, [listing.id]);

  return (
    <Card className="w-full max-w-md shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl font-headline text-center">Book: {listing.name}</CardTitle>
      </CardHeader>
      <form action={formAction}>
        <CardContent className="space-y-6">
          <input type="hidden" name="listingId" value={listing.id} />
          <input type="hidden" name="listingName" value={listing.name} />

          <div className="space-y-2">
            <Label htmlFor="userName">Full Name</Label>
            <Input id="userName" name="userName" placeholder="John Doe" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="userEmail">Email Address</Label>
            <Input id="userEmail" name="userEmail" type="email" placeholder="john.doe@example.com" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bookingDate">Select Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !selectedDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  initialFocus
                  disabled={(date) =>
                    date < new Date(new Date().setHours(0,0,0,0)) || // Disable past dates
                    bookedDates.some(bookedDate => 
                      format(bookedDate, "yyyy-MM-dd") === format(date, "yyyy-MM-dd")
                    ) // Disable already booked dates
                  }
                />
              </PopoverContent>
            </Popover>
            {selectedDate && <input type="hidden" name="bookingDate" value={selectedDate.toISOString().split('T')[0]} />}
          </div>

          {listing.category === 'Appointment' && ( // Example: Show time for appointments
            <div className="space-y-2">
              <Label htmlFor="bookingTime">Preferred Time (Optional)</Label>
              <Input id="bookingTime" name="bookingTime" type="time" />
            </div>
          )}
           <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea id="notes" name="notes" placeholder="Any special requests or additional information..." />
          </div>
        </CardContent>
        <CardFooter>
          <SubmitButton />
        </CardFooter>
      </form>
    </Card>
  );
};

export default BookingForm;
