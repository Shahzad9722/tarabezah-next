import React, { useState, useEffect } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { Input } from '../../ui/input';
import { Button } from '../../ui/button';
import { useQuery } from '@tanstack/react-query';
import { useDebounce } from '@/app/hooks/use-debounce';
import { UseFormReturn } from 'react-hook-form';
import { isNumeric } from '@/app/lib/utils';
import { format } from 'date-fns';

export default function ClientSearch({
  reservationForm,
  setShowAddNewClient,
  showAddNewClient,
  guestForm,
  selected = {},
  setSelected,
  tags,
  restaurantId,
}: {
  reservationForm: UseFormReturn<any>;
  setShowAddNewClient: any;
  showAddNewClient: boolean;
  guestForm: UseFormReturn<any>;
  selected: any;
  setSelected: any;
  tags: any;
  restaurantId: string;
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedQuery = useDebounce(searchQuery, 300);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);

  const { isPending: fetchingGusts, data: guests = [] } = useQuery({
    queryKey: ['guests', { debouncedQuery }],
    queryFn: async () => {
      setLoading(true);

      const res = await fetch(
        `/api/reservation/guest?query=${debouncedQuery}&restaurantId=${restaurantId}`
      );
      if (!res.ok) throw new Error('Failed to fetch guest');
      const data = await res.json();
      setLoading(false);
      return data.guests;
    },
    enabled: !!debouncedQuery,
  });


  const isEmail = (value: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }
  const isPhone = (value: string) => {
    return /^\+?\d{7,15}$/.test(value);
  }
  const isName = (value: string) => {
    return /^[a-zA-Z\s]+$/.test(value);
  }
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setShowResults(true);
  };

  const handleSelectGuest = (guest: any) => {
    // console.log('guest', guest);
    setShowResults(false);
    setSelected(guest);
    reservationForm.setValue('clientId', guest.guid);
  };

  useEffect(() => {
    if (showAddNewClient && searchQuery) {
      if (isEmail(searchQuery)) {
        guestForm.setValue('email', searchQuery);
      } else if (isPhone(searchQuery)) {
        guestForm.setValue('phone', searchQuery);
      } else if (isName(searchQuery)) {
        guestForm.setValue('name', searchQuery);
      }
    }
    // Only run when opening the form
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showAddNewClient]);

  // console.log('selected', selected);
  return (
    <div className='w-full between-area'>
      {/* Search Bar */}
      <div className='relative mb-8'>
        <div className='relative mb-8 mr-0 md:mr-[100px]'>
          <Input
            placeholder='Search...'
            className='relative pl-[72px] input-focus-remove'
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <div className='absolute left-3 top-0 flex items-center h-full'>
            <Search className={`text-gray-400 ${loading ? 'opacity-0' : ''}`} size={24} />
            <span className='w-[1px] h-[18px] mx-4 bg-[#B6B6B6]'></span>
          </div>
          {loading && <Loader2 className='animate-spin mr-2 absolute inset-3' size={24} />}
        </div>

        {showResults && (
          <div className='absolute top-14 bg-color-E9E3D7 w-full p-2 z-10 rounded-md flex flex-col gap-3'>
            <Button
              className='add-guest-button'
              type='button'
              onClick={() => {
                setShowAddNewClient(true);
                if (isEmail(searchQuery)) {
                  guestForm.setValue('email', searchQuery);
                } else if (isPhone(searchQuery)) {
                  guestForm.setValue('phone', searchQuery);
                } else if (isName(searchQuery)) {
                  guestForm.setValue('name', searchQuery);
                }
              }}
            >
              Add New Guest
            </Button>
            {guests.length > 0
              ? guests.map((g: any, index: number) => (
                <p
                  key={index}
                  className='cursor-pointer capitalize text-color-222036 hover:text-color-B98858'
                  onClick={() => handleSelectGuest(g)}
                >
                  {g.name}
                </p>
              ))
              : debouncedQuery &&
              !loading && (
                <div className='text-center py-2 pb-6 text-gray-600'>
                  No clients found. Please try a different search or add a new guest.
                </div>
              )}
            {loading && <div className='text-center py-2 pb-6 text-gray-600'>Searching...</div>}
          </div>
        )}

        {/* Current Client Details */}
        {Object.keys(selected).length > 0 && (
          <div className='w-full text-color-E9E3D7'>
            <h2 className='text-color-E9E3D7 text-[22px] font-semibold mb-6'>Current Client</h2>

            <div className='relative grid md:grid-cols-2 mb-6 pb-6 gap-4 md:gap-[60px] lg:gap-[120px] border-b border-[#FFFFFF30]'>
              {/* Left Column */}
              <div className='space-y-4'>
                <div className='flex flex-nowrap gap-2 text-lg'>
                  <p className='font-medium shrink-0'>Client Name:</p>
                  <p className='font-normal truncate'>{selected.name}</p>
                </div>

                <div className='flex flex-nowrap gap-2 text-lg'>
                  <p className='font-medium shrink-0'>Client Phone Number:</p>
                  <p className='font-normal truncate'>{selected.phoneNumber}</p>
                </div>

                <div className='flex flex-wrap gap-2 text-lg'>
                  <p className='font-normal shrink-0'>Client Tags:</p>
                  {selected.tags?.length > 0 &&
                    selected.tags.map((tag: string, index: number) => {
                      const matchedIcon = tags.find((icon) => icon.name === tag);
                      return (
                        <span key={index} className="inline-flex items-center gap-1 shrink-0">
                          {matchedIcon && (
                            <img
                              src={matchedIcon.iconUrlWhite}
                              alt={tag}
                              className="w-4 h-4"
                            />
                          )}
                          {tag}
                        </span>
                      );
                    })}
                </div>

                {/* Fixed Client Note Section */}
                <div className="flex text-lg w-full items-start gap-4">
                  <p className="font-medium whitespace-nowrap">Client Note:</p>
                  <div className=" rounded-md break-words whitespace-pre-wrap flex-1">
                    {selected.notes || 'No notes'}
                  </div>
                </div>
              </div>

              {/* Vertical Separator */}
              <div className='hidden md:block h-[calc(100%-24px)] absolute left-1/2 top-0 w-[3px] bg-[#FFFFFF30]' />

              {/* Right Column - unchanged from original */}
              <div className='space-y-4'>
                {
                  <div className='flex flex-wrap gap-2 text-lg'>
                    <p className='font-medium'>Last Visit:</p>
                    <p className='font-normal'>
                      {selected.lastVisitDate
                        ? format(new Date(selected.lastVisitDate), 'EEE. dd MMM yyyy')
                        : ''}
                    </p>
                  </div>
                }

                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <p className='font-medium flex justify-between'>
                      <span className='text-color-E9E3D7 text-lg'>
                        Completed: {selected.completedReservationsCurrentRestaurant || 0}
                      </span>
                    </p>
                  </div>

                  <div>
                    <p className='font-medium flex justify-between'>
                      <span className='text-color-E9E3D7 text-lg'>
                        Other Places: {selected.completedReservationsOtherRestaurants || 0}
                      </span>
                    </p>
                  </div>

                  <div>
                    <p className='font-medium flex justify-between'>
                      <span className='text-color-E9E3D7 text-lg'>
                        No Show: {selected.noShowReservationsCurrentRestaurant || 0}
                      </span>
                    </p>
                  </div>

                  <div>
                    <p className='font-medium flex justify-between'>
                      <span className='text-color-E9E3D7 text-lg'>
                        Other Places: {selected.noShowReservationsOtherRestaurants || 0}
                      </span>
                    </p>
                  </div>

                  <div>
                    <p className='font-medium flex justify-between'>
                      <span className='text-color-E9E3D7 text-lg'>
                        Cancel: {selected.cancelledReservationsCurrentRestaurant || 0}
                      </span>
                    </p>
                  </div>

                  <div>
                    <p className='font-medium flex justify-between'>
                      <span className='text-color-E9E3D7 text-lg'>
                        Other Places: {selected.cancelledReservationsOtherRestaurants || 0}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Blacklist section - unchanged from original */}
            <div className='space-y-4'>
              <div className='flex flex-wrap gap-2 text-lg'>
                <p className='font-medium'>Blacklist:</p>
              </div>

              <div className='grid grid-cols-2 lg:grid-cols-3 gap-4'>
                <div>
                  <p className='font-medium flex justify-between'>
                    <span className='text-color-E9E3D7 text-lg'>Other Places: {selected?.blackList?.others || 0}</span>
                  </p>
                </div>

                <div>
                  <p className='font-medium flex justify-between'>
                    <span className='text-color-E9E3D7 text-lg'>
                      Same Place: {selected?.blackList?.same === true ? 'Yes' : 'No'}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
