
import React from "react";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
  className?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  const getStatusColor = () => {
    switch (status.toLowerCase()) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "incorrect cpm":
      case "incorrect cost":
      case "missing dates":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <span 
      className={cn(
        "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium", 
        getStatusColor(),
        className
      )}
    >
      {status}
    </span>
  );
};

export default StatusBadge;
