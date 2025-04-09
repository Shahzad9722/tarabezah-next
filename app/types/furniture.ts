export interface FurnitureItem {
  id: string;
  type: string;
  x: number;
  y: number;
  floorId: number;
  rotation?: number;
  scale?: number;
  label?: string;
  imagePath?: string;
  status?: "Upcoming" | "Seated" | "Completed" | "Cancelled" | "Rejected" | "No Show";
}

export interface DraggableFurniture {
  type: string;
  id: string;
  label: string;
}

export type FurnitureType = 'round-2' | 'round-4' | 'round-6' | 'rect-4' | 'rect-6' | 'rect-8';

export interface ChairPositions {
  [key: string]: number[];
}

export interface Floor {
  id: number;
  name: string;
}