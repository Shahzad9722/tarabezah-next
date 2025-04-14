import React, { useEffect, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import FloorPlan from './FloorPlan';
import { RestaurantProvider } from '@/app/context/RestaurantContext';
import ReservationSidebar from './ReservationSidebar';
import Navigation from '../navigation/NewNavigation';
import { FloorControls } from '../NewFloorControls';
import { toast } from 'sonner';
import { useFloorplan } from '@/app/context/FloorplanContext';
import { useQuery } from '@tanstack/react-query';
import { useMutation } from '@tanstack/react-query';
import { Floor, Floorplan } from '@/app/types';

const RestaurantLayout: React.FC = () => {
  const [activeFloorIndex, setActiveFloorIndex] = useState(0);
  const [floors, setFloors] = useState<Floor[]>([]);
  // const [isConfigDialogOpen, setIsConfigDialogOpen] = useState(false);
  // const [newTable, setNewTable] = useState<{ item: any; x: number; y: number }>({ item: {}, x: 0, y: 0 });

  const { setActiveFloorplanId, setRestaurant, restaurant } = useFloorplan();

  const { isLoading: fetchingFloorPlans, data: floorPlans = [] } = useQuery({
    queryKey: ['floorPlans'],
    queryFn: async () => {
      const restaurantId = typeof window !== 'undefined' ? localStorage.getItem('selected-restaurant-id') : null;
      if (!restaurantId) {
        throw new Error('No restaurant selected');
      }
      const res = await fetch(`/api/restaurant/floorplans?restaurantId=${restaurantId}`);
      if (!res.ok) throw new Error('Failed to fetch filters');
      const data = await res.json();
      return data.floorPlans;
    },
    enabled: typeof window !== 'undefined' && !!localStorage.getItem('selected-restaurant-id'), // Only run the query when we have a restaurantId
  });

  const { mutateAsync: publishFloorPlans, isPending: publishingFloorPlans } = useMutation({
    mutationFn: (data: any[]) => {
      const restaurantId = typeof window !== 'undefined' ? localStorage.getItem('selected-restaurant-id') : null;
      if (!restaurantId) {
        throw new Error('No restaurant selected');
      }
      return fetch(`/api/restaurant/floorplans?restaurantId=${restaurantId}`, {
        method: 'post',
        body: JSON.stringify(data),
      });
    },
  });

  useEffect(() => {
    if (floorPlans.length > 0) {
      const result: Floorplan[] = floorPlans.map((floor: Floor) => ({
        guid: floor.guid,
        name: floor.name,
        elements: floor.elements.map((element: any) => ({
          id: element.elementGuid,
          elementType: element.elementType,
          name: element.elementName,
          minCapacity: element.minCapacity,
          maxCapacity: element.maxCapacity,
          x: element.x,
          y: element.y,
          width: element.width || 60,
          height: element.height || 60,
          rotation: element.rotation,
          elementImageUrl: element.elementImageUrl,
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

  // Publish canvas data to API
  const handlePublish = async () => {
    // console.log('restaurant.floorplans', restaurant.floorplans);
    const toastId = toast.loading('Publishing floor plan...');
    try {
      const floorsToPublish = restaurant.floorplans.map((floor) => ({
        name: floor.name,
        restaurantGuid: restaurant.id,
        elements: floor.elements.map((item) => ({
          elementGuid: item.libraryItemId || item.id,
          tableId: item.name,
          minCapacity: item.minCapacity,
          maxCapacity: item.maxCapacity,
          x: parseInt(item.x?.toString(), 10),
          y: parseInt(item.y?.toString(), 10),
          rotation: 0,
        })),
      }));
      const res = await publishFloorPlans(floorsToPublish);
      if (!res.ok) {
        throw new Error('Failed to publish floor plan');
      }
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
      setActiveFloorplanId(guid);
    }
  };

  // console.log('restaurant', restaurant.floorplans);
  return (
    <DndProvider backend={HTML5Backend}>
      <RestaurantProvider>
        <div className='flex flex-col'>
          <Navigation onPublish={handlePublish} />
          <div className='flex flex-1 overflow-hidden h-[calc(100vh-188px)]'>
            <div className='w-80 ml-4 h-[calc(100vh-188px)] flex flex-col'>
              <FloorControls
                floors={restaurant.floorplans}
                activeFloorIndex={activeFloorIndex}
                onFloorChange={handleFloorPlanSelect}
                onRemoveFloor={removeFloor}
                onRenameFloor={renameFloor}
              />
              <ReservationSidebar />
            </div>
            <div className='flex-1 p-4 pt-0 overflow-hidden h-[calc(100vh-188px)]'>
              <FloorPlan />
            </div>
          </div>
        </div>
      </RestaurantProvider>
    </DndProvider>
  );
};

export default RestaurantLayout;
