const Footer = () => {
  return (
    <footer className="bg-muted border-t">
      <div className="container mx-auto px-4 py-6 text-center text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} ReserveEase. All rights reserved.</p>
        <p className="text-sm mt-1">Effortless bookings at your fingertips.</p>
      </div>
    </footer>
  );
};

export default Footer;
