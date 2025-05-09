
import React, { useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { AlertTriangle, ArrowDown, ArrowUp, Check, CircleCheck } from "lucide-react";
import { toast } from "sonner";
import AlertModal from "./AlertModal";
import { LineItem } from "./FinanceDetailView";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export interface TableColumn {
  key: string;
  header: string;
  sortable?: boolean;
  render?: (value: any, row: any) => React.ReactNode;
}

interface SortableTableProps {
  columns: TableColumn[];
  data: any[];
  sortKey: string;
  sortDirection: 'asc' | 'desc';
  onSort: (key: string) => void;
  onAlert: (item: any) => void;
  onIgnore: (item: any) => void;
  onResolve?: (item: any) => void;
  flaggedRows?: Record<string, boolean>;
}

const SortableTable: React.FC<SortableTableProps> = ({
  columns,
  data,
  sortKey,
  sortDirection,
  onSort,
  onAlert,
  onIgnore,
  onResolve,
  flaggedRows = {}
}) => {
  const [alertModalOpen, setAlertModalOpen] = useState(false);
  const [selectedLineItem, setSelectedLineItem] = useState<LineItem | null>(null);

  const handleSort = (key: string) => {
    onSort(key);
  };

  const handleAlertClick = (item: LineItem) => {
    setSelectedLineItem(item);
    setAlertModalOpen(true);
  };

  const handleSendAlert = (item: LineItem, recipients: string[], channels: string[]) => {
    onAlert(item);
    const recipientsList = recipients.join(", ");
    const channelsList = channels.map(c => c.charAt(0).toUpperCase() + c.slice(1)).join(" and ");
    
    toast.success(`Attention request sent - thank you for helping maintain data quality!`, {
      description: `Sent to ${recipientsList} via ${channelsList}`
    });
  };

  const handleIgnore = (item: any) => {
    onIgnore(item);
    toast.success(`Line item ${item.id} marked as reviewed`, {
      description: "Thank you for reviewing this item"
    });
  };

  const handleResolve = (item: any) => {
    if (onResolve) {
      onResolve(item);
      toast.success(`Line item ${item.id} marked as resolved`, {
        description: "Thank you for resolving this issue"
      });
    }
  };

  // Function to display status badge
  const getStatusBadge = (item: any) => {
    if (item.alertedTo) {
      return (
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
          <AlertTriangle className="mr-1 h-3 w-3" />
          Attention Requested
        </Badge>
      );
    } else if (item.ignored) {
      return (
        <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
          <CircleCheck className="mr-1 h-3 w-3" />
          Reviewed
        </Badge>
      );
    } else if (flaggedRows[item.id]) {
      return (
        <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
          <AlertTriangle className="mr-1 h-3 w-3" />
          Needs Review
        </Badge>
      );
    }
    return null;
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              {columns.map((column) => (
                <TableHead 
                  key={column.key}
                  className={`${column.sortable ? 'cursor-pointer hover:bg-gray-100' : ''} 
                    whitespace-nowrap font-medium`}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="flex items-center">
                    {column.header}
                    {column.sortable && sortKey === column.key && (
                      <span className="ml-1">
                        {sortDirection === 'asc' ? (
                          <ArrowUp className="h-4 w-4" />
                        ) : (
                          <ArrowDown className="h-4 w-4" />
                        )}
                      </span>
                    )}
                  </div>
                </TableHead>
              ))}
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length + 2} className="text-center py-8 text-gray-500">
                  No data available
                </TableCell>
              </TableRow>
            ) : (
              data.map((row, index) => {
                const isIssueRow = flaggedRows[row.id];
                const isAlertedRow = row.alertedTo;
                const isIgnoredRow = row.ignored;
                const isEven = index % 2 === 0;
                
                let rowClassName = "hover:bg-gray-100 transition-colors";
                if (isAlertedRow) rowClassName += " bg-blue-50";
                else if (isIgnoredRow) rowClassName += " bg-gray-50";
                else if (isIssueRow) rowClassName += " bg-amber-50";
                else rowClassName += isEven ? " bg-gray-50" : " bg-white";
                
                return (
                  <TableRow 
                    key={row.id} 
                    className={rowClassName}
                  >
                    {columns.map((column) => (
                      <TableCell 
                        key={`${row.id}-${column.key}`}
                        className={`${column.key === 'quantityGap' && isIssueRow ? 'text-red-600 font-medium' : ''}`}
                      >
                        {column.render 
                          ? column.render(row[column.key], row) 
                          : row[column.key]}
                      </TableCell>
                    ))}
                    
                    {/* Status Column */}
                    <TableCell>
                      {getStatusBadge(row)}
                    </TableCell>
                    
                    {/* Actions Column */}
                    <TableCell>
                      <div className="flex gap-2">
                        {!isAlertedRow && !isIgnoredRow && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={() => handleAlertClick(row)}
                                  className="border-blue-500 text-blue-700 hover:bg-blue-50"
                                >
                                  <AlertTriangle className="mr-1 h-4 w-4" />
                                  Request Attention
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Request team review of this line item</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                        
                        {isAlertedRow && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={() => handleResolve(row)}
                                  className="border-green-500 text-green-700 hover:bg-green-50"
                                >
                                  <CircleCheck className="mr-1 h-4 w-4" />
                                  Resolved
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Mark this item as resolved</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                        
                        {!isIgnoredRow && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={() => handleIgnore(row)}
                                  className="border-gray-300 text-gray-700 hover:bg-gray-50"
                                >
                                  <Check className="mr-1 h-4 w-4" />
                                  {isAlertedRow ? "Acknowledge" : "Mark Reviewed"}
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Mark this item as reviewed</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
      
      <AlertModal
        lineItem={selectedLineItem}
        isOpen={alertModalOpen}
        onClose={() => setAlertModalOpen(false)}
        onSend={handleSendAlert}
      />
    </>
  );
};

export default SortableTable;
