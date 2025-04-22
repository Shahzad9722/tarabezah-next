'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import FilterBar from '../filterBar/FilterBar';
import Accordion from '../accordionData/Accordion';
import { useMutation, useQuery } from '@tanstack/react-query';
import { addSelectedItems } from '@/store/features/combinations/combinationsSlice';
import { queryClient } from '@/app/lib/queryClient';
import CombinationInfoDialog from '../CombinationInfoDialog';
import { toast } from 'sonner';
import { setFilters } from '@/store/features/combination-filters/combinationFilterSlice';
import Image from 'next/image';
import { ZoomIn, ZoomOut, RefreshCw, Move } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Slider } from '@/app/components/ui/slider';
import CombinationDeleteConfirmation from '../accordionData/CombinationDeleteConfirmation';

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
  shape?: string;
  status?: string;
  width?: number;
  height?: number;
  purpose?: string;
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
  const [selectedItems, setSelectedItems] = useState<{ guid: string; tableName: string }[]>([]);
  const [showCombinationInfoDialog, setShowCombinationInfoDialog] = useState(false);
  const [expandedCombination, setExpandedCombination] = useState<Combination | null>(null);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [combinationToDelete, setCombinationToDelete] = useState<string | null>(null);

  const selectedFilters = useSelector((state: RootState) => state.combinationFilter.filters) || {};
  const dispatch = useDispatch();

  // Fetch floor plans
  const { isLoading: fetchingFloorPlans, data: floorPlans = [] } = useQuery({
    queryKey: ['floorPlans'],
    queryFn: async () => {
      const restaurantId = typeof window !== 'undefined' ? localStorage.getItem('selected-restaurant-id') : null;
      if (!restaurantId) {
        throw new Error('No restaurant selected');
      }
      const res = await fetch(`/api/restaurant/floorplans?restaurantId=${restaurantId}`);
      if (!res.ok) throw new Error('Failed to fetch floor plans');
      const data = await res.json();
      return data.floorPlans;
    },
    enabled: typeof window !== 'undefined' && !!localStorage.getItem('selected-restaurant-id'),
  });

  // Fetch table types
  const { isLoading: fetchingTableTypes, data: tableTypes = [] } = useQuery({
    queryKey: ['tableTypes'],
    queryFn: async () => {
      const res = await fetch(`/api/restaurant/elements/table-types`);
      if (!res.ok) throw new Error('Failed to fetch table types');
      const data = await res.json();
      return data.tableTypes;
    },
  });

  // Fetch combinations
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

  // Mutation for adding combinations
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

  // Handle creating combination
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

  const { mutateAsync: deleteCombination } = useMutation({
    mutationFn: async (guid: string) => {
      const res = await fetch(`/api/combinations/${guid}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete combination');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['combinations'] });
    },
  });

  const confirmDeleteCombination = (guid: string) => {
    setShowConfirmDialog(true);
    setCombinationToDelete(guid);
  };
  // Handle item selection
  const handleItemClick = (item: Item) => {
    if (item.purpose !== 'Reservable') return;
    setSelectedItems((prevSelected) => {
      const isAlreadySelected = prevSelected.some((sel) => sel.guid === item.guid);
      const selectedItems = isAlreadySelected
        ? prevSelected.filter((sel) => sel.guid !== item.guid)
        : [...prevSelected, { guid: item.guid, tableName: item.tableId }];
      dispatch(addSelectedItems([item]));
      return selectedItems;
    });
  };

  // Set default floor plan if not selected
  useEffect(() => {
    if (floorPlans.length && !selectedFilters.floorPlanId) {
      dispatch(setFilters({ ...selectedFilters, floorPlanId: floorPlans[0].guid }));
      setSelectedItems([]);
    }
  }, [floorPlans]);

  const handleDeleteCombination = async () => {
    toast.promise(deleteCombination(combinationToDelete), {
      loading: 'Deleting combination...',
      success: 'Combination deleted successfully!',
      error: (err) => {
        console.error(err);
        return 'Failed to delete combination';
      },
    });
    setShowConfirmDialog(false);
    setCombinationToDelete(null);
  };

  // Zoom functionality
  const handleZoomIn = () => {
    const newScale = Math.min(scale + 0.1, 3);
    zoomAroundCenter(newScale);
  };

  const handleZoomOut = () => {
    const newScale = Math.max(scale - 0.1, 0.5);
    zoomAroundCenter(newScale);
  };

  const handleResetView = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  const zoomAroundCenter = (newScale: number) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const viewportCenterX = rect.width / 2;
    const viewportCenterY = rect.height / 2;

    const floorPlanCenterX = (viewportCenterX - position.x) / scale;
    const floorPlanCenterY = (viewportCenterY - position.y) / scale;

    const newPositionX = viewportCenterX - floorPlanCenterX * newScale;
    const newPositionY = viewportCenterY - floorPlanCenterY * newScale;

    setScale(newScale);
    setPosition({ x: newPositionX, y: newPositionY });
  };

  // Handle mouse wheel zoom
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    // Handle panning (both touchpad gestures and mouse movement with Ctrl)
    if (e.ctrlKey || e.metaKey) {
      // For touchpad gestures, use deltaX and deltaY
      if (e.deltaMode === 0) {
        // DOM_DELTA_PIXEL (touchpad)
        const newX = position.x - e.deltaX;
        const newY = position.y - e.deltaY;
        setPosition({ x: newX, y: newY });
      }
      // For mouse wheel, we'll handle it in mouseMove
      return;
    }

    // Handle mouse wheel zooming
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Calculate the point in floor plan space under the mouse
    const floorPlanX = (mouseX - position.x) / scale;
    const floorPlanY = (mouseY - position.y) / scale;

    // Calculate zoom factor based on wheel delta
    const zoomFactor = 1.1; // 10% zoom per wheel tick
    const newScale =
      e.deltaY < 0
        ? Math.min(scale * zoomFactor, 3) // Zoom in
        : Math.max(scale / zoomFactor, 0.5); // Zoom out

    // Calculate new position to keep mouse over the same point
    const newPositionX = mouseX - floorPlanX * newScale;
    const newPositionY = mouseY - floorPlanY * newScale;

    setScale(newScale);
    setPosition({ x: newPositionX, y: newPositionY });
  };

  // Handle panning functionality
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;
      setPosition({
        x: newX,
        y: newY,
      });
    }
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (isDragging) {
      e.preventDefault();
      setIsDragging(false);
    }
  };

  // Handle touch events for mobile
  const touchStartDistance = useRef<number | null>(null);
  const touchStartScale = useRef<number>(1);
  const touchStartPosition = useRef({ x: 0, y: 0 });

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      // Store initial distance between two fingers for pinch zoom
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      touchStartDistance.current = Math.sqrt(dx * dx + dy * dy);
      touchStartScale.current = scale;

      // Calculate midpoint of the two touches
      const midX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
      const midY = (e.touches[0].clientY + e.touches[1].clientY) / 2;

      touchStartPosition.current = { x: midX, y: midY };
    } else if (e.touches.length === 1) {
      // Handle pan
      touchStartPosition.current = {
        x: e.touches[0].clientX - position.x,
        y: e.touches[0].clientY - position.y,
      };
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault(); // Prevent page scrolling

    if (e.touches.length === 2 && touchStartDistance.current !== null) {
      // Handle pinch zoom
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Calculate new scale based on the change in distance
      const newScale = Math.min(Math.max(touchStartScale.current * (distance / touchStartDistance.current), 0.5), 3);

      // Calculate midpoint of the two touches
      const midX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
      const midY = (e.touches[0].clientY + e.touches[1].clientY) / 2;

      // Get container rect
      const rect = containerRef.current?.getBoundingClientRect();
      if (rect) {
        // Calculate the point in floor plan space at the touch midpoint
        const floorPlanX = (midX - rect.left - position.x) / scale;
        const floorPlanY = (midY - rect.top - position.y) / scale;

        // Keep the midpoint stationary during zoom
        const newPositionX = midX - rect.left - floorPlanX * newScale;
        const newPositionY = midY - rect.top - floorPlanY * newScale;

        setScale(newScale);
        setPosition({ x: newPositionX, y: newPositionY });
      }
    } else if (e.touches.length === 1) {
      // Handle pan
      setPosition({
        x: e.touches[0].clientX - touchStartPosition.current.x,
        y: e.touches[0].clientY - touchStartPosition.current.y,
      });
    }
  };

  const handleTouchEnd = () => {
    touchStartDistance.current = null;
  };

  // Add effect to prevent browser zoom
  useEffect(() => {
    const preventDefault = (e: Event) => {
      if (containerRef.current?.contains(e.target as Node)) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    };

    const events = [
      'wheel',
      'mousewheel',
      'DOMMouseScroll',
      'touchmove',
      'gesturestart',
      'gesturechange',
      'gestureend',
    ];

    events.forEach((event) => {
      window.addEventListener(event, preventDefault, { passive: false });
      document.addEventListener(event, preventDefault, { passive: false });
    });

    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, preventDefault);
        document.removeEventListener(event, preventDefault);
      });
    };
  }, []);

  // Get table style based on state
  const getTableStyle = (item: Item, isSelected: boolean, isInCombination: boolean) => {
    let baseStyle = 'flex items-center justify-center relative transition-all duration-200 shadow-md ';

    // Shape styling
    if (item.shape === 'circle') {
      baseStyle += 'rounded-full ';
    } else if (item.shape === 'square' || item.shape === 'rectangle') {
      baseStyle += 'rounded-lg ';
    }

    // Selection and combination states
    if (isSelected) {
      baseStyle += 'border-2 border-green-500 ';
    } else if (isInCombination) {
      baseStyle += 'border-2 border-yellow-400 ';
    }

    // Status colors
    if (item.status === 'available') {
      baseStyle += 'bg-white ';
    } else if (item.status === 'reserved') {
      baseStyle += 'bg-blue-100 ';
    } else if (item.status === 'occupied') {
      baseStyle += 'bg-gray-200 ';
    }

    baseStyle += 'cursor-pointer ';

    return baseStyle;
  };

  return (
    <div className='flex-1 px-4'>
      <FilterBar
        floorPlans={floorPlans}
        tableTypes={tableTypes}
        onCreateNew={() => {
          if (selectedItems.length > 1) setShowCombinationInfoDialog(true);
          else toast.info('Please select at least two tables to create a combination');
        }}
      />

      <div className='flex h-[calc(100vh-300px)] flex-col md:flex-row gap-6 border-gray-800 rounded-lg'>
        <div
          className='w-full h-full bg-transparent border border-gray-800 overflow-hidden relative flex flex-col rounded-lg'
          ref={containerRef}
          style={{
            touchAction: 'none' as const,
            userSelect: 'none' as const,
            WebkitUserSelect: 'none' as const,
            msUserSelect: 'none' as const,
          }}
        >
          {/* Zoom controls */}
          <div className='p-4 bg-transparent'>
            <div className='flex flex-wrap gap-1 justify-between items-center bg-transparent'>
              <div className='text-sm text-muted-foreground flex items-center'>
                <Move size={16} className='mr-1' /> Press Ctrl + Click and drag to move floor plan
              </div>
              <div className='flex items-center gap-1'>
                <Button variant='outline' size='sm' onClick={handleZoomIn}>
                  <ZoomIn size={16} />
                </Button>
                <Button variant='outline' size='sm' onClick={handleZoomOut}>
                  <ZoomOut size={16} />
                </Button>
                <Button variant='outline' size='sm' onClick={handleResetView}>
                  <RefreshCw size={16} />
                </Button>
                <div className='ml-2 flex items-center gap-2'>
                  <span className='text-sm text-white'>Zoom:</span>
                  <div className='w-24'>
                    <Slider
                      value={[scale * 100]}
                      min={50}
                      max={300}
                      step={10}
                      onValueChange={([value]) => {
                        zoomAroundCenter(value / 100);
                      }}
                    />
                  </div>
                  <span className='text-sm text-muted-foreground'>{Math.round(scale * 100)}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Selected items counter */}
          <div className='absolute bottom-2 right-2 bg-color-BE963C text-color-222036 font-bold px-2 py-1 text-xs rounded z-50'>
            Selected: {selectedItems.length}
          </div>

          <div
            className='relative flex-1 overflow-hidden cursor-move'
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            ref={(node) => {
              containerRef.current = node;
              // drop(node);
            }}
          >
            <div
              className='absolute inset-0 overflow-visible'
              style={{
                transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                transformOrigin: '0 0',
              }}
            >
              {/* Background grid */}
              <div
                className='absolute'
                style={{
                  backgroundImage: `
              linear-gradient(to right, var(--canvas-grid) 1px, transparent 1px),
              linear-gradient(to bottom, var(--canvas-grid) 1px, transparent 1px)
            `,
                  backgroundSize: '20px 20px',
                  width: '10000px',
                  height: '10000px',
                  left: '-5000px',
                  top: '-5000px',
                  zIndex: 0,
                }}
              />

              {/* Tables container with higher z-index */}
              <div className='relative' style={{ zIndex: 10 }}>
                {floorPlans
                  .find((p) => p.guid === selectedFilters.floorPlanId)
                  ?.elements.filter((e) => {
                    if (!selectedFilters.tableType) return true;
                    return e.elementType === selectedFilters.tableType;
                  })
                  ?.map((item) => {
                    const isSelected = selectedItems.some((sel) => sel.guid === item.guid);
                    const isInExpandedCombination = expandedCombination?.members.some(
                      (member) => member.floorplanElementInstanceGuid === item.guid
                    );

                    return (
                      <div>
                        <div
                          key={item.guid}
                          className={getTableStyle(item, isSelected, isInExpandedCombination)}
                          style={{
                            position: 'absolute',
                            left: `${item.x}px`,
                            top: `${item.y}px`,
                            width: `${item.width || 60}px`,
                            height: `${item.height || 60}px`,
                            zIndex: 20,
                          }}
                          onClick={() => handleItemClick(item)}
                        ></div>
                        {item.elementImageUrl && (
                          <Image
                            src={item.elementImageUrl}
                            alt={item.elementName}
                            className='object-contain w-full h-full'
                            width={item.width || 60}
                            height={item.height || 60}
                            style={{
                              position: 'absolute',
                              left: `${item.x}px`,
                              top: `${item.y}px`,
                              width: `${item.width || 60}px`,
                              height: `${item.height || 60}px`,
                            }}
                          />
                        )}
                      </div>
                    );
                  })}
              </div>
            </div>
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
            onDelete={(guid) => confirmDeleteCombination(guid)}
            onExpand={(combination: Combination | null) => setExpandedCombination(combination)}
          />
        </div>
      </div>

      <CombinationInfoDialog
        open={showCombinationInfoDialog}
        onClose={() => setShowCombinationInfoDialog(false)}
        onSave={handleCreateCombination}
      />

      <CombinationDeleteConfirmation
        open={showConfirmDialog}
        onClose={() => {
          setShowConfirmDialog(false);
          setCombinationToDelete(null);
        }}
        onConfirm={handleDeleteCombination}
      />
    </div>
  );
}
