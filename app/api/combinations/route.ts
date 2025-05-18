import { NextResponse } from 'next/server';
import axios from 'axios';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const floorPlanId = url.searchParams.get('floorPlanId');

    // Get the auth token from cookies
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const res: any = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/Floorplans/${floorPlanId}/combined-tables`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${process.env.BACKEND_TOKEN}`,
        },
      }
    );
    return NextResponse.json({ combinations: res.data?.data?.result || [] }, { status: 200 });
  } catch (error: any) {
    console.error(error.response.data, 'Error fetching combinations');
    return NextResponse.json({ error: 'Failed to load combinations' }, { status: 500 });
  }
}

// Save selected combinations
export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const { floorPlanId, elementIds, name, minCapacity, maxCapacity } = payload;

    // Get the auth token from cookies
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/Floorplans/${floorPlanId}/combined-tables`,
      {
        floorplanGuid: floorPlanId,
        groupName: name,
        minCapacity: minCapacity,
        maxCapacity: maxCapacity,
        floorplanElementInstanceGuids: elementIds,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${process.env.BACKEND_TOKEN}`,
        },
      }
    );
    return NextResponse.json({ combination: res.data }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.response.data.errorMessage }, { status: 500 });
  }
}
