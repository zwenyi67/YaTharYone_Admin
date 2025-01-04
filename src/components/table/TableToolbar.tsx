import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { Input } from "../ui/input";
import { SetStateAction, useEffect } from "react";
import { ColumnFiltersState } from "@tanstack/react-table";

const FILTER_OPTIONS = [
  { label: "Oldest", value: "Oldest" },
  { label: "Newest", value: "Newest" },
];

type TableToolbarProps = {
  header?: string;
  headerDescription?: string;
  search: boolean;
  sort: boolean;
  setGlobalFilter: React.Dispatch<React.SetStateAction<string>>;
  globalFilter: string | number; 
  selectedOpt: "Newest" | "Oldest";
  filterColumns: string[],
  setColumnFilters: React.Dispatch<SetStateAction<ColumnFiltersState>>
  classNames: string;
  sortSelectNewLine?: boolean;
  setSelectedOpt: (value: "Oldest" | "Newest") => void;
  
  selectOptions?: { label: string; value: string }[];
  children: React.ReactNode;
};

const TableToolbar = ({
  search,
  sort,
  header,
  headerDescription,
  selectedOpt,
  setSelectedOpt,
  setGlobalFilter, 
  filterColumns,
  setColumnFilters,
  globalFilter, 
  sortSelectNewLine = false,
  selectOptions = FILTER_OPTIONS,
  classNames = "",
  children,
}: TableToolbarProps) => {

  useEffect(() => {
    setColumnFilters(
      (prev: ColumnFiltersState): ColumnFiltersState => [
        ...prev.filter((filter) => !filterColumns.includes(filter.id)),
        ...filterColumns.map((item: string) => {
          return { id: item, value: globalFilter };
        }),
      ]
    );
  }, [globalFilter]);



  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    setGlobalFilter(inputValue);
  };

  const handleSelect = (value: "Oldest" | "Newest") => {
    setSelectedOpt(value);
  };

  return (
    <div>
      <div
        className={cn(
          "flex pb-2",
          sortSelectNewLine ? "2xl:flex-nowrap flex-wrap mt-2 xl:mt-0" : ""
        )}
      >
        <div className="mb-4">
          <h1 className="text-nowrap mb-2 text-xl font-bold">{header ?? ""}</h1>
          {headerDescription ? (
            <p className="text-sm text-nowrap text-gray-400">
              {headerDescription}
            </p>
          ) : (
            <></>
          )}
        </div>

        <div
          className={cn(
            !classNames ? "flex justify-end w-full gap-2" : classNames
          )}
        >
          {children}
          {search && (
            <div className="h-fit relative">
              <Input
                type="text"
                placeholder="Search"
                className="indent-3 w-fit bg-gray-100"
                value={globalFilter} 
                onChange={handleChange}
              />
              <MagnifyingGlassIcon className="top-1/2 bottom-1/2 left-2 absolute -translate-y-1/2" />
            </div>
          )}
          {sort && !sortSelectNewLine && (
            <Select defaultValue="Newest" onValueChange={handleSelect}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={`Sort By: ${selectedOpt}`} />
              </SelectTrigger>
              <SelectContent>
                {selectOptions.map((opt, index) => (
                  <SelectItem value={opt.value} key={index}>
                    Sort By:
                    <span className="font-bold"> {opt.label}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </div>
      {sort && sortSelectNewLine && (
        <div className="flex justify-end mt-2">
          <Select defaultValue="Newest" onValueChange={handleSelect}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={`Sort By: ${selectedOpt}`} />
            </SelectTrigger>
            <SelectContent>
              {selectOptions.map((opt, index) => (
                <SelectItem value={opt.value} key={index}>
                  Sort By:
                  <span className="font-bold"> {opt.label}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
};

export default TableToolbar;
