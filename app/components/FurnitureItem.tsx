import { useState, useRef } from 'react';
import Image from 'next/image';
import { cn } from '@/app/lib/utils';
import { useFurnitureKeyboardControls } from '@/app/hooks/useFurnitureKeyboardControls';
import { useFurnitureDrag } from '@/app/hooks/useFurnitureDrag';
import { useFurnitureTouch } from '@/app/hooks/useFurnitureTouch';
// import { RotateIcon } from './RotateIcon';
import { getFurnitureImage } from '@/app/utils/furnitureImages';
import { FloorplanItem } from './FloorplanCanvas';

export interface FurnitureItemProps {
  item: FloorplanItem;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onPositionChange: (id: string, x: number, y: number) => void;
  onRotate: (id: string, rotation: number) => void;
}

export function FurnitureItem({ item, isSelected, onSelect, onPositionChange, onRotate }: FurnitureItemProps) {
  const [isDragging, setIsDragging] = useState(false);
  const offsetX = useRef<number>(0);
  const offsetY = useRef<number>(0);

  // Use the keyboard controls hook
  useFurnitureKeyboardControls({
    id: item.guid,
    isSelected,
    x: item.x,
    y: item.y,
    rotation: item.rotation,
    onPositionChange,
    onRotate,
  });

  // Use the drag hook
  const { itemRef, handleMouseDown } = useFurnitureDrag({
    id: item.guid,
    onSelect,
    onPositionChange,
  });

  // Use the touch hook
  useFurnitureTouch({
    id: item.guid,
    itemRef,
    isDragging,
    offsetX,
    offsetY,
    setIsDragging,
    onSelect,
    onPositionChange,
  });

  // Get the image path for this furniture type
  const imagePath = getFurnitureImage(item.elementType);

  return (
    <div
      ref={itemRef}
      className={cn(
        'furniture-item absolute cursor-move',
        isSelected && 'selected',
        isDragging && 'dragging opacity-80'
      )}
      style={{
        transform: `translate(${item.x}px, ${item.y}px) rotate(${item.rotation}deg)`,
        width: `${item.width || 100}px`,
        height: `${item.height || 100}px`,
        zIndex: isSelected ? 10 : 1,
      }}
      onMouseDown={handleMouseDown}
      onClick={(e) => {
        onSelect(item.guid);
        e.stopPropagation();
      }}
      data-type={item.elementType}
      draggable={false}
    >
      <Image
        src={item.elementImageUrl}
        alt={item.elementType}
        className='w-14 h-14 md:w-[75px] md:h-[75px] furniture-element'
        draggable={false}
        width={100}
        height={100}
      />

      {isSelected && (
        <div className='absolute -top-8 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-md whitespace-nowrap'>
          {item.elementType}
        </div>
      )}

      {/* {isSelected && (
        <button
          className='absolute -bottom-4 -right-4 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md hover:bg-primary/90 transition-colors'
          onClick={(e) => {
            e.stopPropagation();
            onRotate(item.guid, (item.rotation + 45) % 360);
          }}
        >
          <RotateIcon />
        </button>
      )} */}
    </div>
  );
}
