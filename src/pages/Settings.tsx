
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import UserManagement from "@/components/UserManagement";
import WebhookConfigurations from "@/components/WebhookConfigurations";
import DataSourceSettings from "@/components/DataSourceSettings";
import AddViewRequestModal from "@/components/AddViewRequestModal";
import { CustomView } from "@/pages/Finance";

const Settings: React.FC = () => {
  const [isAddingView, setIsAddingView] = useState(false);
  
  // Handler for adding a new view
  const handleAddView = (view: CustomView) => {
    console.log("New view added:", view);
    setIsAddingView(false);
  };
  
  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Settings</h1>
        <Button onClick={() => setIsAddingView(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New View Request
        </Button>
      </div>
      
      <Tabs defaultValue="users" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="datasources">Data Sources</TabsTrigger>
        </TabsList>
        
        <TabsContent value="users">
          <UserManagement />
        </TabsContent>
        
        <TabsContent value="integrations">
          <WebhookConfigurations />
        </TabsContent>
        
        <TabsContent value="datasources">
          <DataSourceSettings />
        </TabsContent>
      </Tabs>
      
      <AddViewRequestModal
        isOpen={isAddingView}
        onClose={() => setIsAddingView(false)}
        onAddView={handleAddView}
      />
    </div>
  );
};

export default Settings;
