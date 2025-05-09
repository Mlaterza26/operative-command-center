
import React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface FilterOption {
  label: string;
  value: string;
}

interface FilterBarProps {
  filters: {
    name: string;
    options: FilterOption[];
    value: string;
    onChange: (value: string) => void;
  }[];
}

const FilterBar: React.FC<FilterBarProps> = ({ filters }) => {
  return (
    <div className="flex flex-wrap gap-4 mb-6">
      {filters.map((filter) => (
        <div key={filter.name} className="min-w-[180px]">
          <Select
            value={filter.value}
            onValueChange={filter.onChange}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={filter.name} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>{filter.name}</SelectLabel>
                {filter.options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      ))}
    </div>
  );
};

export default FilterBar;
