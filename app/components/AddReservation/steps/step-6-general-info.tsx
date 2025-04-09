'use client';

import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Crown, Wine, Sofa, Heater, Users, Clock, NotebookTabs } from 'lucide-react';
import { MultiSelect, type MultiSelectOption } from '../../../components/ui/multi-select';
import { UseFormReturn } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../ui/form';

const tags: MultiSelectOption[] = [
  {
    id: 1,
    name: 'VIP',
    icon: <Crown size={20} />,
  },
  {
    id: 2,
    name: 'Wine Lover',
    icon: <Wine />,
  },
  {
    id: 3,
    name: 'Lounger',
    icon: <Sofa />,
  },
  {
    id: 4,
    name: 'BBQ Lover',
    icon: <Heater />,
  },
  {
    id: 5,
    name: 'Owners Friends',
    icon: <Users />,
  },
];

export default function GeneralInfoStep({ form }: { form: UseFormReturn<any> }) {
  return (
    <div className='w-full'>
      <h2 className='text-color-E9E3D7 text-[22px] font-semibold mb-6'>General Information</h2>

      {/* Tags Select Options */}
      <div className='mb-6'>
        <FormField
          control={form.control}
          name='tags'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tags</FormLabel>
              <FormControl>
                <MultiSelect options={tags} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Reminder */}
      <div className='flex justify-between items-center gap-4 mb-6'>
        <Label>Reminder</Label>
        <Clock />
      </div>

      {/* Client Note */}
      <div className='mb-6'>
        <FormField
          control={form.control}
          name='additionalNotes'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <div className='relative'>
                  <Input placeholder='Add Note...' className='pl-11 h-10' {...field} />
                  <NotebookTabs
                    className='absolute left-3 top-[calc(50%-12px)] text-color-E9E3D7 pointer-events-none'
                    size={24}
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
