import React, { useRef } from 'react';
import { useDrop, useDrag } from 'react-dnd';
import { Button } from '@/app/components/ui/button';
import { X } from 'lucide-react';
import { Table } from '@/app/types/restaurant';
import Image from 'next/image';
import { useFloorplan } from '@/app/context/FloorplanContext';

interface TableComponentProps {
  table: Table;
  scale: number;
  selectedTable: Table | null;
  setSelectedTable: (table: Table | null) => void;
}

interface DropResult {
  id: string;
  x: number;
  y: number;
  dropEffect: string;
}

const TableComponent: React.FC<TableComponentProps> = ({ table, scale, selectedTable, setSelectedTable }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { removeElement } = useFloorplan();

  // Handle reservation dropping on table
  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: 'RESERVATION',
    drop: (item: { id: string }) => {
      // assignReservation(item.id, table.id);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
    canDrop: () => table.status === 'available',
  }));

  // Handle table dragging
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: 'TABLE',
      item: () => {
        // console.log('Drag started for table:', table.id);
        return { tableType: table };
      },
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
      end: (item, monitor) => {
        // console.log('Drag ended for table:', table.id);
        const dropResult = monitor.getDropResult() as DropResult;
        // console.log('Drop result:', dropResult);

        if (!monitor.didDrop()) {
          // console.log('Table was not dropped properly');
          return;
        }

        if (dropResult && typeof dropResult.x === 'number' && typeof dropResult.y === 'number') {
          // console.log('Updating table position:', { id: table.id, x: dropResult.x, y: dropResult.y });
          // updateTablePosition(table.id, dropResult.x, dropResult.y);
        }
      },
    }),
    [table.id, table.x, table.y, scale]
  );

  // Connect the drop and drag refs to the same component
  drag(drop(ref));

  // Determine the table style based on shape and status
  const getTableStyle = () => {
    let baseStyle = 'flex items-center justify-center relative transition-all duration-200 shadow-md ';

    // Add shape styles
    if (table.shape === 'circle') {
      baseStyle += 'rounded-full ';
    } else if (table.shape === 'square' || table.shape === 'rectangle') {
      baseStyle += 'rounded-lg ';
    }

    // Add status colors
    if (isOver && canDrop) {
      baseStyle += 'bg-green-200 border-2 border-green-500 shadow-lg transform scale-105 ';
    } else if (canDrop) {
      baseStyle += 'bg-blue-50 border border-blue-300 ';
    } else if (table.status === 'available') {
      baseStyle += 'bg-white border border-gray-300 ';
    } else if (table.status === 'reserved') {
      baseStyle += 'bg-blue-100 border border-blue-500 ';
    } else if (table.status === 'occupied') {
      baseStyle += 'bg-gray-200 border border-gray-500 ';
    }

    if (isDragging) {
      baseStyle += 'opacity-50 cursor-grabbing ';
    } else {
      baseStyle += 'cursor-grab ';
    }

    return baseStyle;
  };
  return (
    <div
      ref={ref}
      style={{
        position: 'absolute',
        left: `${table.x}px`,
        top: `${table.y}px`,
        width: `${table.width}px`,
        height: `${table.height}px`,
        zIndex: 20,
      }}
      className={getTableStyle()}
    >
      {table.elementImageUrl && (
        <Image
          src={table.elementImageUrl}
          alt={table.tableId}
          className='object-contain w-full h-full'
          width={table.width}
          height={table.height}
          onClick={() => {
            // console.log('table', table);
            if (table.purpose === 'reservable') {
              setSelectedTable(table);
            }
          }}
        />
      )}

      {
        <Button
          variant='destructive'
          size='icon'
          className='absolute -top-2 -right-2 h-4 w-4 rounded-full bg-red-400 hover:bg-red-600'
          onClick={() => removeElement(table.localId)}
        >
          <X className='h-3 w-3' />
        </Button>
      }
    </div>
  );
};

export default TableComponent;
