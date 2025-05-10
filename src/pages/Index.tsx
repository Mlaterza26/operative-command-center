import React, { useEffect, useState } from "react";
import TopNavigation from "@/components/TopNavigation";
import TeamPanel from "@/components/TeamPanel";
import UncOperative1Bot from "@/components/UncOperative1Bot";
const teamDescriptions = {
  sales: "Manage leads, track sales performance, and monitor pipeline progress with real-time data.",
  planning: "Oversee campaign planning, resource allocation, and project timelines across multiple clients.",
  clientSuccess: "Track client satisfaction metrics, monitor account health, and identify opportunities for growth.",
  adOps: "Optimize ad delivery metrics, monitor campaign performance, and identify technical issues.",
  finance: "Review financial reports, track invoicing status, and identify discrepancies in campaign billing."
};
const Index: React.FC = () => {
  const [alertCount, setAlertCount] = useState<number>(0);

  // Get alert count from localStorage
  useEffect(() => {
    // Check if there are any alerts in localStorage
    const checkAlerts = () => {
      const alertsData = localStorage.getItem("alertHistory");
      if (alertsData) {
        try {
          const alerts = JSON.parse(alertsData);
          // Count unresolved alerts
          const unresolvedCount = alerts.filter((alert: any) => !alert.resolved).length;
          setAlertCount(unresolvedCount);
        } catch (error) {
          console.error("Error parsing alerts data:", error);
          setAlertCount(0);
        }
      }
    };
    checkAlerts();
    // Check alerts whenever the component is mounted
    const interval = setInterval(checkAlerts, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);
  return <div className="min-h-screen bg-gray-50">
      <TopNavigation />
      
      <div className="container mx-auto px-4 py-12">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Operative Control Center</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">For those pesky uncOperative scenarios</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <TeamPanel title="Sales" description={teamDescriptions.sales} path="/sales" className="border-l-4 border-blue-500" />
          
          <TeamPanel title="Planning" description={teamDescriptions.planning} path="/planning" className="border-l-4 border-purple-500" />
          
          <TeamPanel title="Client Success" description={teamDescriptions.clientSuccess} path="/client-success" className="border-l-4 border-green-500" />
          
          <TeamPanel title="Ad Ops" description={teamDescriptions.adOps} path="/ad-ops" className="border-l-4 border-amber-500" />
          
          <TeamPanel title="Finance" subtitle="Financial Order Monitoring & Alerts" description={teamDescriptions.finance} path="/finance" className="border-l-4 border-operative-red" badge={alertCount > 0 ? {
          count: alertCount,
          label: "new alerts"
        } : undefined} />
          
          {/* The new uncOperative1 Bot panel */}
          <UncOperative1Bot />
        </div>
      </div>
    </div>;
};
export default Index;