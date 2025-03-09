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
import { ArrowUpDown, Plus, ScrollText } from "lucide-react";
import { Link } from "react-router-dom";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";

const FILTER_OPTIONS = [
  { label: "Oldest", value: "Oldest" },
  { label: "Newest", value: "Newest" },
];

type TableToolbarProps = {
  header?: string;
  newCreate?: string;
  reportTool?: string;
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
  excelExport?: React.ReactNode | undefined;
  onSearchChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  children: React.ReactNode;
};

const TableToolbar = ({
  search,
  newCreate,
  reportTool,
  sort,
  selectedOpt,
  setSelectedOpt,
  filterColumns,
  setColumnFilters,
  globalFilter,
  sortSelectNewLine = false,
  selectOptions = FILTER_OPTIONS,
  classNames = "",
  excelExport = undefined,
  children,
  onSearchChange,
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

  const handleSelect = (value: "Oldest" | "Newest") => {
    setSelectedOpt(value);
  };

  return (
    <div>
      <div
        className={cn(
          "flex pb-2 lg:flex-row md:flex-row flex-col gap-2 mb-4",
          sortSelectNewLine ? "2xl:flex-nowrap flex-wrap mt-2 xl:mt-0" : ""
        )}
      >
        <div className="flex justity-start gap-4">
          {newCreate && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link to={newCreate} className="flex items-center bg-secondary rounded-sm text-white px-4 text-sm">
                    <div className="flex"><Plus className="h-4 w-4 pt-1" />Create</div>
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Add New</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          <div>
            {excelExport}
          </div>
          {reportTool && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link to={reportTool} className="flex bg-secondary rounded-sm text-white p-3">
                    <div><ScrollText className="h-5 w-5" /></div>
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Reporting Tool</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
        <div
          className={cn(
            !classNames ? "flex lg:flex-row md:flex-row flex-col lg:justify-end md:justify-end justify-center w-full gap-2" : classNames
          )}
        >
          {children}
          {search && (
            <div className="h-fit relative">
              <Input
                type="text"
                placeholder="Search"
                className="indent-3 w-[250px] bg-gray-100 text-xs"
                value={globalFilter}
                onChange={onSearchChange}
              />
              <MagnifyingGlassIcon className="top-1/2 bottom-1/2 left-2 absolute -translate-y-1/2" />
            </div>
          )}
          {sort && !sortSelectNewLine && (
            <Select defaultValue="Newest" onValueChange={handleSelect}>
              <SelectTrigger className="w-[120px]">
                <SelectValue className="text-sm" placeholder={`Sort By: ${selectedOpt}`} />
              </SelectTrigger>
              <SelectContent>
                {selectOptions.map((opt, index) => (
                  <SelectItem value={opt.value} key={index}>
                    <div className="flex">
                      <ArrowUpDown className="w-[15px] h-[15px] pt-[2px] me-2" />
                      <span className="font-bold text-xs"> {opt.label}</span>
                    </div>
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
            <SelectTrigger className="w-[120px]">
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
