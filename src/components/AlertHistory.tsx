
import React, { useState, useEffect } from "react";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { AlertHistoryItem } from "@/pages/Finance";
import { getAllAlertHistory, resolveAlert, resolveAllAlerts } from "@/utils/alertStorage";

interface AlertHistoryProps {
  onBackClick: () => void;
}

const AlertHistory: React.FC<AlertHistoryProps> = ({ onBackClick }) => {
  const [alerts, setAlerts] = useState<AlertHistoryItem[]>([]);
  const [filteredAlerts, setFilteredAlerts] = useState<AlertHistoryItem[]>([]);
  const [orderFilter, setOrderFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");

  useEffect(() => {
    const history = getAllAlertHistory();
    setAlerts(history);
    setFilteredAlerts(history);
  }, []);

  useEffect(() => {
    let filtered = alerts;
    
    if (orderFilter) {
      filtered = filtered.filter(alert => 
        alert.orderId.toLowerCase().includes(orderFilter.toLowerCase()));
    }
    
    if (statusFilter !== "all") {
      const isResolved = statusFilter === "resolved";
      filtered = filtered.filter(alert => alert.resolved === isResolved);
    }
    
    if (dateFilter) {
      filtered = filtered.filter(alert => {
        const alertDate = new Date(alert.alertedAt).toISOString().split('T')[0];
        return alertDate === dateFilter;
      });
    }
    
    setFilteredAlerts(filtered);
  }, [alerts, orderFilter, statusFilter, dateFilter]);

  const handleResolve = (lineItemId: string) => {
    resolveAlert(lineItemId);
    const updatedAlerts = alerts.map(alert => 
      alert.lineItemId === lineItemId ? { ...alert, resolved: true, resolvedAt: new Date().toISOString() } : alert
    );
    setAlerts(updatedAlerts);
    toast.success(`Alert for line item ${lineItemId} marked as resolved`);
  };

  const handleResolveAll = () => {
    const selectedAlerts = filteredAlerts.filter(alert => !alert.resolved).map(alert => alert.lineItemId);
    if (selectedAlerts.length === 0) {
      toast.info("No active alerts to resolve");
      return;
    }
    
    resolveAllAlerts(selectedAlerts);
    
    const updatedAlerts = alerts.map(alert => 
      selectedAlerts.includes(alert.lineItemId) ? 
        { ...alert, resolved: true, resolvedAt: new Date().toISOString() } : alert
    );
    
    setAlerts(updatedAlerts);
    toast.success(`${selectedAlerts.length} alerts marked as resolved`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 mb-4">
        <Button variant="ghost" size="sm" onClick={onBackClick}>
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Views
        </Button>
        <h2 className="text-xl font-semibold">Alert History</h2>
      </div>
      
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="space-y-2">
            <Label htmlFor="order-filter">Filter by Order ID</Label>
            <Input 
              id="order-filter"
              placeholder="Enter Order ID" 
              value={orderFilter}
              onChange={(e) => setOrderFilter(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="status-filter">Status</Label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger id="status-filter">
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="date-filter">Alert Date</Label>
            <Input 
              id="date-filter"
              type="date" 
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex justify-end mb-4">
          <Button onClick={handleResolveAll} variant="outline">
            Resolve All Matching
          </Button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left p-3 font-medium">Line Item ID</th>
                <th className="text-left p-3 font-medium">Order ID</th>
                <th className="text-left p-3 font-medium">Client</th>
                <th className="text-left p-3 font-medium">Alerted At</th>
                <th className="text-left p-3 font-medium">Alerted To</th>
                <th className="text-left p-3 font-medium">Status</th>
                <th className="text-right p-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredAlerts.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-6 text-gray-500">
                    No alerts matching current filters
                  </td>
                </tr>
              )}
              {filteredAlerts.map((alert) => (
                <tr key={alert.lineItemId} className="border-b border-gray-100">
                  <td className="p-3">{alert.lineItemId}</td>
                  <td className="p-3">{alert.orderId}</td>
                  <td className="p-3">{alert.client}</td>
                  <td className="p-3">{new Date(alert.alertedAt).toLocaleString()}</td>
                  <td className="p-3">{alert.alertedBy}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      alert.resolved ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"
                    }`}>
                      {alert.resolved ? "Resolved" : "Active"}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    {!alert.resolved && (
                      <Button size="sm" variant="outline" onClick={() => handleResolve(alert.lineItemId)}>
                        Mark Resolved
                      </Button>
                    )}
                    {alert.resolved && (
                      <span className="text-sm text-gray-400">
                        Resolved {alert.resolvedAt && new Date(alert.resolvedAt).toLocaleDateString()}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default AlertHistory;
