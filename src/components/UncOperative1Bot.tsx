
import React from "react";
import { Link } from "react-router-dom";
import { MessageSquare } from "lucide-react";

const UncOperative1Bot: React.FC = () => {
  return (
    <Link to="/dashboard">
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300 transition-all duration-300 h-full transform hover:-translate-y-1 border-l-4 border-cyan-500">
        <div className="flex flex-col h-full">
          <div className="flex items-center mb-2">
            <div className="mr-3">
              <MessageSquare className="h-6 w-6 text-cyan-500" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">uncOperative1 Bot</h2>
          </div>
          
          <p className="text-gray-600 mb-4 flex-grow">
            Automated order analysis bot. Detects CPU orders spanning multiple months and alerts team members to potential issues.
          </p>
          
          <div className="flex justify-end">
            <span className="text-sm font-medium text-operative-black hover:text-cyan-500 transition-colors">
              Launch Bot Dashboard →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default UncOperative1Bot;
