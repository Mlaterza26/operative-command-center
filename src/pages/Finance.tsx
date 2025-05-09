
import React, { useState } from "react";
import TopNavigation from "@/components/TopNavigation";
import FilterBar from "@/components/FilterBar";
import OrderTable, { Order } from "@/components/OrderTable";
import { toast } from "@/components/ui/sonner";

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
  const [orders, setOrders] = useState<Order[]>(financeOrders);
  const [errorType, setErrorType] = useState("all");
  const [orderOwner, setOrderOwner] = useState("all");
  const [dateRange, setDateRange] = useState("7days");
  const [client, setClient] = useState("all");

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
            Review nightly FTP? Google Driogle Drive report data from Operative.One
          </p>
        </div>

        <FilterBar filters={filters} />

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <OrderTable 
            orders={orders}
            onAlertAction={handleAlertAction}
            onIgnoreAction={handleIgnoreAction}
          />
        </div>
      </div>
    </div>
  );
};

export default Finance;
