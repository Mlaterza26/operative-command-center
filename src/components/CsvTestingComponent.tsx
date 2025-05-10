
import React, { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { parse } from "papaparse";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { RefreshCw, FileText, Upload, Clock } from "lucide-react";
import { toast } from "sonner";

interface CsvLineItem {
  "Order ID": string;
  "Line Item ID": string;
  "Line Item Name": string;
  "Line Item Cost Method": string;
  "Line Item Start Date": string;
  "Line Item End Date": string;
  "Line Item Quantity": string;
  [key: string]: string; // Allow for additional columns
}

interface ProcessedLineItem {
  orderId: string;
  lineItemId: string;
  lineItemName: string;
  costMethod: string;
  startDate: string;
  endDate: string;
  monthsSpanned: number;
  quantity: number;
  requiredQuantity: number;
  quantityGap: number;
  flagged: boolean;
}

interface UploadRecord {
  id: string;
  fileName: string;
  timestamp: string;
  itemCount: number;
  flaggedCount: number;
}

const CsvTestingComponent: React.FC = () => {
  const [csvData, setCsvData] = useState<CsvLineItem[]>([]);
  const [processedData, setProcessedData] = useState<ProcessedLineItem[]>([]);
  const [isProcessed, setIsProcessed] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string>("");
  
  // Summary statistics
  const [totalCpuItems, setTotalCpuItems] = useState(0);
  const [flaggedItems, setFlaggedItems] = useState(0);
  const [totalQuantityGap, setTotalQuantityGap] = useState(0);
  
  // Upload history
  const [uploadHistory, setUploadHistory] = useState<UploadRecord[]>([]);

  // Load upload history from localStorage on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('cpuDataUploadHistory');
    if (savedHistory) {
      try {
        setUploadHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Failed to parse upload history:", e);
      }
    }
  }, []);

  // Save upload history to localStorage whenever it changes
  useEffect(() => {
    if (uploadHistory.length > 0) {
      localStorage.setItem('cpuDataUploadHistory', JSON.stringify(uploadHistory));
    }
  }, [uploadHistory]);

  const handleDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setUploadedFileName(file.name);
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (e.target?.result) {
          parse(e.target.result as string, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
              setCsvData(results.data as CsvLineItem[]);
              setIsProcessed(false);
              toast.success(`File "${file.name}" uploaded successfully`, {
                description: `${results.data.length} rows found in the CSV file.`
              });
            },
            error: (error) => {
              toast.error("Error parsing CSV file", {
                description: error.message
              });
            }
          });
        }
      };
      reader.readAsText(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop: handleDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.ms-excel': ['.csv']
    },
    multiple: false
  });

  const calculateMonthsSpanned = (startDate: string, endDate: string): number => {
    try {
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return 0;
      }
      
      return (end.getFullYear() - start.getFullYear()) * 12 + 
        (end.getMonth() - start.getMonth()) + 1;
    } catch (error) {
      console.error("Error calculating months:", error);
      return 0;
    }
  };

  const processData = () => {
    if (csvData.length === 0) {
      toast.error("No CSV data to process", {
        description: "Please upload a CSV file first."
      });
      return;
    }

    // Filter for CPU line items and process them
    const cpuItems = csvData.filter(item => 
      item["Line Item Cost Method"]?.toLowerCase().includes("cpu")
    );
    
    let flaggedCount = 0;
    let totalGap = 0;
    
    const processed = cpuItems.map(item => {
      const startDate = item["Line Item Start Date"] || "";
      const endDate = item["Line Item End Date"] || "";
      const quantity = parseInt(item["Line Item Quantity"] || "0", 10);
      
      const monthsSpanned = calculateMonthsSpanned(startDate, endDate);
      const requiredQuantity = monthsSpanned;
      const quantityGap = quantity - requiredQuantity;
      const isFlagged = quantity < monthsSpanned;
      
      if (isFlagged) {
        flaggedCount++;
        totalGap += quantityGap;
      }
      
      return {
        orderId: item["Order ID"] || "",
        lineItemId: item["Line Item ID"] || "",
        lineItemName: item["Line Item Name"] || "",
        costMethod: item["Line Item Cost Method"] || "",
        startDate,
        endDate,
        monthsSpanned,
        quantity,
        requiredQuantity,
        quantityGap,
        flagged: isFlagged
      };
    });

    setProcessedData(processed);
    setTotalCpuItems(cpuItems.length);
    setFlaggedItems(flaggedCount);
    setTotalQuantityGap(totalGap);
    setIsProcessed(true);
    
    // Record this upload in the history
    const newUploadRecord: UploadRecord = {
      id: Date.now().toString(),
      fileName: uploadedFileName || "Data refresh",
      timestamp: new Date().toISOString(),
      itemCount: cpuItems.length,
      flaggedCount
    };
    
    setUploadHistory(prev => [newUploadRecord, ...prev]);
    
    toast.success("CPU data refreshed", {
      description: `${cpuItems.length} CPU line items found, ${flaggedCount} items flagged.`
    });
  };

  return (
    <div className="space-y-6">
      <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Refresh CPU Data</h2>
        
        {/* File Upload Area */}
        <div 
          {...getRootProps()} 
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
            ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'}`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center space-y-2">
            <Upload className="h-10 w-10 text-gray-400" />
            {isDragActive ? (
              <p className="text-blue-600 font-medium">Drop the CSV file here...</p>
            ) : (
              <>
                <p className="font-medium">Upload a CSV file or drag and drop</p>
                <p className="text-sm text-gray-500">CSV files containing CPU cost method items</p>
              </>
            )}
          </div>
        </div>
        
        {/* File Info & Process Button */}
        <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between">
          <div>
            {uploadedFileName && (
              <div className="flex items-center text-sm text-gray-600">
                <FileText className="h-4 w-4 mr-1" />
                <span className="truncate max-w-xs">{uploadedFileName}</span>
                <span className="ml-2 text-gray-500">({csvData.length} rows)</span>
              </div>
            )}
          </div>
          <Button 
            onClick={processData} 
            disabled={csvData.length === 0}
            className="mt-3 sm:mt-0"
          >
            Refresh CPU Data
            <RefreshCw className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Upload History */}
      <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Upload History</h2>
        {uploadHistory.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Clock className="mx-auto h-8 w-8 mb-2 opacity-40" />
            <p>No upload history yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>File Name</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Flagged</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {uploadHistory.map(record => (
                  <TableRow key={record.id}>
                    <TableCell>{new Date(record.timestamp).toLocaleString()}</TableCell>
                    <TableCell>{record.fileName}</TableCell>
                    <TableCell>{record.itemCount}</TableCell>
                    <TableCell>{
                      record.flaggedCount > 0 ? 
                        <span className="font-medium text-amber-600">{record.flaggedCount}</span> : 
                        record.flaggedCount
                    }</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
      
      {/* Results Section */}
      {isProcessed && (
        <div className="space-y-4">
          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="text-sm text-gray-500 mb-1">Total CPU Line Items</div>
              <div className="text-2xl font-semibold">{totalCpuItems}</div>
            </div>
            <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="text-sm text-gray-500 mb-1">Items Flagged</div>
              <div className="text-2xl font-semibold text-amber-600">{flaggedItems}</div>
            </div>
            <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="text-sm text-gray-500 mb-1">Total Quantity Gap</div>
              <div className="text-2xl font-semibold text-red-600">{totalQuantityGap}</div>
            </div>
          </div>
          
          {/* Results Table */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Line Item ID</TableHead>
                    <TableHead>Line Item Name</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>End Date</TableHead>
                    <TableHead>Months Spanned</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Required Qty</TableHead>
                    <TableHead>Quantity Gap</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {processedData.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={10} className="text-center py-8 text-gray-500">
                        No CPU line items found in the CSV data
                      </TableCell>
                    </TableRow>
                  ) : (
                    processedData.map((item, index) => (
                      <TableRow 
                        key={`${item.lineItemId}-${index}`}
                        className={item.flagged ? "bg-amber-50" : ""}
                      >
                        <TableCell>{item.orderId}</TableCell>
                        <TableCell>{item.lineItemId}</TableCell>
                        <TableCell>{item.lineItemName}</TableCell>
                        <TableCell>{item.startDate}</TableCell>
                        <TableCell>{item.endDate}</TableCell>
                        <TableCell>{item.monthsSpanned}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>{item.requiredQuantity}</TableCell>
                        <TableCell className={item.quantityGap < 0 ? "text-red-600 font-medium" : ""}>
                          {item.quantityGap}
                        </TableCell>
                        <TableCell>
                          {item.flagged ? (
                            <span className="px-2 py-1 rounded-full text-xs bg-amber-100 text-amber-800 font-medium">
                              Flagged
                            </span>
                          ) : (
                            <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800 font-medium">
                              OK
                            </span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CsvTestingComponent;
