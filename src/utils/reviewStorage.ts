
export interface ReviewRecord {
  lineItemId: string;
  reviewer: string;
  timestamp: string;
  notes: string;
}

const STORAGE_KEY = "reviewedItems";

/**
 * Review storage service for managing review data
 */
class ReviewStorageService {
  /**
   * Marks a line item as reviewed
   * @param lineItemId The ID of the line item to mark as reviewed
   * @param notes Any notes associated with the review
   * @param reviewer The name of the person who reviewed the item
   */
  public markAsReviewed(lineItemId: string, notes: string = "", reviewer: string = "Current User"): void {
    const reviewData: ReviewRecord = {
      lineItemId,
      reviewer,
      timestamp: new Date().toISOString(),
      notes
    };
    
    const reviewedItems = this.getReviewedItems();
    reviewedItems[lineItemId] = reviewData;
    
    this.saveToLocalStorage(reviewedItems);
  }

  /**
   * Checks if a line item has been reviewed
   * @param lineItemId The ID of the line item to check
   * @returns Whether the line item has been reviewed
   */
  public isReviewed(lineItemId: string): boolean {
    const reviewedItems = this.getReviewedItems();
    return !!reviewedItems[lineItemId];
  }

  /**
   * Gets all reviewed items
   * @returns An object containing all reviewed items, keyed by line item ID
   */
  public getReviewedItems(): Record<string, ReviewRecord> {
    if (typeof localStorage === 'undefined') {
      return {};
    }
    
    const storedItems = localStorage.getItem(STORAGE_KEY);
    if (!storedItems) {
      return {};
    }
    
    try {
      return JSON.parse(storedItems);
    } catch (error) {
      console.error("Error parsing reviewed items", error);
      return {};
    }
  }

  /**
   * Removes review status for a line item
   * @param lineItemId The ID of the line item to remove review status for
   */
  public removeReview(lineItemId: string): void {
    const reviewedItems = this.getReviewedItems();
    if (reviewedItems[lineItemId]) {
      delete reviewedItems[lineItemId];
      this.saveToLocalStorage(reviewedItems);
    }
  }

  /**
   * Gets review notes for a line item
   * @param lineItemId The ID of the line item to get notes for
   * @returns The notes associated with the review, or null if not found
   */
  public getReviewNotes(lineItemId: string): string | null {
    const reviewedItems = this.getReviewedItems();
    return reviewedItems[lineItemId]?.notes || null;
  }

  /**
   * Gets review info for a line item
   * @param lineItemId The ID of the line item to get review info for
   * @returns The full review record, or null if not found
   */
  public getReviewInfo(lineItemId: string): ReviewRecord | null {
    const reviewedItems = this.getReviewedItems();
    return reviewedItems[lineItemId] || null;
  }

  /**
   * Gets all line items that have been reviewed
   * @returns An array of line item IDs that have been reviewed
   */
  public getReviewedItemIds(): string[] {
    return Object.keys(this.getReviewedItems());
  }

  /**
   * Clears all review data
   */
  public clearAllReviews(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
    }
  }

  /**
   * Saves the reviewed items to localStorage
   * @param items The items to save
   */
  private saveToLocalStorage(items: Record<string, ReviewRecord>): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }
  }
}

// Create a singleton instance
const reviewStorageInstance = new ReviewStorageService();

// Export the singleton instance
export const reviewStorage = reviewStorageInstance;

// Also export individual functions for backward compatibility
export const markAsReviewed = reviewStorageInstance.markAsReviewed.bind(reviewStorageInstance);
export const isReviewed = reviewStorageInstance.isReviewed.bind(reviewStorageInstance);
export const getReviewedItems = reviewStorageInstance.getReviewedItems.bind(reviewStorageInstance);
export const removeReview = reviewStorageInstance.removeReview.bind(reviewStorageInstance);
export const getReviewNotes = reviewStorageInstance.getReviewNotes.bind(reviewStorageInstance);
export const getReviewInfo = reviewStorageInstance.getReviewInfo.bind(reviewStorageInstance);
export const getReviewedItemIds = reviewStorageInstance.getReviewedItemIds.bind(reviewStorageInstance);
export const clearAllReviews = reviewStorageInstance.clearAllReviews.bind(reviewStorageInstance);
