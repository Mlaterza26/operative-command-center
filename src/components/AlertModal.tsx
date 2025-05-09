import React, { useState } from "react";
import { LineItem } from "./FinanceDetailView";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, Mail, AlertTriangle, Slack } from "lucide-react";
import { toast } from "sonner";

interface AlertModalProps {
  lineItem: LineItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSend: (lineItem: LineItem, recipients: string[], channels: string[]) => void;
}

interface TeamMember {
  name: string;
  role: string;
}

const AlertModal: React.FC<AlertModalProps> = ({
  lineItem,
  isOpen,
  onClose,
  onSend,
}) => {
  const [selectedRecipients, setSelectedRecipients] = useState<string[]>([]);
  const [selectedChannels, setSelectedChannels] = useState<string[]>(["slack"]);
  const [messagePreview, setMessagePreview] = useState<string>("");

  // Team members list
  const teamMembers: TeamMember[] = [
    { name: "Maria Rodriguez", role: "Planning Lead" },
    { name: "James Wilson", role: "Finance Director" },
    { name: "Sarah Chen", role: "Ad Ops Manager" },
    { name: "Alex Johnson", role: "Client Success Manager" }
  ];

  // Set default recipient when line item changes
  React.useEffect(() => {
    if (lineItem && lineItem.orderOwner) {
      setSelectedRecipients([lineItem.orderOwner]);
    } else {
      setSelectedRecipients([]);
    }
    
    // Create the default message
    if (lineItem) {
      const monthsCount = lineItem.months ? lineItem.months.split(',').length : 0;
      const message = `Please review Line Item ${lineItem.id} in Order ${lineItem.orderName || lineItem.orderId}. This CPU order spans ${monthsCount} months but has only ${lineItem.quantity} quantity. Please update if needed. If already resolved, please ignore.`;
      setMessagePreview(message);
    }
  }, [lineItem]);

  // Toggle recipient selection
  const toggleRecipient = (name: string) => {
    if (selectedRecipients.includes(name)) {
      setSelectedRecipients(selectedRecipients.filter(r => r !== name));
    } else {
      setSelectedRecipients([...selectedRecipients, name]);
    }
  };

  // Toggle channel selection
  const toggleChannel = (channel: string) => {
    if (selectedChannels.includes(channel)) {
      if (selectedChannels.length > 1) { // Ensure at least one channel is selected
        setSelectedChannels(selectedChannels.filter(c => c !== channel));
      }
    } else {
      setSelectedChannels([...selectedChannels, channel]);
    }
  };

  // Handle sending the alert
  const handleSend = () => {
    if (!lineItem) return;

    if (selectedRecipients.length === 0) {
      toast.error("Please select at least one recipient");
      return;
    }

    onSend(lineItem, selectedRecipients, selectedChannels);
    onClose();
  };

  // Format the date to be more readable
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (!lineItem) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center text-xl font-semibold text-blue-600">
            <AlertTriangle className="mr-2 h-5 w-5 text-amber-500" />
            Request Attention for Line Item
          </DialogTitle>
        </DialogHeader>

        {/* Line Item Details */}
        <div className="bg-blue-50 p-4 rounded-md mb-4">
          <h3 className="font-medium text-blue-800 mb-2">Line Item Details</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="font-medium">Order ID:</span> {lineItem.orderId}
            </div>
            <div>
              <span className="font-medium">Order Name:</span> {lineItem.orderName}
            </div>
            <div>
              <span className="font-medium">Line Item ID:</span> {lineItem.id}
            </div>
            <div>
              <span className="font-medium">Cost Method:</span> {lineItem.costMethod}
            </div>
            <div>
              <span className="font-medium">Months Spanned:</span> {lineItem.months}
            </div>
            <div>
              <span className="font-medium">Quantity:</span> {lineItem.quantity}
            </div>
            <div>
              <span className="font-medium">Start Date:</span> {formatDate(lineItem.startDate)}
            </div>
            <div>
              <span className="font-medium">End Date:</span> {formatDate(lineItem.endDate)}
            </div>
          </div>
        </div>

        {/* Recipients Selection */}
        <div className="mb-4">
          <h3 className="font-medium mb-2">Team Involvement</h3>
          <p className="text-sm text-gray-600 mb-3">Select who should review this line item</p>
          
          <div className="space-y-2">
            {/* Order Owner */}
            <div className="flex items-start space-x-2">
              <Checkbox
                id={`recipient-${lineItem.orderOwner}`}
                checked={selectedRecipients.includes(lineItem.orderOwner)}
                onCheckedChange={() => toggleRecipient(lineItem.orderOwner)}
              />
              <div className="grid gap-1.5 leading-none">
                <label
                  htmlFor={`recipient-${lineItem.orderOwner}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {lineItem.orderOwner} (Order Owner)
                </label>
              </div>
            </div>
            
            {/* Other Team Members */}
            {teamMembers.map((member) => (
              <div key={member.name} className="flex items-start space-x-2">
                <Checkbox
                  id={`recipient-${member.name}`}
                  checked={selectedRecipients.includes(member.name)}
                  onCheckedChange={() => toggleRecipient(member.name)}
                />
                <div className="grid gap-1.5 leading-none">
                  <label
                    htmlFor={`recipient-${member.name}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {member.name} ({member.role})
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Communication Channels */}
        <div className="mb-4">
          <h3 className="font-medium mb-2">Communication Channels</h3>
          <div className="flex space-x-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="channel-slack"
                checked={selectedChannels.includes("slack")}
                onCheckedChange={() => toggleChannel("slack")}
              />
              <label
                htmlFor="channel-slack"
                className="text-sm font-medium leading-none flex items-center"
              >
                <Slack className="mr-1 h-4 w-4" />
                Slack
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="channel-email"
                checked={selectedChannels.includes("email")}
                onCheckedChange={() => toggleChannel("email")}
              />
              <label
                htmlFor="channel-email"
                className="text-sm font-medium leading-none flex items-center"
              >
                <Mail className="mr-1 h-4 w-4" />
                Daily Digest Email
              </label>
            </div>
          </div>
        </div>

        {/* Message Preview */}
        <Tabs defaultValue="slack" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="slack">Slack Preview</TabsTrigger>
            <TabsTrigger value="email">Email Digest Preview</TabsTrigger>
          </TabsList>
          <TabsContent value="slack" className="mt-2">
            <div className="border rounded-md p-3">
              <div className="flex items-start mb-2">
                <div className="bg-blue-100 rounded-full p-1 mr-2">
                  <AlertTriangle className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <span className="font-bold">Finance Bot</span>
                  <span className="text-gray-500 text-sm ml-2">Today at {new Date().toLocaleTimeString()}</span>
                </div>
              </div>
              <div className="pl-8">
                <p className="mb-2">{messagePreview}</p>
                <div className="bg-gray-50 border rounded p-2 text-sm">
                  <div><strong>Order:</strong> {lineItem.orderId} - {lineItem.orderName}</div>
                  <div><strong>Line Item:</strong> {lineItem.id}</div>
                  <div><strong>Time Period:</strong> {formatDate(lineItem.startDate)} to {formatDate(lineItem.endDate)}</div>
                  <div><strong>Requested by:</strong> Current User</div>
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="email" className="mt-2">
            <div className="border rounded-md p-3">
              <div className="border-b pb-2 mb-2">
                <h4 className="font-medium">Daily Finance Digest - Attention Requests</h4>
              </div>
              <div className="mb-3">
                <div className="flex items-center mb-1">
                  <AlertTriangle className="h-4 w-4 text-blue-600 mr-2" />
                  <h5 className="font-medium">Line Item {lineItem.id}</h5>
                </div>
                <p className="text-sm pl-6 mb-2">{messagePreview}</p>
                <div className="bg-gray-50 border rounded p-2 text-sm ml-6">
                  <div><strong>Order:</strong> {lineItem.orderId} - {lineItem.orderName}</div>
                  <div><strong>Time Period:</strong> {formatDate(lineItem.startDate)} to {formatDate(lineItem.endDate)}</div>
                  <div><strong>Requested by:</strong> Current User</div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="flex justify-between items-center pt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSend} className="bg-blue-600 hover:bg-blue-700">
            <Check className="mr-1 h-4 w-4" /> 
            Send Request
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AlertModal;
