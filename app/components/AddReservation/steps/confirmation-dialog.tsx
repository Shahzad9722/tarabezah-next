import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/app/components/ui/dialog';
import { Button } from '@/app/components/ui/button';

interface ConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: any;
  submittingForm: boolean;
}

export default function ConfirmationDialog({ open, onOpenChange, onSubmit, submittingForm }: ConfirmationDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='bg-color-222036 border-0 flex flex-col items-center gap-[82px]'>
        <DialogHeader className=''>
          <DialogTitle className='text-[26px]'>Reservation Confirmed!</DialogTitle>
        </DialogHeader>
        <DialogFooter>
          <Button type='button' disabled={submittingForm} onClick={onSubmit}>
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
