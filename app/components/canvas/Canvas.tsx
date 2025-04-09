
import React, { useRef, useEffect } from 'react';
import { useCanvasHandlers } from '@/app/hooks/useCanvasHandlers';
import { ZoomControls } from './ZoomControls';
import { TableConfigDialog } from './TableConfigDialog';
import { CanvasElements } from './CanvasElements';
import { FurnitureItem } from '@/app/types/furniture';


interface CanvasProps {
  placedItems: FurnitureItem[];
  setPlacedItems: React.Dispatch<React.SetStateAction<FurnitureItem[]>>;
}
export const Canvas: React.FC<CanvasProps> = ({ placedItems, setPlacedItems }) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const {
    state,
    handleCanvasClick,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleKeyDown,
    handleKeyUp,
    handleZoomIn,
    handleZoomOut,
    handleWheel,
    handleDragOver,
    handleDrop,
    handleCompleteReservable,
    setTableName,
    setMinCapacity,
    setMaxCapacity,
    setIsConfigDialogOpen
  } = useCanvasHandlers(canvasRef);

  // Register global event listeners
  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleMouseMove, handleMouseUp, handleKeyDown, handleKeyUp]);

  return (
    <>
      <div className="relative h-full overflow-hidden border rounded-lg bg-white">
        <ZoomControls onZoomIn={handleZoomIn} onZoomOut={handleZoomOut} />

        <div
          ref={canvasRef}
          className="relative w-full h-full overflow-hidden bg-canvas"
          style={{
            backgroundImage: `
              linear-gradient(to right, var(--canvas-grid) 1px, transparent 1px),
              linear-gradient(to bottom, var(--canvas-grid) 1px, transparent 1px)
            `,
            backgroundSize: `${20 * state.scale}px ${20 * state.scale}px`,
            backgroundPosition: `${state.panOffset.x * state.scale}px ${state.panOffset.y * state.scale}px`,
          }}
          onClick={handleCanvasClick}
          onMouseDown={handleMouseDown}
          onWheel={handleWheel}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <CanvasElements scale={state.scale} panOffset={state.panOffset} placedItems={placedItems}
            setPlacedItems={setPlacedItems} />
        </div>
      </div>

      <TableConfigDialog
        isOpen={state.isConfigDialogOpen}
        onOpenChange={setIsConfigDialogOpen}
        tableName={state.tableName}
        setTableName={setTableName}
        minCapacity={state.minCapacity}
        setMinCapacity={setMinCapacity}
        maxCapacity={state.maxCapacity}
        setMaxCapacity={setMaxCapacity}
        onComplete={handleCompleteReservable}
      />
    </>
  );
};
