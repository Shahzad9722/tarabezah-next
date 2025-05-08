import { useEffect, useRef } from 'react';
import { CanvasElement } from '@/app/types';
import { useFloorplan } from '@/app/context/FloorplanContext';

interface ResizeOptions {
    element: CanvasElement;
    scale: number;
}

export function useElementResize({ element, scale }: ResizeOptions) {
    const { updateElement } = useFloorplan();
    const resizeTimeout = useRef<NodeJS.Timeout | null>(null);

    const startResize = (direction: string, e: React.MouseEvent) => {
        const initialX = e.clientX;
        const initialY = e.clientY;
        const initialWidth = element.width;
        const initialHeight = element.height;

        const onMouseMove = (moveEvent: MouseEvent) => {
            const dx = moveEvent.clientX - initialX;
            const dy = moveEvent.clientY - initialY;

            let newWidth = initialWidth;
            let newHeight = initialHeight;

            if (direction === 'top-left') {
                newWidth = initialWidth - dx;
                newHeight = initialHeight - dy;
            } else if (direction === 'top-right') {
                newWidth = initialWidth + dx;
                newHeight = initialHeight - dy;
            } else if (direction === 'bottom-left') {
                newWidth = initialWidth - dx;
                newHeight = initialHeight + dy;
            } else if (direction === 'bottom-right') {
                newWidth = initialWidth + dx;
                newHeight = initialHeight + dy;
            }

            if (resizeTimeout.current) clearTimeout(resizeTimeout.current);
            resizeTimeout.current = setTimeout(() => {
                updateElement(element.localId, {
                    width: Math.max(newWidth, 10),  // Prevent too small widths/heights
                    height: Math.max(newHeight, 10),
                });
            }, 100);
        };

        const onMouseUp = () => {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        };

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    };

    useEffect(() => {
        return () => {
            if (resizeTimeout.current) clearTimeout(resizeTimeout.current);
        };
    }, []);

    return { startResize };
}
