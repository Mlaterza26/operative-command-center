import React, { useState, useEffect } from "react";
import TopNavigation from "@/components/TopNavigation";
import FilterBar from "@/components/FilterBar";
import OrderTable, { Order } from "@/components/OrderTable";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";

// Sample data as fallback
const financeOrders: Order[] = [
  {
    id: "123456",
    client: "Example Co.",
    netCost: "$10,000",
    cpm: "$2.50",
    deliveryPercent: "98%",
    approvalStatus: "Incorrect CPM",
    hasFlag: true,
    orderOwner: "John Doe"
  },
  {
    id: "234567",
    client: "Acme Inc.",
    netCost: "$15,000",
    cpm: "$2.50",
    deliveryPercent: "98%",
    approvalStatus: "Approved",
    hasFlag: false,
    orderOwner: "Jane Smith"
  },
  {
    id: "245577",
    client: "Acrume Ind.",
    netCost: "$15,000",
    cpm: "$2.50",
    deliveryPercent: "98%",
    approvalStatus: "Approved",
    hasFlag: true,
    orderOwner: "Alice Johnson"
  },
  {
    id: "345678",
    client: "123 Industries",
    netCost: "$20,000",
    cpm: "$3.00",
    deliveryPercent: "100%",
    approvalStatus: "Pending",
    hasFlag: true,
    orderOwner: "Bob Wilson"
  },
  {
    id: "456789",
    client: "Beta Corp",
    netCost: "$12,500",
    cpm: "$6.50",
    deliveryPercent: "92%",
    approvalStatus: "Unapproved change",
    hasFlag: true,
    orderOwner: "Charlie Brown"
  },
  {
    id: "567890",
    client: "Global Media",
    netCost: "$3,000",
    cpm: "$4.20",
    deliveryPercent: "88%",
    approvalStatus: "Invalid cost",
    hasFlag: true,
    orderOwner: "Diana Prince"
  }
];

// Function to fetch orders from data source based on admin configuration
const fetchOrders = async (): Promise<Order[]> => {
  try {
    const dataSourceUrl = localStorage.getItem("dataSourceUrl");
    const isGoogleDrive = localStorage.getItem("isGoogleDrive") === "true";
    
    if (!dataSourceUrl) {
      console.log("No data source configured, using sample data");
      return financeOrders;
    }

    if (isGoogleDrive) {
      console.log("Using Google Drive data source:", dataSourceUrl);
      // Here you would implement the actual Google Drive API call
      // This is a placeholder for demonstration
      
      // In a real implementation, you would:
      // 1. Use the Google Drive API to fetch the file
      // 2. Parse the spreadsheet or document data
      // 3. Convert it to the Order[] format
      
      // For now, we'll return the sample data with a toast notification
      toast.info("Google Drive integration would fetch data from: " + dataSourceUrl, {
        description: "This is a demo. In production, data would be fetched from Google Drive."
      });
      
      return financeOrders;
    } else {
      // Standard API endpoint fetch
      const response = await fetch(dataSourceUrl);
      if (!response.ok) {
        throw new Error("Failed to fetch orders from API");
      }
      return await response.json();
    }
  } catch (error) {
    console.error("Error fetching orders:", error);
    toast.error("Failed to load data from source", {
      description: "Using sample data instead."
    });
    return financeOrders;
  }
};

const errorTypeOptions = [
  { label: "All Error Types", value: "all" },
  { label: "CPM Issues", value: "cpm" },
  { label: "Cost Issues", value: "cost" },
  { label: "Approval Issues", value: "approval" }
];

const orderOwnerOptions = [
  { label: "All Order Owners", value: "all" },
  { label: "John Doe", value: "John Doe" },
  { label: "Jane Smith", value: "Jane Smith" },
  { label: "Alice Johnson", value: "Alice Johnson" },
  { label: "Bob Wilson", value: "Bob Wilson" },
  { label: "Charlie Brown", value: "Charlie Brown" },
  { label: "Diana Prince", value: "Diana Prince" }
];

const dateRangeOptions = [
  { label: "Last 7 Days", value: "7days" },
  { label: "Last 30 Days", value: "30days" },
  { label: "Last Quarter", value: "quarter" },
  { label: "Year to Date", value: "ytd" }
];

const clientOptions = [
  { label: "All Clients", value: "all" },
  { label: "Example Co.", value: "Example Co." },
  { label: "Acme Inc.", value: "Acme Inc." },
  { label: "Acrume Ind.", value: "Acrume Ind." },
  { label: "123 Industries", value: "123 Industries" },
  { label: "Beta Corp", value: "Beta Corp" },
  { label: "Global Media", value: "Global Media" }
];

const Finance: React.FC = () => {
  const { data = financeOrders, isLoading } = useQuery({
    queryKey: ["financeOrders"],
    queryFn: fetchOrders,
    refetchInterval: parseInt(localStorage.getItem("refreshInterval") || "60", 10) * 1000,
    staleTime: 30000,
  });

  const [orders, setOrders] = useState<Order[]>(data);
  const [errorType, setErrorType] = useState("all");
  const [orderOwner, setOrderOwner] = useState("all");
  const [dateRange, setDateRange] = useState("7days");
  const [client, setClient] = useState("all");

  // Update orders when data from query changes
  useEffect(() => {
    setOrders(data);
  }, [data]);

  const handleAlertAction = (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (order) {
      toast.success(`Alert sent for Order #${orderId}`, {
        description: `${order.orderOwner} has been notified about this issue.`
      });
    }
  };

  const handleIgnoreAction = (orderId: string) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, hasFlag: false } : order
    ));
    toast.info(`Order #${orderId} alert dismissed`);
  };

  const filters = [
    {
      name: "Error Type",
      options: errorTypeOptions,
      value: errorType,
      onChange: setErrorType
    },
    {
      name: "Order Owner",
      options: orderOwnerOptions,
      value: orderOwner,
      onChange: setOrderOwner
    },
    {
      name: "Date Range",
      options: dateRangeOptions,
      value: dateRange,
      onChange: setDateRange
    },
    {
      name: "Client",
      options: clientOptions,
      value: client,
      onChange: setClient
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <TopNavigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Finance</h1>
          <p className="text-gray-600">
            Review data from {localStorage.getItem("dataSourceUrl") ? 
              (localStorage.getItem("isGoogleDrive") === "true" ? "Google Drive" : "API endpoint") : 
              "sample data"}
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <div className="text-lg text-gray-500">Loading data...</div>
          </div>
        ) : (
          <>
            <FilterBar filters={filters} />

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <OrderTable 
                orders={orders}
                onAlertAction={handleAlertAction}
                onIgnoreAction={handleIgnoreAction}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Finance;
