import * as React from "react";
import { DayPicker } from "react-day-picker";

import { cn } from "@/app/lib/utils";
import { buttonVariants } from "@/app/components/ui/button";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center h-10",
        caption_label: "text-sm font-medium text-white uppercase",
        nav: "absolute w-full space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 text-white border-white/20 opacity-70 hover:opacity-100 hover:bg-white/10"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell:
          "text-white/50 rounded-md w-9 font-normal text-[0.8rem] uppercase",
        row: "flex w-full mt-4",
        cell: "relative p-0 text-center text-sm focus-within:relative focus-within:z-20",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-normal text-white hover:bg-[#1A1A1A] hover:text-white rounded-full transition-colors"
        ),
        day_selected:
          "bg-[#1A1A1A] text-white hover:bg-[#1A1A1A] hover:text-white focus:bg-[#1A1A1A] focus:text-white rounded-full",
        day_today: "bg-[#1A1A1A] text-white rounded-full",
        day_outside:
          "text-white/30 opacity-50 hover:bg-[#1A1A1A] hover:text-white/50",
        day_disabled: "text-white/20 opacity-50 hover:bg-transparent",
        day_range_middle:
          "aria-selected:bg-[#1A1A1A] aria-selected:text-white rounded-full",
        day_hidden: "invisible",
        ...classNames,
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
