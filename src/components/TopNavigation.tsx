
import React from "react";
import { Link, useLocation } from "react-router-dom";

const navItems = [
  { name: "SALES", path: "/sales" },
  { name: "PLANNING", path: "/planning" },
  { name: "CLIENT SUCCESS", path: "/client-success" },
  { name: "AD OPS", path: "/ad-ops" },
  { name: "FINANCE", path: "/finance" },
];

const TopNavigation: React.FC = () => {
  const location = useLocation();

  return (
    <div className="w-full border-b border-gray-200">
      <div className="flex items-center px-6 py-4">
        <Link to="/" className="mr-10">
          <h1 className="text-xl font-bold text-operative-black tracking-wide">
            OPERATIVE CONTROL
          </h1>
        </Link>
        <nav className="flex space-x-6 flex-grow">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`text-sm font-medium py-2 border-b-2 ${
                location.pathname === item.path
                  ? "border-operative-black text-operative-black"
                  : "border-transparent text-gray-600 hover:text-operative-black"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default TopNavigation;
