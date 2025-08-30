import React, { useMemo, useState, useEffect } from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { CheckIcon } from "lucide-react";

interface DropdownOption {
  label: string;
  value: string;
}

interface CustomMultiSelectDropDownProps {
  label: string;
  name: string;
  placeholder: string;
  value: string[]; // Array to handle multiple selections
  onChange: (selectedValues: string[]) => void; // Callback for selected values
  fetchOptions: (query: string) => Promise<DropdownOption[]>; // Fetch options based on input query
  errorMsg?: string;
  className?: string;
}

const CustomMultiSelectDropDown: React.FC<CustomMultiSelectDropDownProps> = ({
  label,
  name,
  placeholder,
  value,
  onChange,
  fetchOptions,
  errorMsg,
  className,
}) => {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<DropdownOption[]>([]); // Dropdown options
  const [searchQuery, setSearchQuery] = useState(""); // Query for search

  // Fetch options from API based on the search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setOptions([]);
      return;
    }

    const fetchDropdownOptions = async () => {
      try {
        const fetchedOptions = await fetchOptions(searchQuery);
        setOptions(fetchedOptions);
      } catch (error) {
        console.error("Error fetching options:", error);
      }
    };

    fetchDropdownOptions();
  }, [searchQuery, fetchOptions]);

  const selectedValuesSet = useMemo(() => {
    return new Set(value);
  }, [value]);

  const handleSelect = (val: string) => {
    const newSet = new Set(selectedValuesSet);
    if (newSet.has(val)) {
      newSet.delete(val);
    } else {
      newSet.add(val);
    }
    onChange(Array.from(newSet)); // Convert back to array and pass to parent
  };

  return (
    <FormField
      name={name}
      render={() => (
        <FormItem className={className}>
          <FormLabel>{label}</FormLabel>
          <Select
            open={open}
            onOpenChange={setOpen}
            onValueChange={(selectedValue) => handleSelect(selectedValue)}
          >
            <FormControl>
              <SelectTrigger className="border-dashed">
                <input
                  type="text"
                  placeholder={placeholder || "Search..."}
                  className="w-full p-2 border-none outline-none"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)} // Update search query
                />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  className="flex items-center"
                >
                  <div
                    className={cn(
                      "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                      selectedValuesSet.has(option.value)
                        ? "bg-primary text-primary-foreground"
                        : "opacity-50 [&_svg]:invisible"
                    )}
                  >
                    <CheckIcon className="h-4 w-4" aria-hidden="true" />
                  </div>
                  <span>{option.label}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errorMsg && <FormMessage>{errorMsg}</FormMessage>}
        </FormItem>
      )}
    />
  );
};

export default CustomMultiSelectDropDown;
