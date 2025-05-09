
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Check } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { updateAlertHistory } from "@/utils/alertStorage";

export type AlertHistoryItem = {
  lineItemId: string;
  orderId: string;
  client: string;
  alertedAt: string;
  alertedBy: string;
  resolved: boolean;
  resolvedAt?: string;
};

interface AlertHistoryProps {
  onBackClick: () => void;
}

const AlertHistory: React.FC<AlertHistoryProps> = ({ onBackClick }) => {
  const [alerts, setAlerts] = useState<AlertHistoryItem[]>([]);
  const [selectedAlerts, setSelectedAlerts] = useState<string[]>([]);

  useEffect(() => {
    // Get alerts from localStorage
    try {
      const alertHistory = localStorage.getItem("alertHistory");
      if (alertHistory) {
        setAlerts(JSON.parse(alertHistory));
      }
    } catch (error) {
      console.error("Error loading alert history:", error);
      toast.error("Failed to load alert history");
    }
  }, []);

  const handleResolveSelected = () => {
    if (selectedAlerts.length === 0) {
      toast.info("No alerts selected");
      return;
    }

    // Update alerts in state
    const updatedAlerts = alerts.map(alert => {
      if (selectedAlerts.includes(alert.lineItemId)) {
        return {
          ...alert,
          resolved: true,
          resolvedAt: new Date().toISOString()
        };
      }
      return alert;
    });

    setAlerts(updatedAlerts);
    
    // Update localStorage
    localStorage.setItem("alertHistory", JSON.stringify(updatedAlerts));
    
    // Update individual alert records
    selectedAlerts.forEach(lineItemId => {
      const alert = alerts.find(a => a.lineItemId === lineItemId);
      if (alert) {
        updateAlertHistory({
          ...alert,
          resolved: true
        });
      }
    });

    toast.success(`${selectedAlerts.length} alert(s) marked as resolved`);
    setSelectedAlerts([]);
  };

  const handleCheckboxChange = (lineItemId: string) => {
    setSelectedAlerts(prev => {
      if (prev.includes(lineItemId)) {
        return prev.filter(id => id !== lineItemId);
      } else {
        return [...prev, lineItemId];
      }
    });
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedAlerts(alerts.filter(alert => !alert.resolved).map(alert => alert.lineItemId));
    } else {
      setSelectedAlerts([]);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
    } catch (e) {
      return "Invalid date";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" onClick={onBackClick}>
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          <h2 className="text-xl font-semibold">Alert History</h2>
        </div>
        <Button 
          onClick={handleResolveSelected} 
          disabled={selectedAlerts.length === 0}
          size="sm"
        >
          <Check className="h-4 w-4 mr-1" />
          Resolve Selected ({selectedAlerts.length})
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <input 
                  type="checkbox" 
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="rounded border-gray-300"
                />
              </TableHead>
              <TableHead>Line Item ID</TableHead>
              <TableHead>Order ID</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Alerted At</TableHead>
              <TableHead>Alerted By</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Resolved At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {alerts.length > 0 ? (
              alerts.map((alert) => (
                <TableRow 
                  key={alert.lineItemId}
                  className={alert.resolved ? "bg-gray-50" : undefined}
                >
                  <TableCell>
                    {!alert.resolved && (
                      <input 
                        type="checkbox" 
                        checked={selectedAlerts.includes(alert.lineItemId)}
                        onChange={() => handleCheckboxChange(alert.lineItemId)}
                        className="rounded border-gray-300"
                      />
                    )}
                  </TableCell>
                  <TableCell>{alert.lineItemId}</TableCell>
                  <TableCell>{alert.orderId}</TableCell>
                  <TableCell>{alert.client}</TableCell>
                  <TableCell>{formatDate(alert.alertedAt)}</TableCell>
                  <TableCell>{alert.alertedBy}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      alert.resolved 
                      ? "bg-green-100 text-green-800" 
                      : "bg-red-100 text-red-800"
                    }`}>
                      {alert.resolved ? "Resolved" : "Pending"}
                    </span>
                  </TableCell>
                  <TableCell>
                    {alert.resolved && alert.resolvedAt 
                      ? formatDate(alert.resolvedAt)
                      : "—"}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                  No alerts found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AlertHistory;
