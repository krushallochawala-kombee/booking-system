'use client'; // Required for useState, useEffect, and client-side actions like re-fetching

import { useEffect, useState, useCallback } from 'react';
import type { Booking } from '@/types';
import BookingItem from '@/components/booking-item';
import { getBookingsAction } from '@/app/actions';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from '@/components/ui/skeleton';
import { Frown } from 'lucide-react';

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchBookings = useCallback(async () => {
    setIsLoading(true);
    const fetchedBookings = await getBookingsAction();
    // Sort bookings by date, most recent first for upcoming, oldest first for past
    fetchedBookings.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    setBookings(fetchedBookings);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const upcomingBookings = bookings.filter(
    (b) => b.status === 'confirmed' && new Date(b.bookingDate) >= new Date(new Date().setHours(0,0,0,0))
  );
  const pastBookings = bookings.filter(
    (b) => b.status !== 'confirmed' || new Date(b.bookingDate) < new Date(new Date().setHours(0,0,0,0))
  );


  const renderBookingList = (list: Booking[], emptyMessage: string) => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(2)].map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      );
    }
    if (list.length === 0) {
      return (
        <div className="text-center py-10 flex flex-col items-center">
          <Frown className="w-16 h-16 text-muted-foreground mb-4" />
          <p className="text-xl text-muted-foreground">{emptyMessage}</p>
        </div>
      );
    }
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {list.map((booking) => (
          <BookingItem key={booking.id} booking={booking} onBookingCancelled={fetchBookings} />
        ))}
      </div>
    );
  };
  
  const CardSkeleton = () => (
    <div className="p-6 border rounded-lg shadow-md space-y-4">
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-10 w-1/3 mt-4" />
    </div>
  );


  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl font-bold font-headline text-primary mb-6">My Bookings</h1>
      </section>

      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:w-1/2 mb-6">
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="past">Past & Cancelled</TabsTrigger>
        </TabsList>
        <TabsContent value="upcoming">
          {renderBookingList(upcomingBookings, "You have no upcoming bookings.")}
        </TabsContent>
        <TabsContent value="past">
          {renderBookingList(pastBookings, "You have no past or cancelled bookings.")}
        </TabsContent>
      </Tabs>
    </div>
  );
}
