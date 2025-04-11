import { useState } from 'react';
import Image from 'next/image';
import { ScrollArea } from '@/app/components/ui/scroll-area';
import { Input } from '@/app/components/ui/input';
import { Search } from 'lucide-react';
import { getFurnitureImage } from '@/app/utils/furnitureImages';
import { Card } from './ui/card';
import { useQuery } from '@tanstack/react-query';

interface FurnitureLibraryProps {
  activeCategory: string;
  onItemSelect: (item: any) => void;
  onDragStart?: (item: any) => void;
}

export function FurnitureLibrary({ activeCategory, onItemSelect, onDragStart }: FurnitureLibraryProps) {
  // const [searchQuery, setSearchQuery] = useState('');

  const { isLoading: fetchingElements, data: elements = [] } = useQuery({
    queryKey: ['elements'],
    queryFn: async () => {
      const res = await fetch(`/api/restaurant/elements`);
      if (!res.ok) throw new Error('Failed to fetch filters');
      const data = await res.json();
      return data.elements;
    },
  });

  // console.log('elements', elements);
  // Filter items based on search query
  // const filteredItems = searchQuery
  //   ? Object.values(furnitureItems)
  //       .flat()
  //       .filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
  //   : furnitureItems[activeCategory as keyof typeof furnitureItems] || [];

  // Handle drag start event
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, item: any) => {
    // Set data transfer for the drag operation
    e.dataTransfer.setData('application/json', JSON.stringify(item));

    // Update drag state in parent component
    if (onDragStart) {
      onDragStart(item);
    }
  };

  return (
    <Card className='w-full md:w-[407px] py-4 px-3 h-full rounded-xl overflow-y-auto border-none bg-[linear-gradient(119.26deg,_rgba(18,_17,_32,_0.23)_45.47%,_rgba(185,_136,_88,_0.23)_105.35%)]'>
      <h2 className='text-xl font-medium mb-7'>Elements</h2>
      {/* <div className="p-4 border-b">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search furniture..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div> */}

      <ScrollArea className='flex-1'>
        <div className='grid grid-cols-3 gap-4'>
          {elements.map(
            (item: { guid: string; imageUrl: string; name: string; tableType: string; purpose: string }) => (
              <div
                key={item.guid}
                className='flex flex-col items-center p-2 rounded-xl justify-between group hover:bg-[#FFFFFF1A] cursor-move'
                onClick={() => onItemSelect(item)}
                draggable
                onDragStart={(e) => handleDragStart(e, item)}
              >
                <div className={`relative flex items-center justify-center`}>
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    width={60}
                    height={60}
                    className='w-14 h-14 md:w-[75px] md:h-[75px] furniture-element'
                  />
                </div>
                <div className='text-xs mt-3 text-center lg:opacity-0 lg:group-hover:opacity-100'>{item.name}</div>
              </div>
            )
          )}
        </div>

        {elements.length === 0 && (
          <div className='text-center py-8 text-muted-foreground'>No furniture items found</div>
        )}
      </ScrollArea>
    </Card>
  );
}
