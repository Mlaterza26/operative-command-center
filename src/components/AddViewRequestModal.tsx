
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CustomView } from "@/pages/Finance";
import { toast } from "sonner";

// Form data interface
interface ViewRequestForm {
  requestName: string;
  description: string;
  functionality: string;
  sourceData: string;
  additionalNotes: string;
}

// Main component props
interface AddViewRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddView: (view: CustomView) => void;
}

// Text input field with label
const TextInputField: React.FC<{
  id: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
}> = ({ id, label, placeholder, value, onChange, rows }) => {
  const InputComponent = rows ? Textarea : Input;
  
  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>
      <InputComponent
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
      />
    </div>
  );
};

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

  // Submit to Asana webhook
  const submitToAsana = async (webhookUrl: string, formData: ViewRequestForm) => {
    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      mode: "no-cors",
      body: JSON.stringify({
        name: formData.requestName,
        notes: formatRequestForAsana(formData),
        resource_type: "task",
        created_at: new Date().toISOString()
      }),
    });
  };

  // Submit to Zapier webhook
  const submitToZapier = async (webhookUrl: string, formData: ViewRequestForm) => {
    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      mode: "no-cors",
      body: JSON.stringify({
        task_name: formData.requestName,
        description: formData.description,
        functionality: formData.functionality,
        source_data: formData.sourceData,
        additional_notes: formData.additionalNotes,
        timestamp: new Date().toISOString(),
        triggered_from: window.location.origin
      }),
    });
  };

  // Send email (opens email client)
  const sendEmail = (formData: ViewRequestForm) => {
    const email = "michael.laterza@futurenet.com";
    const subject = encodeURIComponent(`New Finance View Request: ${formData.requestName}`);
    const body = encodeURIComponent(formatRequestForEmail(formData));
    
    window.open(`mailto:${email}?subject=${subject}&body=${body}`, '_blank');
  };

  // Helper function to format request for Asana
  const formatRequestForAsana = (formData: ViewRequestForm): string => {
    return `
Description: ${formData.description}
Expected Functionality: ${formData.functionality}
Source Data: ${formData.sourceData}
Additional Notes: ${formData.additionalNotes}
    `;
  };

  // Helper function to format request for Email
  const formatRequestForEmail = (formData: ViewRequestForm): string => {
    return `
Request Name: ${formData.requestName}
Description: ${formData.description}
Expected Functionality: ${formData.functionality}
Source Data: ${formData.sourceData}
Additional Notes: ${formData.additionalNotes}
    `;
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

        <div className="grid gap-4 py-4">
          {/* Basic Info Fields */}
          <TextInputField
            id="requestName"
            label="Request Name"
            placeholder="Enter a name for this view request"
            value={form.requestName}
            onChange={(value) => updateForm("requestName", value)}
          />

          <TextInputField
            id="description"
            label="Description"
            placeholder="Describe what this view should show"
            value={form.description}
            onChange={(value) => updateForm("description", value)}
            rows={3}
          />

          <TextInputField
            id="functionality"
            label="Expected Functionality"
            placeholder="What should this view do? What interactions are needed?"
            value={form.functionality}
            onChange={(value) => updateForm("functionality", value)}
            rows={3}
          />

          <TextInputField
            id="sourceData"
            label="Source Data"
            placeholder="What data sources should this view use?"
            value={form.sourceData}
            onChange={(value) => updateForm("sourceData", value)}
            rows={3}
          />

          <TextInputField
            id="additionalNotes"
            label="Additional Notes"
            placeholder="Any additional information that might be helpful"
            value={form.additionalNotes}
            onChange={(value) => updateForm("additionalNotes", value)}
            rows={3}
          />
        </div>

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
