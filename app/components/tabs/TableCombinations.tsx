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
import CombinationInfoDialog from '../CombinationInfoDialog';
import { toast } from 'sonner';
import { setFilters } from '@/store/features/combination-filters/combinationFilterSlice';

interface Item {
  guid: string;
  x: number;
  y: number;
  elementImageUrl: string;
  elementName: string;
  minCapacity: number;
  maxCapacity: number;
  tableId: string;
  elementGuid: number;
  rotation: number;
  elementType: string;
}

interface SelectedItem {
  guid: string;
  tableName: string;
}

interface CombinationMember {
  guid: string;
  floorplanElementInstanceGuid: string;
  tableId: string;
}

interface Combination {
  groupName: string;
  guid: string;
  maxCapacity: number;
  minCapacity: number;
  members: CombinationMember[];
}

export default function TableCombinations() {
  const [items, setItems] = useState<Item[]>([]);
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);
  const [showCombinationInfoDialog, setShowCombinationInfoDialog] = useState(false);
  const [expandedCombination, setExpandedCombination] = useState<Combination | null>(null);

  const selectedFilters = useSelector((state: RootState) => state.combinationFilter.filters) || {};

  const dispatch = useDispatch();

  const { isLoading: fetchingFloorPlans, data: floorPlans = [] } = useQuery({
    queryKey: ['floorPlans'],
    queryFn: async () => {
      const restaurantId = typeof window !== 'undefined' ? localStorage.getItem('selected-restaurant-id') : null;
      if (!restaurantId) {
        throw new Error('No restaurant selected');
      }
      const res = await fetch(`/api/restaurant/floorplans?restaurantId=${restaurantId}`);
      if (!res.ok) throw new Error('Failed to fetch filters');
      const data = await res.json();
      return data.floorPlans;
    },
    enabled: typeof window !== 'undefined' && !!localStorage.getItem('selected-restaurant-id'),
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

  const { mutateAsync: addCombinations, isPending: addingCombination } = useMutation({
    mutationFn: async (payload: { combinationName: string; minCapacity: number; maxCapacity: number }) => {
      const res = await fetch(`/api/combinations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          floorPlanId: selectedFilters.floorPlanId,
          elementIds: selectedItems.map((i) => i.guid),
          name: payload.combinationName,
          minCapacity: payload.minCapacity,
          maxCapacity: payload.maxCapacity,
        }),
      });
      if (!res.ok) throw new Error('Failed to save combination');
      return res.json();
    },
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ['combinations', { floorPlanId: selectedFilters.floorPlanId }],
      });
      toast.success('Combination created successfully!');
      setSelectedItems([]);
    },
  });

  const handleCreateCombination = async (payload: {
    combinationName: string;
    minCapacity: number;
    maxCapacity: number;
  }) => {
    toast.promise(addCombinations(payload), {
      loading: 'Creating combination...',
      success: 'Combination created successfully!',
      error: (err) => {
        console.error(err);
        return 'Failed to create combination';
      },
    });
  };

  const handleItemClick = (item: Item) => {
    setSelectedItems((prevSelected) => {
      const isAlreadySelected = prevSelected.some((sel) => sel.guid === item.guid);
      const selectedItems = isAlreadySelected
        ? prevSelected.filter((sel) => sel.guid !== item.guid)
        : [...prevSelected, { guid: item.guid, tableName: item.elementName }];
      dispatch(addSelectedItems([item]));
      return selectedItems;
    });
  };

  useEffect(() => {
    if (floorPlans.length && !selectedFilters.floorPlanId) {
      dispatch(setFilters({ ...selectedFilters, floorPlanId: floorPlans[0].guid }));
      setSelectedItems([]);
    }
  }, [floorPlans]);

  return (
    <div className='flex-1'>
      <FilterBar
        floorPlans={floorPlans}
        tableTypes={tableTypes}
        onCreateNew={() => {
          if (selectedItems.length > 1) setShowCombinationInfoDialog(true);
          else toast.info('Please select at least two tables to create a combination');
        }}
      />
      <div className='flex min-h-[600px] h-[70vh] flex-col md:flex-row gap-6'>
        <div className='md:flex-1 bg-color-D0C17 rounded-lg min-h-[300px] md:min-h-auto relative overflow-hidden'>
          <div className='relative w-full h-full'>
            {floorPlans
              .find((p) => p.guid === selectedFilters.floorPlanId)
              ?.elements.filter((e) => {
                if (!selectedFilters.tableType) return true;
                return e.elementType === selectedFilters.tableType;
              })
              ?.map((item, index) => {
                const isSelected = selectedItems.some((sel) => sel.guid === item.guid);
                const isInExpandedCombination = expandedCombination?.members.some(
                  (member) => member.floorplanElementInstanceGuid === item.guid
                );

                return (
                  <div
                    key={item.guid}
                    onClick={() => handleItemClick(item)}
                    className={`absolute w-12 h-12 md:w-18 md:h-18 flex items-center justify-center cursor-pointer transition-all duration-200 ${isSelected
                      ? 'border-2 border-green-500'
                      : isInExpandedCombination
                        ? 'border-2 border-yellow-400'
                        : 'border-transparent'
                      }`}
                    style={{
                      transform: `translate(${item.x}px, ${item.y}px) scale(0.8)`,
                      transformOrigin: 'top left'
                    }}
                  >
                    <Image
                      src={item.elementImageUrl}
                      alt={item.elementName}
                      className='w-full h-full object-contain'
                      width={100}
                      height={100}
                    />
                  </div>
                );
              })}
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
          <div className='rounded-lg bg-[#1C1A2E] p-4'>
            <h3 className='text-lg mb-2'>Selected Tables</h3>
            {selectedItems.length > 0 ? (
              <ul className='list-disc pl-4'>
                {selectedItems.map((sel) => (
                  <li key={sel.guid} className='text-white text-sm'>
                    {sel.tableName}
                  </li>
                ))}
              </ul>
            ) : (
              <p className='text-gray-500'>No tables selected.</p>
            )}
          </div>

          <Accordion
            combinations={combinations}
            onExpand={(combination: Combination | null) => setExpandedCombination(combination)}
          />
        </div>
      </div>
      <CombinationInfoDialog
        open={showCombinationInfoDialog}
        onClose={() => setShowCombinationInfoDialog(false)}
        onSave={handleCreateCombination}
      />
    </div>
  );
}