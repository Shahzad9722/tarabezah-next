import React, { useState, useRef, useEffect } from 'react';
import { Calendar, NotebookTabs } from 'lucide-react';
import { Input } from '../../../components/ui/input';
import { MultiSelect } from '../../../components/ui/multi-select';
import { Button } from '../../ui/button';
import { UseFormReturn } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../ui/form';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Controller } from 'react-hook-form';
import { cn } from '@/lib/utils';
import BirthdayCalendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

export default function AddReservationStep({
  form,
  sources,
  tags,
  submittingForm,
  setShowAddNewClient,
  walkIn,
}: {
  form: UseFormReturn<any>;
  sources: { name: string; value: number, iconUrlGold: string, iconUrlWhite: string, }[];
  tags: { name: string; value: number, iconUrlWhite: string, iconUrlGold: string }[];
  submittingForm: boolean;
  setShowAddNewClient: any;
  walkIn?: boolean;
}) {
  // Birthday calendar popover state and ref
  const [showBirthdayCalendar, setShowBirthdayCalendar] = useState(false);
  const birthdayInputRef = useRef<HTMLInputElement>(null);
  // Format date as dd/MM/yyyy
  const formatDisplayDate = (dateStr: string) => {
    if (!dateStr) return '';
    const d = new Date(dateStr + 'T00:00:00');
    if (isNaN(d.getTime())) return '';
    return d.toLocaleDateString('en-GB');
  };
  // Close calendar if clicked outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        birthdayInputRef.current &&
        !birthdayInputRef.current.contains(event.target as Node) &&
        !(event.target as HTMLElement).closest('.birthday-calendar-popover')
      ) {
        setShowBirthdayCalendar(false);
      }
    }
    if (showBirthdayCalendar) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showBirthdayCalendar]);

  return (
    <div className='w-full between-area'>
      {/* Add New Client Form */}
      <div className='space-y-6 mb-4'>
        <div className='flex  flex-col-reverse gap-6 md:flex-row justify-between'>
          <h2 className='text-color-E9E3D7 text-[22px] font-semibold mb-4'>Add New Client</h2>
          <div className='flex mr-[50px]'>
            <Button type='button' onClick={() => setShowAddNewClient(false)}>
              Client Search
            </Button>
          </div>
        </div>

        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input
                  type='text'
                  maxLength={30}
                  placeholder='Enter Name'
                  {...field}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^a-zA-Z\s]/g, ''); // allow only letters & spaces
                    field.onChange(value);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='phone'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input
                  maxLength={15}
                  type='tel'
                  pattern='^\+?[0-9]{7,15}$'
                  placeholder='Enter Phone Number'
                  {...field}
                  onChange={(e) => {
                    // Allow numbers and + only at the start
                    let value = e.target.value;
                    if (value.startsWith('+')) {
                      value = '+' + value.slice(1).replace(/[^0-9]/g, '');
                    } else {
                      value = value.replace(/[^0-9]/g, '');
                    }
                    field.onChange(value);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type='email' placeholder='Enter Email' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='birthday'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Birthday</FormLabel>
              <FormControl>
                <div className="relative w-full">
                  <input
                    ref={birthdayInputRef}
                    type="text"
                    readOnly
                    value={formatDisplayDate(field.value)}
                    placeholder="dd/mm/yyyy"
                    className="flex h-10 w-full rounded-md border border-input bg-color-222036 px-3 border-color-222036 py-2 text-base ring-offset-background text-color-E9E3D7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm pr-10"
                    onClick={() => setShowBirthdayCalendar((v) => !v)}
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => setShowBirthdayCalendar((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white"
                  >
                    <Calendar size={18} />
                  </button>
                  {showBirthdayCalendar && (
                    <div
                      className="birthday-calendar-popover absolute z-50 mt-2 bg-color-222036 border border-[#E9E3D736] rounded shadow-lg left-1/2 -translate-x-1/2 md:left-0 md:translate-x-0 w-[90vw] max-w-[320px] md:w-[320px]"
                      style={{ top: '110%' }}
                    >
                      <BirthdayCalendar
                        className="!w-full !bg-transparent border-none rounded"
                        maxDate={new Date()}
                        onChange={(value) => {
                          if (value instanceof Date) {
                            const year = value.getFullYear();
                            const month = String(value.getMonth() + 1).padStart(2, '0');
                            const day = String(value.getDate()).padStart(2, '0');
                            field.onChange(`${year}-${month}-${day}`);
                            setShowBirthdayCalendar(false);
                          }
                        }}
                        value={field.value ? new Date(field.value + 'T00:00:00') : undefined}
                        formatShortWeekday={(locale, date) => date.toLocaleDateString(locale, { weekday: 'narrow' })}
                      />
                    </div>
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='sources'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Client Source</FormLabel>
              <FormControl>
                <MultiSelect
                  options={sources.map((s) => ({ id: s.value, name: s.name, iconUrlGold: s.iconUrlGold, iconUrlWhite: s.iconUrlWhite, }))}
                  {...field}
                  isMultiSelect={false}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='tags'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tags</FormLabel>
              <FormControl>
                <MultiSelect options={tags.map((t) => ({ id: t.value, name: t.name, iconUrlWhite: t.iconUrlWhite, iconUrlGold: t.iconUrlGold }))} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='clientNotes'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Client Note</FormLabel>
              <FormControl>
                <div className='relative'>
                  <Input placeholder='Add Note...' className='pl-12 h-16' {...field} />
                  <NotebookTabs
                    className='absolute left-3 top-[calc(50%-16px)] text-color-E9E3D7 pointer-events-none'
                    size={32}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Add guest button */}
      <div className='flex justify-between my-4 gap-4'>
        <Button type='submit' disabled={submittingForm} className='w-full'>
          Add Guest
        </Button>
      </div>
    </div>
  );
}
