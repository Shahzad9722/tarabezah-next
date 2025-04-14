import React from 'react';
import { useDrag } from 'react-dnd';
import { useFloorplan } from '@/app/context/FloorplanContext';
import Image from 'next/image';

// Component for a draggable table type item
const TableTypeItem = ({ type }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'NEW_TABLE',
    item: { tableType: type },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag as any}
      className={`p-3 mb-2  shadow-sm  transition-all ${isDragging ? 'opacity-50' : 'opacity-100'}`}
    >
      <div className='flex flex-col items-center gap-3 cursor-move hover:bg-white/10 p-2 rounded-lg'>
        <Image
          src={type.elementImageUrl}
          alt={type.name}
          className='w-[60px] h-[60px] object-contain'
          width={60}
          height={60}
        />
        <h3 className='font-thin text-sm'>{type.name}</h3>
      </div>
    </div>
  );
};

const ReservationSidebar: React.FC = () => {
  const { elementLibrary } = useFloorplan();
  return (
    <>
      <div className='mt-4 overflow-y-auto w-full flex-1 border border-gray-800 rounded-lg bg-gradient-to-br from-[#121120]/40 to-[#b98858]/20 p-4'>
        <div className='mb-4'>
          <h2 className='text-xl font-semibold'>Tables</h2>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-2'>
          {elementLibrary
            .filter((item) => item.elementType === 'reservable')
            .map((type: any) => {
              return <TableTypeItem key={type.id} type={type} />;
            })}
        </div>
      </div>

      <div className='my-4 overflow-y-auto w-full flex-1 border border-gray-800 rounded-lg bg-gradient-to-br from-[#121120]/40 to-[#b98858]/20 p-4'>
        <div className='mb-4'>
          <h2 className='text-xl font-semibold'>Decorative</h2>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-2'>
          {elementLibrary
            .filter((item) => item.elementType === 'decorative')
            .map((type: any) => {
              return <TableTypeItem key={type.id} type={type} />;
            })}
        </div>
      </div>
    </>
  );
};

export default ReservationSidebar;
