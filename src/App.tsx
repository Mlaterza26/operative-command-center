import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LineItemTable, { LineItem } from '@/components/LineItemTable';
import RefreshData from '@/components/RefreshData';
import { useToast } from '@/components/ui/use-toast';

const App = () => {
  const [lineItems, setLineItems] = useState<LineItem[]>([]);
  const [flaggedItemIds, setFlaggedItemIds] = useState<string[]>([]);
  const [cpuMultiMonthItems, setCpuMultiMonthItems] = useState<LineItem[]>([]);
  const { toast } = useToast();
  
  const handleDataRefreshed = (items: LineItem[], flagged: string[]) => {
    setLineItems(items);
    setFlaggedItemIds(flagged);
  };
  
  const handleCPUMultiMonthDataUpdated = (items: LineItem[]) => {
    setCpuMultiMonthItems(items);
    
    // Automatically switch to the CPU Multi-Month tab if there are items
    if (items.length > 0) {
      toast({
        title: "CPU Multi-Month Items Updated",
        description: `Found ${items.length} CPU cost method orders spanning multiple months.`,
      });
    }
  };
  
  const handleAlertAction = (itemId: string) => {
    // Implementation for handling alerts
    console.log(`Alert action for item ${itemId}`);
  };
  
  const handleIgnoreAction = (itemId: string) => {
    // Implementation for handling ignores
    console.log(`Ignore action for item ${itemId}`);
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Operative Command Center</h1>
      
      <Tabs defaultValue="refreshData">
        <TabsList className="mb-4">
          <TabsTrigger value="refreshData">Refresh Data</TabsTrigger>
          <TabsTrigger value="lineItems">All Line Items</TabsTrigger>
          <TabsTrigger value="cpuMultiMonth">
            CPU Multi-Month
            {cpuMultiMonthItems.length > 0 && (
              <span className="ml-2 bg-red-600 text-white rounded-full px-2 py-0.5 text-xs">
                {cpuMultiMonthItems.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="refreshData">
          <RefreshData 
            onDataRefreshed={handleDataRefreshed}
            onCPUMultiMonthDataUpdated={handleCPUMultiMonthDataUpdated}
          />
        </TabsContent>
        
        <TabsContent value="lineItems">
          <LineItemTable 
            items={lineItems}
            onAlertAction={handleAlertAction}
            onIgnoreAction={handleIgnoreAction}
          />
        </TabsContent>
        
        <TabsContent value="cpuMultiMonth">
          {cpuMultiMonthItems.length === 0 ? (
            <div className="text-center py-12 border rounded-lg bg-gray-50">
              <p className="text-gray-500">No CPU cost method orders spanning multiple months found.</p>
              <p className="text-sm text-gray-400 mt-2">
                Upload data in the Refresh Data tab to identify these line items.
              </p>
            </div>
          ) : (
            <LineItemTable 
              items={cpuMultiMonthItems}
              onAlertAction={handleAlertAction}
              onIgnoreAction={handleIgnoreAction}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default App;