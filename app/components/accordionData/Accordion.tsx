import { ChevronDown, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@radix-ui/react-tooltip';

interface CombinationMember {
  guid: string;
  floorplanElementInstanceGuid: string;
  tableId: string;
}

interface Combination {
  groupName: string;
  guid: string;
  maxCapacity: number;
  minCapacity: number;
  members: CombinationMember[];
  index: string;
}

interface AccordionProps {
  combinations: Combination[];
  onExpand: (combination: Combination | null) => void;
  onDelete: (guid: string) => void;
}

const Accordion = ({ combinations, onExpand, onDelete }: AccordionProps) => {
  const [openId, setOpenId] = useState<string | null>(null);

  const toggleAccordion = (combination: Combination) => {
    const newId = openId === combination.guid ? null : combination.guid;
    setOpenId(newId);
    onExpand(newId ? combination : null);
  };

  return (
    <TooltipProvider>
      <div className='w-full flex flex-col gap-1 text-white'>

        {/* Section Label */}
        <div className='bg-[#2E2A4B] px-4 py-2 font-bold text-sm'>
          All combinations
        </div>

        {combinations.map((item) => {
          const isOpen = openId === item.guid;

          return (
            <div key={item.guid} className='bg-[#181628] border-b border-[#2E2A4B]'>

              {/* Collapsed Row */}
              <div
                className='flex justify-between items-center px-4 py-3 cursor-pointer hover:bg-[#1F1C33]'
                onClick={() => toggleAccordion(item)}
              >
                <span className='truncate'>{item.groupName} ({item.members.length})</span>
                <ChevronDown
                  className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
                  size={18}
                />
              </div>

              {/* Expanded Content */}
              {isOpen && (
                <div className='px-4 pb-3 text-sm text-[#B0B0B0]'>
                  {/* Min/Max/Delete Row */}
                  <div className='flex justify-between items-center mb-1'>
                    <div className='flex gap-6'>
                      <span>Min: {item.minCapacity}</span>
                      <span>Max: {item.maxCapacity}</span>
                    </div>
                    <Tooltip>
                      <TooltipTrigger
                        onClick={() => onDelete(item.guid)}
                        className='text-red-400 hover:text-red-600 cursor-pointer'
                      >
                        <Trash2 size={16} />
                      </TooltipTrigger>
                      <TooltipContent className='text-xs'>
                        Delete combination
                      </TooltipContent>
                    </Tooltip>
                  </div>

                  {/* Table List */}
                  <div className='text-[#909090] text-xs'>
                    Tables: [{item.members.map((m) => m.tableId).join(', ')}]
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </TooltipProvider>
  );
};

export default Accordion;
