
import { Button } from "@/app/components/ui/button";
import React from "react";
import { FurnitureItem } from "@/app/types/furniture";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu";

interface TableStatusControlsProps {
  item: FurnitureItem;
  rotation: number;
  onStatusChange: (status: 'available' | 'booked' | 'cancelled') => void;
}

export default function TableStatusControls({ item, rotation, onStatusChange }: TableStatusControlsProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
  };

  return (
    <div 
      className="absolute -top-16 left-1/2 transform -translate-x-1/2"
      style={{ transform: `rotate(${-rotation}deg)` }}
      onClick={handleClick}
      onMouseDown={handleClick}
      onPointerDown={handleClick}
    >
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            className="bg-background/90 text-foreground text-xs h-8"
            onClick={handleClick}
          >
            {item.status || 'Available'}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => onStatusChange('available')}>
            Available
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onStatusChange('booked')}>
            Booked
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onStatusChange('cancelled')}>
            Cancelled
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
