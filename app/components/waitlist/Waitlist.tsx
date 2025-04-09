import React from "react";
import { Search, Filter} from "lucide-react";
import Image from "next/image";

const WaitlistItem = () => {
  return (
    <div className="bg-gray-900 p-4 rounded-lg border border-gray-700 flex flex-col gap-2">

      <div className="flex gap-2">
        <div className="p-[17px_2px] h-[88px] w-[22px] bg-[#B98858]">
          <Image
            src={"/images/tick.svg"}
            alt={"tick"}
            width={12}
            height={12}
            className="m-auto h-full"
          />
        </div>
        <div className="flex justify-between w-full">
          <div className="flex flex-col gap-2">
            <p className="text-[#E9E3D7] font-poppins text-sm font-normal leading-normal">Ahmad Khalid</p>
            <p className="text-[#E9E3D7] font-poppins text-sm font-normal leading-normal">10:10 A.M • Late</p>
            <div className="p-[2px_4px] rounded-[3px] border-2 border-[#B98858] flex gap-2 w-fit">
              <Image
                src={"/images/crown.svg"}
                alt={"tick"}
                width={12}
                height={12}
                className="m-auto h-full"
              />
              <p className="text-[#E9E3D7] font-poppins text-sm font-normal leading-normal">Vip</p>
            </div>
          </div>
        </div>
        <div className="flex gap-1 h-max">
          <div className="flex flex-col items-start p-[5px_8px] gap-5 w-max">
            <Image
              src={"/images/formkit_people.svg"}
              alt={"tick"}
              width={16}
              height={16}
              className="h-4 w-4"
            />
            <p className="text-[#E9E3D7] center font-inter text-[14px] font-medium leading-normal"
            >Vip</p>
          </div>
          <div className="flex flex-col items-start p-[5px_8px] gap-5 w-max border border-dashed border-[#E9E3D7]">
            <p className="text-[#E9E3D7] center font-inter text-[14px] font-medium leading-normal "
            >Vip</p>
            <Image
              src={"/images/cake.svg"}
              alt={"tick"}
              width={16}
              height={16}
              className="h-4 w-4"
            />

          </div>

        </div>
      </div>
      <p className="text-[#E9E3D7] font-poppins text-[12px] font-normal leading-normal"
      >Notes: Lorem ipsum dolor sit amet.</p>

    </div>
  );
};

const Waitlist = () => {
  return (
    <div className="bg-gray-950 min-h-screen p-4 text-white">
      <div className="flex items-center justify-between mb-4">
        <div className="relative w-full max-w-md">
          <input
            type="text"
            placeholder="Search....."
            className="bg-gray-800 text-white w-full px-4 py-2 rounded-lg pl-10 focus:outline-none"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
        </div>
        <button className="ml-4 p-2 bg-gray-800 rounded-lg">
          <Filter className="text-white w-5 h-5" />
        </button>
      </div>
      <div className="flex justify-between w-full" >
        <div className=" mb-4">
          <h2 className="text-[#E9E3D7] font-poppins text-[14px] font-medium leading-normal uppercase">WAITLIST</h2>
          <h2 className="text-[#E9E3D7] font-poppins text-[12px] font-normal leading-normal underline decoration-solid capitalize">By scheduled time</h2>
        </div>

        <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
          <div className="flex gap-1">
            <Image
              src={"/images/formkit_people.svg"}
              alt={"tick"}
              width={16}
              height={16}
              className="h-6 w-6"
            />
            2
          </div>
          <div className="flex gap-1">
            <Image
              src={"/images/document-list.svg"}
              alt={"tick"}
              width={16}
              height={16}
              className="h-6 w-6"
            />
            10
          </div>
          <div className="flex gap-1">
            <Image
              src={"/images/up-arrow.svg"}
              alt={"tick"}
              width={16}
              height={16}
              className="h-6 w-6"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <WaitlistItem />
        <WaitlistItem />
      </div>
    </div>
  );
};

export default Waitlist;
