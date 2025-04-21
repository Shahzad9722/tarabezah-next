import { ChevronDown, XCircle } from 'lucide-react';
import { useState } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@radix-ui/react-tooltip';

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
      <div className="w-full mt-10 text-white flex flex-col gap-1.5">
        <div className="bg-color-222036 py-4 px-3.5 font-bold text-md">
          All combinations
        </div>

        {combinations.map((item) => (
          <div key={item.guid} className="bg-color-D0C17">
            <button
              className={`w-full flex justify-between items-center py-2.5 px-4 hover:bg-color-F2C45 transition ${openId === item.guid ? 'bg-color-F2C45' : 'bg-color-D0C17'
                }`}
              onClick={() => toggleAccordion(item)}
            >
              <div className="flex items-center justify-between w-full">
                {/* Left: Name + Delete Button */}
                <div className="flex items-center gap-2 text-left truncate">
                  <span className="truncate">{item.groupName}</span>
                  <Tooltip>
                    <TooltipTrigger
                      asChild
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(item.guid);
                      }}
                    >
                      <span className="text-red-500 hover:text-red-700 cursor-pointer">
                        <XCircle size={18} />
                      </span>
                    </TooltipTrigger>
                    <TooltipContent className="text-xs">Delete combination</TooltipContent>
                  </Tooltip>
                </div>

                {/* Right: Chevron */}
                <div
                  className={`transition-transform ${openId === item.guid ? 'rotate-180' : ''
                    }`}
                >
                  <ChevronDown size={16} />
                </div>
              </div>
            </button>

            {/* Accordion Content */}
            <div
              className={`overflow-hidden transition-all duration-300 px-4 text-[#909090] ${openId === item.guid ? 'max-h-40 py-4' : 'max-h-0 py-0'
                }`}
            >
              {`Tables: [${item.members.map((m) => m.tableId).join(', ')}]`}
            </div>
          </div>
        ))}
      </div>
    </TooltipProvider>
  );
};

export default Accordion;
