import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { CustomView } from "@/pages/Finance";
import LineItemTable, { LineItem } from "./LineItemTable";
import { getLocalStorageAlerts, recordAlert } from "@/utils/alertStorage";

// Sample data as fallback
const sampleLineItems: LineItem[] = [
  {
    id: "LI-123456-1",
    orderId: "123456",
    client: "Example Co.",
    netCost: "$10,000",
    cpm: "$2.50",
    deliveryPercent: "98%",
    costMethod: "CPU",
    months: "Jan, Feb, Mar",
    approvalStatus: "Incorrect CPM",
    hasFlag: true,
    orderOwner: "John Doe",
    alertedTo: ""
  },
  {
    id: "LI-234567-1",
    orderId: "234567",
    client: "Acme Inc.",
    netCost: "$15,000",
    cpm: "$2.50",
    deliveryPercent: "98%",
    costMethod: "CPU",
    months: "Mar, Apr",
    approvalStatus: "Approved",
    hasFlag: false,
    orderOwner: "Jane Smith",
    alertedTo: ""
  },
  {
    id: "LI-245577-1",
    orderId: "245577",
    client: "Acrume Ind.",
    netCost: "$15,000",
    cpm: "$2.50",
    deliveryPercent: "98%",
    costMethod: "CPU",
    months: "Feb, Mar, Apr, May",
    approvalStatus: "Approved",
    hasFlag: true,
    orderOwner: "Alice Johnson",
    alertedTo: ""
  },
  {
    id: "LI-345678-1",
    orderId: "345678",
    client: "123 Industries",
    netCost: "$20,000",
    cpm: "$3.00",
    deliveryPercent: "100%",
    costMethod: "CPM",
    months: "Jan, Feb",
    approvalStatus: "Pending",
    hasFlag: true,
    orderOwner: "Bob Wilson",
    alertedTo: ""
  }
];

// Function to fetch line items based on view filters
const fetchLineItems = async (view: CustomView): Promise<LineItem[]> => {
  try {
    const dataSourceUrl = localStorage.getItem("dataSourceUrl");
    const isGoogleDrive = localStorage.getItem("isGoogleDrive") === "true";
    
    if (!dataSourceUrl) {
      console.log("No data source configured, using sample data");
      return sampleLineItems;
    }

    if (isGoogleDrive) {
      console.log("Using Google Drive data source:", dataSourceUrl);
      // In a real implementation, you'd fetch data from Google Drive
      // This is a placeholder for demonstration
      toast.info("Would fetch from Google Drive: " + dataSourceUrl, {
        description: "Using sample data instead"
      });
      
      return sampleLineItems;
    } else {
      // Standard API endpoint fetch
      const response = await fetch(dataSourceUrl);
      if (!response.ok) {
        throw new Error("Failed to fetch line items from API");
      }
      return await response.json();
    }
  } catch (error) {
    console.error("Error fetching line items:", error);
    toast.error("Failed to load data from source", {
      description: "Using sample data instead."
    });
    return sampleLineItems;
  }
};

interface FinanceDetailViewProps {
  view: CustomView;
  onBackClick: () => void;
}

const FinanceDetailView: React.FC<FinanceDetailViewProps> = ({ view, onBackClick }) => {
  const { data: lineItems, isLoading } = useQuery({
    queryKey: ["lineItems", view.id],
    queryFn: () => fetchLineItems(view),
  });

  const [displayItems, setDisplayItems] = useState<LineItem[]>([]);

  // Process items and check against localStorage for alert status
  useEffect(() => {
    if (!lineItems) return;
    
    const alertedItems = getLocalStorageAlerts();
    const processedItems = lineItems.map(item => {
      const alertRecord = alertedItems[item.id];
      
      // If item was previously alerted but content has changed, mark as actionable
      if (alertRecord && alertRecord.savedHash !== calculateItemHash(item)) {
        return { ...item, alertedTo: "", hasFlag: true };
      }
      
      // If item was previously alerted and hasn't changed, keep alert info
      if (alertRecord && !alertRecord.ignored) {
        return { ...item, alertedTo: alertRecord.alertedTo, hasFlag: false };
      }
      
      // If item was previously ignored, remove flag
      if (alertRecord && alertRecord.ignored) {
        return { ...item, hasFlag: false };
      }
      
      return item;
    });
    
    setDisplayItems(processedItems);
  }, [lineItems]);

  // Function to calculate a simple hash of an item's content to detect changes
  const calculateItemHash = (item: LineItem): string => {
    return `${item.netCost}-${item.cpm}-${item.deliveryPercent}-${item.approvalStatus}`;
  };

  const handleAlertAction = (lineItemId: string) => {
    // Find the line item
    const lineItem = displayItems.find(item => item.id === lineItemId);
    if (!lineItem) return;

    // Simulate Zapier webhook call
    const webhookUrl = localStorage.getItem("zapierWebhook") || "https://hooks.zapier.com/example";
    simulateZapierWebhook(webhookUrl, lineItem);

    // Update the item in the UI
    const alertedTo = lineItem.orderOwner || "Team Lead";
    const updatedItems = displayItems.map(item => 
      item.id === lineItemId ? { ...item, hasFlag: false, alertedTo } : item
    );
    
    setDisplayItems(updatedItems);
    
    // Record the alert in localStorage
    recordAlert({
      lineItemId: lineItem.id,
      orderId: lineItem.orderId,
      client: lineItem.client,
      alertedTo,
      savedHash: calculateItemHash(lineItem)
    });

    toast.success(`Alert sent for Line Item #${lineItemId}`, {
      description: `${alertedTo} has been notified about this issue.`
    });
  };

  const simulateZapierWebhook = async (webhookUrl: string, lineItem: LineItem) => {
    console.log("Triggering Zapier webhook with data:", lineItem);
    
    // In a real implementation, you would make a real fetch call
    // This is mocked to avoid actual API calls during development
    setTimeout(() => {
      console.log("Zapier webhook triggered successfully");
    }, 500);
  };

  const handleIgnoreAction = (lineItemId: string) => {
    // Update the item in the UI
    const updatedItems = displayItems.map(item => 
      item.id === lineItemId ? { ...item, hasFlag: false } : item
    );
    
    setDisplayItems(updatedItems);
    
    // Record the ignore in localStorage
    const lineItem = displayItems.find(item => item.id === lineItemId);
    if (lineItem) {
      recordAlert({
        lineItemId: lineItem.id,
        orderId: lineItem.orderId,
        client: lineItem.client,
        ignored: true,
        savedHash: calculateItemHash(lineItem)
      });
    }

    toast.info(`Line Item #${lineItemId} alert dismissed`);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 mb-4">
        <Button variant="ghost" size="sm" onClick={onBackClick}>
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Views
        </Button>
        <h2 className="text-xl font-semibold">{view.name}</h2>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        {isLoading ? (
          <div className="py-8 text-center">Loading data...</div>
        ) : (
          <LineItemTable 
            items={displayItems} 
            onAlertAction={handleAlertAction}
            onIgnoreAction={handleIgnoreAction}
          />
        )}
      </div>
    </div>
  );
};

export default FinanceDetailView;
