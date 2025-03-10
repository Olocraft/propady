
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Building, LineChart, User, Home, LogOut, Flame } from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from '@/components/ui/button';

const NavbarLinks: React.FC = () => {
  const location = useLocation();
  const { user, signOut } = useAuth();

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Marketplace', path: '/marketplace' },
    { label: 'AI Assistant', path: '/ai-assistant' }
  ];

  return (
    <>
      {/* Primary Nav Links */}
      <div className="hidden md:flex space-x-1">
        {navLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              location.pathname === link.path
                ? 'text-white bg-black/20'
                : 'text-white/70 hover:text-white hover:bg-black/10'
            }`}
          >
            {link.label}
          </Link>
        ))}
      </div>

      {/* Auth Buttons / User Menu */}
      <div className="flex items-center space-x-2">
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full bg-black/20">
                <Avatar className="h-9 w-9">
                  <AvatarFallback className="bg-black/20 text-white text-sm">
                    {user.email?.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-black/80 backdrop-blur-md border-white/10 text-white">
              <div className="flex items-center justify-start gap-2 p-2">
                <div className="flex flex-col space-y-0.5">
                  <p className="text-sm font-medium">{user.email}</p>
                </div>
              </div>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem asChild className="cursor-pointer hover:bg-white/10">
                <Link to="/profile" className="flex items-center">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="cursor-pointer hover:bg-white/10">
                <Link to="/manage" className="flex items-center">
                  <Building className="mr-2 h-4 w-4" />
                  <span>My Properties</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="cursor-pointer hover:bg-white/10">
                <Link to="/investments" className="flex items-center">
                  <LineChart className="mr-2 h-4 w-4" />
                  <span>Investments</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="cursor-pointer hover:bg-white/10">
                <Link to="/ai-assistant" className="flex items-center">
                  <Flame className="mr-2 h-4 w-4" />
                  <span>AI Assistant</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem 
                onClick={signOut}
                className="cursor-pointer text-red-300 hover:bg-red-900/20 hover:text-red-300"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <>
            <Link to="/auth?mode=signin">
              <Button variant="ghost" className="text-white hover:bg-white/10">Sign In</Button>
            </Link>
            <Link to="/auth?mode=signup">
              <Button className="bg-propady-mint text-black hover:bg-propady-mint/90">Sign Up</Button>
            </Link>
          </>
        )}
      </div>
    </>
  );
};

export default NavbarLinks;
