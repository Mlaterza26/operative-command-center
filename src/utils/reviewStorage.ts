
interface ReviewRecord {
  lineItemId: string;
  reviewer: string;
  timestamp: string;
  notes: string;
}

/**
 * Marks a line item as reviewed
 * @param lineItemId The ID of the line item to mark as reviewed
 * @param notes Any notes associated with the review
 * @param reviewer The name of the person who reviewed the item
 */
export const markAsReviewed = (lineItemId: string, notes: string = "", reviewer: string = "Current User"): void => {
  const reviewData: ReviewRecord = {
    lineItemId,
    reviewer,
    timestamp: new Date().toISOString(),
    notes
  };
  
  const reviewedItems = getReviewedItems();
  reviewedItems[lineItemId] = reviewData;
  
  localStorage.setItem("reviewedItems", JSON.stringify(reviewedItems));
};

/**
 * Checks if a line item has been reviewed
 * @param lineItemId The ID of the line item to check
 * @returns Whether the line item has been reviewed
 */
export const isReviewed = (lineItemId: string): boolean => {
  const reviewedItems = getReviewedItems();
  return !!reviewedItems[lineItemId];
};

/**
 * Gets all reviewed items
 * @returns An object containing all reviewed items, keyed by line item ID
 */
export const getReviewedItems = (): Record<string, ReviewRecord> => {
  const storedItems = localStorage.getItem("reviewedItems");
  if (!storedItems) {
    return {};
  }
  
  try {
    return JSON.parse(storedItems);
  } catch (error) {
    console.error("Error parsing reviewed items", error);
    return {};
  }
};

/**
 * Removes review status for a line item
 * @param lineItemId The ID of the line item to remove review status for
 */
export const removeReview = (lineItemId: string): void => {
  const reviewedItems = getReviewedItems();
  if (reviewedItems[lineItemId]) {
    delete reviewedItems[lineItemId];
    localStorage.setItem("reviewedItems", JSON.stringify(reviewedItems));
  }
};

/**
 * Gets review notes for a line item
 * @param lineItemId The ID of the line item to get notes for
 * @returns The notes associated with the review, or null if not found
 */
export const getReviewNotes = (lineItemId: string): string | null => {
  const reviewedItems = getReviewedItems();
  return reviewedItems[lineItemId]?.notes || null;
};

/**
 * Gets review info for a line item
 * @param lineItemId The ID of the line item to get review info for
 * @returns The full review record, or null if not found
 */
export const getReviewInfo = (lineItemId: string): ReviewRecord | null => {
  const reviewedItems = getReviewedItems();
  return reviewedItems[lineItemId] || null;
};

/**
 * Gets all line items that have been reviewed
 * @returns An array of line item IDs that have been reviewed
 */
export const getReviewedItemIds = (): string[] => {
  return Object.keys(getReviewedItems());
};

/**
 * Clears all review data
 */
export const clearAllReviews = (): void => {
  localStorage.removeItem("reviewedItems");
};
