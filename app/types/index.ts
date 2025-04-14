import { FloorplanItem } from '../components/FloorplanCanvas';

export type ElementType = 'reservable' | 'decorative';

export interface CanvasElement {
  id: string;
  libraryItemId?: string;
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
  guid: string;
  name: string;
  elements: CanvasElement[];
}

export interface Restaurant {
  id: string;
  name: string;
  floorplans: Floorplan[];
}

export interface Floor {
  name: string;
  guid: string;
  elements: FloorplanItem[];
}
