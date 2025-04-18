'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navigation from './Navigation';
import logo from '@/public/images/logo.svg';
import { Button } from '../ui/button';
import { useFloorplan } from '@/app/context/FloorplanContext';

const Header = () => {
  const router = useRouter();
  const { setRestaurant } = useFloorplan();

  const signOut = async () => {
    await fetch('/api/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    localStorage.removeItem('selected-restaurant-id');
    setRestaurant({ id: '', name: '', floorplans: [] });
    router.push('/login');
  };

  return (
    <header className='relative flex items-center bg-[#1c1a2e] p-6 pb-6 [box-shadow:0px_4px_4px_0px_#00000040]'>
      {/* Left Side - Menu */}
      <Navigation />

      {/* Center - Logo */}
      <div className='absolute left-1/2 py-2 transform -translate-x-1/2'>
        <Link href='/'>
          <Image src={logo} height={36.73} width={50} alt='logo' />
        </Link>
      </div>

      {/* Right Side - Help Icon, Dropdown & Logout */}
      <div className='ml-auto flex items-center gap-3 '>
        <button className='bg-color-121020 text-white py-2.5 px-2.5 rounded-md hidden'>
          <Image src={'/images/question.svg'} height={22} width={22} alt='help' />
        </button>
        <select className='bg-color-121020 text-white p-2 pr-5 hidden rounded-[4px] w-[262px]'>
          {/*  <option value="Table 1">Table 1</option>
          <option value="Table 2">Table 2</option> */}
        </select>
        <Button
          onClick={signOut}
        >
          Log out
        </Button>
      </div>
    </header>
  );
};

export default Header;
