import { Card } from "@/app/components/ui/card";
import FurnitureElement from "../furniture/FurnitureElement";
import type { DraggableFurniture, FurnitureType } from "@/app/types/furniture";
// import BookignElements from '../bookignElements/BookignElements';

const FURNITURE_ITEMS: DraggableFurniture[] = [
  { id: "round-2", type: "round-2", label: "Round Table (2 Chairs)" },
  { id: "round-4", type: "round-4", label: "Round Table (4 Chairs)" },
  { id: "round-6", type: "round-6", label: "Round Table (6 Chairs)" },
  { id: "rect-4", type: "rect-4", label: "Rectangle Table (4 Chairs)" },
  { id: "rect-6", type: "rect-6", label: "Rectangle Table (6 Chairs)" },
  { id: "rect-8", type: "rect-8", label: "Rectangle Table (8 Chairs)" },
];

export default function FurnitureSidebar() {
  return (
    <Card className="w-full md:w-[407px] py-4 px-3 md:h-screen rounded-xl overflow-y-auto border-none bg-[linear-gradient(119.26deg,_rgba(18,_17,_32,_0.23)_45.47%,_rgba(185,_136,_88,_0.23)_105.35%)]">
      <h2 className="text-xl font-medium mb-7">Elements</h2>
      <div className="grid grid-cols-3 gap-3">
        {FURNITURE_ITEMS.map((item) => (
          <div
            key={item.id}
            className="flex flex-col items-center p-2 rounded-xl justify-between group hover:bg-[#FFFFFF1A]"
          >
            <FurnitureElement
              type={item.type as FurnitureType}
              isPlaced={false}
            />
            <span className="text-xs mt-3 text-center lg:opacity-0 lg:group-hover:opacity-100">
              {item.label}
            </span>
          </div>
        ))}
      </div>
      {/* <BookignElements /> */}
    </Card>
  );
}
