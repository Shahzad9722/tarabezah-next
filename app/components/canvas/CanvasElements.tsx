
import React from 'react';
import { useFloorplan } from '@/context/FloorplanContext';
import { CanvasElement } from './CanvasElement';

interface CanvasElementsProps {
  scale: number;
  panOffset: { x: number; y: number };
}

export const CanvasElements: React.FC<CanvasElementsProps> = ({ scale, panOffset }) => {
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
