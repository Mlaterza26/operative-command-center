
import React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ChevronRight } from "lucide-react";

interface TeamPanelProps {
  title: string;
  description: string;
  subtitle?: string;
  badge?: {
    count: number;
    label: string;
  };
  icon?: React.ReactNode;
  path: string;
  className?: string;
}

const TeamPanel: React.FC<TeamPanelProps> = ({
  title,
  description,
  subtitle,
  badge,
  icon,
  path,
  className,
}) => {
  return (
    <Link to={path}>
      <div
        className={cn(
          "miami-panel group bg-operative-navy-light p-6 rounded-xl border-2 border-operative-blue/30 hover:border-operative-blue transition-all duration-300 transform hover:translate-y-[-4px] hover:shadow-neon h-full",
          className
        )}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              {icon && <div className="mr-3 text-operative-blue">{icon}</div>}
              <h2 className="text-xl font-retro font-bold tracking-wide text-operative-teal group-hover:animate-neon-flicker">{title}</h2>
            </div>
            {badge && (
              <Badge variant="destructive" className="ml-2 font-retro bg-operative-coral text-white border-none animate-pulse">
                {badge.count} {badge.label}
              </Badge>
            )}
          </div>
          
          {subtitle && (
            <p className="text-sm font-medium text-operative-teal/80 mb-2 font-retro">{subtitle}</p>
          )}
          
          <p className="text-white/80 mb-4 flex-grow">{description}</p>
          
          <div className="flex justify-end">
            <span className="flex items-center text-sm font-medium text-operative-blue font-retro group-hover:text-operative-teal transition-colors">
              Access Dashboard
              <ChevronRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default TeamPanel;
