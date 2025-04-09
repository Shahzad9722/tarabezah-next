
import { useState, useEffect } from 'react';
import { CanvasElement } from '@/app/types';

interface DragOptions {
    element: CanvasElement;
    scale: number;
    updateElement: (id: string, updates: Partial<CanvasElement>) => void;
}

export const useElementDrag = ({ element, scale, updateElement }: DragOptions) => {
    const [isDragging, setIsDragging] = useState(false);
    const [startPos, setStartPos] = useState({ x: 0, y: 0 });

    const startDrag = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsDragging(true);
        setStartPos({ x: e.clientX, y: e.clientY });
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (!isDragging) return;

        const dx = (e.clientX - startPos.x) / scale;
        const dy = (e.clientY - startPos.y) / scale;

        updateElement(element.id, {
            x: element.x + dx,
            y: element.y + dy,
        });

        setStartPos({ x: e.clientX, y: e.clientY });
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    useEffect(() => {
        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);

            return () => {
                window.removeEventListener('mousemove', handleMouseMove);
                window.removeEventListener('mouseup', handleMouseUp);
            };
        }
    }, [isDragging, startPos, scale]);

    return {
        isDragging,
        startDrag
    };
};
