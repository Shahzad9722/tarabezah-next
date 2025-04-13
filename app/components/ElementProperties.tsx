
import React, { useState, useEffect } from 'react';
import { useFloorplan } from '@/app/context/FloorplanContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Button } from '@/app/components/ui/button';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';


export const ElementProperties: React.FC = () => {
    const {
        activeFloorplan,
        selectedElementId,
        elementLibrary,
        updateElement,
        deleteElement
    } = useFloorplan();

    const [name, setName] = useState('');
    const [minCapacity, setMinCapacity] = useState('');
    const [maxCapacity, setMaxCapacity] = useState('');

    const selectedElement = activeFloorplan?.elements.find(el => el.id === selectedElementId);
    const libraryItem = selectedElement
        ? elementLibrary.find(item => item.id === selectedElement.libraryItemId)
        : null;

    // Update form when selection changes
    useEffect(() => {
        if (selectedElement) {
            setName(selectedElement.name || '');
            setMinCapacity(selectedElement.minCapacity?.toString() || '');
            setMaxCapacity(selectedElement.maxCapacity?.toString() || '');
        } else {
            setName('');
            setMinCapacity('');
            setMaxCapacity('');
        }
    }, [selectedElement]);
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedElementId) return;

        if (!name.trim()) {
            toast.error("Name cannot be empty.");
            return;
        }

        const updates: Record<string, any> = { name };

        if (selectedElement?.elementType === 'reservable') {
            const min = parseInt(minCapacity, 10);
            const max = parseInt(maxCapacity, 10);

            if (isNaN(min) || min < 1) {
                toast.error("Minimum capacity must be a valid number greater than 0.");
                return;
            }

            if (isNaN(max) || max < min) {
                toast.error("Maximum capacity must be a number greater than or equal to minimum.");
                return;
            }

            updates.minCapacity = min;
            updates.maxCapacity = max;
        }

        updateElement(selectedElementId, updates);
        toast.success("Element updated successfully.");
    };


    const handleDelete = () => {
        if (selectedElementId) {
            deleteElement(selectedElementId);
        }
    };

    if (!selectedElement || !libraryItem) {

        return (
            <Card>
                <CardHeader>
                    <CardTitle>Properties</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground text-sm">Select an element to edit its properties</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center align justify-between pb-2">
                <CardTitle>
                    <span className=" text-xs pb-1">
                        <img
                            src={libraryItem.elementImageUrl}
                            alt={libraryItem.name}
                            className="max-w-[50px] max-h-[50px]"
                        />
                    </span>
                </CardTitle>
                <Button variant="ghost" size="icon" onClick={handleDelete}>
                    <Trash2 className="h-4 w-4" />
                </Button>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder={libraryItem.name}
                        />
                    </div>

                    {selectedElement.elementType === 'reservable' && (
                        <>
                            <div className="space-y-2">
                                <Label htmlFor="minCapacity">Min Capacity</Label>
                                <Input
                                    id="minCapacity"
                                    type="number"
                                    value={minCapacity}
                                    onChange={(e) => setMinCapacity(e.target.value)}
                                    min={minCapacity || '1'}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="maxCapacity">Max Capacity</Label>
                                <Input
                                    id="maxCapacity"
                                    type="number"
                                    value={maxCapacity}
                                    onChange={(e) => setMaxCapacity(e.target.value)}
                                    max={minCapacity || '1'}
                                />
                            </div>
                        </>
                    )}

                    <Button type="submit" className="w-full">Apply Changes</Button>
                </form>
            </CardContent>
        </Card>
    );
};
