import Image from 'next/image';
import Link from 'next/link';
import type { Listing } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tag, DollarSign, ArrowRight } from 'lucide-react';

interface ListingCardProps {
  listing: Listing;
}

const CategoryIcon = ({ category }: { category: Listing['category'] }) => {
  switch (category) {
    case 'Service':
      return <ConciergeBellIcon className="w-4 h-4 text-primary" />;
    case 'Product':
      return <ShoppingBagIcon className="w-4 h-4 text-primary" />;
    case 'Appointment':
      return <CalendarDaysIcon className="w-4 h-4 text-primary" />;
    default:
      return <Tag className="w-4 h-4 text-primary" />;
  }
};

// SVG Icons for categories (lucide-react doesn't have all these specific ones)
const ConciergeBellIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M3 20a1 1 0 0 0 1-1v-1a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v1a1 1 0 0 0 1 1 1 1 0 0 0 1-1v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2a1 1 0 0 0 1 1Z"/><path d="M12 12a5.19 5.19 0 0 1 3.9-3.9A5.19 5.19 0 0 1 12 12Zm0 0a5.19 5.19 0 0 0-3.9-3.9A5.19 5.19 0 0 0 12 12Zm0 0A5 5 0 0 0 7 7"/></svg>
);
const ShoppingBagIcon = (props: React.SVGProps<SVGSVGElement>) => (
 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
);
const CalendarDaysIcon = (props: React.SVGProps<SVGSVGElement>) => (
 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/><path d="M16 18h.01"/></svg>
);


const ListingCard: React.FC<ListingCardProps> = ({ listing }) => {
  return (
    <Card className="flex flex-col h-full overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg">
      <CardHeader className="p-0">
        <div className="aspect-video relative">
          <Image
            src={listing.imageUrl}
            alt={listing.name}
            layout="fill"
            objectFit="cover"
            data-ai-hint={listing.dataAiHint}
          />
        </div>
      </CardHeader>
      <CardContent className="p-6 flex-grow">
        <div className="flex items-center gap-2 mb-2 text-sm text-muted-foreground">
          <CategoryIcon category={listing.category} />
          <span>{listing.category}</span>
        </div>
        <CardTitle className="text-xl font-headline mb-2">{listing.name}</CardTitle>
        <CardDescription className="text-sm text-muted-foreground line-clamp-3">
          {listing.description}
        </CardDescription>
      </CardContent>
      <CardFooter className="p-6 pt-0 flex justify-between items-center">
        <div className="flex items-center text-primary font-semibold text-lg">
          <DollarSign className="w-5 h-5 mr-1" />
          {listing.price.toFixed(2)}
        </div>
        <Button asChild variant="default" className="bg-primary hover:bg-primary/90 text-primary-foreground">
          <Link href={`/book/${listing.id}`}>
            Book Now <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ListingCard;
