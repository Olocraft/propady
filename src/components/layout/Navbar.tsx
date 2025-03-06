import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { AlignJustify } from 'lucide-react';

enum AuthStatus {
  LOGIN,
  SIGNUP,
  NONE
}

const Navbar = () => {
  const { user, signOut } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(AuthStatus.NONE);
  const isLoggedIn = !!user;

  const openLoginModal = () => {
    setShowAuthModal(AuthStatus.LOGIN);
  };

  const openSignupModal = () => {
    setShowAuthModal(AuthStatus.SIGNUP);
  };

  const closeAuthModal = () => {
    setShowAuthModal(AuthStatus.NONE);
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-background/90 backdrop-blur-md border-b border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center gap-2">
              <div className="relative w-8 h-8 flex items-center justify-center">
                <div className="absolute inset-0 bg-propady-mint rounded-lg"></div>
                <span className="relative text-black font-bold text-lg">P</span>
              </div>
              <span className="text-white font-bold">Propady</span>
            </Link>
            
            <nav className="hidden md:flex items-center space-x-6">
              <NavLink 
                to="/marketplace" 
                className={({isActive}) => isActive ? 'text-propady-mint font-medium' : 'text-white/70 hover:text-white transition-colors'}
              >
                Marketplace
              </NavLink>
              <NavLink 
                to="/ai-assistant" 
                className={({isActive}) => isActive ? 'text-propady-mint font-medium' : 'text-white/70 hover:text-white transition-colors'}
              >
                AI Assistant
              </NavLink>
              {isLoggedIn && (
                <NavLink 
                  to="/manage" 
                  className={({isActive}) => isActive ? 'text-propady-mint font-medium' : 'text-white/70 hover:text-white transition-colors'}
                >
                  Dashboard
                </NavLink>
              )}
            </nav>
          </div>
          
          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`} alt={user.email} />
                      <AvatarFallback className="bg-propady-purple text-white text-sm">
                        {user.email?.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.email}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.id.substring(0, 8)}...
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => window.location.href = '/profile'}>
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => window.location.href = '/manage'}>
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOut}>
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button variant="outline" className="hidden md:inline-flex border-white/20 text-white hover:bg-white/10" onClick={openLoginModal}>
                  Log In
                </Button>
                <Button className="hidden md:inline-flex bg-propady-purple hover:bg-propady-purple-light text-white" onClick={openSignupModal}>
                  Sign Up
                </Button>
              </>
            )}

            <Sheet>
              <SheetTrigger className="md:hidden">
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <AlignJustify className="h-6 w-6 text-white" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-background border-l border-white/10 text-white">
                <SheetHeader className="space-y-2.5">
                  <SheetTitle>Menu</SheetTitle>
                  <SheetDescription>
                    Explore Propady
                  </SheetDescription>
                </SheetHeader>
                <div className="grid gap-4 py-4">
                  <Button variant="ghost" className="justify-start" onClick={() => window.location.href = '/marketplace'}>
                    Marketplace
                  </Button>
                  <Button variant="ghost" className="justify-start" onClick={() => window.location.href = '/ai-assistant'}>
                    AI Assistant
                  </Button>
                  {isLoggedIn ? (
                    <>
                      <Button variant="ghost" className="justify-start" onClick={() => window.location.href = '/profile'}>
                        Profile
                      </Button>
                      <Button variant="ghost" className="justify-start" onClick={() => window.location.href = '/manage'}>
                        Dashboard
                      </Button>
                      <Button variant="ghost" className="justify-start" onClick={signOut}>
                        Log out
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button variant="ghost" className="justify-start" onClick={openLoginModal}>
                        Log In
                      </Button>
                      <Button variant="ghost" className="justify-start" onClick={openSignupModal}>
                        Sign Up
                      </Button>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
