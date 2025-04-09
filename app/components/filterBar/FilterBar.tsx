import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/app/components/ui/dialog';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { setFilters } from '@/store/features/combination-filters/combinationFilterSlice';
import { ChevronDown } from 'lucide-react';

const FilterBar = ({
  floorPlans,
  onCreateNew,
  tableTypes,
}: {
  floorPlans: {
    name: string;
    guid: string;
  }[];
  tableTypes: string[];
  onCreateNew: any;
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const selectedFilters = useSelector((state: RootState) => state.combinationFilter.filters);

  const [showSuccess, setShowSuccess] = useState(false);

  const handleAdd = () => {
    onCreateNew();
    // setShowSuccess(true);
    // setTimeout(() => setShowSuccess(false), 2000); // Auto close after 2 seconds
  };

  // filter plans
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setFilters({ ...selectedFilters, floorPlanId: e.target.value }));
  };

  // console.log('selectedFilters', selectedFilters);
  return (
    <>
      <div className='flex flex-col md:flex-row md:items-end justify-between gap-4 md:gap-0 md:mt-10 mb-6'>
        <div className='flex flex-col md:flex-row md:items-center gap-4'>
          {/* Floorplan Dropdown */}
          <div className='flex flex-col gap-2.5 md:w-[200px]'>
            <label className='text-xl text-color-E9E3D7 font-medium'>Floorplan</label>
            <div className='relative'>
              <select
                onChange={handleFilterChange}
                value={selectedFilters.floorPlanId || ''}
                className='w-full bg-color-222036 text-[#909090] text-xl pl-4 pr-8 py-2 rounded-[4px] focus:outline-none appearance-none'
              >
                <option value=''>Select Floor plan</option>
                {floorPlans?.map((floorPlan) => (
                  <option key={floorPlan.guid} value={floorPlan.guid}>
                    {floorPlan.name}
                  </option>
                ))}
              </select>
              <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center px-2'>
                <ChevronDown className='h-4 w-4' />
              </div>
            </div>
          </div>

          {/* Dining Areas Dropdown */}
          <div className='flex flex-col gap-2.5 md:w-[200px]'>
            <label className='text-xl text-color-E9E3D7 font-medium'>Dining areas</label>
            <div className='relative w-full'>
              <select className='w-full bg-color-222036 text-[#909090] text-xl pl-4 pr-8 py-2 rounded-[4px] focus:outline-none appearance-none'>
                <option>.</option>
              </select>
              <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center px-2'>
                <ChevronDown className='h-4 w-4' />
              </div>
            </div>
          </div>

          {/* Table Types Dropdown */}
          <div className='flex flex-col gap-2.5 md:w-[200px]'>
            <label className='text-xl text-color-E9E3D7 font-medium'>Table types</label>
            <div className='relative'>
              <select className='w-full bg-color-222036 text-[#909090] text-xl pl-4 pr-8 py-2 rounded-[4px] focus:outline-none appearance-none'>
                {tableTypes?.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center px-2'>
                <ChevronDown className='h-4 w-4' />
              </div>
            </div>
          </div>
        </div>

        {/* Change Log & Add Button */}
        <div className='flex items-center gap-6'>
          <span className='text-sm text-color-B98858 cursor-pointer font-semibold hidden'>Change log</span>
          <Button className='h-9 text-sm' onClick={handleAdd} disabled={!selectedFilters?.floorPlanId}>
            Add
          </Button>
        </div>
      </div>

      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent className='sm:max-w-[425px]'>
          <DialogHeader>
            <DialogTitle className='text-center text-green-500'>Added Successfully!</DialogTitle>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FilterBar;
