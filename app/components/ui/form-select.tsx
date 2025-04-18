'use client';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface FormSelectProps {
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
  options: { label: string; value: string }[];
  className?: string;
}

export default function FormSelect({
  value,
  placeholder = 'Select...',
  onChange,
  options,
  className,
}: FormSelectProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger
        className={cn(
          'flex h-11 w-full items-center justify-between whitespace-nowrap rounded-md border-none bg-color-darkPurple px-3 py-2 text-sm text-white shadow-sm ring-offset-background focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1',
          className
        )}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent
        className={cn(
          'bg-color-darkPurple border-none text-white', // Adding background color here
          className
        )}
      >
        {options.map((opt) => (
          <SelectItem className='hover:bg-[#333852] hover:text-white transition-all' key={opt.value} value={opt.value}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
