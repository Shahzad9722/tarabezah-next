import { NextResponse } from 'next/server';
import axios from 'axios';
import { cookies } from 'next/headers';

interface BackendResponse {
  data?: {
    result?: any[];
  };
}

export async function GET(request: Request) {
  try {
    // Get the auth token from cookies
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get restaurant ID from query params
    const url = new URL(request.url);
    const restaurantId = url.searchParams.get('restaurantId');

    if (!restaurantId) {
      return NextResponse.json({ error: 'Restaurant ID is required' }, { status: 400 });
    }

    // Fetch floorplans from backend
    const res = await axios.get<BackendResponse>(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/Restaurants/${restaurantId}/floorplans/with-elements`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${process.env.BACKEND_TOKEN}`,
        },
      }
    );

    return NextResponse.json({ floorPlans: res.data?.data?.result || [] }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching floorplans:', error.response?.data);
    return NextResponse.json({ error: 'Failed to fetch floorplans' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    // Get the auth token from cookies
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get restaurant ID from query params
    const url = new URL(request.url);
    const restaurantId = url.searchParams.get('restaurantId');

    if (!restaurantId) {
      return NextResponse.json({ error: 'Restaurant ID is required' }, { status: 400 });
    }

    const payload = await request.json();
    console.log('payload', JSON.stringify(payload, null, 2));
    // Save floorplans to backend
    const res = await axios.post<BackendResponse>(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/Restaurants/${restaurantId}/create-floorplans`,
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${process.env.BACKEND_TOKEN}`,
        },
      }
    );

    return NextResponse.json({ floorPlans: res.data?.data?.result || [] }, { status: 201 });
  } catch (error: any) {
    console.error('Error saving floorplans:', error.response?.data);
    return NextResponse.json({ error: 'Failed to save floorplans' }, { status: 500 });
  }
}
