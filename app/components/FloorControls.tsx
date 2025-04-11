import { useState } from 'react';
import { Floor } from '@/app/page';
import { Button } from '@/app/components/ui/button';

import { PlusCircle, Pencil, Trash2, Plus, MousePointer2, ChevronDown } from 'lucide-react';
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

interface FloorControlsProps {
  floors: Floor[];
  activeFloorIndex: number;
  onFloorChange: (index: string) => void;
  onAddFloor: () => void;
  onRemoveFloor: (index: number) => void;
  onRenameFloor: (index: number, newName: string) => void;
}

export function FloorControls({
  floors,
  activeFloorIndex,
  onFloorChange,
  onAddFloor,
  onRemoveFloor,
  onRenameFloor,
}: FloorControlsProps) {

  const {
    activeFloorplan,
  } = useFloorplan();


  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
  const [floorToRename, setFloorToRename] = useState<{
    index: number;
    name: string;
  }>({ index: 0, name: '' });

  const handleRenameClick = (index: number) => {
    setFloorToRename({ index, name: floors[index].name });
    setIsRenameDialogOpen(true);
  };

  const handleRenameSubmit = () => {
    onRenameFloor(floorToRename.index, floorToRename.name);
    setIsRenameDialogOpen(false);
  };

  return (
    <div className='mb-5'>
      <div className='flex flex-col md:flex-row md:items-center justify-between gap-2 bg-[#121020]'>
        <div className='flex items-center gap-2'>
          <div className='relative w-full md:w-[362px]'>
            <select
              className='bg-color-222036 text-color-E9E3D7 pl-4 pr-8 py-2 rounded-[4px] w-full text-xl appearance-none'
              value={activeFloorplan?.id}
              onChange={(e) => onFloorChange(e.target.value)}
            >
              {floors.map((floor, index) => (
                <option key={floor.guid} value={floor.guid}>
                  {floor.name}
                </option>
              ))}
            </select>
            <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center px-2'>
              <ChevronDown className='h-4 w-4' />
            </div>
          </div>
        </div>

        <div className='flex z-10 rounded-[4px] overflow-hidden'>
          <Button
            variant='outline'
            size='icon'
            onClick={onAddFloor}
            className='bg-color-222036 h-[46px] w-[46px] backdrop-blur-sm text-color-B98858 rounded-none'
            title='Add Floor'
            aria-label='Add Floor'
          >
            <Plus className='h-5 w-5' />
          </Button>

          <Button
            variant='outline'
            size='icon'
            onClick={() => handleRenameClick(activeFloorIndex)}
            className='bg-color-222036 h-[46px] w-[46px] backdrop-blur-sm text-color-B98858 rounded-none'
            title='Rename Floor'
            aria-label='Rename Floor'
          >
            <Pencil className='h-5 w-5' />
          </Button>

          <Button
            variant='outline'
            size='icon'
            onClick={() => onRemoveFloor(activeFloorIndex)}
            className='bg-color-222036 h-[46px] w-[46px] backdrop-blur-sm text-color-B98858 rounded-none'
            disabled={floors.length <= 1}
            title='Remove Floor'
            aria-label='Remove Floor'
          >
            <Trash2 className='h-5 w-5' />
          </Button>
        </div>

        <Dialog open={isRenameDialogOpen} onOpenChange={setIsRenameDialogOpen}>
          <DialogContent>
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
                  autoFocus
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
