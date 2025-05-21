"use client";

import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { UseFormReturn } from "react-hook-form";
import { FormControl, FormField, FormItem, FormMessage } from "../../ui/form";

// Utility to format a Date as YYYY-MM-DD in local time
function toLocalDateString(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export default function DateStep({ form }: { form: UseFormReturn<any> }) {
  // Handler for react-calendar's value type
  const handleDateChange = (value: any) => {
    if (value instanceof Date) {
      form.setValue('eventDate', toLocalDateString(value));
    } else if (Array.isArray(value) && value[0] instanceof Date) {
      // If range, just use the first date
      form.setValue('eventDate', toLocalDateString(value[0]));
    }
  };

  return (
    <div className="w-full between-area-4">
      <h2 className="text-color-E9E3D7 text-[22px] font-semibold mb-6">
        Select Date
      </h2>

      <div className="relative">
        <FormField
          control={form.control}
          name="eventDate"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="calendar-container">
                  <Calendar
                    className={
                      "!w-full !bg-transparent !bg-[linear-gradient(119.26deg,_rgba(18,_17,_32,_0.23)_45.47%,_rgba(185,_136,_88,_0.23)_105.35%)] border border-[#E9E3D736] rounded"
                    }
                    tileClassName={"title-test"}
                    minDate={new Date()}
                    selectRange={false}
                    onChange={handleDateChange}
                    value={field.value ? new Date(field.value + 'T00:00:00') : undefined}
                    formatShortWeekday={(locale, date) => window.innerWidth < 768 ? date.toLocaleDateString(locale, { weekday: 'narrow' }) : date.toLocaleDateString(locale, { weekday: 'short' })}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
