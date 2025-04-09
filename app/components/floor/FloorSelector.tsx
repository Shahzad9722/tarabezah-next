import { Floor } from "@/app/types/furniture";
import {
  Plus,
  MousePointer2,
  ZoomIn,
  ZoomOut,
  Minimize2,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/app/components/ui/button";
import AddFloorDialog from "./AddFloorDialog";
import { useState } from "react";

interface FloorSelectorProps {
  floors: Floor[];
  selectedFloor: number;
  onFloorChange: (floorId: number) => void;
  onAddFloor: (name: string) => void;
}

export default function FloorSelector({
  floors,
  selectedFloor,
  onFloorChange,
  onAddFloor,
}: FloorSelectorProps) {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 bg-[#121020]">
      <div className="relative">
        <select
          className="bg-color-222036 text-color-E9E3D7 pl-4 pr-8 py-2 rounded-[4px] w-full md:w-[362px] text-xl appearance-none"
          value={selectedFloor}
          onChange={(e) => onFloorChange(parseInt(e.target.value))}
        >
          {floors.map((floor) => (
            <option key={floor.id} value={floor.id}>
              {floor.name}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
          <ChevronDown className="h-4 w-4" />
        </div>
      </div>

      <div className="relative flex gap-6 justify-between md:justify-normal">
        <div className="flex z-10 rounded-[4px] overflow-hidden hidden">
          <Button
            variant="outline"
            size="icon"
            // onClick={() => zoomIn()}
            className="bg-color-222036 backdrop-blur-sm text-color-B98858 h-full rounded-none"
          >
            <ZoomIn className="h-5 w-5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            // onClick={() => zoomOut()}
            className="bg-color-222036 backdrop-blur-sm text-color-B98858 h-full rounded-none"
          >
            <ZoomOut className="h-5 w-5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            // onClick={() => resetTransform()}
            className="bg-color-222036 backdrop-blur-sm text-color-B98858 h-full rounded-none"
          >
            <Minimize2 className="h-5 w-5" />
          </Button>
        </div>
        <div className="flex z-10 rounded-[4px] overflow-hidden">
          <Button
            variant="outline"
            size="icon"
            // onClick={() => setDialogOpen(true)}
            className="bg-color-222036 h-[46px] w-[46px] backdrop-blur-sm text-color-B98858 rounded-none hidden"
          >
            <MousePointer2 className="h-5 w-5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setDialogOpen(true)}
            className="bg-color-222036 h-[46px] w-[46px] backdrop-blur-sm text-color-B98858 rounded-none"
          >
            <Plus className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <AddFloorDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onAdd={onAddFloor}
      />
    </div>
  );
}
