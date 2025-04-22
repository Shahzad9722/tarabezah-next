'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/app/components/ui/dialog';
import { Button } from '@/app/components/ui/button';

interface CombinationDeleteConfirmationProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function CombinationDeleteConfirmation({
  open,
  onClose,
  onConfirm,
}: CombinationDeleteConfirmationProps) {
  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className='sm:max-w-[425px] bg-color-222036 border-0'>
        <DialogHeader>
          <DialogTitle className='mb-4'>Are you sure you want to delete this combination?</DialogTitle>
          <DialogDescription>This action cannot be undone.</DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button variant='outline' type='button' onClick={handleClose}>
            Back
          </Button>
          <Button type='button' onClick={handleConfirm}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
