import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { FormControl } from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Matcher } from "react-day-picker";

type DateTimePickerType = {
  value: Date;
  onChange: (...event: unknown[]) => void;
  className?: string;
  disabled?: Matcher | Matcher[] | undefined;
  readonly?: boolean;
  placeholder: string;
};

const DateTimePicker = ({
  value,
  onChange,
  readonly = false,
  className,
  disabled,
  placeholder
}: DateTimePickerType) => {
  const [timeValue, setTimeValue] = useState("");

  const getTimeFromValue = () => {
    if (!value) return;

    const hourFromValue = new Date(value)
      .getHours()
      .toString()
      .padStart(2, "0");
    const minuteFromValue = new Date(value)
      .getMinutes()
      .toString()
      .padStart(2, "0");

    setTimeValue(`${hourFromValue}:${minuteFromValue}`);
  };

  useEffect(() => {
    getTimeFromValue();
  }, [value]);

  // const chooseTime = (time: string) => {
  //   const [hour, minute] = time.split(":").map(Number);

  //   const updatedDateTime = new Date(value);
  //   updatedDateTime.setHours(hour, minute);

  //   onChange(updatedDateTime);
  // };

  return (
    <div className={cn("grid items-center gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <FormControl>
            <Button
              disabled={readonly}
              variant={"outline"}
              className={cn(
                "data-[state=open]:border-primary border-0 col-span-2 font-normal px-3",
                !value && "text-muted-foreground"
              )}
            >
              {value ? (
                format(value, "PPP")
              ) : (
                <span>{placeholder}</span>
              )}
              <CalendarIcon className="w-4 h-4 ml-auto opacity-50" />
            </Button>
          </FormControl>
        </PopoverTrigger>
        <PopoverContent side="top" className="w-auto p-0" align="center">
          <Calendar
            mode="single"
            selected={value}
            onSelect={onChange}
            initialFocus
            fromMonth={value}
            disabled={disabled}
          />
        </PopoverContent>
      </Popover>

      {/* <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "data-[state=open]:border-primary border-0 flex justify-between items-center text-sm font-normal px-3",
              timeValue
                ? "tracking-tight gap-1"
                : "text-sm gap-2 text-muted-foreground"
            )}
            disabled={!value || readonly}
          >
            <span>{timeTextToShow}</span>
            <TimerIcon className="text-muted-foreground" />
          </Button>
        </PopoverTrigger>
        <PopoverContent side="top" className="w-auto p-0">
          <div className="flex flex-col max-h-[240px] hide-scrollbar gap-1 p-1 overflow-y-auto">
            {TIMES.map((time) => (
              <PopoverClose
                key={time.value}
                className={cn(
                  "hover:bg-accent p-2 px-3 text-sm text-center rounded cursor-pointer",
                  timeValue === time.value ? "bg-accent shadow" : ""
                )}
                onClick={() => chooseTime(time.value)}
              >
                {time.text}
              </PopoverClose>
            ))}
          </div>
        </PopoverContent>
      </Popover> */}
    </div>
  );
};

export default DateTimePicker;
