'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const navItems = [
  { href: '/', label: 'Browse' },
  { href: '/bookings', label: 'My Bookings' },
];

const Navigation = () => {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-2 sm:gap-4">
      {navItems.map((item) => (
        <Button key={item.href} variant="ghost" asChild
          className={cn(
            "text-sm sm:text-base font-medium transition-colors hover:text-primary",
            pathname === item.href ? "text-primary font-semibold" : "text-muted-foreground"
          )}
        >
          <Link href={item.href}>{item.label}</Link>
        </Button>
      ))}
    </nav>
  );
};

export default Navigation;
