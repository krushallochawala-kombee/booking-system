'use client';

import type React from 'react';
import type { Booking } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock, CheckCircle, XCircle, Hourglass, Tag, User, Mail, Loader2 } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { cancelBookingAction } from '@/app/actions';
import { useState } from 'react';

interface BookingItemProps {
  booking: Booking;
  onBookingCancelled: () => void; // Callback to refresh list
}

const BookingItem: React.FC<BookingItemProps> = ({ booking, onBookingCancelled }) => {
  const { toast } = useToast();
  const [isCancelling, setIsCancelling] = useState(false);

  const handleCancel = async () => {
    setIsCancelling(true);
    const result = await cancelBookingAction(booking.id);
    if (result.success) {
      toast({
        title: 'Success!',
        description: result.message,
      });
      onBookingCancelled(); // Trigger list refresh
    } else {
      toast({
        title: 'Error',
        description: result.message,
        variant: 'destructive',
      });
    }
    setIsCancelling(false);
  };

  const getStatusIcon = (status: Booking['status']) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'completed':
        return <Hourglass className="w-5 h-5 text-blue-500" />; // Assuming 'completed' might look like pending fulfillment or past
      default:
        return <Tag className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const bookingDate = parseISO(booking.bookingDate);
  const isPastBooking = bookingDate < new Date() && booking.status !== 'cancelled';


  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="text-xl font-headline flex justify-between items-center">
          {booking.listingName}
          {getStatusIcon(booking.status)}
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          Booking ID: {booking.id}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-primary" />
          <span>Date: {format(bookingDate, 'PPP')}</span>
        </div>
        {booking.bookingTime && (
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary" />
            <span>Time: {booking.bookingTime}</span>
          </div>
        )}
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-primary" />
          <span>Booked by: {booking.userName}</span>
        </div>
        <div className="flex items-center gap-2">
          <Mail className="w-4 h-4 text-primary" />
          <span>Email: {booking.userEmail}</span>
        </div>
        <div className="flex items-center gap-2 capitalize">
          {getStatusIcon(booking.status)}
          <span>Status: <span className={`font-semibold ${booking.status === 'confirmed' ? 'text-green-600' : booking.status === 'cancelled' ? 'text-red-600' : 'text-blue-600'}`}>{booking.status}</span></span>
        </div>
      </CardContent>
      <CardFooter>
        {booking.status === 'confirmed' && !isPastBooking && (
          <Button
            variant="destructive"
            size="sm"
            onClick={handleCancel}
            disabled={isCancelling}
            aria-label={`Cancel booking for ${booking.listingName}`}
          >
            {isCancelling && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Cancel Booking
          </Button>
        )}
         {isPastBooking && booking.status !== 'cancelled' && (
           <span className="text-sm text-muted-foreground italic">This booking is in the past.</span>
         )}
         {booking.status === 'cancelled' && (
           <span className="text-sm text-red-500 italic">This booking has been cancelled.</span>
         )}
      </CardFooter>
    </Card>
  );
};

export default BookingItem;
