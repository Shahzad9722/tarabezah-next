export interface Reservation {
  id: string;
  name: string;
  time: string;
  party: number;
  status: 'pending' | 'assigned' | 'completed';
  tableId?: string;
}

export interface Table {
  id: string;
  localId?: string;
  tableId?: string;
  purpose?: string;
  number?: number;
  seats?: number;
  x: number;
  y: number;
  status?: 'available' | 'reserved' | 'occupied';
  shape?: 'square' | 'circle' | 'rectangle';
  width: number;
  height: number;
  reservationId?: string;
  elementImageUrl?: string;
  elementType: string;
  name?: string;
}
