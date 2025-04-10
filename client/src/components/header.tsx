import { Bell, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useState } from "react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import Sidebar from "./sidebar";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <div className="relative z-10 flex flex-shrink-0 h-16 bg-white shadow">
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden px-4 text-gray-500"
          onClick={() => setIsMobileMenuOpen(true)}
        >
          <Menu className="h-6 w-6" />
        </Button>
        <div className="flex-1 flex justify-between px-4">
          <div className="flex-1 flex items-center">
            <h1 className="text-lg md:text-xl font-semibold text-gray-900">Student Records Management</h1>
          </div>
          <div className="ml-4 flex items-center md:ml-6">
            <Button
              variant="ghost"
              size="icon"
              className="bg-white text-gray-500 hover:text-gray-900"
            >
              <Bell className="h-5 w-5" />
              <span className="sr-only">Notifications</span>
            </Button>
            <div className="ml-3 relative">
              <div className="flex items-center">
                <Avatar className="h-8 w-8 bg-primary text-white">
                  <AvatarFallback>AD</AvatarFallback>
                </Avatar>
                <span className="ml-2 text-sm font-medium text-gray-900 hidden md:block">
                  Admin User
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetContent side="left" className="p-0 w-64">
          <Sidebar />
        </SheetContent>
      </Sheet>
    </>
  );
}
