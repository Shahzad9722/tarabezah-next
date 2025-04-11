'use client';
import { Provider } from 'react-redux';
import { store } from '@/store/store';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';
import { FloorplanProvider } from './context/FloorplanContext';
import { Loader } from 'lucide-react';
import { LoaderProvider } from './context/loaderContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <LoaderProvider>
          <FloorplanProvider>
            {children}
          </FloorplanProvider>
        </LoaderProvider>
      </Provider>
    </QueryClientProvider>
  );
}
