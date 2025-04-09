"use client";

import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { UseFormReturn } from "react-hook-form";
import { FormControl, FormField, FormItem, FormMessage } from "../../ui/form";

export default function DateStep({ form }: { form: UseFormReturn<any> }) {
  return (
    <div className="w-full">
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
                <Calendar
                  className={
                    "!w-full !bg-transparent !bg-[linear-gradient(119.26deg,_rgba(18,_17,_32,_0.23)_45.47%,_rgba(185,_136,_88,_0.23)_105.35%)] border border-[#E9E3D736] rounded"
                  }
                  tileClassName={"title-test"}
                  minDate={new Date()}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
