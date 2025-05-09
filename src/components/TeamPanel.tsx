
import React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface TeamPanelProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  path: string;
  className?: string;
}

const TeamPanel: React.FC<TeamPanelProps> = ({
  title,
  description,
  icon,
  path,
  className,
}) => {
  return (
    <Link to={path}>
      <div
        className={cn(
          "bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 h-full",
          className
        )}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center mb-4">
            {icon && <div className="mr-3">{icon}</div>}
            <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          </div>
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
