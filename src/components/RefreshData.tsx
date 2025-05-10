import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Upload, FileText, Clock } from "lucide-react";
import { LineItem } from "@/components/LineItemTable";
import { useToast } from "@/components/ui/use-toast";

interface UploadHistoryEntry {
  id: string;
  timestamp: string;
  fileName: string;
  itemCount: number;
  flaggedItems: number;
  flaggedCPUMultiMonthItems: number;
}

interface RefreshDataProps {
  onDataRefreshed: (items: LineItem[], flaggedItemIds: string[]) => void;
  onCPUMultiMonthDataUpdated: (items: LineItem[]) => void; // New prop for CPU multi-month data
}

const RefreshData: React.FC<RefreshDataProps> = ({ 
  onDataRefreshed, 
  onCPUMultiMonthDataUpdated 
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadHistory, setUploadHistory] = useState<UploadHistoryEntry[]>([]);
  const { toast } = useToast();

  // Load upload history from localStorage on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem("uploadHistory");
    if (savedHistory) {
      try {
        setUploadHistory(JSON.parse(savedHistory));
      } catch (error) {
        console.error("Error parsing upload history", error);
      }
    }
  }, []);

  // Save upload history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("uploadHistory", JSON.stringify(uploadHistory));
  }, [uploadHistory]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const processFile = async () => {
    if (!file) return;
    
    setIsProcessing(true);
    
    try {
      // Simulate reading and processing the file
      // In a real implementation, you would parse the CSV/Excel file here
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate processing time
      
      // Simulate data from the file
      const sampleData: LineItem[] = generateSampleData(25);
      
      // Explicitly calculate months spanned for each item
      const processedData = sampleData.map(item => {
        const monthsSpanned = calculateMonthsSpanned(item);
        const isCPUMultiMonth = item.costMethod === "CPU" && monthsSpanned > 1;
        
        // Set the flag based on our condition
        return {
          ...item,
          hasFlag: isCPUMultiMonth
        };
      });
      
      // Identify all flagged items
      const flaggedItemIds = processedData
        .filter(item => item.hasFlag)
        .map(item => item.id);
      
      // Identify specifically CPU multi-month items
      const cpuMultiMonthItems = processedData.filter(item => 
        item.costMethod === "CPU" && calculateMonthsSpanned(item) > 1
      );
      
      console.log("Total items:", processedData.length);
      console.log("Flagged items:", flaggedItemIds.length);
      console.log("CPU multi-month items:", cpuMultiMonthItems.length);
      
      // Create a new history entry
      const newEntry: UploadHistoryEntry = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        fileName: file.name,
        itemCount: processedData.length,
        flaggedItems: flaggedItemIds.length,
        flaggedCPUMultiMonthItems: cpuMultiMonthItems.length
      };
      
      // Update history
      setUploadHistory(prev => [newEntry, ...prev]);
      
      // Update both the main data and CPU multi-month specific data
      onDataRefreshed(processedData, flaggedItemIds);
      onCPUMultiMonthDataUpdated(cpuMultiMonthItems);
      
      toast({
        title: "Data refreshed successfully",
        description: `Processed ${processedData.length} line items, found ${flaggedItemIds.length} flagged items including ${cpuMultiMonthItems.length} CPU multi-month items.`,
      });
      
      setFile(null);
    } catch (error) {
      console.error("Error processing file", error);
      toast({
        title: "Error refreshing data",
        description: "An error occurred while processing the file.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Calculate how many months an item spans
  const calculateMonthsSpanned = (item: LineItem): number => {
    if (!item.startDate || !item.endDate) {
      return item.months ? item.months.split(',').length : 0;
    }
    
    const start = new Date(item.startDate);
    const end = new Date(item.endDate);
    
    return (end.getFullYear() - start.getFullYear()) * 12 + 
      (end.getMonth() - start.getMonth()) + 1;
  };

  // Generate sample data
  const generateSampleData = (count: number): LineItem[] => {
    const items: LineItem[] = [];
    const costMethods = ["CPU", "CPM", "CPC", "Flat"];
    const statuses = ["Approved", "Pending", "Rejected"];
    const clients = ["Nike", "Adidas", "Puma", "Reebok", "Under Armour"];
    const owners = ["John Smith", "Jane Doe", "Bob Johnson", "Alice Williams"];
    
    // Ensure we have at least some CPU multi-month items
    const guaranteedCPUMultiMonthCount = Math.floor(count * 0.3); // 30% of items
    
    // Create guaranteed CPU multi-month items
    for (let i = 0; i < guaranteedCPUMultiMonthCount; i++) {
      const id = `LI-${Date.now()}-${i}`;
      const orderId = `ORD-${Math.floor(Math.random() * 10000)}`;
      
      // Force this to be CPU and multi-month
      items.push({
        id,
        orderId,
        orderName: `Order ${orderId}`,
        client: clients[Math.floor(Math.random() * clients.length)],
        startDate: "2023-01-01",
        endDate: "2023-03-31", // 3 months
        costMethod: "CPU", // Force CPU
        quantity: `${Math.floor(Math.random() * 1000000)}`,
        netCost: `$${(Math.random() * 10000).toFixed(2)}`,
        deliveryPercent: `${(Math.random() * 100).toFixed(2)}%`,
        approvalStatus: statuses[Math.floor(Math.random() * statuses.length)],
        orderOwner: owners[Math.floor(Math.random() * owners.length)],
        hasFlag: true, // Pre-flagged
        alertedTo: "",
        months: "Jan,Feb,Mar" // 3 months
      });
    }
    
    // Create remaining random items
    for (let i = guaranteedCPUMultiMonthCount; i < count; i++) {
      const id = `LI-${Date.now()}-${i}`;
      const orderId = `ORD-${Math.floor(Math.random() * 10000)}`;
      const costMethod = costMethods[Math.floor(Math.random() * costMethods.length)];
      
      // For some items, create multi-month spans
      const isMultiMonth = Math.random() > 0.7;
      const startDate = "2023-01-01";
      const endDate = isMultiMonth ? "2023-03-31" : "2023-01-31";
      const monthsArray = isMultiMonth ? ["Jan", "Feb", "Mar"] : ["Jan"];
      
      items.push({
        id,
        orderId,
        orderName: `Order ${orderId}`,
        client: clients[Math.floor(Math.random() * clients.length)],
        startDate,
        endDate,
        costMethod,
        quantity: `${Math.floor(Math.random() * 1000000)}`,
        netCost: `$${(Math.random() * 10000).toFixed(2)}`,
        deliveryPercent: `${(Math.random() * 100).toFixed(2)}%`,
        approvalStatus: statuses[Math.floor(Math.random() * statuses.length)],
        orderOwner: owners[Math.floor(Math.random() * owners.length)],
        hasFlag: costMethod === "CPU" && isMultiMonth, // Flag only CPU multi-month
        alertedTo: "",
        cpm: costMethod === "CPM" ? `$${(Math.random() * 10).toFixed(2)}` : undefined,
        months: monthsArray.join(",")
      });
    }
    
    return items;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Refresh Data</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Input 
              type="file" 
              accept=".csv,.xlsx,.xls" 
              onChange={handleFileChange}
              className="max-w-sm"
            />
            <Button 
              onClick={processFile}
              disabled={!file || isProcessing}
              className="flex items-center gap-2"
            >
              <Upload className="h-4 w-4" />
              {isProcessing ? "Processing..." : "Refresh Data"}
            </Button>
            
            {/* Test Data Button */}
            <Button 
              onClick={() => {
                // Create a mock file
                const mockFile = new File([""], "test-data.csv", { type: "text/csv" });
                setFile(mockFile);
                setTimeout(() => processFile(), 100);
              }}
              className="ml-2 bg-gray-200 text-gray-800 hover:bg-gray-300"
            >
              Generate Test Data
            </Button>
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Upload a CSV or Excel file to refresh line item data. This will identify CPU cost method orders spanning multiple months.
          </p>
        </CardContent>
      </Card>
      
      {/* Upload History */}
      <Card>
        <CardHeader>
          <CardTitle>Upload History</CardTitle>
        </CardHeader>
        <CardContent>
          {uploadHistory.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-6 text-center text-gray-500">
              <FileText className="h-12 w-12 mb-4 text-gray-400" />
              <p>No upload history yet</p>
              <p className="text-sm">Upload data to see history here</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>File Name</TableHead>
                  <TableHead className="text-right">Items</TableHead>
                  <TableHead className="text-right">Flagged Items</TableHead>
                  <TableHead className="text-right">CPU Multi-Month</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {uploadHistory.map(entry => (
                  <TableRow key={entry.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        {new Date(entry.timestamp).toLocaleString()}
                      </div>
                    </TableCell>
                    <TableCell>{entry.fileName}</TableCell>
                    <TableCell className="text-right">{entry.itemCount}</TableCell>
                    <TableCell className="text-right">{entry.flaggedItems}</TableCell>
                    <TableCell className="text-right font-medium text-red-600">
                      {entry.flaggedCPUMultiMonthItems}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RefreshData;