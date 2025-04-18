import { useState, useCallback, useRef, RefObject } from 'react';
import { CanvasElement } from '@/app/types';
import { useFloorplan } from '@/app/context/FloorplanContext';
import { toast } from 'sonner';
export interface CanvasState {
  scale: number;
  panOffset: { x: number; y: number };
  isPanning: boolean;
  panStart: { x: number; y: number };
  spacePressed: boolean;
  isConfigDialogOpen: boolean;
  newElementData: {
    libraryItem: CanvasElement;
    x: number;
    y: number;
  } | null;
  tableName: string;
  minCapacity: string;
  maxCapacity: string;
}

export const useCanvasHandlers = (canvasRef: RefObject<HTMLDivElement | null>) => {
  const { selectedElementId, setSelectedElementId, addElement } = useFloorplan();

  const [state, setState] = useState<CanvasState>({
    scale: 1,
    panOffset: { x: 0, y: 0 },
    isPanning: false,
    panStart: { x: 0, y: 0 },
    spacePressed: false,
    isConfigDialogOpen: false,
    newElementData: null,
    tableName: '',
    minCapacity: '',
    maxCapacity: '',
  });

  const setScale = (scale: number) => setState((prev) => ({ ...prev, scale }));
  const setPanOffset = (panOffset: { x: number; y: number }) => setState((prev) => ({ ...prev, panOffset }));
  const setIsPanning = (isPanning: boolean) => setState((prev) => ({ ...prev, isPanning }));
  const setPanStart = (panStart: { x: number; y: number }) => setState((prev) => ({ ...prev, panStart }));
  const setSpacePressed = (spacePressed: boolean) => setState((prev) => ({ ...prev, spacePressed }));
  const setIsConfigDialogOpen = (isConfigDialogOpen: boolean) => setState((prev) => ({ ...prev, isConfigDialogOpen }));
  const setNewElementData = (newElementData: { libraryItem: any; x: number; y: number } | null) =>
    setState((prev) => ({ ...prev, newElementData }));
  const setTableName = (tableName: string) => setState((prev) => ({ ...prev, tableName }));
  const setMinCapacity = (minCapacity: string) => setState((prev) => ({ ...prev, minCapacity }));
  const setMaxCapacity = (maxCapacity: string) => setState((prev) => ({ ...prev, maxCapacity }));

  const handleCanvasClick = (e: React.MouseEvent) => {
    // Deselect when clicking the canvas (not an element)
    if (e.target === canvasRef.current) {
      setSelectedElementId(null);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    // Start panning if space is pressed
    if (state.spacePressed || e.button === 1) {
      // Middle mouse button
      setIsPanning(true);
      setPanStart({ x: e.clientX, y: e.clientY });
      if (canvasRef.current) {
        canvasRef.current.style.cursor = 'grabbing';
      }
    }
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (state.isPanning) {
        const dx = e.clientX - state.panStart.x;
        const dy = e.clientY - state.panStart.y;

        setPanOffset({
          x: state.panOffset.x + dx / state.scale,
          y: state.panOffset.y + dy / state.scale,
        });

        setPanStart({ x: e.clientX, y: e.clientY });
      }
    },
    [state.isPanning, state.panStart, state.scale, state.panOffset]
  );

  const handleMouseUp = useCallback(() => {
    if (state.isPanning) {
      setIsPanning(false);
      if (canvasRef.current) {
        canvasRef.current.style.cursor = state.spacePressed ? 'grab' : 'default';
      }
    }
  }, [state.isPanning, state.spacePressed]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === ' ' && !state.spacePressed) {
        setSpacePressed(true);
        if (canvasRef.current) {
          canvasRef.current.style.cursor = 'grab';
        }
        e.preventDefault(); // Prevent page scrolling
      }
    },
    [state.spacePressed]
  );

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    if (e.key === ' ') {
      setSpacePressed(false);
      setIsPanning(false);
      if (canvasRef.current) {
        canvasRef.current.style.cursor = 'default';
      }
    }
  }, []);

  const handleZoomIn = () => {
    setScale(Math.min(state.scale * 1.2, 5));
  };

  const handleZoomOut = () => {
    setScale(Math.max(state.scale / 1.2, 0.2));
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();

    // Zoom with ctrl + wheel
    if (e.ctrlKey) {
      const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
      setScale(Math.max(0.2, Math.min(5, state.scale * zoomFactor)));
    } else {
      // Pan with wheel
      setPanOffset({
        x: state.panOffset.x - e.deltaX / state.scale,
        y: state.panOffset.y - e.deltaY / state.scale,
      });
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();

    try {
      const data = e.dataTransfer.getData('application/json');
      const libraryItem = JSON.parse(data) as any;

      // Get canvas-relative drop coordinates, adjusted for scale and pan
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;

      const dropX = (e.clientX - rect.left) / state.scale - state.panOffset.x;
      const dropY = (e.clientY - rect.top) / state.scale - state.panOffset.y;

      // Calculate position so the element is centered on the drop point
      const x = dropX - libraryItem.defaultWidth / 2;
      const y = dropY - libraryItem.defaultHeight / 2;

      if (libraryItem.type === 'reservable') {
        // Open dialog for reservable items
        setNewElementData({ libraryItem, x, y });
        setTableName(libraryItem.name);
        setMinCapacity('');
        setMaxCapacity('');
        setIsConfigDialogOpen(true);
      } else {
        // Directly add decorative items
        addElement({
          libraryItemId: libraryItem.id,
          elementType: libraryItem.type,
          purpose: libraryItem.purpose,
          tableId: libraryItem.tableId,
          x,
          y,
          width: libraryItem.defaultWidth,
          height: libraryItem.defaultHeight,
        });

        toast.success(`Added ${libraryItem.name}`);
      }
    } catch (error) {
      console.error('Error handling drop:', error);
    }
  };

  const handleCompleteReservable = () => {
    if (!state.newElementData) return;

    const { libraryItem, x, y } = state.newElementData;
    addElement({
      libraryItemId: libraryItem.id,
      elementType: libraryItem.elementType,
      purpose: libraryItem.purpose,
      tableId: libraryItem.tableId,
      x,
      y,
      width: libraryItem.width,
      height: libraryItem.height,
      name: state.tableName || libraryItem.name,
      minCapacity: state.minCapacity ? parseInt(state.minCapacity, 10) : undefined,
      maxCapacity: state.maxCapacity ? parseInt(state.maxCapacity, 10) : undefined,
    });

    setIsConfigDialogOpen(false);
    setNewElementData(null);
    toast.success(`Added ${state.tableName || libraryItem.name}`);
  };

  return {
    state,
    handleCanvasClick,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleKeyDown,
    handleKeyUp,
    handleZoomIn,
    handleZoomOut,
    handleWheel,
    handleDragOver,
    handleDrop,
    handleCompleteReservable,
    setTableName,
    setMinCapacity,
    setMaxCapacity,
    setIsConfigDialogOpen,
  };
};
