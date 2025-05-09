
import React from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { AlertTriangle, ArrowDown, ArrowUp, Check } from "lucide-react";
import { toast } from "sonner";

export interface TableColumn {
  key: string;
  header: string;
  sortable?: boolean;
  render?: (value: any, row: any) => React.ReactNode;
}

interface SortableTableProps {
  columns: TableColumn[];
  data: any[];
  sortKey: string;
  sortDirection: 'asc' | 'desc';
  onSort: (key: string) => void;
  onAlert: (item: any) => void;
  onIgnore: (item: any) => void;
  flaggedRows?: Record<string, boolean>;
}

const SortableTable: React.FC<SortableTableProps> = ({
  columns,
  data,
  sortKey,
  sortDirection,
  onSort,
  onAlert,
  onIgnore,
  flaggedRows = {}
}) => {
  const handleSort = (key: string) => {
    onSort(key);
  };

  const handleAlert = (item: any) => {
    onAlert(item);
    toast.info(`Alert sent for line item ${item.id}`);
  };

  const handleIgnore = (item: any) => {
    onIgnore(item);
    toast.success(`Issue for line item ${item.id} marked as ignored`);
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            {columns.map((column) => (
              <TableHead 
                key={column.key}
                className={`${column.sortable ? 'cursor-pointer hover:bg-gray-100' : ''} 
                  whitespace-nowrap font-medium`}
                onClick={() => column.sortable && handleSort(column.key)}
              >
                <div className="flex items-center">
                  {column.header}
                  {column.sortable && sortKey === column.key && (
                    <span className="ml-1">
                      {sortDirection === 'asc' ? (
                        <ArrowUp className="h-4 w-4" />
                      ) : (
                        <ArrowDown className="h-4 w-4" />
                      )}
                    </span>
                  )}
                </div>
              </TableHead>
            ))}
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length + 1} className="text-center py-8 text-gray-500">
                No data available
              </TableCell>
            </TableRow>
          ) : (
            data.map((row, index) => {
              const isIssueRow = flaggedRows[row.id];
              const isEven = index % 2 === 0;
              
              return (
                <TableRow 
                  key={row.id} 
                  className={`
                    ${isIssueRow ? 'bg-red-50' : isEven ? 'bg-gray-50' : 'bg-white'} 
                    hover:bg-gray-100 transition-colors
                  `}
                >
                  {columns.map((column) => (
                    <TableCell 
                      key={`${row.id}-${column.key}`}
                      className={`${column.key === 'quantityGap' && isIssueRow ? 'text-red-600 font-medium' : ''}`}
                    >
                      {column.render 
                        ? column.render(row[column.key], row) 
                        : row[column.key]}
                    </TableCell>
                  ))}
                  <TableCell>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleAlert(row)}
                        className="border-amber-500 text-amber-700 hover:bg-amber-50"
                      >
                        <AlertTriangle className="mr-1 h-4 w-4" />
                        Alert
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleIgnore(row)}
                        className="border-gray-300 text-gray-700 hover:bg-gray-50"
                      >
                        <Check className="mr-1 h-4 w-4" />
                        Ignore
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default SortableTable;
