import React, { useState } from 'react';
import { Label } from '../../ui/label';
import { UseFormReturn } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormMessage } from '../../ui/form';

function App({
  form,
  shifts,
  tableTypes,
}: {
  form: UseFormReturn<any>;
  shifts: { guid: string; name: string; startTime: string; endTime: string }[];
  tableTypes: { name: string; value: number }[];
}) {
  const [activeShift, setActiveShift] = useState(form.getValues('shiftId'));
  const [activeTableType, setActiveTableType] = useState<string | number>('View All');
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  const handleTimeSlotSelect = (slot: string) => {
    if (selectedSlot === slot) {
      setSelectedSlot(null);
      form.setValue('eventTime', undefined);
    } else {
      setSelectedSlot(slot);
      form.setValue('eventTime', slot);
    }
  };

  const generateTimeSlots = (startTimeStr: string, endTimeStr: string): string[] => {
    console.log('startTimeStr', startTimeStr);
    console.log('endTimeStr', endTimeStr);
    const slots: string[] = [];
    const now = new Date();

    // Parse start and end time strings into Date objects with today's date
    const [startH, startM, startS] = startTimeStr.split(':').map(Number);
    const [endH, endM, endS] = endTimeStr.split(':').map(Number);

    const startTime = new Date();
    startTime.setHours(startH, startM, startS || 0, 0);

    const endTime = new Date();
    endTime.setHours(endH, endM, endS || 0, 0);

    // If current time is after end time, return empty array
    // if (now >= endTime) return slots;

    // Determine the effective start time (max of now and startTimeStr)
    // const effectiveStart = new Date(
    //   Math.max(new Date(now.setMinutes(Math.ceil(now.getMinutes() / 15) * 15, 0, 0)).getTime(), startTime.getTime())
    // );

    // Generate time slots
    while (startTime <= endTime) {
      slots.push(startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      startTime.setMinutes(startTime.getMinutes() + 15);
    }

    return slots;
  };

  return (
    <div className='w-full'>
      <h2 className='text-color-E9E3D7 text-[22px] font-semibold mb-6'>Select Shift & Time</h2>

      <div>
        {/* Shift Tabs */}
        <div className='w-full mb-8 [box-shadow:0px_4px_11.2px_0px_#00000040_inset] rounded-lg py-2.5 px-6'>
          <FormField
            control={form.control}
            name='shiftId'
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className='w-full flex justify-between rounded-lg bg-[#0D0C16] overflow-x-auto'>
                    {shifts.map((shift, index) => (
                      <span
                        key={index}
                        onClick={() => {
                          setActiveShift(shift.guid);
                          field.onChange(shift.guid);
                        }}
                        className={`whitespace-nowrap flex-1 text-center cursor-pointer py-1 px-4 rounded-lg transition-all ${
                          activeShift === shift.guid ? 'bg-color-B98858 text-[#0B0B0B]' : 'text-color-E9E3D7'
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
        <div className='flex items-center justify-between mb-6 overflow-x-auto'>
          <FormField
            control={form.control}
            name='tableType'
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className='w-full flex justify-between'>
                    <button
                      type='button'
                      onClick={() => {
                        setActiveTableType('View All');
                        setSelectedSlot(null);
                      }}
                      className={`transition-all text-lg font-medium w-full whitespace-nowrap ${
                        activeTableType === 'View All' ? ' text-color-B98858 underline' : 'text-color-E9E3D7'
                      }`}
                    >
                      View All
                    </button>
                    <div className='h-6 w-px bg-gray-700 mx-4' />

                    {tableTypes.map((table, index) => (
                      <React.Fragment key={index}>
                        <button
                          type='button'
                          onClick={() => {
                            setActiveTableType(table.value);
                            // field.onChange(table.value);
                          }}
                          className={`transition-all text-lg font-medium w-full ${
                            activeTableType === table.value ? 'text-color-B98858 underline' : 'text-color-E9E3D7'
                          }`}
                        >
                          {table.name}
                        </button>
                        {index < tableTypes.length - 1 && <div className='h-6 w-px bg-gray-700 mx-4' />}
                      </React.Fragment>
                    ))}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Time Slots */}
        <div className='space-y-6 mb-6'>
          <div className='flex justify-between'>
            <Label>Time Slots</Label>
            {/* <Label>Covers</Label> */}
          </div>
          <FormField
            control={form.control}
            name='eventTime'
            render={({ field }) => (
              <FormItem>
                <FormMessage />
                <FormControl>
                  <div className='flex flex-col space-y-2'>
                    {activeShift &&
                      shifts.find((shift) => shift.guid === activeShift) &&
                      generateTimeSlots(
                        shifts.find((shift) => shift.guid === activeShift)?.startTime || '',
                        shifts.find((shift) => shift.guid === activeShift)?.endTime || ''
                      ).map((slot, index) => {
                        return (
                          <div
                            key={index}
                            onClick={() => {
                              handleTimeSlotSelect(slot);
                              field.onChange(slot);
                            }}
                            className={`w-full rounded-lg px-4 py-2 flex items-center justify-between transition-all group cursor-pointer
              ${selectedSlot === slot ? 'bg-color-B98858 text-[#0B0B0B]' : 'bg-color-F2C45 text-color-E9E3D7'}`}
                          >
                            <div className='flex items-center gap-3'>
                              <div>
                                <span className='text-lg'>{slot}</span>
                              </div>
                            </div>
                            <div className={`${selectedSlot === slot ? 'text-[#0B0B0B]' : 'text-color-E9E3D7'}`}>
                              {/* {slot.available}/{slot.total} */}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        {/* <div className='space-y-6'>
          <div className='flex justify-between'>
            <Label>All</Label>
            <Label>Covers</Label>
          </div>
          {renderTimeSlots()}
        </div> */}
      </div>
    </div>
  );
}

export default App;
