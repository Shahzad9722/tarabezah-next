
'use client';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useFloorplan } from '@/app/context/FloorplanContext';
import { ElementLibraryItem } from '@/app/types';
import { CanvasElement } from '@/app/components/canvas/CanvasElement';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/app/components/ui/dialog';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Button } from '@/app/components/ui/button';
import { toast } from 'sonner';
import { ZoomIn, ZoomOut, Move } from 'lucide-react';

export const Canvas: React.FC = () => {
    const canvasRef = useRef<HTMLDivElement>(null);
    const {
        activeFloorplan,
        selectedElementId,
        setSelectedElementId,
        addElement,
        elementLibrary
    } = useFloorplan();

    const [scale, setScale] = useState(1);
    const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
    const [isPanning, setIsPanning] = useState(false);
    const [panStart, setPanStart] = useState({ x: 0, y: 0 });
    const [spacePressed, setSpacePressed] = useState(false);

    // For table configuration modal
    const [isConfigDialogOpen, setIsConfigDialogOpen] = useState(false);
    const [newElementData, setNewElementData] = useState<{
        libraryItem: ElementLibraryItem;
        x: number;
        y: number;
    } | null>(null);
    const [tableName, setTableName] = useState('');
    const [minCapacity, setMinCapacity] = useState('');
    const [maxCapacity, setMaxCapacity] = useState('');

    const handleCanvasClick = (e: React.MouseEvent) => {
        // Deselect when clicking the canvas (not an element)
        if (e.target === canvasRef.current) {
            setSelectedElementId(null);
        }
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        // Start panning if space is pressed
        if (spacePressed || e.button === 1) { // Middle mouse button
            setIsPanning(true);
            setPanStart({ x: e.clientX, y: e.clientY });
            if (canvasRef.current) {
                canvasRef.current.style.cursor = 'grabbing';
            }
        }
    };

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (isPanning) {
            const dx = e.clientX - panStart.x;
            const dy = e.clientY - panStart.y;

            setPanOffset(prev => ({
                x: prev.x + dx / scale,
                y: prev.y + dy / scale,
            }));

            setPanStart({ x: e.clientX, y: e.clientY });
        }
    }, [isPanning, panStart, scale]);

    const handleMouseUp = useCallback(() => {
        if (isPanning) {
            setIsPanning(false);
            if (canvasRef.current) {
                canvasRef.current.style.cursor = spacePressed ? 'grab' : 'default';
            }
        }
    }, [isPanning, spacePressed]);

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (e.key === ' ' && !spacePressed) {
            setSpacePressed(true);
            if (canvasRef.current) {
                canvasRef.current.style.cursor = 'grab';
            }
            e.preventDefault(); // Prevent page scrolling
        }

        // Delete selected element
        if ((e.key === 'Delete' || e.key === 'Backspace') && selectedElementId) {
            // We're handling this in ElementProperties.tsx
        }
    }, [spacePressed, selectedElementId]);

    const handleKeyUp = useCallback((e: KeyboardEvent) => {
        if (e.key === ' ') {
            setSpacePressed(false);
            setIsPanning(false);
            if (canvasRef.current) {
                canvasRef.current.style.cursor = 'default';
            }
        }
    }, []);

    // Register global event listeners
    useEffect(() => {
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [handleMouseMove, handleMouseUp, handleKeyDown, handleKeyUp]);

    // Zoom handlers
    const handleZoomIn = () => {
        setScale(prev => Math.min(prev * 1.2, 5));
    };

    const handleZoomOut = () => {
        setScale(prev => Math.max(prev / 1.2, 0.2));
    };

    const handleWheel = (e: React.WheelEvent) => {
        e.preventDefault();

        // Zoom with ctrl + wheel
        if (e.ctrlKey) {
            const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
            setScale(prev => Math.max(0.2, Math.min(5, prev * zoomFactor)));
        } else {
            // Pan with wheel
            setPanOffset(prev => ({
                x: prev.x - e.deltaX / scale,
                y: prev.y - e.deltaY / scale,
            }));
        }
    };

    // Handle drag and drop
    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();

        try {
            const data = e.dataTransfer.getData('application/json');
            const libraryItem = JSON.parse(data) as ElementLibraryItem;

            // Get canvas-relative drop coordinates, adjusted for scale and pan
            const rect = canvasRef.current?.getBoundingClientRect();
            if (!rect) return;

            // Adjust for the scaling and panning correctly
            const dropX = (e.clientX - rect.left) / scale - panOffset.x;
            const dropY = (e.clientY - rect.top) / scale - panOffset.y;

            // Center the element at the drop location
            const x = dropX - (libraryItem.defaultWidth / 2);
            const y = dropY - (libraryItem.defaultHeight / 2);

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
        if (!newElementData) return;

        const { libraryItem, x, y } = newElementData;
        addElement({
            libraryItemId: libraryItem.id,
            elementType: libraryItem.type,
            x,
            y,
            width: libraryItem.defaultWidth,
            height: libraryItem.defaultHeight,
            name: tableName || libraryItem.name,
            minCapacity: minCapacity ? parseInt(minCapacity, 10) : undefined,
            maxCapacity: maxCapacity ? parseInt(maxCapacity, 10) : undefined,
        });

        setIsConfigDialogOpen(false);
        setNewElementData(null);
        toast.success(`Added ${tableName || libraryItem.name}`);
    };

    return (
        <>
            <div className="relative h-full overflow-hidden border rounded-lg">
                <div className="absolute top-4 right-4 flex space-x-2 z-10">
                    <Button variant="outline" size="icon" onClick={handleZoomIn} title="Zoom In">
                        <ZoomIn className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={handleZoomOut} title="Zoom Out">
                        <ZoomOut className="h-4 w-4" />
                    </Button>
                    <div className="px-2 py-1 rounded border flex items-center text-sm">
                        <Move className="h-4 w-4 mr-1" />
                        <span>Space + Drag to Pan</span>
                    </div>
                </div>
                <div
                    ref={canvasRef}
                    className="relative w-full h-full overflow-hidden bg-canvas"
                    style={{
                        backgroundImage: `
              linear-gradient(to right, var(--canvas-grid) 1px, transparent 1px),
              linear-gradient(to bottom, var(--canvas-grid) 1px, transparent 1px)
            `,

                        backgroundSize: `${20 * scale}px ${20 * scale}px`,
                        backgroundPosition: `${panOffset.x * scale}px ${panOffset.y * scale}px`,
                    }}
                    onClick={handleCanvasClick}
                    onMouseDown={handleMouseDown}
                    onWheel={handleWheel}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                >
                    {activeFloorplan?.elements.map(element => (
                        <CanvasElement
                            key={element.id}
                            element={element}
                            scale={scale}
                            panOffset={panOffset}
                        />
                    ))}
                </div>
            </div>

            {/* Configuration Dialog for Reservable Items */}
            <Dialog open={isConfigDialogOpen} onOpenChange={setIsConfigDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Configure Table</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="tableName">Table Name</Label>
                            <Input
                                id="tableName"
                                value={tableName}
                                onChange={(e) => setTableName(e.target.value)}
                                placeholder="Table Name"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="minCapacity">Minimum Capacity</Label>
                            <Input
                                id="minCapacity"
                                type="number"
                                value={minCapacity}
                                onChange={(e) => setMinCapacity(e.target.value)}
                                placeholder="1"
                                min="1"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="maxCapacity">Maximum Capacity</Label>
                            <Input
                                id="maxCapacity"
                                type="number"
                                value={maxCapacity}
                                onChange={(e) => setMaxCapacity(e.target.value)}
                                placeholder="4"
                                min={minCapacity || '1'}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsConfigDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleCompleteReservable}>
                            Add Table
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};
