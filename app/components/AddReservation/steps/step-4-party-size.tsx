'use client';

import { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormMessage } from '../../ui/form';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';

export default function PartySizeStep({ form }: { form: UseFormReturn<any> }) {
  const [partySize, setPartySize] = useState(form.getValues('numberOfGuests'));

  const partySizes = [1, 2, 3, 4, 5, 6, 7, 8, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];

  return (
    <div className='w-full'>
      <h2 className='text-color-E9E3D7 text-[22px] font-semibold mb-6'>Select Party Size</h2>

      <FormField
        control={form.control}
        name='numberOfGuests'
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <div className='flex flex-col gap-4 my-8'>
                {partySizes.map((size, index) => (
                  <p
                    key={index}
                    className={`p-2 text-center cursor-pointer font-normal text-lg transition-all border-b-[1px] border-[#E9E3D736] ${
                      partySize === size ? 'text-color-B98858' : 'text-color-E9E3D7'
                    }`}
                    onClick={() => {
                      setPartySize(size);
                      field.onChange(size);
                    }}
                  >
                    {size} guests
                  </p>
                ))}
              </div>
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name='numberOfGuests'
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <div className='flex flex-col gap-4 mt-3'>
                <Label>More than 20 guests</Label>
                <Input
                  type='number'
                  {...field}
                  onChange={(e) => {
                    field.onChange(e.target.valueAsNumber);
                    setPartySize(e.target.valueAsNumber);
                  }}
                />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
