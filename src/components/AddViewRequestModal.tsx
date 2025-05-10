
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CustomView } from "@/pages/Finance";
import { toast } from "sonner";

interface AddViewRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddView: (view: CustomView) => void;
}

const AddViewRequestModal: React.FC<AddViewRequestModalProps> = ({
  isOpen,
  onClose,
  onAddView,
}) => {
  const [requestName, setRequestName] = useState("");
  const [description, setDescription] = useState("");
  const [functionality, setFunctionality] = useState("");
  const [sourceData, setSourceData] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [submissionMethod, setSubmissionMethod] = useState<"asana" | "email" | "none">("none");
  const [asanaWebhook, setAsanaWebhook] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!requestName.trim()) {
      toast.error("Request name is required");
      return;
    }

    if (!description.trim()) {
      toast.error("Description is required");
      return;
    }

    // Create a new view request object
    const newView: CustomView = {
      id: `view-${Date.now()}`,
      name: requestName,
      description: description,
      lastUpdated: new Date().toISOString().split("T")[0],
      flaggedItems: 0,
      filters: {},
      sourceData: sourceData,
      functionality: functionality,
      additionalNotes: additionalNotes
    };

    // Handle external submissions
    if (submissionMethod !== "none") {
      setIsSubmitting(true);
      try {
        if (submissionMethod === "asana" && asanaWebhook) {
          // Send to Asana via webhook
          await fetch(asanaWebhook, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            mode: "no-cors", // Handle CORS issues
            body: JSON.stringify({
              name: requestName,
              notes: `
Description: ${description}
Expected Functionality: ${functionality}
Source Data: ${sourceData}
Additional Notes: ${additionalNotes}
              `,
              resource_type: "task",
              created_at: new Date().toISOString()
            }),
          });
          toast.success("Request sent to Asana");
        } else if (submissionMethod === "email" && emailAddress) {
          // Create mailto link to send email
          const subject = encodeURIComponent(`New Finance View Request: ${requestName}`);
          const body = encodeURIComponent(`
Request Name: ${requestName}
Description: ${description}
Expected Functionality: ${functionality}
Source Data: ${sourceData}
Additional Notes: ${additionalNotes}
          `);
          
          window.open(`mailto:${emailAddress}?subject=${subject}&body=${body}`, '_blank');
          toast.success("Email client opened");
        }
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

  const resetForm = () => {
    setRequestName("");
    setDescription("");
    setFunctionality("");
    setSourceData("");
    setAdditionalNotes("");
    setSubmissionMethod("none");
    setAsanaWebhook("");
    setEmailAddress("");
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
          <div className="grid gap-2">
            <Label htmlFor="requestName">Request Name</Label>
            <Input
              id="requestName"
              placeholder="Enter a name for this view request"
              value={requestName}
              onChange={(e) => setRequestName(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe what this view should show"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="functionality">Expected Functionality</Label>
            <Textarea
              id="functionality"
              placeholder="What should this view do? What interactions are needed?"
              value={functionality}
              onChange={(e) => setFunctionality(e.target.value)}
              rows={3}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="sourceData">Source Data</Label>
            <Textarea
              id="sourceData"
              placeholder="What data sources should this view use?"
              value={sourceData}
              onChange={(e) => setSourceData(e.target.value)}
              rows={3}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="additionalNotes">Additional Notes</Label>
            <Textarea
              id="additionalNotes"
              placeholder="Any additional information that might be helpful"
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
              rows={3}
            />
          </div>
          
          <div className="border-t pt-4 mt-2">
            <Label className="mb-2 block">Send request to:</Label>
            <RadioGroup 
              value={submissionMethod} 
              onValueChange={(value) => setSubmissionMethod(value as "asana" | "email" | "none")}
              className="flex flex-col space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="none" id="none" />
                <Label htmlFor="none" className="cursor-pointer">Just save locally</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="asana" id="asana" />
                <Label htmlFor="asana" className="cursor-pointer">Create task in Asana</Label>
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
