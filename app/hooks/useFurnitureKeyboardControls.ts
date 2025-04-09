
import { useEffect } from 'react';

interface KeyboardControlsProps {
  id: string;
  isSelected: boolean;
  x: number;
  y: number;
  rotation: number;
  onPositionChange: (id: string, x: number, y: number) => void;
  onRotate: (id: string, rotation: number) => void;
}

export function useFurnitureKeyboardControls({
  id,
  isSelected,
  x,
  y,
  rotation,
  onPositionChange,
  onRotate
}: KeyboardControlsProps) {
  // Handle rotation with keyboard when selected
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isSelected) return;
      
      if (e.key === 'r') {
        onRotate(id, (rotation + 45) % 360);
      }
      
      // Arrow keys for fine movement
      const moveDistance = e.shiftKey ? 10 : 1;
      
      switch (e.key) {
        case 'ArrowUp':
          onPositionChange(id, x, y - moveDistance);
          e.preventDefault();
          break;
        case 'ArrowDown':
          onPositionChange(id, x, y + moveDistance);
          e.preventDefault();
          break;
        case 'ArrowLeft':
          onPositionChange(id, x - moveDistance, y);
          e.preventDefault();
          break;
        case 'ArrowRight':
          onPositionChange(id, x + moveDistance, y);
          e.preventDefault();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [id, isSelected, rotation, x, y, onPositionChange, onRotate]);
}
