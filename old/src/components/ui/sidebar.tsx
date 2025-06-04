
import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useMobile } from "@/hooks/use-mobile";
import { Menu } from "lucide-react";

interface SidebarProps {
  className?: string;
  children: React.ReactNode;
}

export function Sidebar({ className, children }: SidebarProps) {
  const isMobile = useMobile();

  if (isMobile) {
    return (
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="h-9 w-9 lg:hidden">
            <Menu className="h-4 w-4" />
            <span className="sr-only">Toggle sidebar</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[280px] p-0">
          <ScrollArea className="h-full">
            <div className={cn("pb-12", className)}>{children}</div>
          </ScrollArea>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <aside className={cn("pb-12", className)}>
      <ScrollArea className="h-full">{children}</ScrollArea>
    </aside>
  );
}
