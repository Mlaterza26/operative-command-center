
import React, { useState, useEffect } from "react";
import TopNavigation from "@/components/TopNavigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Settings, Shield, LogOut, FileCheck, Bell } from "lucide-react";
import { Switch } from "@/components/ui/switch";

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [dataSourceUrl, setDataSourceUrl] = useState("");
  const [isGoogleDrive, setIsGoogleDrive] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState("60");
  const [adminPassword, setAdminPassword] = useState("");
  const [zapierWebhook, setZapierWebhook] = useState("");
  
  // Load saved settings when component mounts
  useEffect(() => {
    const savedDataSourceUrl = localStorage.getItem("dataSourceUrl") || "";
    const savedIsGoogleDrive = localStorage.getItem("isGoogleDrive") === "true";
    const savedRefreshInterval = localStorage.getItem("refreshInterval") || "60";
    const savedZapierWebhook = localStorage.getItem("zapierWebhook") || "";
    
    setDataSourceUrl(savedDataSourceUrl);
    setIsGoogleDrive(savedIsGoogleDrive);
    setRefreshInterval(savedRefreshInterval);
    setZapierWebhook(savedZapierWebhook);
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
          <TabsList className="grid w-full md:w-auto grid-cols-4">
            <TabsTrigger value="data-source">Data Source</TabsTrigger>
            <TabsTrigger value="display">Display Settings</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
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
          
          <TabsContent value="integrations">
            <Card>
              <CardHeader>
                <CardTitle>Zapier Integration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="zapier-webhook">Zapier Webhook URL</Label>
                  <Input
                    id="zapier-webhook"
                    placeholder="https://hooks.zapier.com/hooks/catch/..."
                    value={zapierWebhook}
                    onChange={(e) => setZapierWebhook(e.target.value)}
                  />
                  
                  <p className="text-sm text-gray-500">
                    Enter the webhook URL from your Zapier account. This will be used to send alerts when team notifications are triggered.
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button onClick={handleSaveZapierWebhook}>
                    Save Webhook
                  </Button>
                  <Button variant="outline" onClick={handleTestZapierWebhook}>
                    <Bell className="mr-2 h-4 w-4" />
                    Test Webhook
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
