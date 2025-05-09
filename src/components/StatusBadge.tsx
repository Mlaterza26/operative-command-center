
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getStatusStyles = () => {
    switch (status.toLowerCase()) {
      case "approved":
        return "bg-operative-approved text-gray-800";
      case "pending":
        return "bg-operative-pending text-gray-800";
      case "unapproved change":
        return "bg-operative-unapproved text-gray-800";
      case "incorrect cpm":
      case "invalid cost":
        return "text-operative-black";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <span
      className={cn(
        "px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap",
        getStatusStyles()
      )}
    >
      {status}
    </span>
  );
};

export default StatusBadge;
