
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { CanvasElement, ElementLibraryItem, Floorplan, Restaurant } from '@/app/types';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';

interface FloorplanContextType {
    restaurant: Restaurant;
    activeFloorplanId: string;
    selectedElementId: string | null;
    elementLibrary: ElementLibraryItem[];
    activeFloorplan: Floorplan | undefined;

    // Actions
    setActiveFloorplanId: (id: string) => void;
    setSelectedElementId: (id: string | null) => void;
    addFloorplan: (name: string) => void;
    updateFloorplanName: (id: string, name: string) => void;
    deleteFloorplan: (id: string) => void;
    addElement: (element: Omit<CanvasElement, 'id'>) => void;
    updateElement: (id: string, updates: Partial<CanvasElement>) => void;
    deleteElement: (id: string) => void;
    publishFloorplans: () => void;
}

const defaultElementLibrary: ElementLibraryItem[] = [
    {
        id: 'table-round',
        name: 'Round Table',
        type: 'reservable',
        icon: '🔘',
        defaultWidth: 100,
        defaultHeight: 100,
    },
    {
        id: 'table-rect',
        name: 'Rectangular Table',
        type: 'reservable',
        icon: '🔲',
        defaultWidth: 120,
        defaultHeight: 80,
    },
    {
        id: 'chair',
        name: 'Chair',
        type: 'reservable',
        icon: '🪑',
        defaultWidth: 50,
        defaultHeight: 50,
    },
    {
        id: 'plant',
        name: 'Plant',
        type: 'decorative',
        icon: '🪴',
        defaultWidth: 60,
        defaultHeight: 60,
    },
    {
        id: 'wall',
        name: 'Wall',
        type: 'decorative',
        icon: '🧱',
        defaultWidth: 200,
        defaultHeight: 20,
    },
    {
        id: 'bar',
        name: 'Bar',
        type: 'decorative',
        icon: '🍸',
        defaultWidth: 200,
        defaultHeight: 80,
    },
    {
        id: 'sofa',
        name: 'Sofa',
        type: 'reservable',
        icon: '🛋️',
        defaultWidth: 150,
        defaultHeight: 60,
    },
    {
        id: 'door',
        name: 'Door',
        type: 'decorative',
        icon: '🚪',
        defaultWidth: 80,
        defaultHeight: 20,
    },
];

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
    const [activeFloorplanId, setActiveFloorplanId] = useState<string>(restaurant.floorplans[0].id);
    const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
    const [elementLibrary] = useState<ElementLibraryItem[]>(defaultElementLibrary);

    const activeFloorplan = restaurant.floorplans.find(fp => fp.id === activeFloorplanId);

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

        setRestaurant(prev => ({
            ...prev,
            floorplans: prev.floorplans.map(fp =>
                fp.id === activeFloorplanId
                    ? { ...fp, elements: [...fp.elements, newElement] }
                    : fp
            ),
        }));

        setSelectedElementId(newElement.id);
    };

    const updateElement = (id: string, updates: Partial<CanvasElement>) => {
        if (!activeFloorplan) return;

        setRestaurant(prev => ({
            ...prev,
            floorplans: prev.floorplans.map(fp =>
                fp.id === activeFloorplanId
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
        // In a real application, this would save to a database
        // For now, we'll just log to the console and show a toast


        // Save to localStorage as demo persistence
        localStorage.setItem('restaurant', JSON.stringify(restaurant));

        toast.success("Floorplans published successfully!");
    };

    const value = {
        restaurant,
        activeFloorplanId,
        selectedElementId,
        elementLibrary,
        activeFloorplan,

        setActiveFloorplanId,
        setSelectedElementId,
        addFloorplan,
        updateFloorplanName,
        deleteFloorplan,
        addElement,
        updateElement,
        deleteElement,
        publishFloorplans,
    };

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
