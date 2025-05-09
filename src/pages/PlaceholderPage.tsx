
import React from "react";
import TopNavigation from "@/components/TopNavigation";
import { useLocation } from "react-router-dom";

const PlaceholderPage: React.FC = () => {
  const location = useLocation();
  const path = location.pathname.substring(1); // Remove leading slash
  const title = path.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");

  return (
    <div className="min-h-screen bg-gray-50">
      <TopNavigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
          <p className="text-gray-600">
            This dashboard is under development. Please check back soon.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <h2 className="text-2xl font-medium text-gray-700 mb-4">Coming Soon</h2>
          <p className="text-gray-500">
            The {title} dashboard is currently being built. It will provide detailed metrics and 
            management tools specific to the {title} team's needs.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PlaceholderPage;
