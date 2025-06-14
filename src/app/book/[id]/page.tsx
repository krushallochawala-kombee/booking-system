import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getListingByIdAction } from '@/app/actions';
import BookingForm from '@/components/booking-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, Tag, Info } from 'lucide-react';

// Re-defining icons here as they might not be globally accessible or could be styled differently
const ConciergeBellIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M3 20a1 1 0 0 0 1-1v-1a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v1a1 1 0 0 0 1 1 1 1 0 0 0 1-1v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2a1 1 0 0 0 1 1Z"/><path d="M12 12a5.19 5.19 0 0 1 3.9-3.9A5.19 5.19 0 0 1 12 12Zm0 0a5.19 5.19 0 0 0-3.9-3.9A5.19 5.19 0 0 0 12 12Zm0 0A5 5 0 0 0 7 7"/></svg>
);
const ShoppingBagIcon = (props: React.SVGProps<SVGSVGElement>) => (
 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
);
const CalendarDaysIcon = (props: React.SVGProps<SVGSVGElement>) => (
 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/><path d="M16 18h.01"/></svg>
);

interface BookPageProps {
  params: { id: string };
}

export default async function BookPage({ params }: BookPageProps) {
  const listing = await getListingByIdAction(params.id);

  if (!listing) {
    notFound();
  }
  
  const CategoryIcon = ({ category }: { category: typeof listing.category }) => {
    switch (category) {
      case 'Service':
        return <ConciergeBellIcon className="w-5 h-5 text-primary" />;
      case 'Product':
        return <ShoppingBagIcon className="w-5 h-5 text-primary" />;
      case 'Appointment':
        return <CalendarDaysIcon className="w-5 h-5 text-primary" />;
      default:
        return <Tag className="w-5 h-5 text-primary" />;
    }
  };


  return (
    <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start justify-center">
      <Card className="lg:w-1/2 shadow-lg">
        <CardHeader>
          <div className="relative aspect-video w-full overflow-hidden rounded-t-lg">
            <Image
              src={listing.imageUrl}
              alt={listing.name}
              layout="fill"
              objectFit="cover"
              priority
              data-ai-hint={listing.dataAiHint}
            />
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-2 text-primary">
            <CategoryIcon category={listing.category} />
            <span className="font-medium">{listing.category}</span>
          </div>
          <CardTitle className="text-3xl font-headline mb-3">{listing.name}</CardTitle>
          <CardDescription className="text-base text-muted-foreground mb-4 leading-relaxed">
            {listing.description}
          </CardDescription>
          <div className="flex items-center text-2xl font-semibold text-primary">
            <DollarSign className="w-6 h-6 mr-1" />
            {listing.price.toFixed(2)}
          </div>
        </CardContent>
      </Card>

      <div className="lg:w-1/2 flex justify-center lg:justify-start w-full">
        <BookingForm listing={listing} />
      </div>
    </div>
  );
}
