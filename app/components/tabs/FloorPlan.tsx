'use client';

import { DndContext, DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { Canvas } from '@/app/components/canvas/Canvas';
import FurnitureSidebar from '@/app/components/sidebar/FurnitureSidebar';
import FloorSelector from '@/app/components/floor/FloorSelector';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import type { FurnitureItem, Floor } from '@/app/types/furniture';
import { ZoomIn, ZoomOut, MoveHorizontal } from 'lucide-react';
import { Button } from '@/app/components/ui/button';

interface FloorPlanProps {
  placedItems: FurnitureItem[];
  setPlacedItems: React.Dispatch<React.SetStateAction<FurnitureItem[]>>;
  onDragStart: (event: DragStartEvent) => void;
  onDragEnd: (event: DragEndEvent) => void;
  floors: Floor[];
  selectedFloor: number;
  setSelectedFloor: (floorId: number) => void;
  onAddFloor: (name: string) => void;
}

export default function FloorPlan({
  placedItems,
  setPlacedItems,
  onDragStart,
  onDragEnd,
  floors,
  selectedFloor,
  setSelectedFloor,
  onAddFloor,
}: FloorPlanProps) {
  // Filter items for the current floor
  const currentFloorItems = placedItems.filter((item) => item.floorId === selectedFloor);

  return (
    <>
      <div className='mb-5'>
        <FloorSelector
          floors={floors}
          selectedFloor={selectedFloor}
          onFloorChange={setSelectedFloor}
          onAddFloor={onAddFloor}
        />
      </div>
      <div className='flex flex-col md:flex-row flex-1 gap-4 overflow-hidden bg-[#121020]'>
        <DndContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
          <FurnitureSidebar />

          <main className='flex-1 relative'>
            <TransformWrapper initialScale={1} minScale={1} maxScale={2} centerOnInit panning={{ disabled: true }}>
              {({ zoomIn, zoomOut, resetTransform }) => (
                <>
                  <div className='absolute top-4 right-4 flex gap-2 z-10'>
                    <Button
                      variant='outline'
                      size='icon'
                      onClick={() => zoomIn()}
                      className='bg-background/80 backdrop-blur-sm text-[#B98858]'
                    >
                      <ZoomIn className='h-4 w-4' />
                    </Button>
                    <Button
                      variant='outline'
                      size='icon'
                      onClick={() => zoomOut()}
                      className='bg-background/80 backdrop-blur-sm text-[#B98858]'
                    >
                      <ZoomOut className='h-4 w-4' />
                    </Button>
                    <Button
                      variant='outline'
                      size='icon'
                      onClick={() => resetTransform()}
                      className='bg-background/80 backdrop-blur-sm text-[#B98858]'
                    >
                      <MoveHorizontal className='h-4 w-4' />
                    </Button>
                  </div>
                  <TransformComponent
                    wrapperClass='!w-full !h-full !min-h-[500px] !md:min-h-0'
                    contentClass='!w-full !h-full !min-h-[500px] !md:min-h-0'
                  >
                    <Canvas placedItems={currentFloorItems} setPlacedItems={setPlacedItems} />
                  </TransformComponent>
                </>
              )}
            </TransformWrapper>
          </main>
        </DndContext>
      </div>
    </>
  );
}
