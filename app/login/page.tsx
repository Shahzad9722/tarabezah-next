'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '@/store/features/auth/authSlice';
import type { AppDispatch, RootState } from '@/store/store';
import { Button } from '../components/ui/button';
import Logo from '@/public/images/logo.svg';
import { useFloorplan } from '../context/FloorplanContext';

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.auth);
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);

  const { setRestaurant } = useFloorplan();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await dispatch(login(credentials)).unwrap();
       console.log('Login result:', result);
      if (result) {
        // After successful login, fetch restaurants
        const response = await fetch('/api/restaurants');

        if (!response.ok) {
          throw new Error('Failed to fetch restaurants');
        }

        const { restaurants } = await response.json();

        if (restaurants.length > 0) {
          // Use the index from the login response
          const index = result.data.index;
          const selectedRestaurant = restaurants[index] || restaurants[0];
          localStorage.setItem('selected-restaurant-id', selectedRestaurant.guid);
          // Set restaurant data in context
          // setRestaurant({ id: selectedRestaurant.guid, name: selectedRestaurant.name, floorplans: [] });
          // Navigate to home page
          window.location.href = '/';
        } else {
          throw new Error('No restaurants found');
        }
      }
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  return (
    <div
      className='min-h-screen flex items-center justify-center'
      style={{
        background: 'linear-gradient(119deg, rgba(18, 17, 32, 0.95) 45.47%, rgba(185, 136, 88, 0.90) 105.35%)',
        backgroundSize: 'cover',
      }}
    >
      <div className='w-[400px] p-8 rounded-2xl backdrop-blur-sm bg-[#121120]/80 shadow-xl border border-[#2d2a45]/30'>
        <div className='flex justify-center mb-8'>
          <Image src={Logo} width={120} height={80} alt='Logo' className='mb-4' />
        </div>

        <h2 className='text-2xl font-bold text-white text-center mb-8'>Welcome Back</h2>

        {error && (
          <div className='bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-lg mb-6 text-sm text-center'>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className='space-y-6'>
          <div>
            <input
              type='text'
              placeholder='Username'
              className='w-full py-2 px-4 rounded-lg bg-[#2d2a45]/50 text-white border border-[#2d2a45] focus:border-[#b98858] transition-colors focus:outline-none'
              value={credentials.username}
              onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
              disabled={loading}
            />
          </div>
          <div>
            <div className='relative'>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder='Password'
                className='w-full py-2 px-4 rounded-lg bg-[#2d2a45]/50 text-white border border-[#2d2a45] focus:border-[#b98858] transition-colors focus:outline-none'
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                disabled={loading}
              />
              <button
                type='button'
                onClick={() => setShowPassword(!showPassword)}
                className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300'
              >
                {showPassword ? (
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className='w-5 h-5'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88'
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className='w-5 h-5'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z'
                    />
                    <path strokeLinecap='round' strokeLinejoin='round' d='M15 12a3 3 0 11-6 0 3 3 0 016 0z' />
                  </svg>
                )}
              </button>
            </div>
          </div>
          <Button type='submit' className='w-full' disabled={loading}>
            {loading ? (
              <span className='flex items-center justify-center'>
                <svg
                  className='animate-spin -ml-1 mr-3 h-5 w-5 text-white'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                >
                  <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
                  <path
                    className='opacity-75'
                    fill='currentColor'
                    d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                  ></path>
                </svg>
                Logging in...
              </span>
            ) : (
              'Login'
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
