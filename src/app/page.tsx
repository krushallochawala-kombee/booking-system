
'use client';

import { useState, useMemo } from 'react';
import ListingCard from '@/components/listing-card';
import { mockListings } from '@/data/mock';
import type { Listing } from '@/types';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter } from 'lucide-react';

// Helper function to get unique categories from listings
const getUniqueCategories = (listings: Listing[]): string[] => {
  const categories = new Set<string>();
  listings.forEach(listing => categories.add(listing.category));
  return Array.from(categories);
};

export default function HomePage() {
  const allListings: Listing[] = mockListings;
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const uniqueCategories = useMemo(() => getUniqueCategories(allListings), [allListings]);

  const filteredListings = useMemo(() => {
    if (selectedCategory === 'all') {
      return allListings;
    }
    return allListings.filter(listing => listing.category === selectedCategory);
  }, [allListings, selectedCategory]);

  return (
    <div className="space-y-8">
      <section className="text-center py-8">
        <h1 className="text-4xl font-bold font-headline text-primary mb-4">Find Your Next Experience</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Discover and book amazing services, products, and appointments with ReserveEase. Your seamless booking journey starts here.
        </p>
      </section>

      <div className="flex flex-col sm:flex-row gap-4 mb-8 items-center">
        <div className="flex items-center gap-2 text-primary font-medium">
          <Filter className="w-5 h-5" />
          <span>Filter by Category:</span>
        </div>
        <Select
          value={selectedCategory}
          onValueChange={(value) => setSelectedCategory(value)}
        >
          <SelectTrigger className="w-full sm:w-[280px] bg-card rounded-md shadow-sm">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {uniqueCategories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {selectedCategory !== 'all' && (
          <Button variant="outline" onClick={() => setSelectedCategory('all')} className="w-full sm:w-auto">
            Clear Filter
          </Button>
        )}
      </div>

      {filteredListings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredListings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-xl text-muted-foreground">
            No listings found for &quot;{selectedCategory}&quot;. Try a different category or clear the filter.
          </p>
        </div>
      )}
    </div>
  );
}
