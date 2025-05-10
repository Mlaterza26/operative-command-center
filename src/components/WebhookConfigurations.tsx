
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Webhook, Save } from "lucide-react";

const WebhookConfigurations: React.FC = () => {
  const [asanaWebhook, setAsanaWebhook] = useState<string>("");
  const [zapierWebhook, setZapierWebhook] = useState<string>("");

  // Load webhook URLs from localStorage on component mount
  useEffect(() => {
    const savedAsanaWebhook = localStorage.getItem("asanaWebhook") || "";
    const savedZapierWebhook = localStorage.getItem("zapierWebhook") || "";
    
    setAsanaWebhook(savedAsanaWebhook);
    setZapierWebhook(savedZapierWebhook);
  }, []);

  // Save webhook URLs to localStorage
  const saveWebhookConfigurations = () => {
    localStorage.setItem("asanaWebhook", asanaWebhook);
    localStorage.setItem("zapierWebhook", zapierWebhook);
    
    toast.success("Webhook configurations saved successfully");
  };

  return (
    <div className="space-y-6">
      <Card className="card-gradient border-operative-border/20 shadow-glow-sm overflow-hidden">
        <CardHeader className="border-b border-operative-border/20 bg-gradient-to-r from-operative-navy-light/80 to-operative-navy">
          <CardTitle className="text-white flex items-center">
            <Webhook className="mr-2 h-5 w-5 text-operative-blue" />
            Asana Integration
          </CardTitle>
          <CardDescription className="text-operative-text-body">
            Configure the webhook to automatically create tasks in Asana when new view requests are submitted
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="asana-webhook" className="text-operative-text-body">Asana Webhook URL</Label>
              <Input
                id="asana-webhook"
                placeholder="https://hooks.asana.com/your-webhook-url"
                value={asanaWebhook}
                onChange={(e) => setAsanaWebhook(e.target.value)}
                className="bg-operative-navy-light/50 border-operative-border/30 focus-visible:ring-operative-blue text-white"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="card-gradient border-operative-border/20 shadow-glow-sm overflow-hidden">
        <CardHeader className="border-b border-operative-border/20 bg-gradient-to-r from-operative-navy-light/80 to-operative-navy">
          <CardTitle className="text-white flex items-center">
            <Webhook className="mr-2 h-5 w-5 text-operative-teal" />
            Zapier Integration
          </CardTitle>
          <CardDescription className="text-operative-text-body">
            Configure the webhook to trigger Zapier automations when new view requests are submitted
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="zapier-webhook" className="text-operative-text-body">Zapier Webhook URL</Label>
              <Input
                id="zapier-webhook"
                placeholder="https://hooks.zapier.com/your-webhook-url"
                value={zapierWebhook}
                onChange={(e) => setZapierWebhook(e.target.value)}
                className="bg-operative-navy-light/50 border-operative-border/30 focus-visible:ring-operative-blue text-white"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Button 
        onClick={saveWebhookConfigurations} 
        className="bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-200 glow-border"
      >
        <Save className="mr-2 h-4 w-4" />
        Save Configuration
      </Button>
    </div>
  );
};

export default WebhookConfigurations;
