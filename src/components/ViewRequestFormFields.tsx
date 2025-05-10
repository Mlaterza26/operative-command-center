
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ViewRequestForm } from "@/utils/viewRequestSubmission";

// Text input field with label component props
interface TextInputFieldProps {
  id: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
}

// Text input field with label component
export const TextInputField: React.FC<TextInputFieldProps> = ({ 
  id, 
  label, 
  placeholder, 
  value, 
  onChange, 
  rows 
}) => {
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

// Form fields component props
interface ViewRequestFormFieldsProps {
  form: ViewRequestForm;
  updateForm: (field: keyof ViewRequestForm, value: string) => void;
}

// Form fields component
const ViewRequestFormFields: React.FC<ViewRequestFormFieldsProps> = ({ form, updateForm }) => {
  return (
    <div className="grid gap-4 py-4">
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
  );
};

export default ViewRequestFormFields;
