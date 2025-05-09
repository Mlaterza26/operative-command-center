import React from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertTriangle, BellOff, FileText } from "lucide-react";
import StatusBadge from "@/components/StatusBadge";
import { useReview } from "@/hooks/useReview";
import ReviewDialog from "@/components/ReviewDialog";

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

// Extracted Table Header component
const TableHeader: React.FC = () => (
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
);

// Extracted helper function for calculating months spanned
const calculateMonthsSpanned = (startDate?: string, endDate?: string): number => {
  if (!startDate || !endDate) return 0;
  
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  return (end.getFullYear() - start.getFullYear()) * 12 + 
    (end.getMonth() - start.getMonth()) + 1;
};

// Main component
const LineItemTable: React.FC<LineItemTableProps> = ({ 
  items, 
  onAlertAction, 
  onIgnoreAction 
}) => {
  // Use the custom review hook
  const {
    reviewDialogOpen,
    reviewNotes,
    reviewItemId,
    reviewedRows,
    setReviewDialogOpen,
    setReviewNotes,
    openReviewDialog,
    handleSubmitReview,
    handleRemoveReview
  } = useReview(items);

  return (
    <>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader />
          <TableBody>
            {items.map((item) => {
              const monthsSpanned = item.startDate && item.endDate 
                ? calculateMonthsSpanned(item.startDate, item.endDate)
                : (item.months ? item.months.split(',').length : 0);
              
              const isReviewedRow = reviewedRows[item.id];
                
              return (
                <TableRow 
                  key={item.id} 
                  className={
                    isReviewedRow 
                      ? "bg-green-50" 
                      : item.hasFlag 
                        ? "bg-red-50" 
                        : undefined
                  }
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
                    <div className="flex space-x-1">
                      {item.hasFlag && (
                        <>
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
                        </>
                      )}
                      
                      {!isReviewedRow ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openReviewDialog(item.id)}
                          className="border-green-500 text-green-700"
                        >
                          <FileText className="h-3 w-3 mr-1" />
                          Review
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRemoveReview(item.id)}
                          className="border-green-300 text-green-700"
                        >
                          <FileText className="h-3 w-3 mr-1" />
                          Reviewed
                        </Button>
                      )}
                      
                      {!item.hasFlag && item.alertedTo && (
                        <span className="text-sm text-gray-500">
                          Alerted to {item.alertedTo}
                        </span>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
      
      {/* Review Dialog */}
      <ReviewDialog
        open={reviewDialogOpen}
        onOpenChange={setReviewDialogOpen}
        notes={reviewNotes}
        onNotesChange={setReviewNotes}
        onSubmit={handleSubmitReview}
        onRemove={reviewItemId ? () => handleRemoveReview(reviewItemId) : undefined}
        isEditing={reviewItemId ? reviewedRows[reviewItemId] : false}
      />
    </>
  );
};

export default LineItemTable;