import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Upload, FileText, Clock } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import Papa from 'papaparse';
import * as XLSX from 'xlsx';

// Define types more clearly
interface LineItem {
  id: string;
  orderId: string;
  orderName: string;
  client: string;
  startDate: string;
  endDate: string;
  costMethod: string;
  quantity: string;
  netCost: string;
  deliveryPercent: string;
  approvalStatus: string;
  orderOwner: string;
  hasFlag: boolean;
  alertedTo: string;
  cpm: string;
  months: string;
}

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
  onCPUMultiMonthDataUpdated: (items: LineItem[]) => void;
}

const RefreshData: React.FC<RefreshDataProps> = ({ 
  onDataRefreshed, 
  onCPUMultiMonthDataUpdated 
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadHistory, setUploadHistory] = useState<UploadHistoryEntry[]>([]);
  const [parseErrors, setParseErrors] = useState<string[]>([]);
  const { toast } = useToast();

  // Load upload history from localStorage on component mount
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem("uploadHistory");
      if (savedHistory) {
        setUploadHistory(JSON.parse(savedHistory));
      }
    } catch (error) {
      console.error("Error parsing upload history", error);
      // Don't let a localStorage error crash the component
      localStorage.removeItem("uploadHistory");
    }
  }, []);

  // Save upload history to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem("uploadHistory", JSON.stringify(uploadHistory));
    } catch (error) {
      console.error("Error saving upload history", error);
    }
  }, [uploadHistory]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setParseErrors([]);
    }
  };

  // Read a file as text (for CSV)
  const readFileAsText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          resolve(event.target.result as string);
        } else {
          reject(new Error("Failed to read file"));
        }
      };
      reader.onerror = (error) => reject(error);
      reader.readAsText(file);
    });
  };

  // Read a file as array buffer (for Excel)
  const readFileAsArrayBuffer = (file: File): Promise<ArrayBuffer> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          resolve(event.target.result as ArrayBuffer);
        } else {
          reject(new Error("Failed to read file"));
        }
      };
      reader.onerror = (error) => reject(error);
      reader.readAsArrayBuffer(file);
    });
  };

  // Parse CSV data into LineItems
  const parseCSV = async (file: File): Promise<LineItem[]> => {
    const fileContent = await readFileAsText(file);
    const errors: string[] = [];
    
    return new Promise((resolve, reject) => {
      Papa.parse(fileContent, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: true, // Automatically convert numeric values
        complete: (results) => {
          try {
            if (!results.data || results.data.length === 0) {
              throw new Error("No data found in CSV file");
            }
            
            console.log("CSV Headers:", Object.keys(results.data[0] || {}));
            
            const lineItems: LineItem[] = [];
            
            // Map each row to a LineItem, with better error handling
            results.data.forEach((row: any, index) => {
              // Skip rows without Line Item ID
              if (!row["Line Item ID"] && row["Line Item ID"] !== 0) {
                errors.push(`Row ${index + 1}: Missing Line Item ID`);
                return;
              }
              
              // Convert Line Item ID to string (in case dynamicTyping made it a number)
              const lineItemId = String(row["Line Item ID"]);
              
              // Create the line item object
              const lineItem: LineItem = {
                id: lineItemId,
                orderId: row["Order ID"] !== undefined ? String(row["Order ID"]) : "",
                orderName: row["Order Name"] || `Order ${row["Order ID"] || index}`,
                client: row["Primary Advertiser"] || row["Billing Account Name"] || "Unknown Client",
                startDate: row["Line Item Start Date"] || "",
                endDate: row["Line Item End Date"] || "",
                costMethod: row["Line Item Cost Method"] || "Unknown",
                quantity: row["Line Item Quantity"] !== undefined ? String(row["Line Item Quantity"]) : "",
                netCost: row["Net Line Item Cost"] !== undefined ? `$${row["Net Line Item Cost"]}` : "$0.00",
                deliveryPercent: "0%", // Not present in your CSV
                approvalStatus: row["Invoice Review Status"] || "Pending",
                orderOwner: row["Order Owner"] || "Unknown",
                hasFlag: false, // Will be set later
                alertedTo: "", // Not present in your CSV
                cpm: row["Net Line Item Unit Cost"] !== undefined ? `$${row["Net Line Item Unit Cost"]}` : "",
                months: "" // Will calculate based on start/end dates
              };
              
              lineItems.push(lineItem);
            });
            
            if (errors.length > 0) {
              console.warn("Parse warnings:", errors);
              setParseErrors(errors);
            }
            
            if (lineItems.length === 0) {
              errors.push("No valid line items found in file");
              reject(new Error("No valid line items found in file"));
            } else {
              resolve(lineItems);
            }
          } catch (error) {
            console.error("Error processing CSV data:", error);
            reject(error);
          }
        },
        error: (error) => {
          console.error("PapaParse error:", error);
          reject(error);
        }
      });
    });
  };

  // Parse Excel data into LineItems
  const parseExcel = async (file: File): Promise<LineItem[]> => {
    const buffer = await readFileAsArrayBuffer(file);
    const workbook = XLSX.read(buffer, { 
      type: 'array',
      cellDates: true // Handle dates properly
    });
    const errors: string[] = [];
    
    // Get the first sheet
    const firstSheetName = workbook.SheetNames[0];
    if (!firstSheetName) {
      throw new Error("No sheets found in Excel file");
    }
    
    const worksheet = workbook.Sheets[firstSheetName];
    if (!worksheet) {
      throw new Error("Could not read sheet in Excel file");
    }
    
    // Convert to JSON with headers
    const data = XLSX.utils.sheet_to_json(worksheet, { 
      header: "A",
      blankrows: false
    });
    
    if (data.length <= 1) { // Only header row or empty
      throw new Error("No data found in Excel file");
    }
    
    // Get headers from first row
    const headers = data[0];
    const headerMap: {[key: string]: string} = {};
    
    Object.entries(headers).forEach(([col, header]) => {
      headerMap[col] = String(header);
    });
    
    // Find the key for "Line Item ID" in the header map
    const lineItemIdKey = Object.entries(headerMap)
      .find(([_, val]) => val === "Line Item ID")?.[0];
    
    if (!lineItemIdKey) {
      throw new Error("Missing 'Line Item ID' column in Excel file");
    }
    
    console.log("Excel Headers:", headerMap);
    
    // Map to LineItems, skipping header row
    const lineItems: LineItem[] = [];
    
    for (let i = 1; i < data.length; i++) {
      const row = data[i] as any;
      
      // Skip rows without Line Item ID
      if (!row[lineItemIdKey]) {
        errors.push(`Row ${i + 1}: Missing Line Item ID`);
        continue;
      }
      
      // Function to safely get a cell value by header name
      const getCell = (headerName: string): any => {
        const key = Object.entries(headerMap)
          .find(([_, val]) => val === headerName)?.[0];
        return key ? row[key] : undefined;
      };
      
      // Format date if it's a Date object
      const formatDate = (date: any): string => {
        if (!date) return "";
        if (date instanceof Date) {
          return date.toISOString().split('T')[0]; // YYYY-MM-DD
        }
        return String(date);
      };
      
      // Create the line item
      const lineItem: LineItem = {
        id: String(row[lineItemIdKey]),
        orderId: getCell("Order ID") !== undefined ? String(getCell("Order ID")) : "",
        orderName: getCell("Order Name") || `Order ${getCell("Order ID") || i}`,
        client: getCell("Primary Advertiser") || getCell("Billing Account Name") || "Unknown Client",
        startDate: formatDate(getCell("Line Item Start Date")),
        endDate: formatDate(getCell("Line Item End Date")),
        costMethod: getCell("Line Item Cost Method") || "Unknown",
        quantity: getCell("Line Item Quantity") !== undefined ? String(getCell("Line Item Quantity")) : "",
        netCost: getCell("Net Line Item Cost") !== undefined ? `$${getCell("Net Line Item Cost")}` : "$0.00",
        deliveryPercent: "0%",
        approvalStatus: getCell("Invoice Review Status") || "Pending",
        orderOwner: getCell("Order Owner") || "Unknown",
        hasFlag: false,
        alertedTo: "",
        cpm: getCell("Net Line Item Unit Cost") !== undefined ? `$${getCell("Net Line Item Unit Cost")}` : "",
        months: ""
      };
      
      lineItems.push(lineItem);
    }
    
    if (errors.length > 0) {
      console.warn("Parse warnings:", errors);
      setParseErrors(errors);
    }
    
    if (lineItems.length === 0) {
      errors.push("No valid line items found in file");
      throw new Error("No valid line items found in file");
    }
    
    return lineItems;
  };

  // Calculate how many months an item spans
  const calculateMonthsSpanned = (item: LineItem): number => {
    if (!item.startDate || !item.endDate) {
      return item.months ? item.months.split(',').length : 0;
    }
    
    try {
      // Try parsing dates in various formats
      let start: Date | null = null;
      let end: Date | null = null;
      
      // Try to parse as ISO format (YYYY-MM-DD)
      if (item.startDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
        start = new Date(item.startDate);
      }
      // Try to parse as MM/DD/YYYY
      else if (item.startDate.match(/^\d{1,2}\/\d{1,2}\/\d{4}$/)) {
        const [month, day, year] = item.startDate.split('/').map(Number);
        start = new Date(year, month - 1, day);
      }
      
      // Try to parse end date as ISO format
      if (item.endDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
        end = new Date(item.endDate);
      }
      // Try to parse end date as MM/DD/YYYY
      else if (item.endDate.match(/^\d{1,2}\/\d{1,2}\/\d{4}$/)) {
        const [month, day, year] = item.endDate.split('/').map(Number);
        end = new Date(year, month - 1, day);
      }
      
      // If we couldn't parse the dates, return 0 or count from months field
      if (!start || !end || isNaN(start.getTime()) || isNaN(end.getTime())) {
        return item.months ? item.months.split(',').length : 0;
      }
      
      // Calculate months difference
      const months = (end.getFullYear() - start.getFullYear()) * 12 + 
        (end.getMonth() - start.getMonth()) + 1;
      
      return Math.max(months, 1); // Ensure at least 1 month
    } catch (error) {
      console.error("Error calculating months spanned:", error, item);
      return item.months ? item.months.split(',').length : 0;
    }
  };

  // Process the file based on its type
  const processFile = async () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a file to upload.",
        variant: "destructive"
      });
      return;
    }
    
    setIsProcessing(true);
    setParseErrors([]);
    
    try {
      let lineItems: LineItem[] = [];
      
      // Determine file type and parse accordingly
      const fileType = file.name.split('.').pop()?.toLowerCase();
      
      if (fileType === 'csv') {
        lineItems = await parseCSV(file);
      } else if (fileType === 'xlsx' || fileType === 'xls') {
        lineItems = await parseExcel(file);
      } else {
        throw new Error("Unsupported file type. Please upload a CSV or Excel file.");
      }
      
      console.log(`Successfully parsed ${lineItems.length} line items`);
      
      // Log some sample data
      if (lineItems.length > 0) {
        console.log("Sample item:", lineItems[0]);
      }
      
      // Apply flagging logic
      const processedData = lineItems.map(item => {
        const monthsSpanned = calculateMonthsSpanned(item);
        
        // Set months field for display purposes
        if (!item.months && monthsSpanned > 0) {
          // Generate month names based on start date
          const months = [];
          if (item.startDate) {
            const start = new Date(item.startDate);
            if (!isNaN(start.getTime())) {
              for (let i = 0; i < monthsSpanned; i++) {
                const month = new Date(start);
                month.setMonth(start.getMonth() + i);
                months.push(month.toLocaleString('default', { month: 'short' }));
              }
              item.months = months.join(',');
            }
          }
        }
        
        // Check if this is a CPU multi-month item
        const costMethodLower = item.costMethod.toLowerCase();
        const isCPUMultiMonth = (
          costMethodLower === "cpu" || 
          costMethodLower === "cost per unit"
        ) && monthsSpanned > 1;
        
        console.log(`Item ${item.id} - Cost Method: ${item.costMethod}, Months: ${monthsSpanned}, Flag: ${isCPUMultiMonth}`);
        
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
      const cpuMultiMonthItems = processedData.filter(item => item.hasFlag);
      
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
      
      // Show warning if no flagged items found
      if (flaggedItemIds.length === 0) {
        console.warn("No CPU multi-month items found. Check data format and cost method values.");
        setParseErrors(prev => [...prev, "No CPU multi-month items found. Make sure your file has Line Item Cost Method = 'CPU' and date spans > 1 month."]);
        
        toast({
          title: "Data refreshed with warning",
          description: `Processed ${processedData.length} line items, but found no CPU multi-month items.`,
          variant: "warning"
        });
      } else {
        toast({
          title: "Data refreshed successfully",
          description: `Processed ${processedData.length} line items, found ${flaggedItemIds.length} flagged items including ${cpuMultiMonthItems.length} CPU multi-month items.`,
        });
      }
      
      // Clear file input after successful processing
      setFile(null);
      if (document.getElementById('file-input') as HTMLInputElement) {
        (document.getElementById('file-input') as HTMLInputElement).value = '';
      }
    } catch (error) {
      console.error("Error processing file:", error);
      toast({
        title: "Error refreshing data",
        description: error instanceof Error ? error.message : "An error occurred while processing the file.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
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
              id="file-input"
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
          </div>
          
          {parseErrors.length > 0 && (
            <div className="mt-4 p-4 border border-red-200 rounded bg-red-50">
              <h4 className="text-red-800 font-medium mb-2">Warning:</h4>
              <ul className="text-sm text-red-700 list-disc pl-5">
                {parseErrors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}
          
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