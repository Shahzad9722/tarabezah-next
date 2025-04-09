
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/app/components/ui/dialog";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";

interface EditLabelDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentLabel: string;
  onSave: (newLabel: string) => void;
  itemType: string;
}

export default function EditLabelDialog({
  open,
  onOpenChange,
  currentLabel,
  onSave,
  itemType,
}: EditLabelDialogProps) {
  // Local state for the input value
  const [labelValue, setLabelValue] = React.useState("");
  
  // Update local state when dialog opens or currentLabel changes
  React.useEffect(() => {
    setLabelValue(currentLabel || "");
  }, [open, currentLabel]);
  
  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLabelValue(e.target.value);
  };
  
  // Save the new label
  const handleSave = () => {
    onSave(labelValue);
    onOpenChange(false);
  };
  
  // Close the dialog without saving
  const handleCancel = () => {
    onOpenChange(false);
  };
  
  // Handle Enter key press
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSave();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-poppins">Edit Element Label</DialogTitle>
          <DialogDescription>
            Enter a descriptive name for this element
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="element-type" className="font-poppins">Element Type</Label>
            <Input
              id="element-type"
              value={itemType}
              readOnly
              disabled
              className="font-poppins"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="element-label" className="font-poppins">Label</Label>
            <Input
              id="element-label"
              value={labelValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Enter label for this element"
              className="font-poppins"
              autoFocus
            />
          </div>
        </div>
        <DialogFooter className="flex space-x-2 justify-end">
          <Button
            type="button"
            onClick={handleCancel}
            variant="outline"
            className="font-poppins"
          >
            Cancel
          </Button>
          <Button 
            type="button"
            onClick={handleSave} 
            className="font-poppins"
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
