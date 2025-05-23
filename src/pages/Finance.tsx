
import React, { useState } from "react";
import TopNavigation from "@/components/TopNavigation";
import { toast } from "sonner";
import FinanceViewList from "@/components/FinanceViewList";
import FinanceDetailView from "@/components/FinanceDetailView";
import AlertHistory from "@/components/AlertHistory";
import CsvTestingComponent from "@/components/CsvTestingComponent";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export interface CustomView {
  id: string;
  name: string;
  description: string;
  lastUpdated: string;
  flaggedItems: number;
  filters: {
    errorType?: string;
    orderOwner?: string;
    dateRange?: string;
    client?: string;
    costMethod?: string;
  };
  sourceData?: string;
  functionality?: string;
  additionalNotes?: string;
}

export type AlertHistoryItem = {
  lineItemId: string;
  orderId: string;
  client: string;
  alertedAt: string;
  alertedBy: string;
  resolved: boolean;
  resolvedAt?: string;
};

type Tab = "views" | "details" | "history" | "refreshData";

const Finance: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>("views");
  const [activeView, setActiveView] = useState<CustomView | null>(null);
  
  // Get custom views from localStorage or use default views
  const getCustomViews = () => {
    const storedViews = localStorage.getItem("customViews");
    if (storedViews) {
      return JSON.parse(storedViews);
    }
    return [
      {
        id: "view1",
        name: "CPU Cost Method Orders Across Multiple Months",
        description: "Shows all orders using CPU cost method that span multiple months",
        lastUpdated: "2023-05-08",
        flaggedItems: 4,
        filters: {
          costMethod: "cpu",
          dateRange: "quarter"
        }
      },
      {
        id: "view2",
        name: "Missing Flight Dates",
        description: "Orders with missing or incorrect flight dates",
        lastUpdated: "2023-05-07",
        flaggedItems: 2,
        filters: {
          errorType: "dates"
        }
      },
      {
        id: "view3",
        name: "Orders with >20% Delivery Variance",
        description: "Shows orders with significant delivery percentage variance",
        lastUpdated: "2023-05-06",
        flaggedItems: 5,
        filters: {
          client: "all"
        }
      }
    ];
  };

  const [customViews, setCustomViews] = useState<CustomView[]>(getCustomViews());

  // Save views to localStorage
  const saveViews = (views: CustomView[]) => {
    localStorage.setItem("customViews", JSON.stringify(views));
    setCustomViews(views);
    toast.success("Custom views saved successfully");
  };

  const handleViewSelect = (view: CustomView) => {
    setActiveView(view);
    setActiveTab("details");
  };

  const handleBackToViews = () => {
    setActiveView(null);
    setActiveTab("views");
  };

  const handleShowAlertHistory = () => {
    setActiveTab("history");
  };

  return (
    <div className="min-h-screen bg-white">
      <TopNavigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Finance</h1>
          
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as Tab)} className="w-full">
            <TabsList className="mb-2">
              <TabsTrigger value="views">Custom Views</TabsTrigger>
              {activeView && (
                <TabsTrigger value="details">{activeView.name}</TabsTrigger>
              )}
              <TabsTrigger value="history">Alert History</TabsTrigger>
              <TabsTrigger value="refreshData">Refresh Data</TabsTrigger>
            </TabsList>
            
            <TabsContent value="views">
              <FinanceViewList 
                views={customViews}
                onViewSelect={handleViewSelect}
                onViewsUpdated={saveViews}
              />
            </TabsContent>
            
            <TabsContent value="details">
              {activeView && (
                <FinanceDetailView 
                  view={activeView} 
                  onBackClick={handleBackToViews}
                />
              )}
            </TabsContent>
            
            <TabsContent value="history">
              <AlertHistory onBackClick={() => setActiveTab("views")} />
            </TabsContent>
            
            <TabsContent value="refreshData">
              <CsvTestingComponent />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Finance;
