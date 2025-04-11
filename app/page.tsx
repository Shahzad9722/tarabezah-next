'use client';

import { useEffect, useState } from 'react';
import { SidebarProvider } from '@/app/components/ui/sidebar';
import { FurnitureLibrary } from '@/app/components/FurnitureLibrary';
import { FloorControls } from '@/app/components/FloorControls';
import { FloorplanCanvas, FloorplanItem } from '@/app/components/FloorplanCanvas';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
// Updated code snippet
import { ElementProperties } from '@/app/components/ElementProperties';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/app/components/ui/resizable';
import { ElementLibrary } from '@/app/components/ElementLibrary';
import { FloorplanTabs } from '@/app/components/FloorplanTabs';
import { Canvas } from '@/app/components/Canvas';
import { useFloorplan } from '@/app/context/FloorplanContext';


import Navigation from '@/app/components/navigation/Navigation';

import { publishCanvas } from '@/app/services/canvasApi';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Restaurant, Floorplan } from './types';
import { table } from 'console';

export interface Floor {
  name: string;
  guid: string;
  elements: FloorplanItem[];
}

const Home = () => {
  const [activeCategory, setActiveCategory] = useState('tables');
  const [floors, setFloors] = useState<Floor[]>([]);
  const [activeFloorIndex, setActiveFloorIndex] = useState(0);
  const [activeFloorGuid, setActiveFloorGuid] = useState(floors[0]?.guid || '');
  const [activeFloorElements, setActiveFloorElements] = useState<FloorplanItem[] | undefined>();

  const {
    setActiveFloorplanId,
    setRestaurant,
    restaurant,
  } = useFloorplan();


  const [dragItem, setDragItem] = useState<any>(null);

  const { isLoading: fetchingFloorPlans, data: floorPlans = [] } = useQuery({
    queryKey: ['floorPlans'],
    queryFn: async () => {
      const res = await fetch(`/api/restaurant/floorplans`);
      if (!res.ok) throw new Error('Failed to fetch filters');
      const data = await res.json();
      return data.floorPlans;
    },
  });

  const { mutateAsync: publishFloorPlans, isPending: publishingFloorPlans } = useMutation({
    mutationFn: (data: any[]) => {
      return fetch(`/api/restaurant/floorplans`, {
        method: 'post',
        body: JSON.stringify(data),
      });
    },
  });

  useEffect(() => {
    if (floorPlans.length > 0) {
      const result: Floorplan[] = floorPlans.map((floor: Floor) => ({
        id: floor.guid,
        name: floor.name,
        elements: floor.elements.map((element: any) => ({
          id: element.guid,
          libraryItemId: element.elementGuid, // 🔁 use the correct key
          type: 'reservable', // or decide based on `elementType`
          name: element.elementName,
          minCapacity: element?.minCapacity,
          maxCapacity: element?.maxCapacity,
          x: element?.x,
          y: element?.y,
          tableId: element?.tableId,
          width: 50,  // Provide a default or map if you have
          height: 50, // Provide a default or map if you have
          rotation: element?.rotation,
        })),
      }));


      // setActiveFloorplanId(result[0].id);


      setRestaurant({
        ...restaurant,
        floorplans: [...result],
      });



      setFloors(floorPlans);
    }
  }, [floorPlans]);

  // Get current floor
  const activeFloor = floors[activeFloorIndex];
  const items = activeFloor?.elements || [];

  // Handle floor operations
  const addNewFloor = () => {
    const newFloor: Floor = {
      guid: '',
      name: `Floor`,
      elements: [],
    };
    setFloors([...floors, newFloor]);
    setActiveFloorIndex(floors.length);
    toast.success(`Addedeee ${newFloor.name}`);
  };

  const removeFloor = (index: number) => {
    if (floors.length <= 1) {
      toast.error('Cannot remove the last floor');
      return;
    }
    const updatedFloors = floors.filter((_, i) => i !== index);
    setFloors(updatedFloors);
    if (activeFloorIndex >= updatedFloors.length) {
      setActiveFloorIndex(updatedFloors.length - 1);
    }
    toast.success('Floor removed');
  };

  const renameFloor = (index: number, newName: string) => {
    const updatedFloors = [...floors];
    updatedFloors[index] = { ...updatedFloors[index], name: newName };
    setFloors(updatedFloors);
    toast.success('Floor renamed');
  };

  // Handle drag events
  const handleDragStart = (item: any) => {
    setDragItem(item);
  };

  const handleDragEnd = () => {
    setDragItem(null);
  };



  // Handle canvas drop
  const handleCanvasDrop = (x: number, y: number, item: any) => {
    // console.log('item drop', item);
    const newId = uuidv4();

    const newItem: FloorplanItem = {
      guid: newId,
      elementGuid: item.guid,
      elementImageUrl: item.imageUrl,
      elementName: item.name,
      maxCapacity: item.maxCapacity || 0,
      minCapacity: item.minCapacity || 0,
      tableId: item.tableNumber || '',
      elementType: item.tableType || '',
      category: '',
      x,
      y,
      width: item.width || 100,
      height: item.height || 100,
      rotation: 0,
    };

    const updatedFloors = [...floors];
    updatedFloors[activeFloorIndex].elements = [...items, newItem];
    setFloors(updatedFloors);
    toast.success(`Added ${dragItem.name}`);
    handleDragEnd();
  };


  // Publish canvas data to API
  const handlePublish = async () => {
    const toastId = toast.loading('Publishing floor plan...');
    try {
      const floorsToPublish = restaurant.floorplans.map((floor) => ({
        name: floor.name,
        restaurantGuid: restaurant.id,
        elements: floor.elements.map((item) => ({
          elementGuid: item.id,
          tableId: item.name,
          minCapacity: item.minCapacity,
          maxCapacity: item.maxCapacity,
          x: item.x,
          y: item.y,
          rotation: 0
        })),
      }));
      await publishFloorPlans(floorsToPublish);
      toast.success('Floor plan published successfully!');
    } catch (error) {
      toast.error('Failed to publish floor plan');
      console.error('Publish error:', error);
    } finally {
      toast.dismiss(toastId);
    }
  };

  // floor plan select handle
  const handleFloorPlanSelect = (guid: string) => {
    const selectedFloor = floors.find((floor) => floor.guid === guid);
    if (selectedFloor) {
      setActiveFloorplanId(guid)
    }
  };

  return (
    <div className='wrapper p-6 pb-3 bg-[#121020]' onDragOver={(e) => e.preventDefault()}>
      <Navigation onPublish={handlePublish} />
      <FloorControls
        floors={floors}
        activeFloorIndex={activeFloorIndex}
        onFloorChange={handleFloorPlanSelect}
        onAddFloor={addNewFloor}
        onRemoveFloor={removeFloor}
        onRenameFloor={renameFloor}
      />


      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel defaultSize={20} minSize={15} maxSize={30} className='card-gradient'>
            <div className="h-full flex flex-col p-4 gap-4 overflow-auto">
              <ElementLibrary />
              <div className="mt-auto card-gradient">
                <ElementProperties />
              </div>
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle />

          <ResizablePanel defaultSize={80}>
            <div className="h-full flex flex-col p-4 gap-4">
              <FloorplanTabs />
              <div className="flex-1">
                <Canvas />
              </div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default Home;
