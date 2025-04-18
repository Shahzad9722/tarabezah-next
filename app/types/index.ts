import { FloorplanItem } from '../components/FloorplanCanvas';

export interface CanvasElement {
  id: string;
  localId?: string;
  libraryItemId?: string;
  floorplanInstanceGuid?: string;
  purpose: string;
  elementType: string;
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
