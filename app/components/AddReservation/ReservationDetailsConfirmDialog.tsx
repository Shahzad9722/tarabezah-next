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

interface ReservationConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  reservationData: {
    clientName?: string;
    date?: string;
    time?: string;
    partySize?: number;
    notes?: string;
  };
}

export default function ReservationConfirmDialog({
  open,
  onClose,
  onConfirm,
  reservationData,
}: ReservationConfirmDialogProps) {
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
      <DialogContent className='sm:max-w-[425px] bg-color-121020 rounded-xl border-none'>
        <DialogHeader>
          <DialogTitle>Confirm Reservation</DialogTitle>
          <DialogDescription>Please review the reservation details before confirming.</DialogDescription>
        </DialogHeader>
        <div className='grid gap-4 py-4'>
          <div className='space-y-2'>
            {reservationData.clientName && (
              <div className='flex justify-between'>
                <span className='font-medium'>Guest:</span>
                <span>{reservationData.clientName}</span>
              </div>
            )}
            {reservationData.date && (
              <div className='flex justify-between'>
                <span className='font-medium'>Date:</span>
                <span>{reservationData.date}</span>
              </div>
            )}
            {reservationData.time && (
              <div className='flex justify-between'>
                <span className='font-medium'>Time:</span>
                <span>{reservationData.time}</span>
              </div>
            )}
            {reservationData.partySize && (
              <div className='flex justify-between'>
                <span className='font-medium'>Party Size:</span>
                <span>{reservationData.partySize} guests</span>
              </div>
            )}
            {reservationData.notes && (
              <div className='flex w-full items-start gap-4'>
                <span className='font-medium whitespace-nowrap'>Notes:</span>
                <span
                  className='rounded-md break-words whitespace-pre-wrap flex-1 text-right'
                  style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}
                >
                  {reservationData.notes}
                </span>
              </div>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button variant='outline' type='button' onClick={handleClose}>
            Back
          </Button>
          <Button type='button' onClick={handleConfirm}>
            Confirm Reservation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
