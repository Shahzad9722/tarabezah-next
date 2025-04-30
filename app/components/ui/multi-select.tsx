'use client';

import type React from 'react';

export interface MultiSelectOption {
  id: number;
  name: string;
  iconUrlGold?: string;
  iconUrlWhite?: string;
}

interface MultiSelectProps {
  options: MultiSelectOption[];
  value: number[];
  onChange: (value: number[]) => void;
  className?: string;
  isMultiSelect?: boolean;
}

export const MultiSelect: React.FC<MultiSelectProps> = ({
  options,
  value,
  className,
  onChange,
  isMultiSelect = true,
}) => {
  const isSelected = (id: number) => value.includes(id);

  const toggleSelection = (id: number) => {
    if (isSelected(id)) {
      onChange(value.filter((selectedId) => selectedId !== id));
    } else {
      if (isMultiSelect) {
        onChange([...value, id]);
      } else {
        onChange([id]);
      }
    }
  };

  return (
    <div className={`flex flex-wrap gap-5 w-full ${className || ''}`}>
      {options.map((option) => (
        <button
          key={option.id}
          className={`flex items-center gap-3 rounded-lg font-medium focus:outline-none focus:ring-none focus:ring-primary-none hover:bg-muted ${isSelected(option.id) ? 'text-color-B98858' : 'text-color-E9E3D7'
            }`}
          onClick={() => toggleSelection(option.id)}
          type='button'
        >
          {option?.iconUrlGold && option?.iconUrlWhite && <img src={isSelected(option.id) ? option.iconUrlGold : option.iconUrlWhite} alt={option.name} className='w-5 h-5' />}
          {option.name}
        </button>
      ))}
    </div>
  );
};
