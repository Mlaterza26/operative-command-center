
import React from "react";
import { AlertTriangle, Clock, LineChart } from "lucide-react";

interface FinanceSummaryProps {
  itemCount: number;
  totalQuantityGap: number;
  lastUpdated: string;
}

const FinanceSummary: React.FC<FinanceSummaryProps> = ({ 
  itemCount, 
  totalQuantityGap, 
  lastUpdated 
}) => {
  return (
    <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm mb-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex items-center">
          <div className="flex items-center text-blue-600 bg-blue-50 p-2 rounded-full mr-3">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Attention Required</p>
            <p className="font-semibold">
              {itemCount > 0 
                ? `${itemCount} items need review` 
                : "All items reviewed"}
            </p>
          </div>
        </div>
        
        <div className="flex items-center">
          <div className="flex items-center text-blue-600 bg-blue-50 p-2 rounded-full mr-3">
            <LineChart className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Quantity Verification</p>
            <p className="font-semibold">
              {totalQuantityGap > 0 
                ? `Quantity gap: ${totalQuantityGap} units` 
                : "No quantity gaps"}
            </p>
          </div>
        </div>
        
        <div className="flex items-center">
          <div className="flex items-center text-blue-600 bg-blue-50 p-2 rounded-full mr-3">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Last Updated</p>
            <p className="font-semibold">{lastUpdated}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinanceSummary;
