import React, { useEffect, useRef, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { MultiBackend } from 'react-dnd-multi-backend';
import { TouchTransition, MouseTransition } from 'react-dnd-multi-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import { HTML5Backend } from 'react-dnd-html5-backend';
import FloorPlan from './FloorPlan';
import { RestaurantProvider } from '@/app/context/RestaurantContext';
import ReservationSidebar from './ReservationSidebar';
import Navigation from '../navigation/Navigation';
import { FloorControls } from '../FloorControls';
import { toast } from 'sonner';
import { useFloorplan } from '@/app/context/FloorplanContext';
import { useQuery } from '@tanstack/react-query';
import { useMutation } from '@tanstack/react-query';
import { Floor, Floorplan } from '@/app/types';
import { v4 as uuidv4 } from 'uuid';
import { queryClient } from '@/app/lib/queryClient';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import { setFilters } from '@/store/features/combination-filters/combinationFilterSlice';

const RestaurantLayout: React.FC = () => {
  const { setActiveFloorplanId, activeFloorplanId, restaurant, setRestaurant, elementLibrary } = useFloorplan();
  const selectedFilters = useSelector((state: RootState) => state.combinationFilter.filters);
  const dispatch = useDispatch();

  // Track last published floorplans for change detection
  const [lastPublishedFloorplans, setLastPublishedFloorplans] = useState<Floorplan[]>([]);
  // Helper: deep compare two floorplan arrays
  function deepEqual(a: any, b: any) {
    return JSON.stringify(a) === JSON.stringify(b);
  }
  const hasUnsavedChanges = !deepEqual(restaurant.floorplans, lastPublishedFloorplans);

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
      return data.floorPlans?.reverse();
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
    // console.log('floorplans', floorPlans.length);
    if (floorPlans.length > 0) {
      const result: Floorplan[] = floorPlans.map((floor: Floor) => ({
        guid: floor.guid,
        name: floor.name,
        elements: floor.elements.map((element: any) => ({
          floorplanInstanceGuid: element.guid,
          id: element.elementGuid,
          localId: uuidv4(),
          tableId: element.tableId,
          purpose: elementLibrary.find((item) => item.id === element.elementGuid)?.purpose,
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

      // After mapping result, ensure active floor is valid
      let newActiveFloorplanId = activeFloorplanId;
      if (!result.some(fp => fp.guid === activeFloorplanId)) {
        // Try to match by name if GUIDs changed
        const oldFloor = restaurant.floorplans.find(fp => fp.guid === activeFloorplanId);
        const matchByName = oldFloor && result.find(fp => fp.name === oldFloor.name);
        newActiveFloorplanId = matchByName ? matchByName.guid : result[0]?.guid;
      }
      setActiveFloorplanId(newActiveFloorplanId);
      dispatch(setFilters({ ...selectedFilters, floorPlanId: newActiveFloorplanId }));
      setRestaurant({
        ...restaurant,
        floorplans: [...result],
      });
      setLastPublishedFloorplans(result);
    }
  }, [floorPlans]);

  const removeFloor = (id: string) => {
    // if (restaurant.floorplans.length <= 1) {
    //   toast.error('Cannot remove the last floor');
    //   return;
    // }
    const floor = restaurant.floorplans.find((floor) => floor.guid === id);
    if (floor) {
      setRestaurant({
        ...restaurant,
        floorplans: [...restaurant.floorplans.filter((floor) => floor.guid !== id)],
      });

      setActiveFloorplanId(
        restaurant.floorplans[0].guid === id ? restaurant.floorplans[1].guid : restaurant.floorplans[0].guid
      );
    }
    toast.success('Floor deleted');
  };

  const renameFloor = (id: string, newName: string) => {
    const floor = restaurant.floorplans.find((floor) => floor.guid === id);
    if (floor) {
      setRestaurant({
        ...restaurant,
        floorplans: [
          ...restaurant.floorplans.map((floor) => (floor.guid === id ? { ...floor, name: newName } : floor)),
        ],
      });

      toast.success('Floor renamed');
    }
  };

  const handlePublish = async () => {
    const toastId = toast.loading('Publishing floor plan...');
    try {
      const floorsToPublish = restaurant.floorplans.map((floor) => ({
        guid: floor.guid || '00000000-0000-0000-0000-000000000000',
        name: floor.name,
        elements: floor.elements.map((item) => ({
          guid: item.floorplanInstanceGuid || '00000000-0000-0000-0000-000000000000',
          elementGuid: item.id,
          tableId: item.tableId,
          elementName: item.tableId,
          minCapacity: item.minCapacity,
          maxCapacity: item.maxCapacity,
          width: item.width || 60,
          height: item.height || 60,
          x: parseInt(item.x?.toString(), 10),
          y: parseInt(item.y?.toString(), 10),
          rotation: 0,
        })),
      }));

      const res = await publishFloorPlans(floorsToPublish);
      if (!res.ok) {
        throw new Error('Failed to publish floor plan');
      }

      toast.dismiss(toastId); // Remove loading
      toast.success('Floor plan published successfully!'); // Show success

      queryClient.invalidateQueries({ queryKey: ['floorPlans'] });
      setLastPublishedFloorplans(JSON.parse(JSON.stringify(restaurant.floorplans)));
    } catch (error) {
      toast.dismiss(toastId); // Remove loading
      toast.error('Failed to publish floor plan'); // Show error
      console.error('Publish error:', error);
    }
  };


  const HTML5toTouch = {
    backends: [
      {
        backend: HTML5Backend,
        transition: MouseTransition,
      },
      {
        backend: TouchBackend,
        options: { enableMouseEvents: true },
        preview: true,
        transition: TouchTransition,
      },
    ],
  };

  // console.log('restaurant.floorplans', restaurant.floorplans);
  return (

    <DndProvider backend={MultiBackend} options={HTML5toTouch}>
      <RestaurantProvider>
        <div className='flex flex-col'>
          <Navigation onPublish={handlePublish} disabled={!hasUnsavedChanges || publishingFloorPlans} />
          <div className='flex flex-1 overflow-hidden h-[calc(100vh-188px)]'>
            <div className='w-[400px] ml-4 h-[calc(100vh-188px)] flex flex-col'>
              <FloorControls onRemoveFloor={removeFloor} onRenameFloor={renameFloor} />
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
