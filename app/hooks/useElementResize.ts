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
        e.preventDefault();
        e.stopPropagation();

        const initialX = e.clientX;
        const initialY = e.clientY;
        const initialWidth = element.width;
        const initialHeight = element.height;
        const initialLeft = element.x;
        const initialTop = element.y;

        const onMouseMove = (moveEvent: MouseEvent) => {
            const dx = (moveEvent.clientX - initialX) / scale;
            const dy = (moveEvent.clientY - initialY) / scale;

            let newWidth = initialWidth;
            let newHeight = initialHeight;
            let newX = initialLeft;
            let newY = initialTop;

            switch (direction) {
                case 'top-left':
                    newWidth = initialWidth - dx;
                    newHeight = initialHeight - dy;
                    newX = initialLeft + dx;
                    newY = initialTop + dy;
                    break;
                case 'top-right':
                    newWidth = initialWidth + dx;
                    newHeight = initialHeight - dy;
                    newY = initialTop + dy;
                    break;
                case 'bottom-left':
                    newWidth = initialWidth - dx;
                    newHeight = initialHeight + dy;
                    newX = initialLeft + dx;
                    break;
                case 'bottom-right':
                    newWidth = initialWidth + dx;
                    newHeight = initialHeight + dy;
                    break;
            }

            if (resizeTimeout.current) clearTimeout(resizeTimeout.current);
            resizeTimeout.current = setTimeout(() => {
                updateElement(element.localId, {
                    width: Math.max(newWidth, 10),
                    height: Math.max(newHeight, 10),
                    x: newX,
                    y: newY,
                });
            }, 16); // ~60fps
        };

        const onMouseUp = () => {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
            if (resizeTimeout.current) clearTimeout(resizeTimeout.current);
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