
import React from "react";
import { Button } from "@/components/ui/button";
import StatusBadge from "./StatusBadge";

export interface LineItem {
  id: string;
  orderId: string;
  client: string;
  netCost: string;
  cpm: string;
  deliveryPercent: string;
  costMethod: string;
  months: string;
  approvalStatus: string;
  hasFlag: boolean;
  orderOwner: string;
  alertedTo: string;
}

interface LineItemTableProps {
  items: LineItem[];
  onAlertAction: (lineItemId: string) => void;
  onIgnoreAction: (lineItemId: string) => void;
}

const LineItemTable: React.FC<LineItemTableProps> = ({ items, onAlertAction, onIgnoreAction }) => {
  return (
    <div className="w-full overflow-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 whitespace-nowrap">
              ORDER ID
            </th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 whitespace-nowrap">
              LINE ITEM ID
            </th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 whitespace-nowrap">
              CLIENT
            </th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 whitespace-nowrap">
              NET COST
            </th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 whitespace-nowrap">
              CPM
            </th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 whitespace-nowrap">
              DELIVERY %
            </th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 whitespace-nowrap">
              COST METHOD
            </th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 whitespace-nowrap">
              MONTHS
            </th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 whitespace-nowrap">
              STATUS
            </th>
            <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600 whitespace-nowrap"></th>
          </tr>
        </thead>
        <tbody>
          {items.length === 0 && (
            <tr>
              <td colSpan={10} className="py-8 text-center text-gray-500">
                No matching line items found
              </td>
            </tr>
          )}
          {items.map((item) => (
            <tr
              key={item.id}
              className={`border-b border-gray-200 hover:bg-gray-50 transition-colors ${
                item.hasFlag ? "bg-red-50" : ""
              }`}
            >
              <td className="py-4 px-4 whitespace-nowrap">{item.orderId}</td>
              <td className="py-4 px-4 whitespace-nowrap">
                <div className="flex items-center">
                  {item.hasFlag && (
                    <span className="mr-2 text-red-500">⚠️</span>
                  )}
                  <span>{item.id}</span>
                </div>
              </td>
              <td className="py-4 px-4 whitespace-nowrap">{item.client}</td>
              <td className="py-4 px-4 whitespace-nowrap">{item.netCost}</td>
              <td className="py-4 px-4 whitespace-nowrap">{item.cpm}</td>
              <td className="py-4 px-4 whitespace-nowrap">{item.deliveryPercent}</td>
              <td className="py-4 px-4 whitespace-nowrap">{item.costMethod}</td>
              <td className="py-4 px-4 whitespace-nowrap">{item.months}</td>
              <td className="py-4 px-4 whitespace-nowrap">
                <StatusBadge status={item.approvalStatus} />
              </td>
              <td className="py-4 px-4 whitespace-nowrap">
                <div className="flex justify-end space-x-2">
                  {item.alertedTo ? (
                    <span className="text-sm text-gray-500">
                      Alerted to {item.alertedTo}
                    </span>
                  ) : (
                    <>
                      {item.hasFlag && (
                        <>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => onAlertAction(item.id)}
                          >
                            Alert Team
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onIgnoreAction(item.id)}
                          >
                            Ignore
                          </Button>
                        </>
                      )}
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LineItemTable;
