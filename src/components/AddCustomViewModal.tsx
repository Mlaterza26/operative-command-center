
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CustomView } from "@/pages/Finance";

interface AddCustomViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddView: (view: CustomView) => void;
}

const errorTypeOptions = [
  { label: "All Error Types", value: "all" },
  { label: "CPM Issues", value: "cpm" },
  { label: "Cost Issues", value: "cost" },
  { label: "Date Issues", value: "dates" },
  { label: "Approval Issues", value: "approval" }
];

const costMethodOptions = [
  { label: "All Methods", value: "all" },
  { label: "CPU", value: "cpu" },
  { label: "CPM", value: "cpm" },
  { label: "Flat", value: "flat" }
];

const dateRangeOptions = [
  { label: "Last 7 Days", value: "7days" },
  { label: "Last 30 Days", value: "30days" },
  { label: "Last Quarter", value: "quarter" },
  { label: "Year to Date", value: "ytd" }
];

const clientOptions = [
  { label: "All Clients", value: "all" },
  { label: "Example Co.", value: "Example Co." },
  { label: "Acme Inc.", value: "Acme Inc." },
  { label: "123 Industries", value: "123 Industries" }
];

const AddCustomViewModal: React.FC<AddCustomViewModalProps> = ({ isOpen, onClose, onAddView }) => {
  const [viewName, setViewName] = useState("");
  const [description, setDescription] = useState("");
  const [errorType, setErrorType] = useState("all");
  const [costMethod, setCostMethod] = useState("all");
  const [dateRange, setDateRange] = useState("30days");
  const [client, setClient] = useState("all");

  const handleSubmit = () => {
    if (!viewName) {
      return;
    }
    
    const newView: CustomView = {
      id: `view-${Date.now()}`,
      name: viewName,
      description: description,
      lastUpdated: new Date().toISOString().split('T')[0],
      flaggedItems: 0,
      filters: {
        errorType,
        costMethod,
        dateRange,
        client
      }
    };
    
    onAddView(newView);
    resetForm();
  };

  const resetForm = () => {
    setViewName("");
    setDescription("");
    setErrorType("all");
    setCostMethod("all");
    setDateRange("30days");
    setClient("all");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Add New Custom View</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">View Name</Label>
            <Input 
              id="name"
              value={viewName}
              onChange={(e) => setViewName(e.target.value)}
              placeholder="Enter view name"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what this view shows"
              rows={3}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="error-type">Error Type</Label>
              <Select value={errorType} onValueChange={setErrorType}>
                <SelectTrigger id="error-type">
                  <SelectValue placeholder="Select Error Type" />
                </SelectTrigger>
                <SelectContent>
                  {errorTypeOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="cost-method">Cost Method</Label>
              <Select value={costMethod} onValueChange={setCostMethod}>
                <SelectTrigger id="cost-method">
                  <SelectValue placeholder="Select Cost Method" />
                </SelectTrigger>
                <SelectContent>
                  {costMethodOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="date-range">Date Range</Label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger id="date-range">
                  <SelectValue placeholder="Select Date Range" />
                </SelectTrigger>
                <SelectContent>
                  {dateRangeOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="client">Client</Label>
              <Select value={client} onValueChange={setClient}>
                <SelectTrigger id="client">
                  <SelectValue placeholder="Select Client" />
                </SelectTrigger>
                <SelectContent>
                  {clientOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Add View</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddCustomViewModal;
