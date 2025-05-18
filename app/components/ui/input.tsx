import * as React from 'react';

import { cn } from '@/app/lib/utils';


type InputProps = React.ComponentProps<'input'> & {
  isNumeric?: boolean;
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, maxLength, isNumeric, required, ...props }, ref) => {
    return (
      <input
        type={type || 'text'}
        maxLength={type === 'number' ? undefined : maxLength || 100}
        inputMode={isNumeric ? "numeric" : undefined}
        pattern={isNumeric ? "[0-9]*" : "^[a-zA-Z0-9\\s]*$"}
        className={cn(
          'flex h-10 w-full rounded-md border border-input bg-color-222036 px-3 border-color-222036 py-2 text-base ring-offset-background text-color-E9E3D7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
          className
        )}
        onKeyDown={(e) => {
          if (type === 'number' && (e.key === '-' || e.key === 'e')) {
            e.preventDefault();
          }
        }}
        onInput={(e) => {
          const input = e.target as HTMLInputElement;
          if (type === 'number') {
            // Remove non-digit characters
            let value = input.value.replace(/\D/g, '');

            // Prevent negative numbers
            if (Number(value) < 0) {
              input.value = '';
              return;
            }

            // Apply maxLength limit
            if (maxLength && value.length > maxLength) {
              value = value.slice(0, maxLength);
            }

            input.value = value;
          }
        }}
        required={required}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export { Input };
