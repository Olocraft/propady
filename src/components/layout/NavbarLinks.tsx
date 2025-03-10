
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Building, Home, LogOut, Package, Search, User, MessageCircle, TrendingUp, Users } from 'lucide-react';
import { useMediaQuery } from '@/hooks/use-mobile';

const links = [
  { name: 'Home', href: '/', icon: <Home className="h-4 w-4 mr-2" /> },
  { name: 'Marketplace', href: '/marketplace', icon: <Search className="h-4 w-4 mr-2" /> },
  { name: 'Crowdfunding', href: '/crowdfunding', icon: <Users className="h-4 w-4 mr-2" /> },
  { name: 'AI Assistant', href: '/ai-assistant', icon: <MessageCircle className="h-4 w-4 mr-2" /> },
];

const authenticatedLinks = [
  { name: 'My Properties', href: '/manage', icon: <Building className="h-4 w-4 mr-2" /> },
  { name: 'My Investments', href: '/investments', icon: <TrendingUp className="h-4 w-4 mr-2" /> },
  { name: 'Profile', href: '/profile', icon: <User className="h-4 w-4 mr-2" /> },
];

const NavbarLinks = () => {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  const handleSignOut = async () => {
    await signOut();
  };

  const isActive = (href: string) => location.pathname === href;

  return (
    <>
      <div className={isMobile ? "flex flex-col space-y-2" : "flex items-center space-x-4"}>
        {links.map((link) => (
          <Link key={link.name} to={link.href}>
            <Button
              variant={isActive(link.href) ? "default" : "ghost"}
              className={
                isActive(link.href)
                  ? "bg-propady-purple text-white hover:bg-propady-purple-light"
                  : "text-white hover:bg-white/10"
              }
              size={isMobile ? "default" : "sm"}
            >
              {link.icon}
              {link.name}
            </Button>
          </Link>
        ))}

        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="text-white hover:bg-white/10"
                size={isMobile ? "default" : "sm"}
              >
                <Package className="h-4 w-4 mr-2" />
                My Account
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-background border border-white/10">
              {authenticatedLinks.map((link) => (
                <DropdownMenuItem key={link.name} asChild className="text-white focus:bg-white/10 focus:text-white cursor-pointer">
                  <Link to={link.href} className="flex items-center w-full">
                    {link.icon}
                    {link.name}
                  </Link>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem
                className="text-red-500 focus:bg-red-500/10 focus:text-red-500 cursor-pointer"
                onClick={handleSignOut}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Link to="/auth">
            <Button
              variant="default"
              className="bg-gradient-to-r from-propady-purple to-propady-mint text-white hover:opacity-90 transition-opacity"
              size={isMobile ? "default" : "sm"}
            >
              Sign In
            </Button>
          </Link>
        )}
      </div>
    </>
  );
};

export default NavbarLinks;
