
import { useState, useRef, useEffect } from 'react';

interface DragProps {
  id: string;
  onSelect: (id: string) => void;
  onPositionChange: (id: string, x: number, y: number) => void;
}

export function useFurnitureDrag({
  id,
  onSelect,
  onPositionChange
}: DragProps) {
  const [isDragging, setIsDragging] = useState(false);
  const itemRef = useRef<HTMLDivElement>(null);
  const offsetX = useRef<number>(0);
  const offsetY = useRef<number>(0);

  // Handle drag start
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.button !== 0) return; // Only left mouse button
    
    if (itemRef.current) {
      const rect = itemRef.current.getBoundingClientRect();
      offsetX.current = e.clientX - rect.left;
      offsetY.current = e.clientY - rect.top;
    }
    
    setIsDragging(true);
    onSelect(id);
    e.stopPropagation();
  };

  // Handle dragging
  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!itemRef.current || !isDragging) return;
      
      const canvasRect = itemRef.current.parentElement?.getBoundingClientRect();
      if (!canvasRect) return;

      // Calculate new position relative to canvas
      const newX = e.clientX - canvasRect.left - offsetX.current;
      const newY = e.clientY - canvasRect.top - offsetY.current;
      
      // Optional: Snap to grid (every 10px)
      const snappedX = Math.round(newX / 10) * 10;
      const snappedY = Math.round(newY / 10) * 10;
      
      onPositionChange(id, snappedX, snappedY);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [id, isDragging, onPositionChange]);

  return { isDragging, itemRef, handleMouseDown };
}
