'use client';

import { NotebookTabs } from 'lucide-react';
import { MultiSelect, type MultiSelectOption } from '../../../components/ui/multi-select';
import { UseFormReturn } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../ui/form';

export default function GeneralInfoStep({
  form,
  tags,
}: {
  form: UseFormReturn<any>;
  tags: { name: string; value: number; iconUrlWhite: string, iconUrlGold: string }[];
}) {
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
                <MultiSelect
                  options={tags.map((tag) => ({ id: tag.value, name: tag.name, iconUrlGold: tag.iconUrlGold, iconUrlWhite: tag.iconUrlWhite, }))}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Reminder */}
      {/* <div className='mb-6'>
        <FormField
          control={form.control}
          name='reminderTime'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Reminder</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger className="w-full bg-[#0D0C16] border-none text-color-E9E3D7 ring-offset-background focus:ring-1 focus:ring-color-B98858 focus:ring-offset-0">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-color-E9E3D7" />
                      <SelectValue placeholder="Select reminder time" />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="bg-[#0D0C16] border-color-B98858">
                    <SelectItem
                      value="15"
                      className="text-color-E9E3D7 hover:bg-color-B98858/10 focus:bg-color-B98858/10 focus:text-color-E9E3D7 cursor-pointer"
                    >
                      15 minutes before
                    </SelectItem>
                    <SelectItem
                      value="30"
                      className="text-color-E9E3D7 hover:bg-color-B98858/10 focus:bg-color-B98858/10 focus:text-color-E9E3D7 cursor-pointer"
                    >
                      30 minutes before
                    </SelectItem>
                    <SelectItem
                      value="60"
                      className="text-color-E9E3D7 hover:bg-color-B98858/10 focus:bg-color-B98858/10 focus:text-color-E9E3D7 cursor-pointer"
                    >
                      1 hour before
                    </SelectItem>
                    <SelectItem
                      value="120"
                      className="text-color-E9E3D7 hover:bg-color-B98858/10 focus:bg-color-B98858/10 focus:text-color-E9E3D7 cursor-pointer"
                    >
                      2 hours before
                    </SelectItem>
                    <SelectItem
                      value="1440"
                      className="text-color-E9E3D7 hover:bg-color-B98858/10 focus:bg-color-B98858/10 focus:text-color-E9E3D7 cursor-pointer"
                    >
                      1 day before
                    </SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div> */}

      {/* Client Note */}
      <div className='mb-6'>
        <FormField
          control={form.control}
          name='additionalNotes'
          render={({ field }) => {
            const maxLength = 150;
            return (
              <FormItem>
                <FormLabel>Notes</FormLabel>
                <FormControl>
                  <div className='relative'>
                    <NotebookTabs
                      className='absolute left-3 top-3 text-color-E9E3D7 pointer-events-none'
                      size={24}
                    />
                    <textarea
                      placeholder='Add Note...'
                      className='w-full resize-vertical rounded border border-input bg-color-222036 px-10 py-2 text-sm text-color-E9E3D7 shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-0 overflow-y-auto break-words whitespace-pre-wrap'
                      rows={2}
                      style={{
                        boxSizing: 'border-box',
                        width: '100%',
                        resize: 'vertical',
                        overflowWrap: 'break-word',
                        wordBreak: 'break-word',
                      }}
                      maxLength={maxLength}
                      value={field.value || ''}
                      onChange={e => field.onChange(e.target.value.slice(0, maxLength))}
                    />
                  </div>
                </FormControl>
                <div className='text-xs text-right text-color-E9E3D7 mt-1'>
                  {(field.value || '').length}/{maxLength} characters
                </div>
                <FormMessage />
              </FormItem>

            );
          }}
        />
      </div>
    </div>
  );
}
