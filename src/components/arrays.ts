import { Building, Flame, LineChart, User } from "lucide-react";

export const menuItems = [
  { text: "Profile", icon: User, href: "/profile" },
  { text: "My Properties", icon: Building, href: "/manage" },
  { text: "Investments", icon: LineChart, href: "/investments" },
  { text: "AI Assistant", icon: Flame, href: "/ai-assistant" },
  //   { text: "Log out", icon: LogOut, href: null, action: signOut }
];

export const navLinks = [
  { label: "Home", path: "/" },
  { label: "Marketplace", path: "/marketplace" },
  { label: "AI Assistant", path: "/ai-assistant" },
];
