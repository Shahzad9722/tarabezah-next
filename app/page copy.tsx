'use client';
import { useState } from 'react';
import { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import type { FurnitureItem, Floor } from '@/app/types/furniture';
import FloorPlan from '@/app/components/tabs/FloorPlan';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchElements } from '@/store/features/elements/elementsSlice';
import type { AppDispatch } from '@/store/store';

export default function Home() {
  const dispatch = useDispatch<AppDispatch>();

  // Helper function to get the label for a furniture item
  function getFurnitureLabel(type: string): string {
    const labels: Record<string, string> = {
      'round-2': 'Round Table (2)',
      'round-4': 'Round Table (4)',
      'round-6': 'Round Table (6)',
      'rect-4': 'Rect Table (4)',
      'rect-6': 'Rect Table (6)',
      'rect-8': 'Rect Table (8)',
    };

    return labels[type] || `Table ${type}`;
  }

  const [, setActiveId] = useState<string | null>(null);
  const [placedItems, setPlacedItems] = useState<FurnitureItem[]>([]);

  // Load canvas data on mount
  useEffect(() => {
    fetch('/api/canvas')
      .then((res) => res.json())
      .then((data) => {
        if (data.items) {
          setPlacedItems(data.items);
        }
      });
  }, []);

  // Save canvas data whenever items change
  useEffect(() => {
    fetch('/api/canvas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: placedItems }),
    });
  }, [placedItems]);

  const [floors, setFloors] = useState<Floor[]>([{ id: 1, name: 'Ground Floor' }]);
  const [selectedFloor, setSelectedFloor] = useState<number>(1);

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string);
  }

  // useEffect(() => {
  //   dispatch(fetchElements());
  // }, []);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over, delta } = event;

    // Generate a unique key to ensure we don't have conflicts
    const uniqueId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Check if this is a sidebar item (starts with sidebar- prefix)
    const isSidebarItem = active.id.toString().startsWith('sidebar-');

    // If it's a sidebar item, extract the actual type
    const itemType = isSidebarItem ? active.id.toString().replace('sidebar-', '') : (active.id as string);

    // Map item types to their image paths
    const imagePathMap: Record<string, string> = {
      'round-2': '/images/elements/rt-c2.svg',
      'round-4': '/images/elements/rt-c4.svg',
      'round-6': '/images/elements/rt-c6.svg',
      'rect-4': '/images/elements/st-c4.svg',
      'rect-6': '/images/elements/st-c6.svg',
      'rect-8': '/images/elements/st-c8.svg',
    };

    // Check if we're dropping a new item from the sidebar
    if (isSidebarItem) {
      if (over && over.id === 'canvas') {
        // Get appropriate label based on item type
        const itemLabel = getFurnitureLabel(itemType);
        // console.log("🚀 ~ handleDragEnd ~ itemType:", itemType);

        const newItem: FurnitureItem = {
          id: `item-${itemType}-${uniqueId}`,
          type: itemType,
          x: delta.x,
          y: delta.y,
          floorId: selectedFloor,
          rotation: 0,
          scale: 1,
          label: itemLabel,
          imagePath: imagePathMap[itemType] || `/images/elements/${itemType}.svg`,
          status: 'Upcoming',
        };
        setPlacedItems([...placedItems, newItem]);
      }
    } else {
      // Update existing item position directly, preserving rotation and scale
      setPlacedItems((items) =>
        items.map((item) =>
          item.id === active.id
            ? {
                ...item,
                x: item.x + delta.x,
                y: item.y + delta.y,
                rotation: item.rotation || 0,
                scale: item.scale || 1,
              }
            : item
        )
      );
    }

    setActiveId(null);
  }

  const handleAddFloor = (name: string) => {
    const newFloorId = Math.max(...floors.map((f) => f.id)) + 1;
    const newFloor: Floor = {
      id: newFloorId,
      name: name,
    };
    setFloors([...floors, newFloor]);
    setSelectedFloor(newFloorId);
  };

  return (
    <div className='flex flex-col h-screen bg-background text-foreground overflow-hidden'>
      <FloorPlan
        placedItems={placedItems}
        setPlacedItems={setPlacedItems}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        floors={floors}
        selectedFloor={selectedFloor}
        setSelectedFloor={setSelectedFloor}
        onAddFloor={handleAddFloor}
      />
    </div>
  );
}
