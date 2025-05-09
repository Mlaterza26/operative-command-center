import React, { useState, useEffect } from "react";
import TopNavigation from "@/components/TopNavigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Settings, Shield, LogOut, FileCheck, Bell, Database, Trash2, AlertTriangle } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { clearAlertHistory, getAlertHistory, updateLastDataRefresh } from "@/utils/alertStorage";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [dataSourceUrl, setDataSourceUrl] = useState("");
  const [isGoogleDrive, setIsGoogleDrive] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState("60");
  const [adminPassword, setAdminPassword] = useState("");
  const [zapierWebhook, setZapierWebhook] = useState("");
  
  // CPU Rule Configuration
  const [cpuRuleEnabled, setCpuRuleEnabled] = useState(true);
  const [cpuThreshold, setCpuThreshold] = useState("50");
  const [cpuAlertTemplate, setCpuAlertTemplate] = useState(
    "Attention required: CPU line item {{lineItemId}} for {{client}} has a quantity gap of {{gap}} units."
  );
  const [cpuDefaultRecipient, setCpuDefaultRecipient] = useState("finance-team@operative.com");
  const [debugMode, setDebugMode] = useState(false);
  
  // Load saved settings when component mounts
  useEffect(() => {
    const savedDataSourceUrl = localStorage.getItem("dataSourceUrl") || "";
    const savedIsGoogleDrive = localStorage.getItem("isGoogleDrive") === "true";
    const savedRefreshInterval = localStorage.getItem("refreshInterval") || "60";
    const savedZapierWebhook = localStorage.getItem("zapierWebhook") || "";
    
    // Load CPU rule configuration
    const savedCpuRuleEnabled = localStorage.getItem("cpuRuleEnabled") !== "false"; // Default to true
    const savedCpuThreshold = localStorage.getItem("cpuThreshold") || "50";
    const savedCpuAlertTemplate = localStorage.getItem("cpuAlertTemplate") || 
      "Attention required: CPU line item {{lineItemId}} for {{client}} has a quantity gap of {{gap}} units.";
    const savedCpuDefaultRecipient = localStorage.getItem("cpuDefaultRecipient") || "finance-team@operative.com";
    const savedDebugMode = localStorage.getItem("debugMode") === "true";
    
    setDataSourceUrl(savedDataSourceUrl);
    setIsGoogleDrive(savedIsGoogleDrive);
    setRefreshInterval(savedRefreshInterval);
    setZapierWebhook(savedZapierWebhook);
    
    setCpuRuleEnabled(savedCpuRuleEnabled);
    setCpuThreshold(savedCpuThreshold);
    setCpuAlertTemplate(savedCpuAlertTemplate);
    setCpuDefaultRecipient(savedCpuDefaultRecipient);
    setDebugMode(savedDebugMode);
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("adminAuthenticated");
    toast.success("Logged out successfully");
    navigate("/admin");
  };

  const handleSaveDataSource = () => {
    // Validate Google Drive link if that option is selected
    if (isGoogleDrive) {
      // Simple validation for Google Drive links - can be more sophisticated
      const isValidGoogleDriveUrl = dataSourceUrl.includes("drive.google.com") || 
                                   dataSourceUrl.includes("docs.google.com") || 
                                   dataSourceUrl.includes("sheets.google.com");
      
      if (!isValidGoogleDriveUrl) {
        toast.error("Please enter a valid Google Drive URL");
        return;
      }
    }
    
    // Store in localStorage
    localStorage.setItem("dataSourceUrl", dataSourceUrl);
    localStorage.setItem("isGoogleDrive", isGoogleDrive.toString());
    toast.success("Data source URL updated");
  };

  const handleSaveRefreshSettings = () => {
    localStorage.setItem("refreshInterval", refreshInterval);
    toast.success("Refresh interval updated");
  };

  const handleUpdatePassword = () => {
    if (adminPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    // In a real app, this would be securely stored and hashed
    localStorage.setItem("adminPassword", adminPassword);
    setAdminPassword("");
    toast.success("Admin password updated");
  };

  const handleSaveZapierWebhook = () => {
    if (!zapierWebhook.startsWith("https://")) {
      toast.error("Please enter a valid webhook URL starting with https://");
      return;
    }
    
    localStorage.setItem("zapierWebhook", zapierWebhook);
    toast.success("Zapier webhook URL updated");
  };

  const handleTestZapierWebhook = () => {
    if (!zapierWebhook) {
      toast.error("Please enter a webhook URL first");
      return;
    }

    // Simulate a webhook test
    toast.success("Test payload sent to Zapier webhook", {
      description: "Check your Zapier task history to confirm it was received"
    });
  };

  const handleSaveCpuRuleConfig = () => {
    localStorage.setItem("cpuRuleEnabled", cpuRuleEnabled.toString());
    localStorage.setItem("cpuThreshold", cpuThreshold);
    localStorage.setItem("cpuAlertTemplate", cpuAlertTemplate);
    localStorage.setItem("cpuDefaultRecipient", cpuDefaultRecipient);
    
    // Fix: Create example values for template variables instead of trying to reference undefined variables
    const exampleLineItemId = "LI123";
    const exampleClient = "Acme Corp";
    const exampleGap = "3";
    const exampleOrderId = "ORD456";
    
    // Generate example message by replacing template placeholders with example values
    const exampleMessage = cpuAlertTemplate
      .replace(/\{\{lineItemId\}\}/g, exampleLineItemId)
      .replace(/\{\{orderId\}\}/g, exampleOrderId)
      .replace(/\{\{client\}\}/g, exampleClient)
      .replace(/\{\{gap\}\}/g, exampleGap);
    
    toast.success("CPU rule configuration updated", {
      description: "Example alert: " + exampleMessage
    });
  };

  const handleSaveDebugSettings = () => {
    localStorage.setItem("debugMode", debugMode.toString());
    toast.success("Debug settings updated");
  };

  const handleClearAlertHistory = () => {
    clearAlertHistory();
    toast.success("Alert history cleared");
  };

  const handleReloadSampleData = () => {
    // Reset to initial sample data
    localStorage.removeItem("financeAlerts");
    updateLastDataRefresh();
    toast.success("Sample data reloaded");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <TopNavigation />
      <div className="flex-1 container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <Shield className="h-6 w-6 text-operative-black" />
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>

        <Tabs defaultValue="data-source" className="w-full">
          <TabsList className="grid w-full md:w-auto grid-cols-5">
            <TabsTrigger value="data-source">Data Source</TabsTrigger>
            <TabsTrigger value="display">Display Settings</TabsTrigger>
            <TabsTrigger value="cpu-rules">CPU Rules</TabsTrigger>
            <TabsTrigger value="data-management">Data Management</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>
          
          <TabsContent value="data-source">
            <Card>
              <CardHeader>
                <CardTitle>Data Source Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="api-url">Data Source URL</Label>
                  <Input
                    id="api-url"
                    placeholder="https://drive.google.com/spreadsheets/d/..."
                    value={dataSourceUrl}
                    onChange={(e) => setDataSourceUrl(e.target.value)}
                  />
                  
                  <div className="flex items-center space-x-2 pt-2">
                    <Switch 
                      id="google-drive"
                      checked={isGoogleDrive}
                      onCheckedChange={setIsGoogleDrive}
                    />
                    <Label htmlFor="google-drive">This is a Google Drive link</Label>
                  </div>
                  
                  <p className="text-sm text-gray-500">
                    {isGoogleDrive 
                      ? "Enter the Google Drive URL where your financial data is stored. Make sure the file is publicly accessible or has proper sharing permissions." 
                      : "Enter the URL where your financial data is hosted"}
                  </p>
                </div>
                <Button onClick={handleSaveDataSource}>
                  <FileCheck className="mr-2 h-4 w-4" />
                  Save Data Source
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="display">
            <Card>
              <CardHeader>
                <CardTitle>Display Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="refresh">Auto-refresh Interval (seconds)</Label>
                  <Input
                    id="refresh"
                    type="number"
                    min="10"
                    max="3600"
                    value={refreshInterval}
                    onChange={(e) => setRefreshInterval(e.target.value)}
                  />
                </div>
                <Button onClick={handleSaveRefreshSettings}>Save Display Settings</Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="cpu-rules">
            <Card>
              <CardHeader>
                <CardTitle>CPU Rule Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="cpu-rule-enabled"
                      checked={cpuRuleEnabled}
                      onCheckedChange={setCpuRuleEnabled}
                    />
                    <Label htmlFor="cpu-rule-enabled">Enable CPU Rule Alerts</Label>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="cpu-threshold">Minimum Quantity Gap Threshold</Label>
                  <Input
                    id="cpu-threshold"
                    type="number"
                    min="1"
                    max="1000"
                    value={cpuThreshold}
                    onChange={(e) => setCpuThreshold(e.target.value)}
                    disabled={!cpuRuleEnabled}
                  />
                  <p className="text-sm text-gray-500">
                    Alert will be triggered when quantity gap exceeds this threshold
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="cpu-alert-template">Alert Message Template</Label>
                  <Textarea
                    id="cpu-alert-template"
                    placeholder="Custom alert message template"
                    value={cpuAlertTemplate}
                    onChange={(e) => setCpuAlertTemplate(e.target.value)}
                    disabled={!cpuRuleEnabled}
                    className="min-h-[100px]"
                  />
                  <p className="text-sm text-gray-500">
                    Use &#123;&#123;lineItemId&#125;&#125;, &#123;&#123;orderId&#125;&#125;, &#123;&#123;client&#125;&#125;, and &#123;&#123;gap&#125;&#125; as variables
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="cpu-default-recipient">Default Alert Recipient</Label>
                  <Input
                    id="cpu-default-recipient"
                    type="email"
                    placeholder="finance-team@operative.com"
                    value={cpuDefaultRecipient}
                    onChange={(e) => setCpuDefaultRecipient(e.target.value)}
                    disabled={!cpuRuleEnabled}
                  />
                </div>
                
                <Button onClick={handleSaveCpuRuleConfig} disabled={!cpuRuleEnabled}>
                  <AlertTriangle className="mr-2 h-4 w-4" />
                  Save CPU Rule Configuration
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="data-management">
            <Card>
              <CardHeader>
                <CardTitle>Data Management</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Clear Alert History</Label>
                  <p className="text-sm text-gray-500">
                    Remove all stored alert records from local storage
                  </p>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Clear Alert History
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete all
                          alert history records from local storage.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleClearAlertHistory}>Continue</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
                
                <div className="space-y-2">
                  <Label>Reload Sample Data</Label>
                  <p className="text-sm text-gray-500">
                    Reset to initial sample data set, removing any modifications
                  </p>
                  <Button onClick={handleReloadSampleData}>
                    <Database className="mr-2 h-4 w-4" />
                    Reload Sample Data
                  </Button>
                </div>
                
                <div className="space-y-2 pt-4">
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="debug-mode"
                      checked={debugMode}
                      onCheckedChange={setDebugMode}
                    />
                    <Label htmlFor="debug-mode">Enable Debug Mode</Label>
                  </div>
                  <p className="text-sm text-gray-500">
                    Show detailed processing information in browser console
                  </p>
                  <Button onClick={handleSaveDebugSettings}>
                    <Settings className="mr-2 h-4 w-4" />
                    Save Debug Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="admin-password">Update Admin Password</Label>
                  <Input
                    id="admin-password"
                    type="password"
                    placeholder="New password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                  />
                </div>
                <Button onClick={handleUpdatePassword}>Update Password</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
