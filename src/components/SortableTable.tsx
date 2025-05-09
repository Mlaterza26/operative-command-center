
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
import { AlertTriangle, ArrowDown, ArrowUp, Check, CircleCheck, FileText } from "lucide-react";
import { toast } from "sonner";
import AlertModal from "./AlertModal";
import { LineItem } from "./FinanceDetailView";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { isReviewed, markAsReviewed, getReviewInfo, removeReview } from "@/utils/reviewStorage";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

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
  rowsPerPage?: number;
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
  flaggedRows = {},
  rowsPerPage = 20
}) => {
  const [alertModalOpen, setAlertModalOpen] = useState(false);
  const [selectedLineItem, setSelectedLineItem] = useState<LineItem | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [reviewNotes, setReviewNotes] = useState("");
  const [reviewItemId, setReviewItemId] = useState<string | null>(null);
  const [reviewedRows, setReviewedRows] = useState<Record<string, boolean>>({});

  // Initialize reviewed rows from localStorage
  React.useEffect(() => {
    const newReviewedRows: Record<string, boolean> = {};
    data.forEach(item => {
      if (item.id && isReviewed(item.id)) {
        newReviewedRows[item.id] = true;
      }
    });
    setReviewedRows(newReviewedRows);
  }, [data]);

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

  const openReviewDialog = (itemId: string) => {
    setReviewItemId(itemId);
    const existingReview = getReviewInfo(itemId);
    if (existingReview) {
      setReviewNotes(existingReview.notes);
    } else {
      setReviewNotes("");
    }
    setReviewDialogOpen(true);
  };

  const handleSubmitReview = () => {
    if (!reviewItemId) return;
    
    markAsReviewed(reviewItemId, reviewNotes);
    
    // Update UI state
    const newReviewedRows = {...reviewedRows};
    newReviewedRows[reviewItemId] = true;
    setReviewedRows(newReviewedRows);
    
    setReviewDialogOpen(false);
    toast.success("Review saved successfully", {
      description: reviewNotes ? "Your notes have been saved with this review" : "Item marked as reviewed"
    });
  };

  const handleRemoveReview = (itemId: string) => {
    removeReview(itemId);
    
    // Update UI state
    const newReviewedRows = {...reviewedRows};
    delete newReviewedRows[itemId];
    setReviewedRows(newReviewedRows);
    
    toast.success("Review status removed", {
      description: "This item is no longer marked as reviewed"
    });
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
    } else if (reviewedRows[item.id]) {
      return (
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          <FileText className="mr-1 h-3 w-3" />
          Reviewed
        </Badge>
      );
    }
    return null;
  };

  // Calculate pagination
  const totalPages = Math.ceil(data.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = Math.min(startIndex + rowsPerPage, data.length);
  const currentData = data.slice(startIndex, endIndex);

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
            {currentData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length + 2} className="text-center py-8 text-gray-500">
                  No data available
                </TableCell>
              </TableRow>
            ) : (
              currentData.map((row, index) => {
                const isIssueRow = flaggedRows[row.id];
                const isAlertedRow = row.alertedTo;
                const isIgnoredRow = row.ignored;
                const isReviewedRow = reviewedRows[row.id];
                const isEven = index % 2 === 0;
                
                let rowClassName = "hover:bg-gray-100 transition-colors";
                if (isAlertedRow) rowClassName += " bg-blue-50";
                else if (isIgnoredRow) rowClassName += " bg-gray-50";
                else if (isIssueRow) rowClassName += " bg-amber-50";
                else if (isReviewedRow) rowClassName += " bg-green-50";
                else rowClassName += isEven ? " bg-gray-50" : " bg-white";
                
                return (
                  <TableRow 
                    key={row.id} 
                    className={rowClassName}
                  >
                    {columns.map((column) => (
                      <TableCell 
                        key={`${row.id}-${column.key}`}
                        className={`${column.key === 'quantityGap' && Number(row[column.key]) < 0 ? 'text-red-600 font-medium' : ''}`}
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
                        
                        {!isReviewedRow ? (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={() => openReviewDialog(row.id)}
                                  className="border-green-500 text-green-700 hover:bg-green-50"
                                >
                                  <FileText className="mr-1 h-4 w-4" />
                                  Mark as Reviewed
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Mark this item as reviewed with optional notes</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        ) : (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={() => openReviewDialog(row.id)}
                                  className="border-green-300 text-green-700 hover:bg-green-50"
                                >
                                  <FileText className="mr-1 h-4 w-4" />
                                  View Review
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>View or edit review notes</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                        
                        {isReviewedRow && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={() => handleRemoveReview(row.id)}
                                  className="border-gray-300 text-gray-700 hover:bg-gray-50"
                                >
                                  <Check className="mr-1 h-4 w-4" />
                                  Remove Review
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Remove review status</p>
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
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between space-x-2 py-4">
          <div className="text-sm text-gray-500">
            Showing {startIndex + 1}-{endIndex} of {data.length}
          </div>
          <div className="space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span className="text-sm font-medium">
              {currentPage} of {totalPages}
            </span>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
      
      <AlertModal
        lineItem={selectedLineItem}
        isOpen={alertModalOpen}
        onClose={() => setAlertModalOpen(false)}
        onSend={handleSendAlert}
      />

      {/* Review Dialog */}
      <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Review Item</DialogTitle>
            <DialogDescription>
              {reviewedRows[reviewItemId || ''] 
                ? "This item has already been reviewed. You can update your notes or remove the review status."
                : "Add notes about your review of this item. These notes will be stored for future reference."}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              value={reviewNotes}
              onChange={(e) => setReviewNotes(e.target.value)}
              placeholder="Enter any notes about your review..."
              className="min-h-[120px]"
            />
          </div>
          <DialogFooter>
            {reviewedRows[reviewItemId || ''] && (
              <Button
                variant="outline"
                onClick={() => {
                  if (reviewItemId) handleRemoveReview(reviewItemId);
                  setReviewDialogOpen(false);
                }}
              >
                Remove Review
              </Button>
            )}
            <Button variant="default" onClick={handleSubmitReview}>
              {reviewedRows[reviewItemId || ''] ? "Update Review" : "Save Review"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SortableTable;
