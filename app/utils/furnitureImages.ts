
// Map of furniture types to their image paths
export const furnitureImages: Record<string, string> = {
  // Tables
  'table-round-small': '/images/elements/rt-c2.svg',
  'table-round-medium': '/images/elements/rt-c4.svg',
  'table-round-large': '/images/elements/rt-c6.svg',
  'table-square-small': '/images/elements/st-c4.svg',
  'table-square-medium': '/images/elements/st-c6.svg',
  'table-rect-small': '/images/elements/ot-c6.svg',

  
};

// Default placeholder image if a specific image is not found
export const defaultFurnitureImage = '/placeholder.svg';

// Get the image path for a furniture type
export function getFurnitureImage(type: string): string {
  return furnitureImages[type] || defaultFurnitureImage;
}
