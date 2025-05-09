
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings, Plus, Calendar, AlertTriangle } from "lucide-react";
import { CustomView } from "@/pages/Finance";

interface FinanceViewListProps {
  views: CustomView[];
  onViewSelect: (view: CustomView) => void;
  onViewsUpdated: (views: CustomView[]) => void;
}

const FinanceViewList: React.FC<FinanceViewListProps> = ({ views, onViewSelect, onViewsUpdated }) => {
  const [isAddingView, setIsAddingView] = useState(false);

  const handleAddView = (newView: CustomView) => {
    const updatedViews = [...views, newView];
    onViewsUpdated(updatedViews);
    setIsAddingView(false);
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-gray-800">Custom Finance Views</h2>
          <Button onClick={() => setIsAddingView(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add New View
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {views.map((view) => (
            <Card key={view.id} className="hover:shadow-md transition-shadow border border-gray-100">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{view.name}</CardTitle>
                  {view.flaggedItems > 0 && (
                    <div className="bg-red-100 text-red-600 px-2 py-1 rounded-full flex items-center text-xs font-medium">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      {view.flaggedItems}
                    </div>
                  )}
                </div>
                <CardDescription>{view.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-gray-500 space-y-1">
                  <div className="flex items-center">
                    <Calendar className="h-3.5 w-3.5 mr-1 text-gray-400" />
                    Last updated: {view.lastUpdated}
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={() => onViewSelect(view)} className="w-full">
                  View Details
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
};

export default FinanceViewList;
