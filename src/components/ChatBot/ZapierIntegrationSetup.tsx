
import React, { useState, useEffect } from "react";
import { Zap, Save, ArrowLeft, Loader, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useZapierConfig } from "@/hooks/use-zapier-config";
import { toast } from "sonner";

interface ZapierIntegrationSetupProps {
  onClose: () => void;
}

const ZapierIntegrationSetup: React.FC<ZapierIntegrationSetupProps> = ({ onClose }) => {
  const { 
    webhookUrls, 
    updateWebhookUrl, 
    saveConfiguration, 
    testConnection,
    isLoading, 
    isConfigured 
  } = useZapierConfig();

  const handleSave = async () => {
    try {
      await saveConfiguration();
      toast.success("Zapier integration configured successfully");
      onClose();
    } catch (error) {
      toast.error("Failed to save configuration");
    }
  };

  const handleTest = async (webhookType: string) => {
    try {
      await testConnection(webhookType);
      toast.success(`Successfully tested ${webhookType} webhook`);
    } catch (error) {
      toast.error(`Failed to test ${webhookType} webhook`);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center px-4 py-3 border-b border-border/40">
        <div className="flex items-center">
          <Zap className="h-5 w-5 mr-2 text-primary" />
          <h3 className="font-semibold">Zapier Integration</h3>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onClose}
          className="h-8 w-8"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4">
        <p className="text-sm mb-4">
          Connect to Zapier webhooks to enable the assistant to trigger workflows in your external systems.
        </p>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="slack-webhook">Slack Notifications Webhook</Label>
            <div className="flex gap-2">
              <Input 
                id="slack-webhook"
                value={webhookUrls.slack || ''}
                onChange={(e) => updateWebhookUrl('slack', e.target.value)}
                placeholder="https://hooks.zapier.com/hooks/catch/..."
                className="flex-1"
              />
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => handleTest('slack')}
                disabled={!webhookUrls.slack || isLoading}
                className="flex-shrink-0"
              >
                {isLoading ? <Loader className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="asana-webhook">Asana Task Creation Webhook</Label>
            <div className="flex gap-2">
              <Input 
                id="asana-webhook"
                value={webhookUrls.asana || ''}
                onChange={(e) => updateWebhookUrl('asana', e.target.value)}
                placeholder="https://hooks.zapier.com/hooks/catch/..."
                className="flex-1"
              />
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => handleTest('asana')}
                disabled={!webhookUrls.asana || isLoading}
                className="flex-shrink-0"
              >
                {isLoading ? <Loader className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email-webhook">Email Notification Webhook</Label>
            <div className="flex gap-2">
              <Input 
                id="email-webhook"
                value={webhookUrls.email || ''}
                onChange={(e) => updateWebhookUrl('email', e.target.value)}
                placeholder="https://hooks.zapier.com/hooks/catch/..."
                className="flex-1"
              />
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => handleTest('email')}
                disabled={!webhookUrls.email || isLoading}
                className="flex-shrink-0"
              >
                {isLoading ? <Loader className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="sheets-webhook">Google Sheets Data Lookup Webhook</Label>
            <div className="flex gap-2">
              <Input 
                id="sheets-webhook"
                value={webhookUrls.sheets || ''}
                onChange={(e) => updateWebhookUrl('sheets', e.target.value)}
                placeholder="https://hooks.zapier.com/hooks/catch/..."
                className="flex-1"
              />
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => handleTest('sheets')}
                disabled={!webhookUrls.sheets || isLoading}
                className="flex-shrink-0"
              >
                {isLoading ? <Loader className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-4 border-t border-border/40">
        <div className="flex justify-between">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? (
              <Loader className="h-4 w-4 mr-2 animate-spin" />
            ) : isConfigured ? (
              <Check className="h-4 w-4 mr-2" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            {isConfigured ? "Update Configuration" : "Save Configuration"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ZapierIntegrationSetup;
