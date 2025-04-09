"use client";

import type React from "react";

export interface MultiSelectOption {
  id: number;
  name: string;
  icon?: React.ReactNode;
}

interface MultiSelectProps {
  options: MultiSelectOption[];
  value: number[];
  onChange: (value: number[]) => void;
  className?: string;
}

export const MultiSelect: React.FC<MultiSelectProps> = ({
  options,
  value,
  className,
  onChange,
}) => {
  const isSelected = (id: number) => value.includes(id);

  const toggleSelection = (id: number) => {
    if (isSelected(id)) {
      onChange(value.filter((selectedId) => selectedId !== id));
    } else {
      onChange([...value, id]);
    }
  };

  return (
    <div className={`flex flex-wrap gap-5 w-full ${className || ""}`}>
      {options.map((option) => (
        <button
          key={option.id}
          className={`flex items-center gap-3 rounded-lg font-medium focus:outline-none focus:ring-none focus:ring-primary-none hover:bg-muted ${
            isSelected(option.id) ? "text-color-B98858" : "text-color-E9E3D7"
          }`}
          onClick={() => toggleSelection(option.id)}
          type="button"
        >
          {option.icon}
          {option.name}
        </button>
      ))}
    </div>
  );
};
