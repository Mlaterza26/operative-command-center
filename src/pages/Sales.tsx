
import React from "react";
import TopNavigation from "@/components/TopNavigation";
import { FileText, TrendingUp, ChartPie } from "lucide-react";

const Sales: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <TopNavigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Sales Dashboard</h1>
          <p className="text-gray-600">
            Monitor key sales metrics and performance indicators
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
          <div className="text-center mb-6">
            <TrendingUp className="h-16 w-16 text-blue-500 mx-auto mb-4" />
            <h2 className="text-2xl font-medium text-gray-700 mb-4">Sales Dashboard Coming Soon</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              We're building a comprehensive sales dashboard to help you track leads, 
              monitor sales performance, and visualize pipeline progress with real-time data.
            </p>
          </div>
          
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <FeatureCard 
              icon={<TrendingUp className="h-8 w-8 text-blue-500" />}
              title="Performance Tracking"
              description="Real-time sales metrics and performance indicators to measure progress against targets"
            />
            
            <FeatureCard 
              icon={<ChartPie className="h-8 w-8 text-purple-500" />}
              title="Pipeline Visualization"
              description="Interactive visualization of your sales pipeline and conversion rates"
            />
            
            <FeatureCard 
              icon={<FileText className="h-8 w-8 text-green-500" />}
              title="Lead Management"
              description="Comprehensive lead tracking and opportunity management tools"
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

export default Sales;
