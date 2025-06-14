import type { Listing, Booking } from '@/types';

export const mockListings: Listing[] = [
  {
    id: '1',
    name: 'Luxury Spa Package',
    description: 'A full day of relaxation and pampering including massage, facial, and mani-pedi.',
    category: 'Service',
    price: 199.99,
    imageUrl: 'https://placehold.co/600x400.png',
    dataAiHint: 'spa relaxation',
  },
  {
    id: '2',
    name: 'Professional Headshots',
    description: 'One hour photoshoot session with a professional photographer. Includes 5 edited digital prints.',
    category: 'Appointment',
    price: 150.00,
    imageUrl: 'https://placehold.co/600x400.png',
    dataAiHint: 'photography studio',
  },
  {
    id: '3',
    name: 'Artisan Coffee Beans',
    description: '1kg bag of freshly roasted, ethically sourced artisan coffee beans. Various roasts available.',
    category: 'Product',
    price: 25.50,
    imageUrl: 'https://placehold.co/600x400.png',
    dataAiHint: 'coffee beans',
  },
  {
    id: '4',
    name: 'Yoga Class Pass',
    description: 'Access to any 5 yoga classes within a month. Suitable for all levels.',
    category: 'Service',
    price: 75.00,
    imageUrl: 'https://placehold.co/600x400.png',
    dataAiHint: 'yoga class',
  },
  {
    id: '5',
    name: 'Dental Check-up',
    description: 'Comprehensive dental examination and cleaning with our expert dentists.',
    category: 'Appointment',
    price: 90.00,
    imageUrl: 'https://placehold.co/600x400.png',
    dataAiHint: 'dentist office',
  },
  {
    id: '6',
    name: 'Handmade Pottery Vase',
    description: 'Beautifully crafted ceramic vase, perfect for home decor or as a gift.',
    category: 'Product',
    price: 45.00,
    imageUrl: 'https://placehold.co/600x400.png',
    dataAiHint: 'pottery vase',
  },
];

// Bookings will be managed client-side (e.g., in component state or context) for this example.
// This array can be used to initialize if needed, or actions will add to it.
export const mockBookings: Booking[] = [];
