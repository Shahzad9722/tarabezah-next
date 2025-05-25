import React, { useEffect, useState } from 'react';
import { Label } from '../../ui/label';
import { UseFormReturn } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormMessage } from '../../ui/form';
import { Button } from '../../ui/button';
import { Minus, Plus } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { useLoader } from '@/app/context/loaderContext';

interface TimeSlot {
  time: string;
  totalTables: number;
  availableTables: number;
  isAvailable: boolean;
  totalPatySizes: number;
  allocatedTables: number;
}

function App({
  form,
  shifts,
  tableTypes,
  restaurantId,
}: {
  form: UseFormReturn<any>;
  shifts: { guid: string; name: string; startTime: string; endTime: string }[];
  tableTypes: { name: string; value: number }[];
  restaurantId: string;
}) {
  const { showLoader, hideLoader } = useLoader();
  const [activeShift, setActiveShift] = useState(form.getValues('shiftId'));
  const [activeTableType, setActiveTableType] = useState<string | number>('View All');
  const [selectedSlot, setSelectedSlot] = useState<string | null>(form.getValues('eventTime') || null);
  const [duration, setDuration] = useState(form.getValues('duration') || 180); // Duration in minutes
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);

  const { mutateAsync: fetchTimeSlots, isPending: submittingReservationForm } = useMutation({
    mutationFn: async (data: any) => {
      const params = new URLSearchParams({
        RestaurantGuid: data.RestaurantGuid,
        PartySize: data.PartySize?.toString(),
        Date: new Date(form.getValues('eventDate')).toISOString().slice(0, 10),
        ShiftGuid: data.ShiftGuid || '',
        TableType: data.TableType?.toString() || '',
      });

      const response = await fetch(`/api/reservation/shift-time?${params.toString()}`, {
        method: 'GET',
      });

      if (!response.ok) throw new Error('Failed to fetch time slots');
      return response.json();
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      showLoader();
      const payload = {
        RestaurantGuid: restaurantId,
        PartySize: form.getValues('numberOfGuests'),
        Date: form.getValues('eventDate'),
        ShiftGuid: activeShift,
        TableType: activeTableType,
      };

      try {
        const response = await fetchTimeSlots(payload);
        console.log('Fetched time slots:', response);
        setTimeSlots(response?.timeSlots || []);
      } catch (error) {
        console.error('Failed to fetch time slots:', error);
      } finally {
        hideLoader();
      }
    };

    fetchData();
  }, [activeShift, activeTableType, form.watch('eventDate'), form.watch('numberOfGuests')]);

  // Watch both date and time fields
  const selectedDate = form.watch('eventDate');
  const selectedTime = form.watch('eventTime');

  // Update selectedSlot when time changes in the form
  React.useEffect(() => {
    if (selectedTime) {
      setSelectedSlot(selectedTime);
      // Ensure duration is set when time is selected
      if (!form.getValues('duration')) {
        form.setValue('duration', duration);
      }
    }
  }, [selectedTime, duration, form]);

  const formatDate = (dateString: string | Date | null) => {
    if (!dateString) return '';
    try {
      // Parse the ISO date string
      const dateObj = typeof dateString === 'string' ? new Date(dateString) : dateString;
      if (!(dateObj instanceof Date) || isNaN(dateObj.getTime())) return '';

      return dateObj.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return '';
    }
  };

  const handleTimeSlotSelect = (slot: string) => {
    if (selectedSlot === slot) {
      setSelectedSlot(null);
      form.setValue('eventTime', undefined);
      form.setValue('duration', undefined);
    } else {
      setSelectedSlot(slot);
      form.setValue('eventTime', slot);
      form.setValue('duration', duration);
    }
  };

  const handleDurationChange = (change: number) => {
    const newDuration = Math.max(30, Math.min(600, duration + change)); // Min 30 mins, max 180 mins, in 10-min steps
    setDuration(newDuration);
    if (selectedSlot) {
      form.setValue('duration', newDuration);
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins.toString().padStart(2, '0')}m`;
  };

  const formatTime = (timeString: string) => {
    // Convert "07:00:00" to "7:00 AM"
    const [hours, minutes] = timeString.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  return (
    <div className='w-full'>
      <h2 className='text-color-E9E3D7 text-[22px] font-semibold mb-6'>Select Shift & Time</h2>

      <div className='between-area'>
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
                        className={`whitespace-nowrap flex-1 text-center cursor-pointer py-1 px-4 rounded-lg transition-all ${activeShift === shift.guid ? 'bg-color-B98858 text-[#0B0B0B]' : 'text-color-E9E3D7'
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
                      className={`transition-all text-lg font-medium w-full whitespace-nowrap ${activeTableType === 'View All' ? ' text-color-B98858 underline' : 'text-color-E9E3D7'
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
                            setActiveTableType(table.name);
                          }}
                          className={`transition-all text-lg font-medium w-full ${activeTableType === table.name ? 'text-color-B98858 underline' : 'text-color-E9E3D7'
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

        {/* Duration Selection */}
        <div className='space-y-2 mb-6'>
          <FormField
            control={form.control}
            name='duration'
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className='flex w-full items-center gap-4 flex-wrap sm:flex-nowrap'>
                    {/* Date/Time Box */}
                    <div className='w-full sm:w-1/2 bg-[#0D0C16] text-center rounded-lg py-3.5 px-4 text-sm min-h-[64px] flex items-center justify-center'>
                      {selectedDate && selectedTime ? (
                        <span className='text-color-E9E3D7 font-medium'>
                          {formatDate(selectedDate)} {selectedTime}
                        </span>
                      ) : (
                        <span className='text-color-E9E3D7/50'>No date/time selected</span>
                      )}
                    </div>

                    {/* Duration Box */}
                    <div className='w-full sm:w-1/2 flex items-center justify-center gap-2 bg-[#0D0C16] rounded-lg py-3.5 px-4 min-h-[64px]'>
                      <Button
                        type='button'
                        variant='outline'
                        size='icon'
                        onClick={() => handleDurationChange(-10)}
                        disabled={duration <= 30}
                        className='h-8 w-8 bg-transparent border-none hover:bg-color-B98858/10 disabled:opacity-50'
                      >
                        <Minus className='h-4 w-4 text-color-E9E3D7' />
                      </Button>
                      <span className='text-color-E9E3D7 text-sm font-medium min-w-[70px] text-center'>
                        {formatDuration(duration)}
                      </span>
                      <Button
                        type='button'
                        variant='outline'
                        size='icon'
                        onClick={() => handleDurationChange(10)}
                        disabled={duration >= 600}
                        className='h-8 w-8 bg-transparent border-none hover:bg-color-B98858/10 disabled:opacity-50'
                      >
                        <Plus className='h-4 w-4 text-color-E9E3D7' />
                      </Button>
                    </div>
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
          </div>
          <FormField
            control={form.control}
            name='eventTime'
            render={({ field }) => (
              <FormItem>
                <FormMessage />
                <FormControl>
                  <div className='flex flex-col space-y-2'>
                    {timeSlots.length > 0 ? (
                      timeSlots.map((slot, index) => {
                        const isSelected = selectedSlot === formatTime(slot.time);
                        const formattedTime = formatTime(slot.time);
                        const isAvailable = slot.isAvailable;

                        return (
                          <React.Fragment key={index}>
                            <div
                              onClick={() => {
                                handleTimeSlotSelect(formattedTime);
                                field.onChange(formattedTime);
                              }}
                              className={`w-full rounded-lg px-4 py-2 flex items-center justify-between transition-all group
            ${isSelected
                                  ? (isAvailable ? 'bg-color-B98858 text-[#0B0B0B]' : 'bg-color-B98858 border border-red-500')
                                  : isAvailable
                                    ? 'bg-color-F2C45 text-color-E9E3D7 hover:bg-color-B98858/20 cursor-pointer'
                                    : 'border border-red-500'}
                            `}
                              style={{ borderWidth: !isAvailable ? 2 : undefined }}
                              title={!isAvailable ? 'Slot not available' : ''}
                            >
                              <div className='flex items-center gap-3'>
                                <span className='text-lg'>{formattedTime}</span>
                              </div>
                              <div className='flex items-center gap-3'>
                                <span>
                                  {slot.allocatedTables}/{slot.totalPatySizes}
                                </span>
                              </div>
                            </div>
                            {!isAvailable && (
                              <div className="text-red-500 text-xs mt-1">
                                {formattedTime} No Regular Time Available
                              </div>
                            )}
                          </React.Fragment>
                        );
                      })
                    ) : (
                      <div className='text-color-E9E3D7/50 text-center py-4'>No available time slots</div>
                    )}
                  </div>
                </FormControl>
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
