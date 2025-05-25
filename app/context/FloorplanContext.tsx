import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { CanvasElement, Floorplan, Restaurant } from '@/app/types';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
import { useLoader } from '@/app/context/loaderContext';
import { useDispatch, useSelector, UseSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { setFilters } from '@/store/features/combination-filters/combinationFilterSlice';

interface FloorplanContextType {
  restaurant: Restaurant;
  activeFloorplanId: string;
  selectedElementId: string | null;
  elementLibrary: CanvasElement[];
  activeFloorplan: Floorplan | undefined;

  setRestaurant: (restaurant: Restaurant) => void;
  setActiveFloorplanId: (id: string) => void;
  setSelectedElementId: (id: string | null) => void;
  addFloorplan: (name: string) => void;
  updateFloorplanName: (id: string, name: string) => void;
  deleteFloorplan: (id: string) => void;
  addElement: (element: Omit<CanvasElement, 'id'>) => void;
  removeElement: (elementId: string) => void;
  updateElement: (id: string, updates: Partial<CanvasElement>) => void;
  deleteElement: (id: string) => void;
  publishFloorplans: () => void;
  onFloorPlanChange: (floorId: string) => void;
}

const FloorplanContext = createContext<FloorplanContextType | undefined>(undefined);

export const FloorplanProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [restaurant, setRestaurant] = useState<any>({ id: '', name: '', floorplans: [] });
  const [activeFloorplanId, setActiveFloorplanId] = useState<string>('');
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const { showLoader, hideLoader } = useLoader();
  const selectedFilters = useSelector((state: RootState) => state.combinationFilter.filters);
  const dispatch = useDispatch<AppDispatch>();



  // Load restaurant ID from localStorage on initialization
  useEffect(() => {
    // console.log('useEffect inside context');
    const restaurantId = localStorage.getItem('selected-restaurant-id');
    if (restaurantId) {
      setRestaurant((prev) => ({ ...prev, id: restaurantId }));
    }
  }, []);

  // Fetch dynamic elements
  const {
    isLoading: fetchingElements,
    data: elementLibrary = [],
    isError,
    error,
  } = useQuery<CanvasElement[]>({
    queryKey: ['elements'],
    queryFn: async () => {
      const res = await fetch(`/api/restaurant/elements`);

      if (!res.ok) {
        window.location.href = '/login';
        return [];
      }

      const data = await res.json();

      return data.elements.map(
        (el: any): CanvasElement => ({
          id: el.guid,
          localId: '',
          purpose: el.purpose.toLowerCase() === 'reservable' ? 'reservable' : 'decorative',
          name: el.name,
          elementImageUrl: el.imageUrl || '❓',
          elementType: el.tableType?.toLowerCase(),
          width: el.width || 60,
          height: el.height || 60,
          x: 0,
          y: 0,
          rotation: 0,
          tableId: '',
        })
      );
    },
    enabled: typeof window !== 'undefined' && !!localStorage.getItem('selected-restaurant-id'),
  });

  const activeFloorplan = restaurant.floorplans?.find((fp) => fp.guid === activeFloorplanId);

  const addFloorplan = (name: string) => {
    // console.log('name', name);
    const newFloorplan: Floorplan = {
      guid: uuidv4(),
      name,
      elements: [],
    };

    setActiveFloorplanId(newFloorplan.guid);
    setRestaurant((prev) => ({
      ...prev,
      floorplans: [newFloorplan, ...prev.floorplans],
    }));

    // setActiveFloorplanId(newFloorplan.guid);
    // toast.success(`Created new floorplan: ${name}`);
  };

  const updateFloorplanName = (id: string, name: string) => {
    setRestaurant((prev) => ({
      ...prev,
      floorplans: prev.floorplans.map((fp) => (fp.guid === id ? { ...fp, name } : fp)),
    }));
  };

  const deleteFloorplan = (id: string) => {
    // Don't delete the last floorplan
    if (restaurant.floorplans.length <= 1) {
      toast.error('Cannot delete the only floorplan');
      return;
    }

    setRestaurant((prev) => ({
      ...prev,
      floorplans: prev.floorplans.filter((fp) => fp.guid !== id),
    }));

    // If deleting the active floorplan, set active to first remaining one
    if (activeFloorplanId === id) {
      const newActiveId = restaurant.floorplans.find((fp) => fp.guid !== id)?.guid;
      if (newActiveId) {
        setActiveFloorplanId(newActiveId);
      }
    }

    toast.success('Floorplan deleted');
  };

  const addElement = (element: Omit<CanvasElement, 'id'>) => {
    if (!activeFloorplan) return;

    // Ensure width and height are integers
    const roundedElement = {
      ...element,
      width: Math.round(element.width),
      height: Math.round(element.height),
    };

    setRestaurant((prev) => {
      const updatedFloorplans = prev.floorplans.map((fp) => {
        if (fp.guid === (activeFloorplanId || activeFloorplan?.guid)) {
          // Create a NEW array for elements
          return {
            ...fp,
            elements: [...fp.elements, roundedElement],
          };
        }
        return fp;
      });

      return { ...prev, floorplans: updatedFloorplans };
    });

    setSelectedElementId(element.localId);
  };

  const removeElement = (elementId: string) => {
    if (!activeFloorplan) return;

    setRestaurant((prev) => {
      const updatedFloorplans = prev.floorplans.map((fp) => {
        if (fp.guid === (activeFloorplanId || activeFloorplan?.guid)) {
          return {
            ...fp,
            elements: fp.elements.filter((el) => el.localId !== elementId),
          };
        }
        return fp;
      });

      return { ...prev, floorplans: updatedFloorplans };
    });
  };

  const updateElement = (id: string, updates: Partial<CanvasElement>) => {
    if (!activeFloorplan) return;
    // Ensure width and height are integers if present
    const roundedUpdates = {
      ...updates,
      width: updates.width !== undefined ? Math.round(updates.width) : updates.width,
      height: updates.height !== undefined ? Math.round(updates.height) : updates.height,
    };
    setRestaurant(prev => {
      const updated = {
        ...prev,
        floorplans: prev.floorplans.map(fp =>
          fp.guid === activeFloorplan?.guid
            ? {
              ...fp,
              elements: fp.elements.map(el =>
                el.localId === id ? { ...el, ...roundedUpdates } : el
              ),
            }
            : fp
        ),
      };
      return updated;
    });

    setSelectedElementId(null);
  };

  const deleteElement = (id: string) => {
    if (!activeFloorplan) return;

    setRestaurant((prev) => ({
      ...prev,
      floorplans: prev.floorplans.map((fp) =>
        fp.guid === activeFloorplanId ? { ...fp, elements: fp.elements.filter((el) => el.localId !== id) } : fp
      ),
    }));

    if (selectedElementId === id) {
      setSelectedElementId(null);
    }
  };

  const publishFloorplans = () => {
    // localStorage.setItem('restaurant', JSON.stringify(restaurant));
    dispatch(setFilters({ ...selectedFilters, floorPlanId: activeFloorplanId }));
    toast.success('Floorplans published successfully!');
  };

  const onFloorPlanChange = (floorId: string) => {
    // console.log('floorId', floorId);
    setActiveFloorplanId(floorId);
  };

  const value = {
    restaurant,
    activeFloorplanId,
    selectedElementId,
    elementLibrary,
    activeFloorplan,

    setRestaurant,
    setActiveFloorplanId,
    setSelectedElementId,
    addFloorplan,
    updateFloorplanName,
    deleteFloorplan,
    addElement,
    removeElement,
    updateElement,
    deleteElement,
    publishFloorplans,
    onFloorPlanChange,
  };

  useEffect(() => {
    if (fetchingElements) {
      showLoader();
    } else {
      hideLoader();
    }
  }, [fetchingElements]);
  if (isError) return <div>Error: {(error as Error).message}</div>;

  return <FloorplanContext.Provider value={value}>{children}</FloorplanContext.Provider>;
};

export const useFloorplan = () => {
  const context = useContext(FloorplanContext);
  if (context === undefined) {
    throw new Error('useFloorplan must be used within a FloorplanProvider');
  }
  return context;
};