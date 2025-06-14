import Link from 'next/link';
import { CalendarCheck2 } from 'lucide-react';

const AppLogo = () => {
  return (
    <Link href="/" className="flex items-center gap-2 text-primary hover:opacity-80 transition-opacity">
      <CalendarCheck2 className="h-8 w-8" />
      <span className="text-2xl font-bold font-headline">ReserveEase</span>
    </Link>
  );
};

export default AppLogo;
