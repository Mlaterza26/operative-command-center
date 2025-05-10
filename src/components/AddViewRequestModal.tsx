import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CustomView } from "@/pages/Finance";
import { toast } from "sonner";

// Submission method type
type SubmissionMethod = "asana" | "zapier" | "email" | "none";

// Form data interface
interface ViewRequestForm {
  requestName: string;
  description: string;
  functionality: string;
  sourceData: string;
  additionalNotes: string;
  submissionMethod: SubmissionMethod;
  asanaWebhook: string;
  zapierWebhook: string;
  emailAddress: string;
}

// Props for the submission method section
interface SubmissionSectionProps {
  submissionMethod: SubmissionMethod;
  setSubmissionMethod: (method: SubmissionMethod) => void;
  asanaWebhook: string;
  setAsanaWebhook: (url: string) => void;
  zapierWebhook: string;
  setZapierWebhook: (url: string) => void;
  emailAddress: string;
  setEmailAddress: (email: string) => void;
}

// Main component props
interface AddViewRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddView: (view: CustomView) => void;
}

// Submission method selection and options component
const SubmissionMethodSection: React.FC<SubmissionSectionProps> = ({
  submissionMethod,
  setSubmissionMethod,
  asanaWebhook,
  setAsanaWebhook,
  zapierWebhook,
  setZapierWebhook,
  emailAddress,
  setEmailAddress
}) => {
  return (
    <>
      <div className="border-t pt-4 mt-2">
        <Label className="mb-2 block">Send request to:</Label>
        <RadioGroup 
          value={submissionMethod} 
          onValueChange={(value) => setSubmissionMethod(value as SubmissionMethod)}
          className="flex flex-col space-y-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="none" id="none" />
            <Label htmlFor="none" className="cursor-pointer">Just save locally</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="asana" id="asana" />
            <Label htmlFor="asana" className="cursor-pointer">Create task in Asana directly</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="zapier" id="zapier" />
            <Label htmlFor="zapier" className="cursor-pointer">Use Zapier to create Asana task</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="email" id="email" />
            <Label htmlFor="email" className="cursor-pointer">Send email notification</Label>
          </div>
        </RadioGroup>
      </div>
      
      {submissionMethod === "asana" && (
        <div className="grid gap-2">
          <Label htmlFor="asanaWebhook">Asana Webhook URL</Label>
          <Input
            id="asanaWebhook"
            placeholder="Enter your Asana webhook URL"
            value={asanaWebhook}
            onChange={(e) => setAsanaWebhook(e.target.value)}
          />
          <p className="text-xs text-gray-500">
            Paste your Asana webhook URL to create tasks automatically
          </p>
        </div>
      )}
      
      {submissionMethod === "zapier" && (
        <div className="grid gap-2">
          <Label htmlFor="zapierWebhook">Zapier Webhook URL</Label>
          <Input
            id="zapierWebhook"
            placeholder="Enter your Zapier webhook URL"
            value={zapierWebhook}
            onChange={(e) => setZapierWebhook(e.target.value)}
          />
          <p className="text-xs text-gray-500">
            Paste your Zapier webhook URL that creates Asana tasks
          </p>
        </div>
      )}
      
      {submissionMethod === "email" && (
        <div className="grid gap-2">
          <Label htmlFor="emailAddress">Email Address</Label>
          <Input
            id="emailAddress"
            type="email"
            placeholder="Enter email address"
            value={emailAddress}
            onChange={(e) => setEmailAddress(e.target.value)}
          />
          <p className="text-xs text-gray-500">
            The request details will be sent to this email address
          </p>
        </div>
      )}
    </>
  );
};

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
  // Use a single form state object instead of individual states
  const [form, setForm] = useState<ViewRequestForm>({
    requestName: "",
    description: "",
    functionality: "",
    sourceData: "",
    additionalNotes: "",
    submissionMethod: "none",
    asanaWebhook: "",
    zapierWebhook: "",
    emailAddress: ""
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

    // Handle external submissions
    if (form.submissionMethod !== "none") {
      setIsSubmitting(true);
      try {
        await submitToExternalService(form, newView);
      } catch (error) {
        console.error("Error sending request:", error);
        toast.error("Failed to send the request");
      } finally {
        setIsSubmitting(false);
      }
    }

    // Add view to local state regardless of external submission
    onAddView(newView);
    resetForm();
    onClose();
    toast.success("View request submitted successfully");
  };

  // External submission handler
  const submitToExternalService = async (formData: ViewRequestForm, viewData: CustomView) => {
    if (formData.submissionMethod === "asana" && formData.asanaWebhook) {
      // Send to Asana via webhook
      await fetch(formData.asanaWebhook, {
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
      toast.success("Request sent to Asana");
    } 
    else if (formData.submissionMethod === "zapier" && formData.zapierWebhook) {
      // Send to Zapier webhook
      await fetch(formData.zapierWebhook, {
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
      toast.success("Request sent to Zapier");
    } 
    else if (formData.submissionMethod === "email" && formData.emailAddress) {
      // Create mailto link
      const subject = encodeURIComponent(`New Finance View Request: ${formData.requestName}`);
      const body = encodeURIComponent(formatRequestForEmail(formData));
      
      window.open(`mailto:${formData.emailAddress}?subject=${subject}&body=${body}`, '_blank');
      toast.success("Email client opened");
    }
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
      additionalNotes: "",
      submissionMethod: "none",
      asanaWebhook: "",
      zapierWebhook: "",
      emailAddress: ""
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
          
          {/* Submission Method Section */}
          <SubmissionMethodSection
            submissionMethod={form.submissionMethod}
            setSubmissionMethod={(method) => updateForm("submissionMethod", method)}
            asanaWebhook={form.asanaWebhook}
            setAsanaWebhook={(value) => updateForm("asanaWebhook", value)}
            zapierWebhook={form.zapierWebhook}
            setZapierWebhook={(value) => updateForm("zapierWebhook", value)}
            emailAddress={form.emailAddress}
            setEmailAddress={(value) => updateForm("emailAddress", value)}
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