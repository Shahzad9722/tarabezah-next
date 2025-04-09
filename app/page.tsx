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


import Navigation from '@/app/components/navigation/Navigation';

import { publishCanvas } from '@/app/services/canvasApi';
import { useMutation, useQuery } from '@tanstack/react-query';

export interface Floor {
  name: string;
  guid: string;
  elements: FloorplanItem[];
}

const Home = () => {
  const [activeCategory, setActiveCategory] = useState('tables');
  const [floors, setFloors] = useState<Floor[]>([]);
  const [activeFloorIndex, setActiveFloorIndex] = useState(0);

  const [dragItem, setDragItem] = useState<any>(null);

  const [isPublishing, setIsPublishing] = useState(false);

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
    toast.success(`Added ${newFloor.name}`);
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

  // Add a new furniture item to the canvas
  const handleItemSelect = (itemData: any) => {
    console.log('itemData', itemData);
    // const newItem: FloorplanItem = {
    //   guid: "",
    //   type: itemData.id,
    //   category,
    //   x: 100,
    //   y: 100,
    //   width: itemData.width,
    //   height: itemData.height,
    //   rotation: 0,
    // };

    // const updatedFloors = [...floors];
    // updatedFloors[activeFloorIndex].items = [...items, newItem];
    // setFloors(updatedFloors);

    toast.success(`Added ${itemData.name}`);
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

  // Update items for the current floor
  const handleItemsChange = (updatedItems: FloorplanItem[]) => {
    // const updatedFloors = [...floors];
    // updatedFloors[activeFloorIndex].items = updatedItems;
    // setFloors(updatedFloors);
  };

  // Publish canvas data to API
  const handlePublish = async () => {
    try {
      setIsPublishing(true);

      const floorsToPublish = floors.map((floor) => ({
        name: floor.name,
        elements: floor.elements.map((item) => ({
          elementGuid: item.elementGuid,
          tableId: item.tableId,
          minCapacity: item.minCapacity,
          maxCapacity: item.maxCapacity,
          x: item.x,
          y: item.y,
          rotation: item.rotation,
        })),
      }));

      await publishFloorPlans(floorsToPublish);
      // Prepare the data according to the required format
      // const allItems = floors.flatMap((floor, floorIndex) =>
      //   floor.items.map((item) => ({
      //     id: item.id,
      //     type: item.type,
      //     x: item.x,
      //     y: item.y,
      //     floorId: floorIndex + 1, // Using index+1 as floorId for simplicity
      //     rotation: item.rotation,
      //     scale: 1, // Default scale
      //     label: `${item.category.charAt(0).toUpperCase() + item.category.slice(1)} (${item.type.split('-')[1] || ''})`
      //       .replace(/-/g, ' ')
      //       .trim(),
      //     imagePath: `/images/elements/${item.type}.svg`, // Example path format
      //     status: 'Upcoming', // Default status
      //   }))
      // );

      // const canvasData: any = {
      //   items: allItems,
      // };

      // // Post data to API
      // await publishCanvas(canvasData);

      toast.success('Floor plan published successfully!');
      // console.log('Published canvas data:', canvasData);
    } catch (error) {
      toast.error('Failed to publish floor plan');
      console.error('Publish error:', error);
    } finally {
      setIsPublishing(false);
    }
  };

  // console.log('items', items);
  // console.log('dragItem', dragItem);
  // console.log('floors[active]', floors[activeFloorIndex]);
  // console.log('floors', floors);
  return (
    <div className='wrapper p-6 pb-3 bg-[#121020]' onDragOver={(e) => e.preventDefault()}>
      <Navigation onPublish={handlePublish} />
      <FloorControls
        floors={floors}
        activeFloorIndex={activeFloorIndex}
        onFloorChange={setActiveFloorIndex}
        onAddFloor={addNewFloor}
        onRemoveFloor={removeFloor}
        onRenameFloor={renameFloor}
      />


      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
            <div className="h-full flex flex-col p-4 gap-4 overflow-auto">
              <ElementLibrary />
              <div className="mt-auto">
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
