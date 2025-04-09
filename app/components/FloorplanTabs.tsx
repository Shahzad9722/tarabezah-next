
import React, { useState } from 'react';
import { useFloorplan } from '@/app/context/FloorplanContext';
import { Button } from '@/app/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/app/components/ui/dialog';
import { Input } from '@/app/components/ui/input';
import { PlusCircle, Trash2 } from 'lucide-react';

export const FloorplanTabs: React.FC = () => {
    const {
        restaurant,
        activeFloorplanId,
        setActiveFloorplanId,
        addFloorplan,
        deleteFloorplan
    } = useFloorplan();

    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [newFloorplanName, setNewFloorplanName] = useState('');

    const handleAddFloorplan = () => {
        if (newFloorplanName.trim() === '') return;

        addFloorplan(newFloorplanName);
        setNewFloorplanName('');
        setIsAddDialogOpen(false);
    };

    return (
        <div className="flex items-center gap-2">
            <Tabs
                value={activeFloorplanId}
                onValueChange={setActiveFloorplanId}
                className="flex-1"
            >
                <TabsList className="w-full">
                    {restaurant.floorplans.map(floorplan => (
                        <div key={floorplan.id} className="flex items-center">
                            <TabsTrigger
                                value={floorplan.id}
                                className="flex-1"
                            >
                                {floorplan.name}
                            </TabsTrigger>
                            {restaurant.floorplans.length > 1 && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 ml-1"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        deleteFloorplan(floorplan.id);
                                    }}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            )}
                        </div>
                    ))}
                </TabsList>
            </Tabs>

            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                    <Button variant="outline" size="icon">
                        <PlusCircle className="h-5 w-5" />
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add New Floorplan</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        <Input
                            placeholder="Floorplan Name"
                            value={newFloorplanName}
                            onChange={(e) => setNewFloorplanName(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') handleAddFloorplan();
                            }}
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleAddFloorplan}>
                            Add Floorplan
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};
