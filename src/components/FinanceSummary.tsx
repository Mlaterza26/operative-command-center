
import React from "react";
import { AlertTriangle } from "lucide-react";

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
          <div className="flex items-center text-amber-600 bg-amber-50 p-2 rounded-full mr-3">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Issues</p>
            <p className="font-semibold">{itemCount} items require attention</p>
          </div>
        </div>
        
        <div className="flex items-center">
          <div className="flex items-center text-red-600 bg-red-50 p-2 rounded-full mr-3">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
            </svg>
          </div>
          <div>
            <p className="text-sm text-gray-500">Quantity Gap</p>
            <p className="font-semibold">Total gap: {totalQuantityGap} units</p>
          </div>
        </div>
        
        <div className="flex items-center">
          <div className="flex items-center text-blue-600 bg-blue-50 p-2 rounded-full mr-3">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
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
