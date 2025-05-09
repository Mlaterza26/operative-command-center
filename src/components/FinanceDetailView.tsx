
import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { CustomView } from "@/pages/Finance";
import { getLocalStorageAlerts, recordAlert } from "@/utils/alertStorage";
import SortableTable, { TableColumn } from "./SortableTable";
import FinanceFilters, { FilterValues } from "./FinanceFilters";
import FinanceSummary from "./FinanceSummary";

// Extend the LineItem interface to include the new fields we want
export interface LineItem {
  id: string;
  orderId: string;
  orderName?: string;
  client: string;
  netCost: string;
  cpm: string;
  deliveryPercent: string;
  costMethod: string;
  months: string;
  startDate?: string;
  endDate?: string;
  quantity?: number;
  quantityGap?: number;
  approvalStatus: string;
  hasFlag: boolean;
  orderOwner: string;
  alertedTo: string;
  alertedAt?: string;
  ignored?: boolean;
  advertiser?: string;
}

// Sample data as fallback
const sampleLineItems: LineItem[] = [
  {
    id: "LI-123456-1",
    orderId: "123456",
    orderName: "Q1 Campaign",
    client: "Example Co.",
    netCost: "$10,000",
    cpm: "$2.50",
    deliveryPercent: "98%",
    costMethod: "CPU",
    months: "Jan, Feb, Mar",
    startDate: "2023-01-01",
    endDate: "2023-03-31", 
    quantity: 1500,
    quantityGap: 250,
    approvalStatus: "Incorrect CPM",
    hasFlag: true,
    orderOwner: "John Doe",
    alertedTo: "",
    advertiser: "Example Co."
  },
  {
    id: "LI-234567-1",
    orderId: "234567",
    orderName: "Brand Awareness",
    client: "Acme Inc.",
    netCost: "$15,000",
    cpm: "$2.50",
    deliveryPercent: "98%",
    costMethod: "CPU",
    months: "Mar, Apr",
    startDate: "2023-03-01",
    endDate: "2023-04-30",
    quantity: 2000,
    quantityGap: 0,
    approvalStatus: "Approved",
    hasFlag: false,
    orderOwner: "Jane Smith",
    alertedTo: "",
    advertiser: "Acme Inc."
  },
  {
    id: "LI-245577-1",
    orderId: "245577",
    orderName: "Spring Promo",
    client: "Acrume Ind.",
    netCost: "$15,000",
    cpm: "$2.50",
    deliveryPercent: "98%",
    costMethod: "CPU",
    months: "Feb, Mar, Apr, May",
    startDate: "2023-02-01",
    endDate: "2023-05-31",
    quantity: 3500,
    quantityGap: 420,
    approvalStatus: "Approved",
    hasFlag: true,
    orderOwner: "Alice Johnson",
    alertedTo: "",
    advertiser: "Acrume Ind."
  },
  {
    id: "LI-345678-1",
    orderId: "345678",
    orderName: "Product Launch",
    client: "123 Industries",
    netCost: "$20,000",
    cpm: "$3.00",
    deliveryPercent: "100%",
    costMethod: "CPM",
    months: "Jan, Feb",
    startDate: "2023-01-01",
    endDate: "2023-02-28",
    quantity: 1800,
    quantityGap: 175,
    approvalStatus: "Pending",
    hasFlag: true,
    orderOwner: "Bob Wilson",
    alertedTo: "",
    advertiser: "123 Industries"
  },
  {
    id: "LI-456789-1",
    orderId: "456789",
    orderName: "Summer Campaign",
    client: "Tech Solutions",
    netCost: "$30,000",
    cpm: "$4.00",
    deliveryPercent: "90%",
    costMethod: "CPU",
    months: "Jun, Jul, Aug",
    startDate: "2023-06-01",
    endDate: "2023-08-31",
    quantity: 4200,
    quantityGap: 320,
    approvalStatus: "Pending",
    hasFlag: true,
    orderOwner: "Sarah Davis",
    alertedTo: "",
    advertiser: "Tech Solutions"
  },
  {
    id: "LI-567890-1",
    orderId: "567890",
    orderName: "Year-End Sale",
    client: "Retail Depot",
    netCost: "$25,000",
    cpm: "$3.50",
    deliveryPercent: "95%",
    costMethod: "CPU",
    months: "Nov, Dec",
    startDate: "2023-11-01",
    endDate: "2023-12-31",
    quantity: 3800,
    quantityGap: 0,
    approvalStatus: "Approved",
    hasFlag: false,
    orderOwner: "Mike Brown",
    alertedTo: "",
    advertiser: "Retail Depot"
  },
  {
    id: "LI-678901-1",
    orderId: "678901",
    orderName: "Holiday Special",
    client: "GiftMaster",
    netCost: "$18,000",
    cpm: "$3.25",
    deliveryPercent: "93%",
    costMethod: "CPU",
    months: "Dec, Jan",
    startDate: "2023-12-01",
    endDate: "2024-01-31",
    quantity: 2600,
    quantityGap: 280,
    approvalStatus: "Incorrect CPM",
    hasFlag: true,
    orderOwner: "Laura Wilson",
    alertedTo: "",
    advertiser: "GiftMaster"
  },
  {
    id: "LI-789012-1",
    orderId: "789012",
    orderName: "Annual Partnership",
    client: "BigCorp Ltd",
    netCost: "$50,000",
    cpm: "$5.00",
    deliveryPercent: "98%",
    costMethod: "CPU",
    months: "Jan, Feb, Mar, Apr, May, Jun",
    startDate: "2023-01-01",
    endDate: "2023-06-30",
    quantity: 8500,
    quantityGap: 950,
    approvalStatus: "Pending Review",
    hasFlag: true,
    orderOwner: "Chris Taylor",
    alertedTo: "",
    advertiser: "BigCorp Ltd"
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

  // State for filtered and displayed items
  const [displayItems, setDisplayItems] = useState<LineItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<LineItem[]>([]);
  const [flaggedRows, setFlaggedRows] = useState<Record<string, boolean>>({});
  
  // State for sorting
  const [sortKey, setSortKey] = useState<string>("quantityGap");
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  
  // State for filters
  const [filterValues, setFilterValues] = useState<FilterValues>({
    advertisers: [],
    owners: [],
    startDate: null,
    endDate: null,
    searchQuery: ""
  });

  // Extract unique values for filter dropdowns
  const uniqueAdvertisers = lineItems 
    ? [...new Set(lineItems.map(item => item.advertiser || item.client))]
    : [];
  
  const uniqueOwners = lineItems 
    ? [...new Set(lineItems.map(item => item.orderOwner))]
    : [];

  // Calculate summary statistics
  const issueCount = displayItems.filter(item => item.hasFlag).length;
  const totalQuantityGap = displayItems.reduce((sum, item) => sum + (item.quantityGap || 0), 0);
  const lastUpdated = new Date().toLocaleString();

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
        return { 
          ...item, 
          alertedTo: alertRecord.alertedTo, 
          alertedAt: alertRecord.alertedAt,
          hasFlag: false 
        };
      }
      
      // If item was previously ignored, remove flag
      if (alertRecord && alertRecord.ignored) {
        return { ...item, hasFlag: false, ignored: true };
      }
      
      return item;
    });
    
    setFilteredItems(processedItems);
    
    // Create a map of flagged rows
    const flaggedMap: Record<string, boolean> = {};
    processedItems.forEach(item => {
      flaggedMap[item.id] = item.hasFlag;
    });
    setFlaggedRows(flaggedMap);
    
    sortItems(processedItems, sortKey, sortDirection);
  }, [lineItems]);

  // Function to calculate a simple hash of an item's content to detect changes
  const calculateItemHash = (item: LineItem): string => {
    return `${item.netCost}-${item.cpm}-${item.deliveryPercent}-${item.approvalStatus}-${item.quantityGap}`;
  };

  // Sort items based on sort key and direction
  const sortItems = (items: LineItem[], key: string, direction: 'asc' | 'desc') => {
    const sorted = [...items].sort((a, b) => {
      const aValue = a[key as keyof LineItem];
      const bValue = b[key as keyof LineItem];
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return direction === 'asc' ? aValue - bValue : bValue - aValue;
      }
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return direction === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      return 0;
    });
    
    setDisplayItems(sorted);
  };

  // Handle sorting when column header is clicked
  const handleSort = (key: string) => {
    const direction = key === sortKey && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortKey(key);
    setSortDirection(direction);
    sortItems(filteredItems, key, direction);
  };

  // Handle filter changes
  const handleFilterChange = (newFilters: FilterValues) => {
    setFilterValues(newFilters);
  };

  // Apply filters to the data
  const applyFilters = () => {
    if (!lineItems) return;
    
    let filtered = [...lineItems];
    
    // Filter by advertisers
    if (filterValues.advertisers.length > 0) {
      filtered = filtered.filter(item => 
        filterValues.advertisers.includes(item.advertiser || item.client)
      );
    }
    
    // Filter by owners
    if (filterValues.owners.length > 0) {
      filtered = filtered.filter(item => 
        filterValues.owners.includes(item.orderOwner)
      );
    }
    
    // Filter by start date
    if (filterValues.startDate) {
      filtered = filtered.filter(item => {
        if (!item.startDate) return true;
        const itemStartDate = new Date(item.startDate);
        return itemStartDate >= filterValues.startDate!;
      });
    }
    
    // Filter by end date
    if (filterValues.endDate) {
      filtered = filtered.filter(item => {
        if (!item.endDate) return true;
        const itemEndDate = new Date(item.endDate);
        return itemEndDate <= filterValues.endDate!;
      });
    }
    
    setFilteredItems(filtered);
    sortItems(filtered, sortKey, sortDirection);
  };

  // Clear all filters
  const clearFilters = () => {
    setFilterValues({
      advertisers: [],
      owners: [],
      startDate: null,
      endDate: null,
      searchQuery: ""
    });
    
    if (lineItems) {
      setFilteredItems(lineItems);
      sortItems(lineItems, sortKey, sortDirection);
    }
  };

  // Handle search
  const handleSearch = (query: string) => {
    setFilterValues({...filterValues, searchQuery: query});
    
    if (!lineItems) return;
    
    if (!query) {
      applyFilters(); // If search is cleared, just apply the other filters
      return;
    }
    
    const lowerQuery = query.toLowerCase();
    const searchResults = lineItems.filter(item => {
      // Search in multiple fields
      return (
        (item.id && item.id.toLowerCase().includes(lowerQuery)) ||
        (item.orderId && item.orderId.toLowerCase().includes(lowerQuery)) ||
        (item.orderName && item.orderName.toLowerCase().includes(lowerQuery)) ||
        (item.client && item.client.toLowerCase().includes(lowerQuery)) ||
        (item.orderOwner && item.orderOwner.toLowerCase().includes(lowerQuery)) ||
        (item.costMethod && item.costMethod.toLowerCase().includes(lowerQuery))
      );
    });
    
    setFilteredItems(searchResults);
    sortItems(searchResults, sortKey, sortDirection);
  };

  const handleAlertAction = (lineItem: LineItem) => {
    // Find the line item
    if (!lineItem) return;

    // Simulate Zapier webhook call
    const webhookUrl = localStorage.getItem("zapierWebhook") || "https://hooks.zapier.com/example";
    simulateZapierWebhook(webhookUrl, lineItem);

    // Update the item in the UI
    const alertedTo = lineItem.orderOwner || "Team Lead";
    const alertedAt = new Date().toISOString();
    const updatedItems = displayItems.map(item => 
      item.id === lineItem.id ? { 
        ...item, 
        hasFlag: false, 
        alertedTo, 
        alertedAt 
      } : item
    );
    
    // Update flagged rows
    const newFlaggedRows = {...flaggedRows};
    newFlaggedRows[lineItem.id] = false;
    setFlaggedRows(newFlaggedRows);
    
    setDisplayItems(updatedItems);
    setFilteredItems(prev => 
      prev.map(item => item.id === lineItem.id ? { 
        ...item, 
        hasFlag: false, 
        alertedTo, 
        alertedAt 
      } : item)
    );
    
    // Record the alert in localStorage
    recordAlert({
      lineItemId: lineItem.id,
      orderId: lineItem.orderId,
      client: lineItem.client,
      alertedTo,
      alertedAt,
      savedHash: calculateItemHash(lineItem)
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

  const handleIgnoreAction = (lineItem: LineItem) => {
    // Update the item in the UI
    const updatedItems = displayItems.map(item => 
      item.id === lineItem.id ? { ...item, hasFlag: false, ignored: true } : item
    );
    
    // Update flagged rows
    const newFlaggedRows = {...flaggedRows};
    newFlaggedRows[lineItem.id] = false;
    setFlaggedRows(newFlaggedRows);
    
    setDisplayItems(updatedItems);
    setFilteredItems(prev => 
      prev.map(item => item.id === lineItem.id ? { ...item, hasFlag: false, ignored: true } : item)
    );
    
    // Record the ignore in localStorage
    recordAlert({
      lineItemId: lineItem.id,
      orderId: lineItem.orderId,
      client: lineItem.client,
      ignored: true,
      savedHash: calculateItemHash(lineItem)
    });
  };

  const handleResolveAction = (lineItem: LineItem) => {
    // Update the item in the UI
    const updatedItems = displayItems.map(item => 
      item.id === lineItem.id ? { 
        ...item, 
        hasFlag: false, 
        ignored: false, 
        alertedTo: "", 
        resolvedAt: new Date().toISOString() 
      } : item
    );
    
    setDisplayItems(updatedItems);
    setFilteredItems(prev => 
      prev.map(item => item.id === lineItem.id ? { 
        ...item, 
        hasFlag: false, 
        ignored: false, 
        alertedTo: "", 
        resolvedAt: new Date().toISOString() 
      } : item)
    );
    
    // Record the resolution in localStorage
    recordAlert({
      lineItemId: lineItem.id,
      orderId: lineItem.orderId,
      client: lineItem.client,
      resolved: true,
      resolvedAt: new Date().toISOString(),
      savedHash: calculateItemHash(lineItem)
    });
  };

  // Table columns configuration
  const tableColumns: TableColumn[] = [
    { key: "orderId", header: "Order ID", sortable: true },
    { key: "orderName", header: "Order Name", sortable: true },
    { key: "id", header: "Line Item ID", sortable: true },
    { key: "startDate", header: "Start Date", sortable: true },
    { key: "endDate", header: "End Date", sortable: true },
    { key: "costMethod", header: "Cost Method", sortable: true },
    { key: "quantity", header: "Quantity", sortable: true },
    { key: "quantityGap", header: "Quantity Gap", sortable: true },
    { key: "netCost", header: "Net Cost", sortable: true },
    { key: "advertiser", header: "Primary Advertiser", sortable: true },
    { key: "orderOwner", header: "Order Owner", sortable: true },
    { 
      key: "months", 
      header: "Months Spanned", 
      sortable: true,
      render: (value) => {
        const monthCount = value ? value.split(',').length : 0;
        return <span>{monthCount} ({value})</span>;
      }
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 mb-4">
        <Button variant="ghost" size="sm" onClick={onBackClick}>
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Views
        </Button>
        <h2 className="text-xl font-semibold">{view.name}</h2>
      </div>
      
      {/* Filters */}
      <FinanceFilters 
        advertisers={uniqueAdvertisers}
        owners={uniqueOwners}
        filterValues={filterValues}
        onFilterChange={handleFilterChange}
        onApplyFilters={applyFilters}
        onClearFilters={clearFilters}
        onSearchChange={handleSearch}
      />
      
      {/* Summary Stats */}
      <FinanceSummary 
        itemCount={issueCount}
        totalQuantityGap={totalQuantityGap}
        lastUpdated={lastUpdated}
      />
      
      {/* Data Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        {isLoading ? (
          <div className="py-8 text-center">Loading data...</div>
        ) : (
          <SortableTable 
            columns={tableColumns}
            data={displayItems}
            sortKey={sortKey}
            sortDirection={sortDirection}
            onSort={handleSort}
            onAlert={handleAlertAction}
            onIgnore={handleIgnoreAction}
            onResolve={handleResolveAction}
            flaggedRows={flaggedRows}
          />
        )}
      </div>
    </div>
  );
};

export default FinanceDetailView;
