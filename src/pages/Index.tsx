
import React, { useEffect, useState } from "react";
import CommandLayout from "@/components/ui/CommandLayout";
import { useViewContext } from "@/hooks/use-view-context";
import { ChevronRight } from "lucide-react";

const teamDescriptions = {
  sales: "Manage leads, track sales performance, and monitor pipeline progress with real-time data.",
  planning: "Oversee campaign planning, resource allocation, and project timelines across multiple clients.",
  clientSuccess: "Track client satisfaction metrics, monitor account health, and identify opportunities for growth.",
  adOps: "Optimize ad delivery metrics, monitor campaign performance, and identify technical issues.",
  finance: "Review financial reports, track invoicing status, and identify discrepancies in campaign billing."
};

const Index: React.FC = () => {
  const [alertCount, setAlertCount] = useState<number>(0);
  const { updateCurrentView } = useViewContext();

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
    
    // Set the current view
    updateCurrentView("Dashboard");

    return () => clearInterval(interval);
  }, [updateCurrentView]);

  return (
    <CommandLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-12 text-center">
          <h1 className="mb-4 font-retro text-5xl font-bold tracking-wider text-white">
            <span className="mr-2 bg-miami-gradient bg-clip-text text-transparent">OPERATIVE</span>
            <span className="bg-miami-gradient-reverse bg-clip-text text-transparent">CONTROL</span>
          </h1>
          <p className="text-xl text-operative-blue">For those pesky uncOperative scenarios</p>
        </div>

        <div className="mx-auto max-w-5xl space-y-6">
          <TeamPanelButton 
            title="SALES" 
            description={teamDescriptions.sales} 
            path="/sales" 
          />
          
          <TeamPanelButton 
            title="PLANNING" 
            description={teamDescriptions.planning} 
            path="/planning" 
          />
          
          <TeamPanelButton 
            title="CLIENT SUCCESS" 
            description={teamDescriptions.clientSuccess} 
            path="/client-success" 
          />
          
          <TeamPanelButton 
            title="AD OPS" 
            description={teamDescriptions.adOps} 
            path="/ad-ops" 
          />
          
          <TeamPanelButton 
            title="FINANCE" 
            description={teamDescriptions.finance}
            path="/finance" 
            badge={alertCount > 0 ? {
              count: alertCount,
              label: "new alerts"
            } : undefined}
          />
        </div>
      </div>
    </CommandLayout>
  );
};

interface TeamPanelButtonProps {
  title: string;
  description: string;
  path: string;
  badge?: {
    count: number;
    label: string;
  };
}

const TeamPanelButton: React.FC<TeamPanelButtonProps> = ({ 
  title, 
  description, 
  path, 
  badge 
}) => {
  return (
    <a href={path} className="block">
      <div className="group relative overflow-hidden rounded-full bg-gradient-to-r from-operative-blue to-operative-red p-[2px] transition-all hover:shadow-glow-md">
        <div className="flex items-center justify-between rounded-full bg-operative-navy p-4 transition-all">
          <div className="ml-4 flex-1">
            <h2 className="font-retro text-2xl font-bold tracking-wider text-operative-teal group-hover:animate-neon-flicker">
              {title}
            </h2>
            <p className="mt-1 text-sm text-white/80">{description}</p>
          </div>
          
          {badge && (
            <div className="mr-4 flex h-8 items-center rounded-full bg-operative-coral px-4 font-retro text-sm text-white">
              {badge.count} {badge.label}
            </div>
          )}
          
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-operative-blue text-white transition-transform group-hover:translate-x-1">
            <ChevronRight className="h-6 w-6" />
          </div>
        </div>
      </div>
    </a>
  );
};

export default Index;
