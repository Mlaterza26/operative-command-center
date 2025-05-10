
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

  const handleSubmit = () => {
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
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Submit Request</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddViewRequestModal;
