
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CustomView } from "@/pages/Finance";
import { toast } from "sonner";
import { ViewRequestForm, submitToAsana, submitToZapier, sendEmail } from "@/utils/viewRequestSubmission";
import ViewRequestFormFields from "./ViewRequestFormFields";

// Main component props
interface AddViewRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddView: (view: CustomView) => void;
}

// Main component
const AddViewRequestModal: React.FC<AddViewRequestModalProps> = ({
  isOpen,
  onClose,
  onAddView,
}) => {
  // Use a single form state object
  const [form, setForm] = useState<ViewRequestForm>({
    requestName: "",
    description: "",
    functionality: "",
    sourceData: "",
    additionalNotes: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Generic form field update handler
  const updateForm = (field: keyof ViewRequestForm, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  // Submit handler
  const handleSubmit = async () => {
    // Validation
    if (!form.requestName.trim()) {
      toast.error("Request name is required");
      return;
    }

    if (!form.description.trim()) {
      toast.error("Description is required");
      return;
    }

    // Create a new view request object
    const newView: CustomView = {
      id: `view-${Date.now()}`,
      name: form.requestName,
      description: form.description,
      lastUpdated: new Date().toISOString().split("T")[0],
      flaggedItems: 0,
      filters: {},
      sourceData: form.sourceData,
      functionality: form.functionality,
      additionalNotes: form.additionalNotes
    };

    setIsSubmitting(true);
    
    try {
      // Try to retrieve webhook URLs from localStorage
      const asanaWebhook = localStorage.getItem('asanaWebhook') || '';
      const zapierWebhook = localStorage.getItem('zapierWebhook') || '';
      
      // Try submitting to any available webhooks
      if (asanaWebhook) {
        try {
          await submitToAsana(asanaWebhook, form);
          console.log("Sent to Asana webhook");
        } catch (error) {
          console.error("Asana submission error:", error);
        }
      }
      
      if (zapierWebhook) {
        try {
          await submitToZapier(zapierWebhook, form);
          console.log("Sent to Zapier webhook");
        } catch (error) {
          console.error("Zapier submission error:", error);
        }
      }
      
      // Always send email
      sendEmail(form);
      
      // Add view to local state
      onAddView(newView);
      resetForm();
      onClose();
      
      toast.success("Thank you for submitting your request. We'll review it and follow up if we have any questions. Typical response time is 24-48 hours.");
    } catch (error) {
      console.error("Error sending request:", error);
      toast.error("An error occurred while submitting your request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset form to initial state
  const resetForm = () => {
    setForm({
      requestName: "",
      description: "",
      functionality: "",
      sourceData: "",
      additionalNotes: ""
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) onClose();
    }}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Request New Custom View</DialogTitle>
        </DialogHeader>

        <ViewRequestFormFields 
          form={form} 
          updateForm={updateForm} 
        />

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
          <Button 
            onClick={handleSubmit} 
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit Request"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddViewRequestModal;
