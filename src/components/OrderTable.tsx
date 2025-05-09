
import React from "react";
import { toast } from "@/components/ui/sonner";
import StatusBadge from "./StatusBadge";
import { Button } from "@/components/ui/button";

export interface Order {
  id: string;
  client: string;
  netCost: string;
  cpm: string;
  deliveryPercent: string;
  approvalStatus: string;
  notes?: string;
  hasFlag: boolean;
  orderOwner: string;
}

interface OrderTableProps {
  orders: Order[];
  onAlertAction: (orderId: string) => void;
  onIgnoreAction: (orderId: string) => void;
}

const OrderTable: React.FC<OrderTableProps> = ({ orders, onAlertAction, onIgnoreAction }) => {
  return (
    <div className="w-full overflow-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 whitespace-nowrap">
              ORDER ID
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
              APPROVAL STATUS
            </th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 whitespace-nowrap">
              NOTES
            </th>
            <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600 whitespace-nowrap"></th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr
              key={order.id}
              className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <td className="py-4 px-4 whitespace-nowrap">
                <div className="flex items-center">
                  {order.hasFlag && (
                    <span className="mr-2 text-operative-red">⚠️</span>
                  )}
                  <span>{order.id}</span>
                </div>
              </td>
              <td className="py-4 px-4 whitespace-nowrap">{order.client}</td>
              <td className="py-4 px-4 whitespace-nowrap">{order.netCost}</td>
              <td className="py-4 px-4 whitespace-nowrap">{order.cpm}</td>
              <td className="py-4 px-4 whitespace-nowrap">{order.deliveryPercent}</td>
              <td className="py-4 px-4 whitespace-nowrap">
                <StatusBadge status={order.approvalStatus} />
              </td>
              <td className="py-4 px-4">{order.notes || "—"}</td>
              <td className="py-4 px-4 whitespace-nowrap">
                <div className="flex justify-end space-x-2">
                  {order.hasFlag && (
                    <>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => onAlertAction(order.id)}
                      >
                        Alert
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onIgnoreAction(order.id)}
                      >
                        Ignore
                      </Button>
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

export default OrderTable;
