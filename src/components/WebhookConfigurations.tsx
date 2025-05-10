
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

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
      <Card>
        <CardHeader>
          <CardTitle>Asana Integration</CardTitle>
          <CardDescription>
            Configure the webhook to automatically create tasks in Asana when new view requests are submitted
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="asana-webhook">Asana Webhook URL</Label>
              <Input
                id="asana-webhook"
                placeholder="https://hooks.asana.com/your-webhook-url"
                value={asanaWebhook}
                onChange={(e) => setAsanaWebhook(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Zapier Integration</CardTitle>
          <CardDescription>
            Configure the webhook to trigger Zapier automations when new view requests are submitted
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="zapier-webhook">Zapier Webhook URL</Label>
              <Input
                id="zapier-webhook"
                placeholder="https://hooks.zapier.com/your-webhook-url"
                value={zapierWebhook}
                onChange={(e) => setZapierWebhook(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Button onClick={saveWebhookConfigurations}>Save Configuration</Button>
    </div>
  );
};

export default WebhookConfigurations;
