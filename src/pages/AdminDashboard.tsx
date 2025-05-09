
import React, { useState } from "react";
import TopNavigation from "@/components/TopNavigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Settings, Shield, LogOut } from "lucide-react";

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [dataSourceUrl, setDataSourceUrl] = useState("");
  const [refreshInterval, setRefreshInterval] = useState("60");
  const [adminPassword, setAdminPassword] = useState("");
  
  const handleLogout = () => {
    sessionStorage.removeItem("adminAuthenticated");
    toast.success("Logged out successfully");
    navigate("/admin");
  };

  const handleSaveDataSource = () => {
    // In a real app, you'd save this to a database or localStorage
    localStorage.setItem("dataSourceUrl", dataSourceUrl);
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
          <TabsList className="grid w-full md:w-auto grid-cols-3">
            <TabsTrigger value="data-source">Data Source</TabsTrigger>
            <TabsTrigger value="display">Display Settings</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>
          
          <TabsContent value="data-source">
            <Card>
              <CardHeader>
                <CardTitle>Data Source Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="api-url">API Endpoint URL</Label>
                  <Input
                    id="api-url"
                    placeholder="https://api.example.com/data"
                    value={dataSourceUrl}
                    onChange={(e) => setDataSourceUrl(e.target.value)}
                  />
                  <p className="text-sm text-gray-500">
                    Enter the URL where your financial data is hosted
                  </p>
                </div>
                <Button onClick={handleSaveDataSource}>Save Data Source</Button>
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
