import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// Mock restaurant data - replace with your actual data source
const MOCK_RESTAURANTS = [
  {
    id: '1',
    name: 'Restaurant One',
    address: '123 Main St',
    cuisine: 'Italian',
  },
  {
    id: '2',
    name: 'Restaurant Two',
    address: '456 Oak Ave',
    cuisine: 'Mexican',
  },
  {
    id: '3',
    name: 'Restaurant Three',
    address: '789 Pine St',
    cuisine: 'Japanese',
  },
];

export async function GET(request: Request) {
  try {
    // Get the auth token from cookies
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // In a real application, you would:
    // 1. Validate the token
    // 2. Fetch restaurants from your database
    // 3. Apply any necessary filters or permissions

    return NextResponse.json(MOCK_RESTAURANTS);
  } catch (error) {
    console.error('Restaurants fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
