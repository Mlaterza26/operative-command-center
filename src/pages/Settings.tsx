
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Users, Webhook, Database } from "lucide-react";
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
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Settings</h1>
          <p className="text-sm text-operative-text-body mt-1">Configure system preferences and integrations</p>
        </div>
        <Button 
          onClick={() => setIsAddingView(true)}
          className="bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-200 glow-border"
        >
          <Plus className="mr-2 h-4 w-4" />
          New View Request
        </Button>
      </div>
      
      <div className="card-gradient rounded-lg shadow-glow-sm animate-in">
        <Tabs defaultValue="users" className="w-full">
          <TabsList className="mb-6 bg-background/10 backdrop-blur-sm p-1 border-b border-operative-border/20">
            <TabsTrigger 
              value="users" 
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex items-center gap-2"
            >
              <Users className="h-4 w-4" />
              User Management
            </TabsTrigger>
            <TabsTrigger 
              value="integrations" 
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex items-center gap-2"
            >
              <Webhook className="h-4 w-4" />
              Integrations
            </TabsTrigger>
            <TabsTrigger 
              value="datasources" 
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex items-center gap-2"
            >
              <Database className="h-4 w-4" />
              Data Sources
            </TabsTrigger>
          </TabsList>
          
          <div className="px-4 pb-4">
            <TabsContent value="users">
              <UserManagement />
            </TabsContent>
            
            <TabsContent value="integrations">
              <WebhookConfigurations />
            </TabsContent>
            
            <TabsContent value="datasources">
              <DataSourceSettings />
            </TabsContent>
          </div>
        </Tabs>
      </div>
      
      <AddViewRequestModal
        isOpen={isAddingView}
        onClose={() => setIsAddingView(false)}
        onAddView={handleAddView}
      />
    </div>
  );
};

export default Settings;
