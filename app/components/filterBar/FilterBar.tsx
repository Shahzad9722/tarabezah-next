'use client';

import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/app/components/ui/dialog';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { setFilters } from '@/store/features/combination-filters/combinationFilterSlice';
import { ChevronDown } from 'lucide-react';
import FormSelect from '../ui/form-select';

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
    // setTimeout(() => setShowSuccess(false), 2000);
  };

  return (
    <>
      <div className='flex flex-col md:flex-row md:items-end justify-between gap-4 md:gap-0 mb-6'>
        <div className='flex flex-col md:flex-row md:items-center gap-4'>
          {/* Floorplan Dropdown */}
          <div className='flex flex-col gap-2.5 md:w-[200px]'>
            <label className='text-lg text-color-E9E3D7 font-medium'>Floorplan</label>
            <div className='relative'>
              <FormSelect
                value={selectedFilters.floorPlanId || 'all'}
                placeholder='Select floorplan'
                onChange={(value) =>
                  dispatch(setFilters({ ...selectedFilters, floorPlanId: value === 'all' ? '' : value }))
                }
                options={[
                  ...floorPlans.map((fp) => ({
                    label: fp.name,
                    value: fp.guid,
                  })),
                ]}
              />
            </div>
          </div>

          {/* Table Types Dropdown */}
          <div className='flex flex-col gap-2.5 md:w-[200px]'>
            <label className='text-lg text-color-E9E3D7 font-medium'>Table types</label>
            <div className='relative'>
              <FormSelect
                value={selectedFilters.tableType || 'all'}
                placeholder='Select table type'
                onChange={(value) =>
                  dispatch(setFilters({ ...selectedFilters, tableType: value === 'all' ? '' : value }))
                }
                options={[
                  { label: 'All', value: 'all' },
                  ...tableTypes.map((type) => ({
                    label: type,
                    value: type,
                  })),
                ]}
              />
            </div>
          </div>
        </div>

        {/* Add Button */}
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
