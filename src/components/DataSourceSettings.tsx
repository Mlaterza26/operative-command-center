
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

const DataSourceSettings: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card className="card-gradient border-operative-border/20 shadow-glow-sm overflow-hidden">
        <CardHeader className="border-b border-operative-border/20 bg-gradient-to-r from-operative-navy-light/80 to-operative-navy">
          <CardTitle className="text-white flex items-center">
            API Endpoints
          </CardTitle>
          <CardDescription className="text-operative-text-body">
            Configure API endpoints for data sources
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="api-endpoint" className="text-operative-text-body">Primary API Endpoint</Label>
              <Input
                id="api-endpoint"
                placeholder="https://api.example.com/v1/"
                className="bg-operative-navy-light/50 border-operative-border/30 focus-visible:ring-operative-blue text-white"
              />
            </div>
            <div className="flex items-center space-x-3">
              <Switch id="use-auth" />
              <Label htmlFor="use-auth" className="text-operative-text-body">Use authentication</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="card-gradient border-operative-border/20 shadow-glow-sm overflow-hidden">
        <CardHeader className="border-b border-operative-border/20 bg-gradient-to-r from-operative-navy-light/80 to-operative-navy">
          <CardTitle className="text-white flex items-center">
            Google Drive Integration
          </CardTitle>
          <CardDescription className="text-operative-text-body">
            Configure Google Drive as a data source
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="drive-folder" className="text-operative-text-body">Google Drive Folder ID</Label>
              <Input
                id="drive-folder"
                placeholder="Enter your Google Drive folder ID"
                className="bg-operative-navy-light/50 border-operative-border/30 focus-visible:ring-operative-blue text-white"
              />
            </div>
            <div className="flex items-center space-x-3">
              <Switch id="auto-sync" />
              <Label htmlFor="auto-sync" className="text-operative-text-body">Auto-sync data</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      <Button className="bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-200 glow-border">
        Connect Data Sources
      </Button>
    </div>
  );
};

export default DataSourceSettings;
