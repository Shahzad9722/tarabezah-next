import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { CanvasElement, Floorplan, Restaurant } from '@/app/types';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
import { useLoader } from '@/app/context/loaderContext';

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
    updateElement: (id: string, updates: Partial<CanvasElement>) => void;
    deleteElement: (id: string) => void;
    publishFloorplans: () => void;
    onFloorPlanChange: (floorId: string) => void;
}

const defaultRestaurant: Restaurant = {
    id: uuidv4(),
    name: 'My Restaurant',
    floorplans: [
        {
            id: uuidv4(),
            name: 'Main Dining Room',
            elements: [],
        },
    ],
};

const FloorplanContext = createContext<FloorplanContextType | undefined>(undefined);

export const FloorplanProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [restaurant, setRestaurant] = useState<Restaurant>(defaultRestaurant);
    const [activeFloorplanId, setActiveFloorplanId] = useState<string>('');
    const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
    const { showLoader, hideLoader } = useLoader();

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
            if (!res.ok) throw new Error('Failed to fetch elements');
            const data = await res.json();
            // Transform the response
            return data.elements.map((el: any): CanvasElement => ({
                id: el.guid,
                name: el.name,
                elementImageUrl: el.imageUrl || '❓', // fallback to emoji or default icon
                elementType: el.purpose?.toLowerCase() === 'reservable' ? 'reservable' : 'decorative',
                width: 100,
                height: 100,
                x: el.x || 0,
                y: el.y || 0,
                rotation: el.rotation || 0,
                libraryItemId: el.guid,
                minCapacity: el.minCapacity || 1,
            }));
        },
    });

    const activeFloorplan = restaurant.floorplans.find(fp => fp.id === activeFloorplanId) ?? restaurant.floorplans[0];

    const addFloorplan = (name: string) => {
        const newFloorplan: Floorplan = {
            id: uuidv4(),
            name,
            elements: [],
        };

        setRestaurant(prev => ({
            ...prev,
            floorplans: [...prev.floorplans, newFloorplan],
        }));

        setActiveFloorplanId(newFloorplan.id);
        toast.success(`Created new floorplan: ${name}`);
    };

    const updateFloorplanName = (id: string, name: string) => {
        setRestaurant(prev => ({
            ...prev,
            floorplans: prev.floorplans.map(fp =>
                fp.id === id ? { ...fp, name } : fp
            ),
        }));
    };

    const deleteFloorplan = (id: string) => {
        // Don't delete the last floorplan
        if (restaurant.floorplans.length <= 1) {
            toast.error("Cannot delete the only floorplan");
            return;
        }

        setRestaurant(prev => ({
            ...prev,
            floorplans: prev.floorplans.filter(fp => fp.id !== id),
        }));

        // If deleting the active floorplan, set active to first remaining one
        if (activeFloorplanId === id) {
            const newActiveId = restaurant.floorplans.find(fp => fp.id !== id)?.id;
            if (newActiveId) {
                setActiveFloorplanId(newActiveId);
            }
        }

        toast.success("Floorplan deleted");
    };

    const addElement = (element: Omit<CanvasElement, 'id'>) => {
        if (!activeFloorplan) return;

        const newElement: CanvasElement = {
            ...element,
            id: uuidv4(),
        };

        setRestaurant(prev => {
            const updatedFloorplans = prev.floorplans.map(fp => {
                if (fp.id === (activeFloorplanId || activeFloorplan?.id)) {
                    // Create a NEW array for elements
                    return {
                        ...fp,
                        elements: [...fp.elements, newElement]
                    };
                }
                return fp;
            });

            return { ...prev, floorplans: updatedFloorplans };
        });

        setSelectedElementId(newElement.id);
    };

    const updateElement = (id: string, updates: Partial<CanvasElement>) => {
        if (!activeFloorplan) return;

        setRestaurant(prev => ({
            ...prev,
            floorplans: prev.floorplans.map(fp =>
                fp.id === activeFloorplan?.id
                    ? {
                        ...fp,
                        elements: fp.elements.map(el =>
                            el.id === id ? { ...el, ...updates } : el
                        )
                    }
                    : fp
            ),
        }));
    };

    const deleteElement = (id: string) => {
        if (!activeFloorplan) return;

        setRestaurant(prev => ({
            ...prev,
            floorplans: prev.floorplans.map(fp =>
                fp.id === activeFloorplanId
                    ? { ...fp, elements: fp.elements.filter(el => el.id !== id) }
                    : fp
            ),
        }));

        if (selectedElementId === id) {
            setSelectedElementId(null);
        }
    };

    const publishFloorplans = () => {
        localStorage.setItem('restaurant', JSON.stringify(restaurant));
        toast.success("Floorplans published successfully!");
    };

    const onFloorPlanChange = (floorId: string) => {
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
        updateElement,
        deleteElement,
        publishFloorplans,
        onFloorPlanChange
    };

    useEffect(() => {
        if (fetchingElements) {
            showLoader();
        } else {
            hideLoader();
        }
    }, [fetchingElements]);
    if (isError) return <div>Error: {(error as Error).message}</div>;

    return (
        <FloorplanContext.Provider value={value}>
            {children}
        </FloorplanContext.Provider>
    );
};

export const useFloorplan = () => {
    const context = useContext(FloorplanContext);
    if (context === undefined) {
        throw new Error('useFloorplan must be used within a FloorplanProvider');
    }
    return context;
};
