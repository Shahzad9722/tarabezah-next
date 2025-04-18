'use client';

import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useFloorplan } from '@/app/context/FloorplanContext';

function Navigation() {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const { setRestaurant } = useFloorplan();
  // Hide navigation on login page
  if (pathname === '/login') return null;

  const openMenu = () => setIsOpen(true);
  const closeMenu = () => setIsOpen(false);


  return (
    <div>
      <nav className='relative'>
        <div className='flex items-center'>
          <button onClick={openMenu} className='bg-color-121020 text-white py-2 px-2 rounded-md'>
            <Menu className='h-8 w-8' />
          </button>
        </div>

        <div
          className={`fixed top-0 left-0 h-screen w-1/6 min-w-[260px] md:min-w-0 bg-color-121020 shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${isOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
        >
          <div className='flex justify-end'>
            <button onClick={closeMenu} className='bg-color-121020 text-white p-2 mt-4 mr-4 rounded-md'>
              <X className='h-8 w-8' />
            </button>
          </div>
          <div className='pt-6 px-4 space-y-4'>
            <Link
              href='/'
              onClick={closeMenu}
              className='block py-3 text-color-E9E3D7 hover:text-color-B98858 px-4 rounded-lg transition-colors duration-200'
            >
              Floor Management
            </Link>
            <Link
              href='/upload'
              onClick={closeMenu}
              className='block py-3 text-color-E9E3D7 hover:text-color-B98858 px-4 rounded-lg transition-colors duration-200'
            >
              Upload Icon
            </Link>
          </div>
        </div>

        {/* Overlay */}
        <div
          onClick={closeMenu}
          className={`fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300 z-40 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
        />
      </nav>
    </div>
  );
}

export default Navigation;
