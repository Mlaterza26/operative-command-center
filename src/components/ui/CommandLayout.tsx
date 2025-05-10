
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
  User,
  Users,
  ChevronDown,
  ChevronRight
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
  const [teamMenuOpen, setTeamMenuOpen] = useState(false);

  const mainNavItems = [
    { icon: Home, label: "Dashboard", path: "/" },
    { icon: BarChart3, label: "Finance", path: "/finance" },
    { icon: FileText, label: "Reports", path: "/reports" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  const teamNavItems = [
    { label: "Sales", path: "/sales" },
    { label: "Planning", path: "/planning" },
    { label: "Client Success", path: "/client-success" },
    { label: "Ad Ops", path: "/ad-ops" },
    { label: "Finance", path: "/finance" },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const toggleTeamMenu = () => {
    setTeamMenuOpen(!teamMenuOpen);
  };

  return (
    <div className="flex min-h-screen bg-operative-navy">
      {/* Sidebar */}
      <div 
        className={cn(
          "fixed left-0 top-0 z-40 h-screen transition-all duration-300 ease-in-out bg-operative-navy-light border-r-2 border-operative-blue/30",
          sidebarOpen ? "w-60" : "w-16"
        )}
      >
        <div className="flex h-16 items-center justify-between px-4 border-b-2 border-operative-blue/30">
          <div className={cn("flex items-center", !sidebarOpen && "justify-center w-full")}>
            {sidebarOpen ? (
              <span className="font-retro text-lg font-bold text-operative-blue animate-neon-flicker">OpCommand</span>
            ) : (
              <span className="font-retro text-lg font-bold text-operative-blue animate-neon-flicker">OC</span>
            )}
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className={cn("text-operative-blue hover:bg-operative-blue/10", !sidebarOpen && "hidden")}
            onClick={() => setSidebarOpen(false)}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
        </div>
        
        {!sidebarOpen && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="mt-2 mx-auto block text-operative-blue hover:bg-operative-blue/10"
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
                    ? "bg-operative-blue/20 text-operative-teal shadow-neon" 
                    : "text-operative-teal hover:bg-operative-blue/10 hover:text-white",
                  !sidebarOpen && "justify-center"
                )}
              >
                <item.icon className={cn("h-5 w-5", isActive(item.path) && "animate-subtle-bounce")} />
                {sidebarOpen && <span className="ml-3 font-retro tracking-wide">{item.label}</span>}
              </Link>
            ))}
            
            {/* Team dropdown section */}
            <div className="pt-4">
              <button
                onClick={toggleTeamMenu}
                className={cn(
                  "w-full group flex items-center px-3 py-2 rounded-md text-sm transition-all duration-200",
                  "text-operative-teal hover:bg-operative-blue/10 hover:text-white",
                  !sidebarOpen && "justify-center"
                )}
              >
                <Users className="h-5 w-5" />
                {sidebarOpen && (
                  <>
                    <span className="ml-3 flex-1 font-retro tracking-wide">Team</span>
                    {teamMenuOpen ? 
                      <ChevronDown className="h-4 w-4" /> : 
                      <ChevronRight className="h-4 w-4" />
                    }
                  </>
                )}
              </button>
              
              {teamMenuOpen && sidebarOpen && (
                <div className="mt-1 ml-6 space-y-1">
                  {teamNavItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={cn(
                        "flex items-center px-3 py-1.5 rounded-md text-sm transition-all duration-200",
                        isActive(item.path) 
                          ? "bg-operative-blue/20 text-operative-teal shadow-neon" 
                          : "text-operative-teal hover:bg-operative-blue/10 hover:text-white"
                      )}
                    >
                      <span className="font-retro tracking-wide">{item.label}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </nav>
        </div>
      </div>
      
      {/* Main content area */}
      <div className={cn(
        "flex-1 transition-all duration-300 ease-in-out", 
        sidebarOpen ? "ml-60" : "ml-16"
      )}>
        {/* Top navigation bar */}
        <header className="h-16 border-b-2 border-operative-blue/30 bg-operative-navy-light/80 backdrop-blur sticky top-0 z-30">
          <div className="h-full px-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="text-xs text-operative-teal border-operative-blue hover:bg-operative-blue/10 hidden md:flex">
                <Calendar className="h-3.5 w-3.5 mr-1" />
                Today
              </Button>
              <div className="bg-operative-navy-light border border-operative-blue/50 rounded-full hidden lg:flex items-center px-4 w-64">
                <Search className="h-4 w-4 text-operative-teal" />
                <input 
                  type="text"
                  placeholder="Search..."
                  className="bg-transparent border-0 h-8 w-full focus:outline-none text-sm text-operative-teal"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleTheme} 
                className="text-operative-teal hover:bg-operative-blue/10"
              >
                {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
              
              <div className="relative">
                <Button variant="ghost" size="icon" className="text-operative-teal hover:bg-operative-blue/10">
                  <Bell className="h-5 w-5" />
                </Button>
                {notificationCount > 0 && (
                  <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-operative-coral text-xs text-white flex items-center justify-center animate-pulse-glow">
                    {notificationCount}
                  </span>
                )}
              </div>
              
              <Button 
                variant="ghost" 
                size="icon" 
                className="flex items-center justify-center rounded-full bg-operative-red text-white h-8 w-8 hover:shadow-neon-red"
              >
                ML
              </Button>
            </div>
          </div>
        </header>
        
        {/* Page content */}
        <main className="p-4 bg-operative-navy">
          {children}
        </main>
      </div>
    </div>
  );
};

export default CommandLayout;
