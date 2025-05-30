"use client"
import React, { useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import FloorPlan from '../components/floorplan/FloorPlan';
import { RestaurantProvider } from '@/app/context/RestaurantContext';
import ReservationSidebar from '../components/floorplan/ReservationSidebar';
import Navigation from '../components/navigation/Navigation';
import { FloorControls } from '../components/FloorControls';
import { toast } from 'sonner';
import { useFloorplan } from '@/app/context/FloorplanContext';
import { useQuery } from '@tanstack/react-query';
import { useMutation } from '@tanstack/react-query';
import { Floor, Floorplan } from '@/app/types';
import { v4 as uuidv4 } from 'uuid';
import { queryClient } from '@/app/lib/queryClient';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import Waitlist from '../components/waitlist/Waitlist';

const RestaurantLayout: React.FC = () => {
  const { setActiveFloorplanId, restaurant, setRestaurant, elementLibrary } = useFloorplan();
  const selectedFilters = useSelector((state: RootState) => state.combinationFilter.filters);

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

      setActiveFloorplanId(selectedFilters.floorPlanId || result[0].guid);

      setRestaurant({
        ...restaurant,
        floorplans: [...result],
      });
    }
  }, [floorPlans]);

  const removeFloor = (id: string) => {
    if (restaurant.floorplans.length <= 1) {
      toast.error('Cannot remove the last floor');
      return;
    }
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
    toast.success('Floor removed');
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
          x: parseInt(item.x?.toString(), 10),
          y: parseInt(item.y?.toString(), 10),
          rotation: 0,
        })),
      }));

      console.log('floorsToPublish', floorsToPublish);

      const res = await publishFloorPlans(floorsToPublish);
      if (!res.ok) {
        throw new Error('Failed to publish floor plan');
      }
      toast.success('Floor plan published successfully!');

      queryClient.invalidateQueries({ queryKey: ['floorPlans'] });
    } catch (error) {
      toast.error('Failed to publish floor plan');
      console.error('Publish error:', error);
    } finally {
      toast.dismiss(toastId);
    }
  };

  // console.log('restaurant.floorplans', restaurant.floorplans);
  return (
    <DndProvider backend={HTML5Backend}>
      <RestaurantProvider>
        <div className='flex flex-col'>
          <Navigation onPublish={handlePublish} />
          <div className='flex flex-1 overflow-hidden h-[calc(100vh-188px)]'>
            <div className='w-[400px] ml-4 h-[calc(100vh-188px)] flex flex-col'>
              <FloorControls onRemoveFloor={removeFloor} onRenameFloor={renameFloor} />
              {/* <ReservationSidebar /> */}
              <Waitlist/>
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
