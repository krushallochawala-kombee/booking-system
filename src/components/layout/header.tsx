import AppLogo from './app-logo';
import Navigation from './navigation';

const Header = () => {
  return (
    <header className="bg-card border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <AppLogo />
        <Navigation />
      </div>
    </header>
  );
};

export default Header;
