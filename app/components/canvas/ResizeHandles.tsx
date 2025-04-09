
import React from 'react';

interface ResizeHandlesProps {
  isSelected: boolean;
  onMouseDown: (handle: string, e: React.MouseEvent) => void;
}

export const ResizeHandles: React.FC<ResizeHandlesProps> = ({
  isSelected,
  onMouseDown
}) => {
  if (!isSelected) return null;

  return (
    <>
      <div
        className="resize-handle top-left"
        data-handle="top-left"
        onMouseDown={(e) => {
          e.stopPropagation();
          onMouseDown('top-left', e);
        }}
      />
      <div
        className="resize-handle top-right"
        data-handle="top-right"
        onMouseDown={(e) => {
          e.stopPropagation();
          onMouseDown('top-right', e);
        }}
      />
      <div
        className="resize-handle bottom-left"
        data-handle="bottom-left"
        onMouseDown={(e) => {
          e.stopPropagation();
          onMouseDown('bottom-left', e);
        }}
      />
      <div
        className="resize-handle bottom-right"
        data-handle="bottom-right"
        onMouseDown={(e) => {
          e.stopPropagation();
          onMouseDown('bottom-right', e);
        }}
      />
    </>
  );
};
