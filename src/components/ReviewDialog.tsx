import React from "react";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

interface ReviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  notes: string;
  onNotesChange: (notes: string) => void;
  onSubmit: () => void;
  onRemove?: () => void;
  isEditing: boolean;
}

/**
 * Reusable dialog component for reviewing items
 */
const ReviewDialog: React.FC<ReviewDialogProps> = ({
  open,
  onOpenChange,
  notes,
  onNotesChange,
  onSubmit,
  onRemove,
  isEditing
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Review Item</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "This item has already been reviewed. You can update your notes or remove the review status."
              : "Add notes about your review of this item. These notes will be stored for future reference."}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Textarea
            value={notes}
            onChange={(e) => onNotesChange(e.target.value)}
            placeholder="Enter any notes about your review..."
            className="min-h-[120px]"
          />
        </div>
        <DialogFooter>
          {isEditing && onRemove && (
            <Button
              variant="outline"
              onClick={onRemove}
            >
              Remove Review
            </Button>
          )}
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="default" onClick={onSubmit}>
            {isEditing ? "Update Review" : "Save Review"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewDialog;
