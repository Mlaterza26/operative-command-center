
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

const DataSourceSettings: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>API Endpoints</CardTitle>
          <CardDescription>
            Configure API endpoints for data sources
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="api-endpoint">Primary API Endpoint</Label>
              <Input
                id="api-endpoint"
                placeholder="https://api.example.com/v1/"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="use-auth" />
              <Label htmlFor="use-auth">Use authentication</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Google Drive Integration</CardTitle>
          <CardDescription>
            Configure Google Drive as a data source
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="drive-folder">Google Drive Folder ID</Label>
              <Input
                id="drive-folder"
                placeholder="Enter your Google Drive folder ID"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="auto-sync" />
              <Label htmlFor="auto-sync">Auto-sync data</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      <Button>Connect Data Sources</Button>
    </div>
  );
};

export default DataSourceSettings;
