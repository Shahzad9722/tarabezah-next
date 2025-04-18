'use client';
import TableCombinations from '@/app/components/tabs/TableCombinations';
import Navigation from '../components/navigation/Navigation';

export default function TableCombinationPage() {
  return (
    <div className='flex flex-col'>
      <Navigation />
      <TableCombinations />
    </div>
  );
}
