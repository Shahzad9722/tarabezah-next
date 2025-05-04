import React from 'react';
import { useDragLayer } from 'react-dnd';
import Image from 'next/image';
import { Table } from '@/app/types/restaurant';

function getItemStyles(initialOffset: any, currentOffset: any): React.CSSProperties {
    if (!initialOffset || !currentOffset) {
        return { display: 'none' };
    }
    const { x, y } = currentOffset;
    return {
        position: 'fixed',
        pointerEvents: 'none' as React.CSSProperties['pointerEvents'],
        left: x,
        top: y,
        transform: `translate(0px, 0px)`,
        zIndex: 9999,
    };
}

const CustomDragLayer: React.FC = () => {
    const {
        itemType,
        isDragging,
        item,
        initialOffset,
        currentOffset,
    } = useDragLayer((monitor) => ({
        item: monitor.getItem(),
        itemType: monitor.getItemType(),
        isDragging: monitor.isDragging(),
        initialOffset: monitor.getInitialSourceClientOffset(),
        currentOffset: monitor.getSourceClientOffset(),
    }));

    if (!isDragging || itemType !== 'TABLE' || !item?.tableType) {
        return null;
    }

    const table: Table = item.tableType;
    const style = getItemStyles(initialOffset, currentOffset);

    let baseStyle = 'flex items-center justify-center relative shadow-md ';
    if (table.shape === 'circle') {
        baseStyle += 'rounded-full ';
    } else if (table.shape === 'square' || table.shape === 'rectangle') {
        baseStyle += 'rounded-lg ';
    }
    baseStyle += 'bg-white border border-gray-300 opacity-80';

    return (
        <div style={style} className={baseStyle}>
            {table.elementImageUrl ? (
                <Image
                    src={table.elementImageUrl}
                    alt={table.tableId}
                    className='object-contain w-full h-full'
                    width={table.width}
                    height={table.height}
                />
            ) : (
                <div
                    style={{
                        width: table.width,
                        height: table.height,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold',
                        fontSize: 16,
                    }}
                >
                    {table.name || table.tableId || 'Table'}
                </div>
            )}
        </div>
    );
};

export default CustomDragLayer; 