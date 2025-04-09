
import React from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ElementLibraryItem } from '@/types';

interface TableConfigDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  tableName: string;
  setTableName: (name: string) => void;
  minCapacity: string;
  setMinCapacity: (capacity: string) => void;
  maxCapacity: string;
  setMaxCapacity: (capacity: string) => void;
  onComplete: () => void;
}

export const TableConfigDialog: React.FC<TableConfigDialogProps> = ({
  isOpen,
  onOpenChange,
  tableName,
  setTableName,
  minCapacity,
  setMinCapacity,
  maxCapacity,
  setMaxCapacity,
  onComplete,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Configure Table</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="tableName">Table Name</Label>
            <Input
              id="tableName"
              value={tableName}
              onChange={(e) => setTableName(e.target.value)}
              placeholder="Table Name"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="minCapacity">Minimum Capacity</Label>
            <Input
              id="minCapacity"
              type="number"
              value={minCapacity}
              onChange={(e) => setMinCapacity(e.target.value)}
              placeholder="1"
              min="1"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="maxCapacity">Maximum Capacity</Label>
            <Input
              id="maxCapacity"
              type="number"
              value={maxCapacity}
              onChange={(e) => setMaxCapacity(e.target.value)}
              placeholder="4"
              min={minCapacity || '1'}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onComplete}>
            Add Table
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
