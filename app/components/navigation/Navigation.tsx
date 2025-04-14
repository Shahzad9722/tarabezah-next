'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Button } from '@/app/components/ui/button';

export default function Navigation({ onPublish }: { onPublish?: any }) {
  const pathname = usePathname();
  const hideButton = pathname === '/table-combination';
  return (
    <div className='w-full flex flex-col md:flex-row md:items-center justify-between my-2 px-4'>
      <div className='flex items-center overflow-x-auto mb-4 md:mb-0 md:overflow-x-visible'>
        <Link
          href='/'
          className='flex items-center gap-2 md:gap-4 text-color-BE963C hover:bg-color-222036 rounded-lg text-md font-normal px-2 py-2 md:px-4 md:py-4 whitespace-nowrap'
        >
          <svg width='24' height='24' viewBox='0 0 36 36' fill='none' xmlns='http://www.w3.org/2000/svg'>
            <path
              d='M31.5 2.25H4.5C3.2625 2.25 2.25 3.2625 2.25 4.5V31.5C2.25 32.7375 3.2625 33.75 4.5 33.75H21.375V31.5C21.375 28.35 23.85 25.875 27 25.875V23.625C22.6125 23.625 19.125 27.1125 19.125 31.5H15.75V27H13.5V31.5H4.5V4.5H13.5V20.25H15.75V14.625H20.25V12.375H15.75V4.5H31.5V12.375H27V14.625H31.5V31.5H27V33.75H31.5C32.7375 33.75 33.75 32.7375 33.75 31.5V4.5C33.75 3.2625 32.7375 2.25 31.5 2.25Z'
              fill='#BE963C'
            />
          </svg>
          Floorplan
        </Link>
        <Link
          href='/table-combination'
          className='flex items-center gap-2 md:gap-4 text-color-BE963C hover:bg-color-222036 rounded-lg text-md font-normal px-2 py-2 md:px-4 md:py-4 whitespace-nowrap'
        >
          <svg width='24' height='24' viewBox='0 0 37 36' fill='none' xmlns='http://www.w3.org/2000/svg'>
            <path
              d='M33.2002 11.25C33.2002 8.355 26.4802 6 18.2002 6C9.9202 6 3.2002 8.355 3.2002 11.25C3.2002 13.965 9.1252 16.215 16.7002 16.47V22.5H14.2252C12.9952 22.5 11.9002 23.25 11.4352 24.39L9.2002 30H12.2002L14.0002 25.5H22.4002L24.2002 30H27.2002L24.9502 24.39C24.5002 23.25 23.3902 22.5 22.1752 22.5H19.7002V16.47C27.2752 16.215 33.2002 13.965 33.2002 11.25Z'
              fill='#BE963C'
            />
          </svg>
          Table Combinations
        </Link>
      </div>
      {!hideButton && (
        <Button onClick={onPublish} className='rounded-lg text-md'>
          Publish updates
        </Button>
      )}
    </div>
  );
}
