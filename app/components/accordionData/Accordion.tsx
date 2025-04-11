import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

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
}

const Accordion = ({ combinations, onExpand }: AccordionProps) => {
  const [openId, setOpenId] = useState<string | null>(null);

  const toggleAccordion = (combination: Combination) => {
    const newId = openId === combination.guid ? null : combination.guid;
    setOpenId(newId);
    onExpand(newId ? combination : null);
  };

  return (
    <div className='w-full mt-10 text-white flex flex-col gap-1.5'>
      <div className='bg-color-222036 py-4 px-3.5 font-bold text-md '>All combinations</div>
      {combinations.toReversed().map((item) => (
        <div key={item.guid} className='bg-color-D0C17'>
          <button
            className={`w-full flex justify-between items-center py-2.5 px-4 hover:bg-color-F2C45 transition ${openId === item.guid ? 'bg-color-F2C45' : 'bg-color-D0C17'
              }`}
            onClick={() => toggleAccordion(item)}
          >
            <span>{`${item.groupName}`}</span>
            <span className={`transition-transform ${openId === item.guid ? 'rotate-180' : ''}`}>
              <ChevronDown height={15} />
            </span>
          </button>
          <div
            className={`overflow-hidden transition-all duration-300 px-4 text-[#909090] ${openId === item.guid ? 'max-h-40 py-4' : 'max-h-0 py-0'
              }`}
          >
            {`Tables: [${item.members.map((member) => member.tableId).join(', ')}]`}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Accordion;