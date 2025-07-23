import { useState } from 'react';
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
import FormSelect from './ui/form-select';
import { AppDispatch, RootState } from '@/store/store';
import { useDispatch, useSelector } from 'react-redux';
import { setFilters } from '@/store/features/combination-filters/combinationFilterSlice';

interface FloorControlsProps {
  onRemoveFloor: (id: string) => void;
  onRenameFloor: (id: string, newName: string) => void;
}

export function FloorControls({ onRemoveFloor, onRenameFloor }: FloorControlsProps) {
  const { addFloorplan, onFloorPlanChange, activeFloorplanId, restaurant } = useFloorplan();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
  const [newFloorplanName, setNewFloorplanName] = useState('');
  const [floorToRename, setFloorToRename] = useState({
    id: '',
    name: '',
  });

  const selectedFilters = useSelector((state: RootState) => state.combinationFilter.filters);
  const dispatch = useDispatch<AppDispatch>();

  const handleAddFloorplan = () => {
    if (newFloorplanName.trim() === '') {
      toast.error('Floorplan name cannot be empty.');
      return;
    }

    addFloorplan(newFloorplanName);
    setNewFloorplanName('');
    setIsAddDialogOpen(false);
    toast.success(`Floorplan "${newFloorplanName}" added successfully`);
  };

  const handleRenameClick = (id: string) => {
    const floor = restaurant.floorplans.find((floor) => floor.guid === id);
    if (floor) {
      setFloorToRename({ id, name: floor.name });
      setIsRenameDialogOpen(true);
    }
  };

  const handleRenameSubmit = () => {
    onRenameFloor(floorToRename.id, floorToRename.name);
    setIsRenameDialogOpen(false);
  };
  return (
    <div className=''>
      <div className='flex flex-col md:flex-row md:items-center pt-1 gap-2 bg-[#121020] '>
        {/* Floor Selection Dropdown */}
        <div className='flex flex-1 items-center gap-2'>
          <div className='relative w-[300px] '>

            <FormSelect
              value={activeFloorplanId}
              onChange={(value) => {
                dispatch(setFilters({ ...selectedFilters, floorPlanId: value }));
                onFloorPlanChange(value);
              }}
              options={restaurant.floorplans.map((floor) => ({
                label: floor.name,
                value: floor.guid,
              }))}
              className='text-xl'
            />
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
            onClick={() => handleRenameClick(activeFloorplanId)}
            className='bg-color-222036 h-[44px] w-[30px] backdrop-blur-sm text-color-B98858 rounded-none'
            title='Rename Floor'
            aria-label='Rename Floor'
          >
            <Pencil className='h-4 w-4' />
          </Button>

          <Button
            variant='outline'
            size='icon'
            onClick={() => onRemoveFloor(activeFloorplanId)}
            className='bg-color-222036 h-[44px] w-[30px] backdrop-blur-sm text-color-B98858 rounded-none'
            // disabled={restaurant.floorplans.length <= 1}
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
