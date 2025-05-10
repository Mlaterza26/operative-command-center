
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Home, 
  BarChart3, 
  FileText, 
  Settings, 
  Menu, 
  ChevronLeft,
  Sun,
  Moon,
  Bell,
  Search,
  Calendar,
  User
} from "lucide-react";
import { Button } from "./button";
import { useTheme } from "@/hooks/use-theme";
import { cn } from "@/lib/utils";

interface CommandLayoutProps {
  children: React.ReactNode;
}

const CommandLayout: React.FC<CommandLayoutProps> = ({ children }) => {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notificationCount] = useState(3);

  const mainNavItems = [
    { icon: Home, label: "Dashboard", path: "/dashboard" },
    { icon: BarChart3, label: "Finance", path: "/finance" },
    { icon: FileText, label: "Reports", path: "/reports" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <div 
        className={cn(
          "fixed left-0 top-0 z-40 h-screen transition-all duration-300 ease-in-out bg-sidebar border-r border-border/40",
          sidebarOpen ? "w-60" : "w-16"
        )}
      >
        <div className="flex h-16 items-center justify-between px-4 border-b border-border/40">
          <div className={cn("flex items-center", !sidebarOpen && "justify-center w-full")}>
            {sidebarOpen ? (
              <span className="font-bold text-lg text-sidebar-foreground">OpCommand</span>
            ) : (
              <span className="font-bold text-lg text-primary">OC</span>
            )}
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className={cn("text-sidebar-foreground", !sidebarOpen && "hidden")}
            onClick={() => setSidebarOpen(false)}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
        </div>
        
        {!sidebarOpen && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="mt-2 mx-auto block text-sidebar-foreground"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        )}
        
        <div className="py-4">
          <nav className="px-2 space-y-1">
            {mainNavItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "group flex items-center px-3 py-2 rounded-md text-sm transition-all duration-200",
                  isActive(item.path) 
                    ? "bg-sidebar-accent text-sidebar-primary" 
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-primary",
                  !sidebarOpen && "justify-center"
                )}
              >
                <item.icon className={cn("h-5 w-5", isActive(item.path) && "animate-subtle-bounce")} />
                {sidebarOpen && <span className="ml-3">{item.label}</span>}
              </Link>
            ))}
          </nav>
        </div>
      </div>
      
      {/* Main content area */}
      <div className={cn(
        "flex-1 transition-all duration-300 ease-in-out", 
        sidebarOpen ? "ml-60" : "ml-16"
      )}>
        {/* Top navigation bar */}
        <header className="h-16 border-b border-border/40 bg-background/80 backdrop-blur sticky top-0 z-30">
          <div className="h-full px-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="text-xs text-muted-foreground hidden md:flex">
                <Calendar className="h-3.5 w-3.5 mr-1" />
                Today
              </Button>
              <div className="bg-background border border-border/60 rounded-md hidden lg:flex items-center px-2 w-64">
                <Search className="h-4 w-4 text-muted-foreground" />
                <input 
                  type="text"
                  placeholder="Search..."
                  className="bg-transparent border-0 h-8 w-full focus:outline-none text-sm text-foreground"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleTheme} 
                className="text-foreground"
              >
                {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
              
              <div className="relative">
                <Button variant="ghost" size="icon" className="text-foreground">
                  <Bell className="h-5 w-5" />
                </Button>
                {notificationCount > 0 && (
                  <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-primary text-xs text-primary-foreground flex items-center justify-center animate-pulse-glow">
                    {notificationCount}
                  </span>
                )}
              </div>
              
              <Button variant="ghost" size="icon" className="text-foreground">
                <User className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </header>
        
        {/* Page content */}
        <main className="p-4">
          {children}
        </main>
      </div>
    </div>
  );
};

export default CommandLayout;
