
import React from 'react';
import { useFloorplan } from '@/app/context/FloorplanContext';
import { CanvasElement } from './CanvasElement';
import { FurnitureItem } from '@/app/types/furniture';

interface CanvasElementsProps {
  scale: number;
  panOffset: { x: number; y: number };
  placedItems: FurnitureItem[];
  setPlacedItems: React.Dispatch<React.SetStateAction<FurnitureItem[]>>;
}

export const CanvasElements: React.FC<CanvasElementsProps> = ({ scale, panOffset, placedItems,
  setPlacedItems }) => {
  const { activeFloorplan } = useFloorplan();

  return (
    <>
      {activeFloorplan?.elements.map(element => (
        <CanvasElement
          key={element.id}
          element={element}
          scale={scale}
          panOffset={panOffset}
        />
      ))}
    </>
  );
};
