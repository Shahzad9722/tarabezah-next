import { useDraggable } from "@dnd-kit/core";
import type { FurnitureType } from "@/app/types/furniture";
import { CSSProperties } from "react";
import Image from "next/image";

interface FurnitureElementProps {
  type: FurnitureType;
  isPlaced: boolean;
}

export default function FurnitureElement({
  type,
  isPlaced,
}: FurnitureElementProps) {
  const elementId = isPlaced ? type : `sidebar-${type}`;

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: elementId,
    disabled: isPlaced,
    data: {
      type: type,
    },
  });

  const style: CSSProperties | undefined = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  const furnitureImages: Record<FurnitureType, string> = {
    "round-2": "/images/elements/rt-c2.svg",
    "round-4": "/images/elements/rt-c4.svg",
    "round-6": "/images/elements/rt-c6.svg",
    "rect-4": "/images/elements/st-c4.svg",
    "rect-6": "/images/elements/st-c6.svg",
    "rect-8": "/images/elements/ot-c6.svg",
  };

  const imageSize = isPlaced ? 60 : 45;
  const imageSrc = furnitureImages[type] || "/images/elements/default.svg";

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`cursor-move touch-none ${
        isPlaced ? "" : "hover:scale-105 transition-transform"
      }`}
    >
      <div className="relative flex items-center justify-center">
        <Image
          src={imageSrc}
          alt={`Furniture ${type}`}
          width={imageSize}
          height={imageSize}
          className="w-14 h-14 md:w-[75px] md:h-[75px] furniture-element"
        />
      </div>
    </div>
  );
}