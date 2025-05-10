
import React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

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
          "bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300 transition-all duration-300 h-full transform hover:-translate-y-1",
          className
        )}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              {icon && <div className="mr-3">{icon}</div>}
              <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
            </div>
            {badge && (
              <Badge variant="destructive" className="ml-2 animate-pulse">
                {badge.count} {badge.label}
              </Badge>
            )}
          </div>
          
          {subtitle && (
            <p className="text-sm font-medium text-gray-600 mb-2">{subtitle}</p>
          )}
          
          <p className="text-gray-600 mb-4 flex-grow">{description}</p>
          
          <div className="flex justify-end">
            <span className="text-sm font-medium text-operative-black hover:text-operative-red transition-colors">
              Access Dashboard →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default TeamPanel;
