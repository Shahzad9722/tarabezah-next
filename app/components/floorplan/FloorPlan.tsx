import React, { useState, useRef, useEffect } from 'react';
import TableComponent from './TableComponent';
import { ZoomIn, ZoomOut, Move, RefreshCw } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Slider } from '@/app/components/ui/slider';
import { useDrop } from 'react-dnd';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/app/components/ui/dialog';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { useFloorplan } from '@/app/context/FloorplanContext';
import { toast } from 'sonner';

const FloorPlan: React.FC = () => {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const [newTable, setNewTable] = useState<{ item: any; x: number; y: number }>({ item: {}, x: 0, y: 0 });
  const [selectedTable, setSelectedTable] = useState<any>(null);
  const [isConfigDialogOpen, setIsConfigDialogOpen] = useState(false);
  const [newTableConfig, setNewTableConfig] = useState({
    tableName: '',
    minCapacity: undefined,
    maxCapacity: undefined,
  });

  const { activeFloorplan, addElement, updateElement } = useFloorplan();

  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: ['NEW_TABLE', 'TABLE'],
      drop: (item: { tableType?: any; id?: string; x?: number; y?: number }, monitor) => {
        // console.log('Drop event triggered with item:', item);

        const containerRect = containerRef.current?.getBoundingClientRect();
        if (!containerRect) {
          // console.log('No container rect found');
          return null;
        }

        const dropOffset = monitor.getClientOffset();
        if (!dropOffset) {
          // console.log('No drop offset found');
          return null;
        }

        // Convert to container coordinates (relative to the container)
        const containerX = dropOffset.x - containerRect.left;
        const containerY = dropOffset.y - containerRect.top;

        // Convert to floor plan coordinates considering current transform
        const floorPlanX = (containerX - position.x) / scale;
        const floorPlanY = (containerY - position.y) / scale;

        // console.log('Drop coordinates:', {
        //   client: { x: dropOffset.x, y: dropOffset.y },
        //   container: { x: containerX, y: containerY },
        //   floorPlan: { x: floorPlanX, y: floorPlanY },
        // });

        // If it's a new table being dropped
        if (item.tableType) {
          // console.log('Dropping new table:', item.tableType);
          if (item.tableType.elementType === 'decorative') {
            // Add the new decorative item
            addElement({
              ...item.tableType,
              x: floorPlanX,
              y: floorPlanY,
              elementImageUrl: item.tableType.elementImageUrl,
              elementType: item.tableType.elementType,
              name: item.tableType.name,
            });
            toast.success(`Added ${item.tableType.name}`);
          } else {
            setNewTable({ item: item.tableType, x: floorPlanX, y: floorPlanY });
            setIsConfigDialogOpen(true);
          }
        } else {
          // console.log('Dropping existing table:', item.id);
          if (item.id) {
            updateElement(item.id, { x: floorPlanX, y: floorPlanY });
          }
        }

        // Return the drop result for both new and existing tables
        const dropResult = {
          id: item.id,
          x: floorPlanX,
          y: floorPlanY,
        };
        // console.log('Returning drop result:', dropResult);
        return dropResult;
      },
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
      }),
    }),
    [position, scale, addElement, updateElement]
  );

  const handleCompleteReservable = () => {
    if (selectedTable) {
      updateElement(selectedTable.id, {
        name: newTableConfig.tableName,
        minCapacity: Number(newTableConfig.minCapacity) || 1,
        maxCapacity: Number(newTableConfig.maxCapacity) || 1,
      });

      toast.success(`Updated ${newTableConfig.tableName}`);
    } else {
      addElement({
        ...newTable.item,
        x: newTable.x,
        y: newTable.y,
        width: newTable.item.width || 60,
        height: newTable.item.height || 60,
        elementType: newTable.item.elementType,
        elementImageUrl: newTable.item.elementImageUrl,
        name: newTableConfig.tableName,
        minCapacity: Number(newTableConfig.minCapacity) || 1,
        maxCapacity: Number(newTableConfig.maxCapacity) || 1,
      });

      setNewTable({ item: {}, x: 0, y: 0 });
      toast.success(`Added ${newTableConfig.tableName}`);
    }
    setIsConfigDialogOpen(false);
    setNewTableConfig({
      tableName: '',
      minCapacity: undefined,
      maxCapacity: undefined,
    });
  };
  // Handle zoom functionality
  const handleZoomIn = () => {
    const newScale = Math.min(scale + 0.1, 3);
    zoomAroundCenter(newScale);
  };

  const handleZoomOut = () => {
    const newScale = Math.max(scale - 0.1, 0.5);
    zoomAroundCenter(newScale);
  };

  const handleResetView = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  // zoom around center to maintain position
  const zoomAroundCenter = (newScale: number) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const viewportCenterX = rect.width / 2;
    const viewportCenterY = rect.height / 2;

    // Calculate the point in floor plan space that's currently at the center of viewport
    const floorPlanCenterX = (viewportCenterX - position.x) / scale;
    const floorPlanCenterY = (viewportCenterY - position.y) / scale;

    // Calculate new position to keep that same point centered after zoom
    const newPositionX = viewportCenterX - floorPlanCenterX * newScale;
    const newPositionY = viewportCenterY - floorPlanCenterY * newScale;

    setScale(newScale);
    setPosition({ x: newPositionX, y: newPositionY });
  };

  // Handle mouse wheel zoom
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    // Handle touchpad gestures (panning)
    if (e.ctrlKey || e.metaKey) {
      setPosition((prev) => ({
        x: prev.x - e.deltaX,
        y: prev.y - e.deltaY,
      }));
      return;
    }

    // Handle mouse wheel zooming
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Calculate the point in floor plan space under the mouse
    const floorPlanX = (mouseX - position.x) / scale;
    const floorPlanY = (mouseY - position.y) / scale;

    // Calculate zoom factor based on wheel delta
    const zoomFactor = 1.1; // 10% zoom per wheel tick
    const newScale =
      e.deltaY < 0
        ? Math.min(scale * zoomFactor, 3) // Zoom in
        : Math.max(scale / zoomFactor, 0.5); // Zoom out

    // Calculate new position to keep mouse over the same point
    const newPositionX = mouseX - floorPlanX * newScale;
    const newPositionY = mouseY - floorPlanY * newScale;

    setScale(newScale);
    setPosition({ x: newPositionX, y: newPositionY });
  };

  // Add effect to prevent browser zoom
  useEffect(() => {
    const preventDefault = (e: Event) => {
      if (containerRef.current?.contains(e.target as Node)) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    };

    const events = [
      'wheel',
      'mousewheel',
      'DOMMouseScroll',
      'touchmove',
      'gesturestart',
      'gesturechange',
      'gestureend',
    ];

    events.forEach((event) => {
      window.addEventListener(event, preventDefault, { passive: false });
      document.addEventListener(event, preventDefault, { passive: false });
    });

    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, preventDefault);
        document.removeEventListener(event, preventDefault);
      });
    };
  }, []);

  // Handle panning functionality
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === containerRef.current || (e.target as HTMLElement).classList.contains('floor-background')) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Handle touch events for mobile
  const touchStartDistance = useRef<number | null>(null);
  const touchStartScale = useRef<number>(1);
  const touchStartPosition = useRef({ x: 0, y: 0 });

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      // Store initial distance between two fingers for pinch zoom
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      touchStartDistance.current = Math.sqrt(dx * dx + dy * dy);
      touchStartScale.current = scale;

      // Calculate midpoint of the two touches
      const midX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
      const midY = (e.touches[0].clientY + e.touches[1].clientY) / 2;

      touchStartPosition.current = { x: midX, y: midY };
    } else if (e.touches.length === 1) {
      // Handle pan
      touchStartPosition.current = {
        x: e.touches[0].clientX - position.x,
        y: e.touches[0].clientY - position.y,
      };
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault(); // Prevent page scrolling

    if (e.touches.length === 2 && touchStartDistance.current !== null) {
      // Handle pinch zoom
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Calculate new scale based on the change in distance
      const newScale = Math.min(Math.max(touchStartScale.current * (distance / touchStartDistance.current), 0.5), 3);

      // Calculate midpoint of the two touches
      const midX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
      const midY = (e.touches[0].clientY + e.touches[1].clientY) / 2;

      // Get container rect
      const rect = containerRef.current?.getBoundingClientRect();
      if (rect) {
        // Calculate the point in floor plan space at the touch midpoint
        const floorPlanX = (midX - rect.left - position.x) / scale;
        const floorPlanY = (midY - rect.top - position.y) / scale;

        // Keep the midpoint stationary during zoom
        const newPositionX = midX - rect.left - floorPlanX * newScale;
        const newPositionY = midY - rect.top - floorPlanY * newScale;

        setScale(newScale);
        setPosition({ x: newPositionX, y: newPositionY });
      }
    } else if (e.touches.length === 1) {
      // Handle pan
      setPosition({
        x: e.touches[0].clientX - touchStartPosition.current.x,
        y: e.touches[0].clientY - touchStartPosition.current.y,
      });
    }
  };

  const handleTouchEnd = () => {
    touchStartDistance.current = null;
  };

  useEffect(() => {
    if (selectedTable) {
      setNewTableConfig({
        tableName: selectedTable.name,
        minCapacity: selectedTable.minCapacity,
        maxCapacity: selectedTable.maxCapacity,
      });

      setIsConfigDialogOpen(true);
    }
  }, [selectedTable]);
  return (
    <>
      <div
        className='w-full h-full bg-transparent border border-gray-800 overflow-hidden relative flex flex-col rounded-lg'
        onWheel={handleWheel}
        ref={containerRef}
        style={{
          touchAction: 'none' as const,
          userSelect: 'none' as const,
          WebkitUserSelect: 'none' as const,
          msUserSelect: 'none' as const,
        }}
      >
        <div className='p-4 bg-transparent'>
          <div className='flex flex-wrap gap-1 justify-between items-center bg-transparent'>
            <div className='text-sm text-muted-foreground flex items-center'>
              <Move size={16} className='mr-1' /> Press Ctrl + Click and drag to move floor plan
            </div>
            <div className='flex items-center gap-1'>
              <Button variant='outline' size='sm' onClick={handleZoomIn}>
                <ZoomIn size={16} />
              </Button>
              <Button variant='outline' size='sm' onClick={handleZoomOut}>
                <ZoomOut size={16} />
              </Button>
              <Button variant='outline' size='sm' onClick={handleResetView}>
                <RefreshCw size={16} />
              </Button>
              <div className='ml-2 flex items-center gap-2'>
                <span className='text-sm text-white'>Zoom:</span>
                <div className='w-24'>
                  <Slider
                    value={[scale * 100]}
                    min={50}
                    max={300}
                    step={10}
                    onValueChange={([value]) => {
                      zoomAroundCenter(value / 100);
                    }}
                  />
                </div>
                <span className='text-sm text-muted-foreground'>{Math.round(scale * 100)}%</span>
              </div>
            </div>
          </div>
        </div>

        <div
          className='relative flex-1 overflow-hidden cursor-move'
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          ref={(node) => {
            containerRef.current = node;
            drop(node);
          }}
        >
          {/* IMPORTANT: Changed to a single div container with relative positioning */}
          <div
            className='absolute inset-0 overflow-visible'
            style={{
              transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
              transformOrigin: '0 0',
            }}
          >
            {/* Background grid */}
            <div
              className='absolute'
              style={{
                backgroundImage: `
              linear-gradient(to right, var(--canvas-grid) 1px, transparent 1px),
              linear-gradient(to bottom, var(--canvas-grid) 1px, transparent 1px)
            `,
                backgroundSize: '20px 20px',
                width: '10000px',
                height: '10000px',
                left: '-5000px',
                top: '-5000px',
                zIndex: 0,
              }}
            />

            {/* Tables container with higher z-index */}
            <div className='absolute' style={{ zIndex: 10 }}>
              {activeFloorplan?.elements.length > 0 &&
                activeFloorplan?.elements.map((table) => (
                  <TableComponent
                    key={table.id}
                    table={table}
                    scale={scale}
                    selectedTable={selectedTable}
                    setSelectedTable={setSelectedTable}
                  />
                ))}
            </div>
          </div>
        </div>

        {/* Debug table count display */}
        <div className='absolute bottom-2 right-2 bg-color-BE963C text-color-222036 font-bold px-2 py-1 text-xs rounded'>
          Total Elements: {activeFloorplan?.elements.length ? activeFloorplan?.elements.length : 0}
        </div>
      </div>

      {/* Configuration Dialog for Reservable Items */}
      <Dialog
        open={isConfigDialogOpen}
        onOpenChange={(e) => {
          setIsConfigDialogOpen(e);
          if (!e) {
            setNewTableConfig({ tableName: '', minCapacity: undefined, maxCapacity: undefined });
            setSelectedTable(null);
          }
        }}
      >
        <DialogContent className='bg-color-D0C17'>
          <DialogHeader>
            <DialogTitle>Configure Table</DialogTitle>
          </DialogHeader>
          <div className='space-y-4 py-4'>
            <div className='space-y-2'>
              <Label htmlFor='tableName'>Table Name</Label>
              <Input
                id='tableName'
                value={newTableConfig.tableName}
                onChange={(e) => setNewTableConfig((prev) => ({ ...prev, tableName: e.target.value }))}
                placeholder='Table Name'
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='minCapacity'>Minimum Capacity</Label>
              <Input
                id='minCapacity'
                type='number'
                value={newTableConfig.minCapacity}
                onChange={(e) => setNewTableConfig((prev) => ({ ...prev, minCapacity: e.target.value }))}
                min={1}
                required
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='maxCapacity'>Maximum Capacity</Label>
              <Input
                id='maxCapacity'
                type='number'
                value={newTableConfig.maxCapacity}
                onChange={(e) => setNewTableConfig((prev) => ({ ...prev, maxCapacity: e.target.value }))}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => {
                setIsConfigDialogOpen(false);
                setNewTableConfig({ tableName: '', minCapacity: undefined, maxCapacity: undefined });
                setSelectedTable(null);
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleCompleteReservable}>{selectedTable ? 'Update Table' : 'Add Table'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FloorPlan;
