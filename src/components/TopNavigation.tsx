
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Settings, Search, Bell, Calendar, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";

const navItems = [
  { name: "SALES", path: "/sales" },
  { name: "PLANNING", path: "/planning" },
  { name: "CLIENT SUCCESS", path: "/client-success" },
  { name: "AD OPS", path: "/ad-ops" },
  { name: "FINANCE", path: "/finance" },
];

const TopNavigation: React.FC = () => {
  const location = useLocation();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className={`w-full border-b ${isDark ? 'border-gray-700 bg-gray-900' : 'border-gray-200'}`}>
      <div className="flex items-center px-6 py-4">
        <Link to="/" className="mr-10">
          <h1 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-800'} tracking-wide`}>
            OPERATIVE CONTROL
          </h1>
        </Link>
        <nav className="flex space-x-6 flex-grow">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`text-sm font-medium py-2 border-b-2 transition-all duration-200 ${
                location.pathname === item.path
                  ? isDark 
                    ? "border-indigo-500 text-white" 
                    : "border-indigo-600 text-gray-800"
                  : isDark
                    ? "border-transparent text-gray-300 hover:text-white hover:border-indigo-400"
                    : "border-transparent text-gray-600 hover:text-gray-800"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>
        <Link 
          to="/settings" 
          className={`ml-6 p-2 rounded-full hover:bg-${isDark ? 'gray-800' : 'gray-100'} transition-colors duration-200`}
          title="Settings"
        >
          <Settings className={`h-5 w-5 ${isDark ? 'text-gray-300' : 'text-gray-600'}`} />
        </Link>
      </div>
    </div>
  );
};

export default TopNavigation;
