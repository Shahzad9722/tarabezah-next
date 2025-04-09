import { useState, useRef } from 'react';
import { FurnitureItem } from './furniture';
import { cn } from '@/app/lib/utils';
import { Button } from '@/app/components/ui/button';
import { Minus, Plus, Trash2, ZoomIn, ZoomOut, MoveHorizontal } from 'lucide-react';
import { toast } from 'sonner';

import TableInfoDialog from './TableInfoDialog';

export interface FloorplanItem {
  elementGuid: string;
  elementImageUrl: string;
  elementName: string;
  elementType: string;
  guid: string;
  maxCapacity: number;
  minCapacity: number;
  rotation: number;
  tableId: string;
  category: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
}

interface FloorplanCanvasProps {
  items: FloorplanItem[];
  onItemsChange: (items: FloorplanItem[]) => void;
  onDrop?: (x: number, y: number, dragItem: any) => void;
  dragItem?: any;
}

export function FloorplanCanvas({ items, onItemsChange, onDrop, dragItem }: FloorplanCanvasProps) {
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [scale, setScale] = useState(1);
  const [dropIndicator, setDropIndicator] = useState({
    show: false,
    x: 0,
    y: 0,
  });
  const canvasRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  // Clear selection when clicking on the canvas
  const handleCanvasClick = () => {
    setSelectedItemId(null);
  };

  // Handle drag over
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    // console.log('🚀 ~ handleDragOver ~ handleDragOver:', handleDragOver);
    e.preventDefault();
    if (!gridRef.current || !dragItem) return;

    const rect = gridRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / scale;
    const y = (e.clientY - rect.top) / scale;

    // Snap to grid (every 10px)
    const snappedX = Math.round(x / 10) * 10;
    const snappedY = Math.round(y / 10) * 10;
    const minusValue = 35;

    setDropIndicator({
      show: true,
      x: snappedX - minusValue,
      y: snappedY - minusValue,
    });
  };

  const [showTableInfoDialog, setShowTableInfoDialog] = useState(false);
  const [dropPosition, setDropPosition] = useState({ x: 0, y: 0 });

  // Handle drop
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    // console.log("🚀 ~ handleDrop ~ handleDrop:", handleDrop);
    e.preventDefault();
    if (!gridRef.current || !onDrop || !dragItem) return;

    const rect = gridRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / scale;
    const y = (e.clientY - rect.top) / scale;

    // Snap to grid (every 10px)
    const snappedX = Math.round(x / 10) * 10;
    const snappedY = Math.round(y / 10) * 10;

    const minusValue = 35;

    const finalX = snappedX - minusValue;
    const finalY = snappedY - minusValue;

    setDropPosition({ x: finalX, y: finalY });
    setShowTableInfoDialog(true);

    setDropIndicator({ show: false, x: 0, y: 0 });
  };

  const handleTableInfoSave = (info: { tableNumber: string; minCapacity: number; maxCapacity: number }) => {
    if (onDrop) {
      onDrop(dropPosition.x, dropPosition.y, { ...dragItem, ...info });

      // You can pass the table info to your state management here
    }
  };

  // Reset drop indicator on drag leave
  const handleDragLeave = () => {
    // console.log("🚀 ~ handleDragLeave ~ handleDragLeave:", handleDragLeave);
    setDropIndicator({ show: false, x: 0, y: 0 });
  };

  // Delete selected item
  const handleDeleteSelected = () => {
    if (!selectedItemId) return;

    const updatedItems = items.filter((item) => item.elementGuid !== selectedItemId);
    onItemsChange(updatedItems);
    setSelectedItemId(null);
    toast.success('Item deleted');
  };

  // Handle position changes for furniture items
  const handlePositionChange = (id: string, x: number, y: number) => {
    /* console.log(
      "🚀 ~ handlePositionChange ~ handlePositionChange:",
      handlePositionChange
    ); */
    const updatedItems = items.map((item) => {
      if (item.elementGuid === id) {
        return { ...item, x, y };
      }
      return item;
    });

    onItemsChange(updatedItems);
  };

  // Handle rotation changes
  const handleRotate = (id: string, rotation: number) => {
    const updatedItems = items.map((item) => {
      if (item.elementGuid === id) {
        return { ...item, rotation };
      }
      return item;
    });

    onItemsChange(updatedItems);
  };

  // Zoom in/out functions
  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev + 0.1, 2));
  };

  const handleZoomOut = () => {
    setScale((prev) => Math.max(prev - 0.1, 0.5));
  };

  const handleResetZoom = () => {
    setScale(1);
  };

  return (
    <div className='relative h-full flex flex-col'>
      <div className='absolute top-4 right-4 flex gap-2 z-10'>
        <Button
          variant='outline'
          size='icon'
          onClick={() => handleZoomIn()}
          className='bg-background/80 backdrop-blur-sm text-[#B98858]'
          title='Zoom In'
          aria-label='Zoom In'
        >
          <ZoomIn className='h-4 w-4' />
        </Button>
        <Button
          variant='outline'
          size='icon'
          onClick={() => handleZoomOut()}
          className='bg-background/80 backdrop-blur-sm text-[#B98858]'
          title='Zoom Out'
          aria-label='Zoom Out'
        >
          <ZoomOut className='h-4 w-4' />
        </Button>
        <Button
          variant='outline'
          size='icon'
          onClick={() => handleResetZoom()}
          className='bg-background/80 backdrop-blur-sm text-[#B98858]'
          title='Reset Zoom'
          aria-label='Reset Zoom'
        >
          <MoveHorizontal className='h-4 w-4' />
        </Button>
      </div>

      {selectedItemId && (
        <div className='absolute top-4 left-5 z-10'>
          <Button
            size='sm'
            variant='secondary'
            onClick={handleDeleteSelected}
            className='flex items-center gap-1 text-[#B98858] text-sm'
          >
            <Trash2 className='h-4 w-4' />
            <span>Delete Item</span>
          </Button>
        </div>
      )}

      <div
        ref={canvasRef}
        className='floorplan-canvas flex-1 w-full overflow-auto bg-background'
        onClick={handleCanvasClick}
      >
        <div
          ref={gridRef}
          className={cn(
            'w-full h-full min-h-[500px] md:min-h-0 bg-color-D0C17 rounded-2xl relative overflow-hidden floorplan-grid ',
            'transform transition-transform duration-200',
            dragItem && 'cursor-copy'
          )}
          style={{
            backgroundImage:
              'linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)',
            backgroundSize: '20px 20px',
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
          }}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {items.map((item, index) => (
            <FurnitureItem
              key={index}
              item={item}
              isSelected={selectedItemId === item.elementGuid}
              onSelect={setSelectedItemId}
              onPositionChange={handlePositionChange}
              onRotate={handleRotate}
            />
          ))}

          <TableInfoDialog
            open={showTableInfoDialog}
            onClose={() => setShowTableInfoDialog(false)}
            onSave={handleTableInfoSave}
          />

          {/* Drop indicator */}
          {dropIndicator.show && dragItem && (
            <div
              className='absolute border-2 border-dashed border-primary rounded-md bg-primary/10 pointer-events-none'
              style={{
                left: `${dropIndicator.x}px`,
                top: `${dropIndicator.y}px`,
                width: `${dragItem.width}px`,
                height: `${dragItem.height}px`,
              }}
            />
          )}
        </div>
      </div>

      <div className='py-2 px-4 flex justify-between items-center bg-card absolute bottom-2 left-0 pointer-events-none opacity-40'>
        <div className='text-sm text-muted-foreground'>
          {items.length} items • {Math.round(scale * 100)}% zoom
        </div>
      </div>
    </div>
  );
}
