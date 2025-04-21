import { Button } from '@/app/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/app/components/ui/dialog';
import { Input } from '@/app/components/ui/input';
import { useState } from 'react';
import { toast } from 'sonner';

interface TableInfoDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (info: { combinationName: string; minCapacity: number; maxCapacity: number }) => void;
}

export default function CombinationInfoDialog({ open, onClose, onSave }: TableInfoDialogProps) {
  const [combinationName, setCombinationName] = useState('');
  const [minCapacity, setMinCapacity] = useState<number | ''>(1);
  const [maxCapacity, setMaxCapacity] = useState<number | ''>(2);

  const isFormValid =
    combinationName.trim() !== '' &&
    minCapacity !== '' &&
    maxCapacity !== '' &&
    minCapacity >= 0 &&
    maxCapacity >= 0 &&
    minCapacity <= maxCapacity;

  const handleSave = () => {
    if (!isFormValid) {
      toast.error('Please fill all fields correctly.');
      return;
    }

    onSave({
      combinationName: combinationName.trim(),
      minCapacity: Number(minCapacity),
      maxCapacity: Number(maxCapacity),
    });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Enter Combination Information</DialogTitle>
        </DialogHeader>
        <div className='grid gap-4 py-4'>
          {/* Name */}
          <div className='grid grid-cols-4 items-center gap-4'>
            <label htmlFor='tableNumber'>Name</label>
            <Input
              id='tableNumber'
              value={combinationName}
              onChange={(e) => setCombinationName(e.target.value)}
              className='col-span-3'
            />
          </div>

          {/* Min Capacity */}
          <div className='grid grid-cols-4 items-center gap-4'>
            <label htmlFor='minCapacity'>Min Capacity</label>
            <Input
              id='minCapacity'
              type='number'
              value={minCapacity === 0 ? '' : minCapacity}
              onChange={(e) => {
                const value = e.target.value === '' ? '' : Number(e.target.value);
                setMinCapacity(value);
              }}
              className='col-span-3'
            />
          </div>

          {/* Max Capacity */}
          <div className='grid grid-cols-4 items-center gap-4'>
            <label htmlFor='maxCapacity'>Max Capacity</label>
            <Input
              id='maxCapacity'
              type='number'
              value={maxCapacity === 0 ? '' : maxCapacity}
              onChange={(e) => {
                const value = e.target.value === '' ? '' : Number(e.target.value);
                setMaxCapacity(value);
              }}
              className='col-span-3'
            />
          </div>
        </div>

        {/* Footer */}
        <DialogFooter>
          <Button variant='outline' onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!isFormValid}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

