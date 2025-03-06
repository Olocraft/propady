
import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, User, ShoppingCart, Menu, LogOut } from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Close mobile menu when route changes
    setIsMobileMenuOpen(false);
  }, [location]);

  const handleAuthAction = () => {
    if (user) {
      // If user is logged in, show dropdown
      return;
    } else {
      // If user is not logged in, redirect to auth page
      navigate('/auth');
    }
  };

  return (
    <header 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'glass-morphism py-2' : 'py-4 bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img src="/lovable-uploads/99b9e28a-439c-4750-90ce-22d5c7d601af.png" alt="Propady" className="h-10 w-auto" />
          <span className="text-white font-bold text-xl">Propady</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/marketplace" className="text-white hover:text-propady-mint transition-colors">
            Marketplace
          </Link>
          <Link to="/projects" className="text-white hover:text-propady-mint transition-colors">
            Projects
          </Link>
          <Link to="/manage" className="text-white hover:text-propady-mint transition-colors">
            Manage Prop
          </Link>
        </nav>

        {/* Search Bar */}
        <div className="hidden md:flex items-center relative max-w-md w-full mx-4">
          <Input
            type="text"
            placeholder="Explore Properties"
            className="pl-10 pr-4 py-2 rounded-full bg-white/10 border-white/20 text-white placeholder-white/60 focus:ring-propady-mint"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 h-4 w-4" />
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
            <ShoppingCart size={20} />
          </Button>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 rounded-full">
                  <User size={20} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="glass-morphism border-white/20 text-white">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-white/20" />
                <DropdownMenuItem onClick={() => navigate('/profile')}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/manage')}>
                  <span>Dashboard</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-white/20" />
                <DropdownMenuItem onClick={signOut} className="text-red-400">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button 
              variant="default" 
              className="hidden md:flex bg-propady-purple hover:bg-propady-purple-light text-white"
              onClick={handleAuthAction}
            >
              Sign up
            </Button>
          )}
          
          {/* Mobile Menu Button */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Menu size={24} />
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden glass-morphism mt-1 py-4 px-4 animate-fade-in">
          <div className="flex flex-col space-y-4">
            <Input
              type="text"
              placeholder="Explore Properties"
              className="pl-10 pr-4 py-2 rounded-full bg-white/10 border-white/20 text-white placeholder-white/60"
            />
            <div className="absolute left-8 top-[4.5rem] text-white/60">
              <Search size={16} />
            </div>
            
            <div className="flex flex-col space-y-2 pt-2">
              <Link to="/marketplace" className="text-white hover:text-propady-mint p-2 rounded-md hover:bg-white/5 transition-colors">
                Marketplace
              </Link>
              <Link to="/projects" className="text-white hover:text-propady-mint p-2 rounded-md hover:bg-white/5 transition-colors">
                Projects
              </Link>
              <Link to="/manage" className="text-white hover:text-propady-mint p-2 rounded-md hover:bg-white/5 transition-colors">
                Manage Prop
              </Link>
            </div>
            
            {user ? (
              <Button 
                variant="outline" 
                className="w-full border-white/20 text-white hover:bg-white/10"
                onClick={signOut}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </Button>
            ) : (
              <Button 
                variant="default" 
                className="w-full bg-propady-purple hover:bg-propady-purple-light text-white"
                onClick={() => navigate('/auth')}
              >
                Sign up
              </Button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
