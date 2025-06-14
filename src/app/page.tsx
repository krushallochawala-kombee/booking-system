import ListingCard from '@/components/listing-card';
import { mockListings } from '@/data/mock';
import type { Listing } from '@/types';

export default function HomePage() {
  const listings: Listing[] = mockListings;

  return (
    <div className="space-y-8">
      <section className="text-center py-8">
        <h1 className="text-4xl font-bold font-headline text-primary mb-4">Find Your Next Experience</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Discover and book amazing services, products, and appointments with ReserveEase. Your seamless booking journey starts here.
        </p>
      </section>

      {listings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-xl text-muted-foreground">No listings available at the moment. Please check back later.</p>
        </div>
      )}
    </div>
  );
}
