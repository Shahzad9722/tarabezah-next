'use client';

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import FilterBar from '../filterBar/FilterBar';
import Accordion from '../accordionData/Accordion';
import Image from 'next/image';
import { useMutation, useQuery } from '@tanstack/react-query';
import { addSelectedItems } from '@/store/features/combinations/combinationsSlice';
import { queryClient } from '@/app/lib/queryClient';
import useSignalR from '@/app/hooks/useSignalR';

interface Item {
  id: number;
  x: number;
  y: number;
  imagePath: string;
  label: string;
  status?: string;
}

interface SelectedItem {
  id: number;
  combinationId: number;
  floorplanElementId: number;
}

export default function TableCombinations() {
  const [items, setItems] = useState<Item[]>([]);
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);

  const selectedFilters = useSelector((state: RootState) => state.combinationFilter.filters);

  const dispatch = useDispatch();

  useEffect(() => {
    fetch('/api/canvas')
      .then((res) => res.json())
      .then((data) => {
        // console.log('items', data);
        if (data.items) {
          setItems(data.items);
        }
      });
  }, []);

  const { isLoading: fetchingFloorPlans, data: floorPlans = [] } = useQuery({
    queryKey: ['floorPlans'],
    queryFn: async () => {
      const res = await fetch(`/api/restaurant/floorplans`);
      if (!res.ok) throw new Error('Failed to fetch filters');
      const data = await res.json();
      return data.floorPlans;
    },
  });

  const { isLoading: fetchingTableTypes, data: tableTypes = [] } = useQuery({
    queryKey: ['tableTypes'],
    queryFn: async () => {
      const res = await fetch(`/api/restaurant/elements/table-types`);
      if (!res.ok) throw new Error('Failed to fetch tableTypes');
      const data = await res.json();
      return data.tableTypes;
    },
  });

  const { isLoading: fetchingCombinations, data: combinations = [] } = useQuery({
    queryKey: ['combinations', { floorPlanId: selectedFilters.floorPlanId }],
    queryFn: async () => {
      const res = await fetch(`/api/combinations?floorPlanId=${selectedFilters.floorPlanId}`);
      if (!res.ok) throw new Error('Failed to fetch combinations');
      const data = await res.json();
      return data.combinations;
    },
    enabled: !!selectedFilters?.floorPlanId,
  });

  // const { isLoading: fetchingItems, data: canvasItems = [] } = useQuery({
  //   queryKey: ['floorItems', { floorPlanId: selectedFilters.floorPlanId }],
  //   queryFn: async () => {
  //     const res = await fetch(`/api/canvas?floorPlanId=${selectedFilters.floorPlanId}`);
  //     if (!res.ok) throw new Error('Failed to fetch canvas data');
  //     const data = await res.json();
  //     return data.canvas;
  //   },
  //   enabled: !!selectedFilters?.floorPlanId,
  // });

  // // Send selected combinations
  const { mutate: addCombinations, isPending: addingCombination } = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/combinations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          floorPlanId: selectedFilters.floorPlanId,
          elementIds: selectedItems.map((i) => i.id),
        }),
      });
      if (!res.ok) throw new Error('Failed to save combination');
      return res.json();
    },
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ['combinations', { floorPlanId: selectedFilters.floorPlanId }],
      });
    },
  });

  // Handle item selection
  const handleItemClick = (item: Item) => {
    // console.log('item', item);
    setSelectedItems((prevSelected) => {
      const isAlreadySelected = prevSelected.some((sel) => sel.id === item.id);
      const selectedItems = isAlreadySelected
        ? prevSelected.filter((sel) => sel.id !== item.id) // Remove if already selected
        : [...prevSelected, { id: item.id, combinationId: 0, floorplanElementId: item.id }];
      dispatch(addSelectedItems([item]));
      return selectedItems;
    });
  };

  // useSignalR(['combinations', { floorPlanId: selectedFilters?.floorPlanId }]);
  return (
    <div className='flex-1'>
      <FilterBar floorPlans={floorPlans} tableTypes={tableTypes} onCreateNew={addCombinations} />
      <div className='flex min-h-[600px] h-[70vh] flex-col md:flex-row gap-6'>
        <div className='md:flex-1 bg-color-D0C17 rounded-lg min-h-[300px] md:min-h-auto'>
          <div className='grid grid-cols-3 gap-6 relative'>
            {items.map((item, index) => (
              <div
                key={item.id}
                onClick={() => handleItemClick(item)}
                className={`absolute w-18 h-18 flex items-center justify-center cursor-pointer transition-all duration-200 ${
                  selectedItems.some((sel) => sel.id === item.id) ? 'border-2 border-green-500' : 'border-transparent'
                }`}
                style={{ transform: `translate(${item.x}px, ${item.y}px)` }}
              >
                {/* <span className="absolute text-black text-center flex justify-center items-center">
                  {item.label}
                </span> */}
                <Image
                  src={item.imagePath}
                  alt={item.label}
                  className='w-full h-full object-contain'
                  width={40}
                  height={40}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className='md:w-[350px] lg:w-[400px]'>
          <div className='rounded-lg bg-[#1C1A2E] p-4 mb-4'>
            <p className='text-white text-sm'>
              To create combinations, select tables and click the Add button. To select multiple tables, hold down the
              shift key or select and drag across desired tables.
            </p>
          </div>
          {/* need to remove this later */}
          <div className='rounded-lg bg-[#1C1A2E] p-4'>
            <h3 className='text-lg mb-2'>Selected Tables</h3>
            {selectedItems.length > 0 ? (
              <ul className='list-disc pl-4'>
                {selectedItems.map((sel) => (
                  <li key={sel.id} className='text-white text-sm'>
                    Table ID: {sel.id}
                  </li>
                ))}
              </ul>
            ) : (
              <p className='text-gray-500'>No tables selected.</p>
            )}
          </div>

          <Accordion combinations={combinations} />
        </div>
      </div>
    </div>
  );
}
