import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/app/components/ui/dialog';
import { Button } from '@/app/components/ui/button';

interface ConfirmationDialogProps {
  open: boolean;
  onConfirm: any;
}

export default function ConfirmationDialog({ open, onConfirm }: ConfirmationDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onConfirm}>
      <DialogContent className='bg-color-222036 border-0 flex flex-col items-center gap-[82px]'>
        <DialogHeader className=''>
          <DialogTitle className='text-[26px]'>Confirm Reservation</DialogTitle>
        </DialogHeader>
        <DialogFooter>
          <Button type='button' onClick={onConfirm}>
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
