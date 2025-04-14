import { useState } from 'react';
import { Floor } from '@/app/page';
import { Button } from '@/app/components/ui/button';
import { Plus, Pencil, Trash2, ChevronDown } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/app/components/ui/dialog';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { useFloorplan } from '@/app/context/FloorplanContext';
import { toast } from 'sonner';

interface FloorControlsProps {
  floors: any[];
  activeFloorIndex: number;
  onFloorChange: (floorId: string) => void;
  onRemoveFloor: (index: number) => void;
  onRenameFloor: (index: number, newName: string) => void;
}

export function FloorControls({ floors, activeFloorIndex, onRemoveFloor, onRenameFloor }: FloorControlsProps) {
  const { addFloorplan, onFloorPlanChange, activeFloorplanId } = useFloorplan();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
  const [newFloorplanName, setNewFloorplanName] = useState('');
  const [floorToRename, setFloorToRename] = useState({
    index: 0,
    name: '',
  });

  const handleAddFloorplan = () => {
    if (newFloorplanName.trim() === '') {
      toast.error('Floorplan name cannot be empty.');
      return;
    }

    // console.log('Adding new floorplan:', newFloorplanName);
    addFloorplan(newFloorplanName);
    setNewFloorplanName('');
    setIsAddDialogOpen(false);
    toast.success(`Floorplan "${newFloorplanName}" added successfully`);
  };

  const handleRenameClick = (index: number) => {
    setFloorToRename({ index, name: floors[index].name });
    setIsRenameDialogOpen(true);
  };

  const handleRenameSubmit = () => {
    onRenameFloor(floorToRename.index, floorToRename.name);
    setIsRenameDialogOpen(false);
  };
  console.log('floors', floors);
  return (
    <div className=''>
      <div className='flex flex-col md:flex-row md:items-center  gap-2 bg-[#121020] '>
        {/* Floor Selection Dropdown */}
        <div className='flex flex-1 items-center gap-2'>
          <div className='relative w-full '>
            <select
              className='bg-color-222036 text-color-E9E3D7 pl-4 pr-8 py-2 rounded-[4px] w-full text-xl appearance-none'
              value={activeFloorplanId}
              onChange={(e) => onFloorPlanChange(e.target.value)}
            >
              {floors.map((floor) => (
                <option key={floor.guid} value={floor.guid}>
                  {floor.name}
                </option>
              ))}
            </select>
            <ChevronDown className='absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none' />
          </div>
        </div>

        {/* Action Buttons */}
        <div className='flex z-10 rounded-[4px] overflow-hidden'>
          <Button
            variant='outline'
            size='icon'
            onClick={() => setIsAddDialogOpen(true)}
            className='bg-color-222036 h-[44px] w-[30px] backdrop-blur-sm text-color-B98858 rounded-none'
            title='Add Floorplan'
            aria-label='Add Floorplan'
          >
            <Plus className='h-4 w-4' />
          </Button>

          <Button
            variant='outline'
            size='icon'
            onClick={() => handleRenameClick(activeFloorIndex)}
            className='bg-color-222036 h-[44px] w-[30px] backdrop-blur-sm text-color-B98858 rounded-none'
            title='Rename Floor'
            aria-label='Rename Floor'
          >
            <Pencil className='h-4 w-4' />
          </Button>

          <Button
            variant='outline'
            size='icon'
            onClick={() => onRemoveFloor(activeFloorIndex)}
            className='bg-color-222036 h-[44px] w-[30px] backdrop-blur-sm text-color-B98858 rounded-none'
            disabled={floors.length <= 1}
            title='Remove Floor'
            aria-label='Remove Floor'
          >
            <Trash2 className='h-4 w-4' />
          </Button>
        </div>

        {/* Add Floorplan Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className='bg-color-D0C17'>
            <DialogHeader>
              <DialogTitle>Add New Floorplan</DialogTitle>
            </DialogHeader>
            <div className='py-4'>
              <Input
                placeholder='Floorplan Name'
                value={newFloorplanName}
                onChange={(e) => setNewFloorplanName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddFloorplan()}
                autoFocus
              />
            </div>
            <DialogFooter>
              <Button variant='outline' onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddFloorplan}>Add Floorplan</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Rename Floor Dialog */}
        <Dialog open={isRenameDialogOpen} onOpenChange={setIsRenameDialogOpen}>
          <DialogContent className='bg-color-D0C17'>
            <DialogHeader>
              <DialogTitle>Rename Floor</DialogTitle>
              <DialogDescription>Enter a new name for this floor.</DialogDescription>
            </DialogHeader>
            <div className='grid gap-4 py-4'>
              <div className='grid grid-cols-4 items-center gap-4'>
                <Label htmlFor='floor-name' className='text-right'>
                  Name
                </Label>
                <Input
                  id='floor-name'
                  value={floorToRename.name}
                  onChange={(e) => setFloorToRename({ ...floorToRename, name: e.target.value })}
                  className='col-span-3'
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant='outline' onClick={() => setIsRenameDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleRenameSubmit}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
