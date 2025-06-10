import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { LogOut } from "lucide-react";
import { menuItems, navLinks } from "./arrays";

const NavbarLinks: React.FC = () => {
  const path = usePathname();
  const { user, signOut } = useAuth();


  return (
    <>
      <div className="hidden md:flex space-x-1">
        {navLinks.map((link) => (
          <Link
            key={link.path}
            href={link.path}
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              path === link.path
                ? "text-white bg-black/20"
                : "text-white/70 hover:text-white hover:bg-black/10"
            }`}
          >
            {link.label}
          </Link>
        ))}
      </div>

      <div className="flex items-center space-x-2">
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-9 w-9 rounded-full bg-black/20"
              >
                <Avatar className="h-9 w-9">
                  <AvatarFallback className="bg-black/20 text-white text-sm">
                    {user.email?.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-56 bg-black/80 backdrop-blur-md border-white/10 text-white"
            >
              <div className="flex items-center justify-start gap-2 p-2">
                <div className="flex flex-col space-y-0.5">
                  <p className="text-sm font-medium">{user.email}</p>
                </div>
              </div>
              <DropdownMenuSeparator className="bg-white/10" />
              {menuItems.map((menu, index) => (
                <DropdownMenuItem
                  key={index}
                  asChild
                  className="cursor-pointer hover:bg-white/10"
                >
                  <Link href={menu.href} className="flex items-center">
                    <menu.icon className="mr-2 h-4 w-4" />
                    <span>{menu.text}</span>
                  </Link>
                </DropdownMenuItem>
              ))}

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
            <Link href="/auth/signin">
              <Button variant="ghost" className="text-white hover:bg-white/10">
                Sign In
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button className="bg-propady-mint text-black hover:bg-propady-mint/90">
                Sign Up
              </Button>
            </Link>
          </>
        )}
      </div>
    </>
  );
};

export default NavbarLinks;
