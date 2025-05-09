
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { 
  Checkbox 
} from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import { CalendarRange, Check, ChevronDown, Filter, X } from "lucide-react";

export interface FilterValues {
  advertisers: string[];
  owners: string[];
  startDate: Date | null;
  endDate: Date | null;
  searchQuery: string;
}

interface FinanceFiltersProps {
  advertisers: string[];
  owners: string[];
  filterValues: FilterValues;
  onFilterChange: (filters: FilterValues) => void;
  onApplyFilters: () => void;
  onClearFilters: () => void;
  onSearchChange: (query: string) => void;
}

const FinanceFilters: React.FC<FinanceFiltersProps> = ({
  advertisers,
  owners,
  filterValues,
  onFilterChange,
  onApplyFilters,
  onClearFilters,
  onSearchChange
}) => {
  const [selectedAdvertisers, setSelectedAdvertisers] = useState<string[]>(filterValues.advertisers || []);
  const [selectedOwners, setSelectedOwners] = useState<string[]>(filterValues.owners || []);
  const [startDate, setStartDate] = useState<Date | null>(filterValues.startDate || null);
  const [endDate, setEndDate] = useState<Date | null>(filterValues.endDate || null);

  const handleAdvertiserChange = (value: string, checked: boolean) => {
    if (checked) {
      setSelectedAdvertisers([...selectedAdvertisers, value]);
    } else {
      setSelectedAdvertisers(selectedAdvertisers.filter(adv => adv !== value));
    }
  };

  const handleOwnerChange = (value: string, checked: boolean) => {
    if (checked) {
      setSelectedOwners([...selectedOwners, value]);
    } else {
      setSelectedOwners(selectedOwners.filter(owner => owner !== value));
    }
  };

  const handleApplyFilters = () => {
    onFilterChange({
      ...filterValues,
      advertisers: selectedAdvertisers,
      owners: selectedOwners,
      startDate,
      endDate
    });
    onApplyFilters();
  };

  const handleClearFilters = () => {
    setSelectedAdvertisers([]);
    setSelectedOwners([]);
    setStartDate(null);
    setEndDate(null);
    onFilterChange({
      advertisers: [],
      owners: [],
      startDate: null,
      endDate: null,
      searchQuery: ""
    });
    onClearFilters();
  };

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm mb-6 space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-medium flex items-center">
          <Filter className="h-4 w-4 mr-2" /> Filters
        </h3>
        <Button variant="ghost" size="sm" onClick={handleClearFilters} className="text-gray-500">
          <X className="h-4 w-4 mr-1" /> Clear All
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search Box */}
        <div className="col-span-1 md:col-span-2 lg:col-span-4">
          <div className="relative">
            <Input 
              type="text"
              placeholder="Search by any field..."
              className="w-full"
              value={filterValues.searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        </div>
        
        {/* Advertisers Multi-select */}
        <div>
          <Label className="mb-1 block">Primary Advertiser</Label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full justify-between">
                {selectedAdvertisers.length === 0 ? "Select Advertisers" : 
                  selectedAdvertisers.length === 1 ? selectedAdvertisers[0] : 
                    `${selectedAdvertisers.length} selected`
                }
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 max-h-[300px] overflow-auto">
              {advertisers.map((advertiser) => (
                <DropdownMenuCheckboxItem
                  key={advertiser}
                  checked={selectedAdvertisers.includes(advertiser)}
                  onCheckedChange={(checked) => handleAdvertiserChange(advertiser, !!checked)}
                >
                  {advertiser}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Order Owner Multi-select */}
        <div>
          <Label className="mb-1 block">Order Owner</Label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full justify-between">
                {selectedOwners.length === 0 ? "Select Owners" : 
                  selectedOwners.length === 1 ? selectedOwners[0] : 
                    `${selectedOwners.length} selected`
                }
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 max-h-[300px] overflow-auto">
              {owners.map((owner) => (
                <DropdownMenuCheckboxItem
                  key={owner}
                  checked={selectedOwners.includes(owner)}
                  onCheckedChange={(checked) => handleOwnerChange(owner, !!checked)}
                >
                  {owner}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Start Date Picker */}
        <div>
          <Label className="mb-1 block">Start Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-between">
                {startDate ? format(startDate, "PPP") : "Select Date"}
                <CalendarRange className="ml-2 h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={startDate || undefined}
                onSelect={setStartDate}
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* End Date Picker */}
        <div>
          <Label className="mb-1 block">End Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-between">
                {endDate ? format(endDate, "PPP") : "Select Date"}
                <CalendarRange className="ml-2 h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={endDate || undefined}
                onSelect={setEndDate}
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="flex justify-end pt-2 space-x-2">
        <Button variant="outline" onClick={handleClearFilters}>
          Clear Filters
        </Button>
        <Button onClick={handleApplyFilters} className="bg-blue-600 hover:bg-blue-700">
          Apply Filters
        </Button>
      </div>
    </div>
  );
};

export default FinanceFilters;
