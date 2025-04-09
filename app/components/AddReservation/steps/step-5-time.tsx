import React, { useState } from "react";
import { Label } from "../../ui/label";
import { UseFormReturn } from "react-hook-form";
import { FormControl, FormField, FormItem, FormMessage } from "../../ui/form";

type TimeSlot = {
  time: string;
  available: number;
  total: number;
};

type Section = {
  name: string;
  timeSlots: TimeSlot[];
};

type SelectedSlot = {
  time: string;
  section: string;
} | null;

function App({
  form,
  shifts,
  tableTypes,
}: {
  form: UseFormReturn<any>;
  shifts: any[];
  tableTypes: any[];
}) {
  const [activeShift, setActiveShift] = useState(form.getValues("shiftId"));
  const [activeTableType, setActiveTableType] = useState(
    form.getValues("tableType") || "SquareTable"
  );
  // const [activeSection, setActiveSection] = useState('Regular');
  const [selectedSlot, setSelectedSlot] = useState<SelectedSlot>(null);

  const sections: Section[] = [
    {
      name: "SquareTable",
      timeSlots: [
        { time: "6:15 PM", available: 12, total: 25 },
        { time: "6:45 PM", available: 8, total: 25 },
        { time: "7:15 PM", available: 15, total: 25 },
        { time: "7:45 PM", available: 20, total: 25 },
      ],
    },
    {
      name: "Bar",
      timeSlots: [
        { time: "6:00 PM", available: 5, total: 10 },
        { time: "6:30 PM", available: 3, total: 10 },
        { time: "7:00 PM", available: 7, total: 10 },
      ],
    },
    {
      name: "Stools",
      timeSlots: [
        { time: "6:15 PM", available: 4, total: 8 },
        { time: "7:00 PM", available: 6, total: 8 },
      ],
    },
  ];

  const handleTimeSlotSelect = (time: string, section: string) => {
    if (selectedSlot?.time === time && selectedSlot?.section === section) {
      setSelectedSlot(null);
    } else {
      setSelectedSlot({ time, section });
    }
  };

  const getAllTimeSlots = () => {
    const allSlots: Array<{
      time: string;
      available: number;
      total: number;
      section: string;
    }> = [];
    sections.forEach((section) => {
      section.timeSlots.forEach((slot) => {
        allSlots.push({ ...slot, section: section.name });
      });
    });
    return allSlots.sort((a, b) => a.time.localeCompare(b.time));
  };

  const renderTimeSlots = () => {
    if (activeTableType === "View All") {
      return getAllTimeSlots().map((slot) => (
        <button
          key={`${slot.section}-${slot.time}`}
          onClick={() => handleTimeSlotSelect(slot.time, slot.section)}
          className={`w-full rounded-lg px-4 py-2 flex items-center justify-between transition-all group
            ${
              selectedSlot?.time === slot.time &&
              selectedSlot?.section === slot.section
                ? "bg-color-B98858 text-[#0B0B0B]"
                : "bg-color-F2C45 text-color-E9E3D7"
            }`}
        >
          <div className="flex items-center gap-3">
            <div>
              <span className="text-lg">{slot.time}</span>
              <span className={`ml-3 text-md`}>({slot.section})</span>
            </div>
          </div>
          <div
            className={`${
              selectedSlot?.time === slot.time &&
              selectedSlot?.section === slot.section
                ? "text-[#0B0B0B]"
                : "text-color-E9E3D7"
            }`}
          >
            {slot.available}/{slot.total}
          </div>
        </button>
      ));
    } else {
      return sections
        .find((section) => section.name === activeTableType)
        ?.timeSlots.map((slot) => (
          <button
            key={slot.time}
            onClick={() => handleTimeSlotSelect(slot.time, activeTableType)}
            className={`w-full rounded-lg px-4 py-2 flex items-center justify-between transition-all group
              ${
                selectedSlot?.time === slot.time &&
                selectedSlot?.section === activeTableType
                  ? "bg-color-B98858 text-[#0B0B0B]"
                  : "bg-color-F2C45 text-color-E9E3D7"
              }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-lg">{slot.time}</span>
            </div>
            <div
              className={`${
                selectedSlot?.time === slot.time &&
                selectedSlot?.section === activeTableType
                  ? "text-[#0B0B0B]"
                  : "text-color-E9E3D7"
              }`}
            >
              {slot.available}/{slot.total}
            </div>
          </button>
        ));
    }
  };

  return (
    <div className="w-full">
      <h2 className="text-color-E9E3D7 text-[22px] font-semibold mb-6">
        Select Shift & Time
      </h2>

      <div>
        {/* Shift Tabs */}
        <div className="w-full mb-8 [box-shadow:0px_4px_11.2px_0px_#00000040_inset] rounded-lg py-2.5 px-6">
          <FormField
            control={form.control}
            name="shiftId"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="w-full flex justify-between rounded-lg bg-[#0D0C16] overflow-x-auto">
                    {shifts.map((shift, index) => (
                      <span
                        key={index}
                        onClick={() => {
                          setActiveShift(shift.guidId);
                          field.onChange(shift.guidId);
                        }}
                        className={`whitespace-nowrap flex-1 text-center cursor-pointer py-1 px-4 rounded-lg transition-all ${
                          activeShift === shift.guidId
                            ? "bg-color-B98858 text-[#0B0B0B]"
                            : "text-color-E9E3D7"
                        }`}
                      >
                        {shift.name}
                      </span>
                    ))}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Table Type Tabs */}
        <div className="flex items-center justify-between mb-6 overflow-x-auto">
          <FormField
            control={form.control}
            name="tableType"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="w-full flex justify-between">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTableType("View All");
                        setSelectedSlot(null);
                      }}
                      className={`transition-all text-lg font-medium w-full whitespace-nowrap ${
                        activeTableType === "View All"
                          ? " text-color-B98858 underline"
                          : "text-color-E9E3D7"
                      }`}
                    >
                      View All
                    </button>
                    <div className="h-6 w-px bg-gray-700 mx-4" />

                    {tableTypes.map((table, index) => (
                      <React.Fragment key={index}>
                        <button
                          type="button"
                          onClick={() => {
                            setActiveTableType(table);
                            field.onChange(table);
                          }}
                          className={`transition-all text-lg font-medium w-full ${
                            activeTableType === table
                              ? "text-color-B98858 underline"
                              : "text-color-E9E3D7"
                          }`}
                        >
                          {table}
                        </button>
                        {index < tableTypes.length - 1 && (
                          <div className="h-6 w-px bg-gray-700 mx-4" />
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Section Navigation */}
        {/* <div className='flex items-center justify-between mb-6'>
          <div className='w-full flex justify-between'>
            <button
              onClick={() => {
                setActiveSection('View All');
                setSelectedSlot(null);
              }}
              className={`transition-all text-lg font-medium w-full ${
                activeSection === 'View All' ? ' text-color-B98858 underline' : 'text-color-E9E3D7'
              }`}
            >
              View All
            </button>
            <div className='h-6 w-px bg-gray-700 mx-4' />
            {sections.map((section, index) => (
              <React.Fragment key={section.name}>
                <button
                  key={section.name}
                  onClick={() => {
                    setActiveSection(section.name);
                    setSelectedSlot(null);
                  }}
                  className={`transition-all text-lg font-medium w-full ${
                    activeSection === section.name ? 'text-color-B98858 underline' : 'text-color-E9E3D7'
                  }`}
                >
                  {section.name}
                </button>
                {index < sections.length - 1 && <div className='h-6 w-px bg-gray-700 mx-4' />}
              </React.Fragment>
            ))}
          </div>
        </div> */}

        {/* Time Slots */}
        <div className="space-y-6 mb-6">
          <div className="flex justify-between">
            <Label>Recommended</Label>
            <Label>Covers</Label>
          </div>
          {renderTimeSlots()}
        </div>

        <div className="space-y-6">
          <div className="flex justify-between">
            <Label>All</Label>
            <Label>Covers</Label>
          </div>
          {renderTimeSlots()}
        </div>
      </div>
    </div>
  );
}

export default App;
