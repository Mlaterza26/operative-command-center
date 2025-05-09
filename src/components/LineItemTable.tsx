
import React from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertTriangle, BellOff } from "lucide-react";
import StatusBadge from "@/components/StatusBadge";

export interface LineItem {
  id: string;
  orderId: string;
  orderName?: string;
  client: string;
  startDate?: string;
  endDate?: string;
  costMethod: string;
  quantity?: string;
  netCost: string;
  deliveryPercent?: string;
  approvalStatus: string;
  orderOwner: string;
  hasFlag: boolean;
  alertedTo: string;
  cpm?: string;
  months?: string;
}

interface LineItemTableProps {
  items: LineItem[];
  onAlertAction: (lineItemId: string) => void;
  onIgnoreAction: (lineItemId: string) => void;
}

const LineItemTable: React.FC<LineItemTableProps> = ({ items, onAlertAction, onIgnoreAction }) => {
  // Function to calculate months spanned
  const calculateMonthsSpanned = (startDate: string, endDate: string): number => {
    if (!startDate || !endDate) return 0;
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    return (end.getFullYear() - start.getFullYear()) * 12 + 
      (end.getMonth() - start.getMonth()) + 1;
  };
  
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>Order Name</TableHead>
            <TableHead>Line Item ID</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead>End Date</TableHead>
            <TableHead>Cost Method</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Net Cost</TableHead>
            <TableHead>Advertiser</TableHead>
            <TableHead>Order Owner</TableHead>
            <TableHead>Months Spanned</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => {
            const monthsSpanned = item.startDate && item.endDate 
              ? calculateMonthsSpanned(item.startDate, item.endDate)
              : (item.months ? item.months.split(',').length : 0);
              
            return (
              <TableRow 
                key={item.id} 
                className={item.hasFlag ? "bg-red-50" : undefined}
              >
                <TableCell>{item.orderId}</TableCell>
                <TableCell>{item.orderName || "Order " + item.orderId}</TableCell>
                <TableCell>{item.id}</TableCell>
                <TableCell>{item.startDate || "2023-01-01"}</TableCell>
                <TableCell>{item.endDate || "2023-03-31"}</TableCell>
                <TableCell className="font-medium">
                  {item.costMethod === "CPU" ? (
                    <span className="text-red-600">{item.costMethod}</span>
                  ) : (
                    item.costMethod
                  )}
                </TableCell>
                <TableCell>{item.quantity || "100,000"}</TableCell>
                <TableCell>{item.netCost}</TableCell>
                <TableCell>{item.client}</TableCell>
                <TableCell>{item.orderOwner}</TableCell>
                <TableCell>
                  {monthsSpanned > 1 ? (
                    <span className="text-red-600 font-medium">{monthsSpanned} months</span>
                  ) : (
                    <span>{monthsSpanned} month</span>
                  )}
                </TableCell>
                <TableCell>
                  <StatusBadge status={item.approvalStatus} />
                </TableCell>
                <TableCell>
                  {item.hasFlag ? (
                    <div className="flex space-x-1">
                      <Button 
                        size="sm" 
                        variant="destructive" 
                        onClick={() => onAlertAction(item.id)}
                        className="flex items-center"
                      >
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        Alert
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => onIgnoreAction(item.id)}
                      >
                        <BellOff className="h-3 w-3 mr-1" />
                        Ignore
                      </Button>
                    </div>
                  ) : item.alertedTo ? (
                    <span className="text-sm text-gray-500">
                      Alerted to {item.alertedTo}
                    </span>
                  ) : (
                    <span className="text-sm text-gray-500">No action needed</span>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default LineItemTable;
