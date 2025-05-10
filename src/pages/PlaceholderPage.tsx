
import React from "react";
import TopNavigation from "@/components/TopNavigation";
import { useLocation } from "react-router-dom";
import { FileText, TrendingUp, ChartPie } from "lucide-react";

const PlaceholderPage: React.FC = () => {
  const location = useLocation();
  const path = location.pathname.substring(1); // Remove leading slash
  const title = path.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");

  return (
    <div className="min-h-screen bg-gray-50">
      <TopNavigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{title} Dashboard</h1>
          <p className="text-gray-600">
            Monitor key {title.toLowerCase()} metrics and performance indicators
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
          <div className="text-center mb-6">
            <TrendingUp className="h-16 w-16 text-blue-500 mx-auto mb-4" />
            <h2 className="text-2xl font-medium text-gray-700 mb-4">{title} Dashboard Coming Soon</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              We're building a comprehensive {title.toLowerCase()} dashboard to help you track progress, 
              monitor performance, and visualize key metrics with real-time data.
            </p>
          </div>
          
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <FeatureCard 
              icon={<TrendingUp className="h-8 w-8 text-blue-500" />}
              title="Performance Tracking"
              description={`Real-time ${title.toLowerCase()} metrics and performance indicators to measure progress against targets`}
            />
            
            <FeatureCard 
              icon={<ChartPie className="h-8 w-8 text-purple-500" />}
              title="Data Visualization"
              description={`Interactive visualization of your ${title.toLowerCase()} data and key metrics`}
            />
            
            <FeatureCard 
              icon={<FileText className="h-8 w-8 text-green-500" />}
              title="Resource Management"
              description={`Comprehensive ${title.toLowerCase()} resource tracking and management tools`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const FeatureCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
}> = ({ icon, title, description }) => {
  return (
    <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
      <div className="flex items-center mb-4">
        {icon}
        <h3 className="ml-3 text-lg font-medium text-gray-800">{title}</h3>
      </div>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

export default PlaceholderPage;
