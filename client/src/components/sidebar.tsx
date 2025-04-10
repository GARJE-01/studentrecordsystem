import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Home, Users, BarChart2, Settings } from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Students", href: "/students", icon: Users },
  { name: "Reports", href: "/reports", icon: BarChart2 },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  const [location] = useLocation();

  return (
    <div className="hidden md:flex md:w-64 md:flex-col">
      <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto bg-white border-r border-gray-200">
        <div className="flex items-center justify-center flex-shrink-0 px-4 mb-5">
          <h1 className="text-xl font-semibold text-primary">Student Manager</h1>
        </div>
        <nav className="flex-1 mt-5 space-y-1 bg-white px-2">
          {navigation.map((item) => {
            const isActive = location === item.href;
            return (
              <div key={item.name}>
                <Link href={item.href}>
                  <div
                    className={cn(
                      "flex items-center px-4 py-3 text-base font-medium rounded-md cursor-pointer",
                      isActive
                        ? "bg-primary text-white"
                        : "text-gray-900 hover:bg-gray-50"
                    )}
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </div>
                </Link>
              </div>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
