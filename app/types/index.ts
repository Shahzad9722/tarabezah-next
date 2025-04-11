
export type ElementType = 'reservable' | 'decorative';

export interface ElementLibraryItem {
    id: string;
    name: string;
    type: ElementType;
    icon: string;
    defaultWidth: number;
    defaultHeight: number;
}

export interface CanvasElement {
    id: string;
    libraryItemId: string;
    elementType: ElementType;
    x: number;
    y: number;
    width: number;
    height: number;
    name?: string;
    minCapacity?: number;
    maxCapacity?: number;
    rotation?: number;
    tableId?: string;
    elementImageUrl?: string;
}

export interface Floorplan {
    id: string;
    name: string;
    elements: CanvasElement[];
}

export interface Restaurant {
    id: string;
    name: string;
    floorplans: Floorplan[];
}
