import { useState, useEffect } from "react";
import * as reviewStorage from "@/utils/reviewStorage";
import { toast } from "sonner";

interface UseReviewOptions {
  showToasts?: boolean;
}

/**
 * Custom hook for managing review functionality
 * @param items Array of items with IDs to check for review status
 * @param options Configuration options
 */
export function useReview<T extends { id: string }>(
  items: T[],
  options: UseReviewOptions = {}
) {
  const { showToasts = true } = options;
  
  // Review dialog state
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [reviewNotes, setReviewNotes] = useState("");
  const [reviewItemId, setReviewItemId] = useState<string | null>(null);
  const [reviewedRows, setReviewedRows] = useState<Record<string, boolean>>({});
  
  // Initialize reviewed rows from localStorage
  useEffect(() => {
    const newReviewedRows: Record<string, boolean> = {};
    items.forEach(item => {
      if (item.id && reviewStorage.isReviewed(item.id)) {
        newReviewedRows[item.id] = true;
      }
    });
    setReviewedRows(newReviewedRows);
  }, [items]);

  const openReviewDialog = (itemId: string) => {
    setReviewItemId(itemId);
    const existingReview = reviewStorage.getReviewInfo(itemId);
    if (existingReview) {
      setReviewNotes(existingReview.notes);
    } else {
      setReviewNotes("");
    }
    setReviewDialogOpen(true);
  };

  const handleSubmitReview = () => {
    if (!reviewItemId) return;
    
    reviewStorage.markAsReviewed(reviewItemId, reviewNotes);
    
    // Update UI state
    const newReviewedRows = { ...reviewedRows };
    newReviewedRows[reviewItemId] = true;
    setReviewedRows(newReviewedRows);
    
    setReviewDialogOpen(false);
    
    if (showToasts) {
      toast.success("Review saved successfully", {
        description: reviewNotes 
          ? "Your notes have been saved with this review" 
          : "Item marked as reviewed"
      });
    }
  };

  const handleRemoveReview = (itemId: string) => {
    reviewStorage.removeReview(itemId);
    
    // Update UI state
    const newReviewedRows = { ...reviewedRows };
    delete newReviewedRows[itemId];
    setReviewedRows(newReviewedRows);
    
    if (showToasts) {
      toast.success("Review status removed", {
        description: "This item is no longer marked as reviewed"
      });
    }
  };

  return {
    reviewDialogOpen,
    reviewNotes,
    reviewItemId,
    reviewedRows,
    setReviewDialogOpen,
    setReviewNotes,
    openReviewDialog,
    handleSubmitReview,
    handleRemoveReview,
    isReviewed: reviewStorage.isReviewed
  };
}