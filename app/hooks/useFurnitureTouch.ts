
import { useEffect } from 'react';

interface TouchProps {
  id: string;
  itemRef: any
  isDragging: boolean;
  offsetX: React.MutableRefObject<number>;
  offsetY: React.MutableRefObject<number>;
  setIsDragging: (isDragging: boolean) => void;
  onSelect: (id: string) => void;
  onPositionChange: (id: string, x: number, y: number) => void;
}

export function useFurnitureTouch({
  id,
  itemRef,
  isDragging,
  offsetX,
  offsetY,
  setIsDragging,
  onSelect,
  onPositionChange
}: TouchProps) {
  // Handle touch devices
  useEffect(() => {
    if (!itemRef.current) return;
    
    const element = itemRef.current;
    
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      
      const touch = e.touches[0];
      const rect = element.getBoundingClientRect();
      offsetX.current = touch.clientX - rect.left;
      offsetY.current = touch.clientY - rect.top;
      
      setIsDragging(true);
      onSelect(id);
      e.preventDefault();
    };
    
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length !== 1 || !isDragging) return;
      
      const touch = e.touches[0];
      const canvasRect = element.parentElement?.getBoundingClientRect();
      if (!canvasRect) return;
      
      const newX = touch.clientX - canvasRect.left - offsetX.current;
      const newY = touch.clientY - canvasRect.top - offsetY.current;
      
      // Snap to grid
      const snappedX = Math.round(newX / 10) * 10;
      const snappedY = Math.round(newY / 10) * 10;
      
      onPositionChange(id, snappedX, snappedY);
      e.preventDefault();
    };
    
    const handleTouchEnd = () => {
      setIsDragging(false);
    };
    
    element.addEventListener('touchstart', handleTouchStart, { passive: false });
    element.addEventListener('touchmove', handleTouchMove, { passive: false });
    element.addEventListener('touchend', handleTouchEnd);
    
    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [id, isDragging, onPositionChange, onSelect, itemRef, offsetX, offsetY, setIsDragging]);
}
