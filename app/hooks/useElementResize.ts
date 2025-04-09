
import { useState, useEffect } from 'react';
import { CanvasElement } from '@/app/types';

interface ResizeOptions {
    element: CanvasElement;
    scale: number;
    updateElement: (id: string, updates: Partial<CanvasElement>) => void;
}

export const useElementResize = ({ element, scale, updateElement }: ResizeOptions) => {
    const [isResizing, setIsResizing] = useState(false);
    const [resizeHandle, setResizeHandle] = useState<string | null>(null);
    const [startPos, setStartPos] = useState({ x: 0, y: 0 });
    const [startDims, setStartDims] = useState({ width: 0, height: 0 });
    const [startElemPos, setStartElemPos] = useState({ x: 0, y: 0 });

    const startResize = (handle: string, e: React.MouseEvent) => {
        setIsResizing(true);
        setResizeHandle(handle);
        setStartPos({ x: e.clientX, y: e.clientY });
        setStartDims({ width: element.width, height: element.height });
        setStartElemPos({ x: element.x, y: element.y });
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (!isResizing || !resizeHandle) return;

        const dx = (e.clientX - startPos.x) / scale;
        const dy = (e.clientY - startPos.y) / scale;

        let newWidth = startDims.width;
        let newHeight = startDims.height;
        let newX = startElemPos.x;
        let newY = startElemPos.y;

        switch (resizeHandle) {
            case 'top-left':
                newWidth = Math.max(20, startDims.width - dx);
                newHeight = Math.max(20, startDims.height - dy);
                newX = startElemPos.x + (startDims.width - newWidth);
                newY = startElemPos.y + (startDims.height - newHeight);
                break;
            case 'top-right':
                newWidth = Math.max(20, startDims.width + dx);
                newHeight = Math.max(20, startDims.height - dy);
                newY = startElemPos.y + (startDims.height - newHeight);
                break;
            case 'bottom-left':
                newWidth = Math.max(20, startDims.width - dx);
                newHeight = Math.max(20, startDims.height + dy);
                newX = startElemPos.x + (startDims.width - newWidth);
                break;
            case 'bottom-right':
                newWidth = Math.max(20, startDims.width + dx);
                newHeight = Math.max(20, startDims.height + dy);
                break;
        }

        updateElement(element.id, {
            x: newX,
            y: newY,
            width: newWidth,
            height: newHeight,
        });
    };

    const handleMouseUp = () => {
        setIsResizing(false);
        setResizeHandle(null);
    };

    useEffect(() => {
        if (isResizing) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);

            return () => {
                window.removeEventListener('mousemove', handleMouseMove);
                window.removeEventListener('mouseup', handleMouseUp);
            };
        }
    }, [isResizing, startPos, startDims, resizeHandle, scale, startElemPos]);

    return {
        isResizing,
        startResize
    };
};
