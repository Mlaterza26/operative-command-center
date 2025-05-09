
import React from "react";
import { Select } from "@/components/ui/select";
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
            <Select.Trigger className="w-full">
              <Select.Value placeholder={filter.name} />
            </Select.Trigger>
            <Select.Content>
              <Select.Group>
                <Select.Label>{filter.name}</Select.Label>
                {filter.options.map((option) => (
                  <Select.Item key={option.value} value={option.value}>
                    {option.label}
                  </Select.Item>
                ))}
              </Select.Group>
            </Select.Content>
          </Select>
        </div>
      ))}
    </div>
  );
};

export default FilterBar;
