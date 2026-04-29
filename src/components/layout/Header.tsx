import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Car, Menu, LogOut, Moon, Sun, X } from 'lucide-react';
import { Button } from '../ui/button';
import { useAuthStore } from '@/store/authStore';

export default function Header() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const getUserAvatar = () => {
    if (user?.profilePhoto) return user.profilePhoto;
    return `https://api.dicebear.com/7.x/initials/svg?seed=${user?.name}`;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-(--header-bg) h-16 text-foreground shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <Car className="h-6 w-6 text-primary" />
          <span className="text-xl font-display font-bold">
            Auction <span className="text-gradient-gold">Wheels</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <Link
            to="/auctions"
            className="text-sm font-medium hover:text-primary transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all hover:after:w-full"
          >
            Auctions
          </Link>
          <Link
            to="/vehicles"
            className="text-sm font-medium hover:text-primary transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all hover:after:w-full"
          >
            Vehicles
          </Link>

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleDarkMode}
            className="h-9 w-9"
          >
            {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>

          {!isAuthenticated ? (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm">Login</Button>
              </Link>
              <Link to="/register">
                <Button size="sm" className="gradient-gold text-black hover:opacity-90">Register</Button>
              </Link>
            </>
          ) : (
            <>
              <Link to={`/${user?.role}/dashboard`}>
                <Button variant="ghost" size="sm" className="gap-2">
                  <img
                    src={getUserAvatar()}
                    alt={user?.name}
                    className="h-6 w-6 rounded-full"
                  />
                  {user?.name}
                </Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={logout} className="gap-2">
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </>
          )}
        </nav>

        <div className="flex md:hidden items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleDarkMode}
            className="h-9 w-9"
          >
            {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-(--header-bg)">
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-4">
            <Link
              to="/auctions"
              className="text-sm font-medium hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Auctions
            </Link>
            <Link
              to="/vehicles"
              className="text-sm font-medium hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Vehicles
            </Link>

            {!isAuthenticated ? (
              <>
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" size="sm" className="w-full justify-start">Login</Button>
                </Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                  <Button size="sm" className="w-full gradient-gold text-black">Register</Button>
                </Link>
              </>
            ) : (
              <>
                <Link to={`/${user?.role}/dashboard`} onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" size="sm" className="gap-2 w-full justify-start">
                    <img
                      src={getUserAvatar()}
                      alt={user?.name}
                      className="h-6 w-6 rounded-full"
                    />
                    {user?.name}
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="gap-2 w-full justify-start"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
