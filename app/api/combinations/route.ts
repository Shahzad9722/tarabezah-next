import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const floorPlanId = url.searchParams.get('floorPlanId') || 'd4f9a1b2-c03e-4f5a-8b67-9a0e7f2c3d45';

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
    console.log('error', error);
    console.error(error.response.data, 'Error fetching combinations');
    return NextResponse.json({ error: 'Failed to load combinations' }, { status: 500 });
  }
}

// Save selected combinations
export async function POST(request: Request) {
  try {
    const payload = await request.json();
    console.log('payload', payload);
    const { floorPlanId, elementIds } = payload;
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/FloorElementCombinationService/SaveFloorElementCombination?locale=en`,
      { floorplanId: floorPlanId, floorplanElementIds: elementIds }
    );
    return NextResponse.json({ combination: res.data }, { status: 201 });
  } catch (error: any) {
    console.error('Error saving combination:', error.response.data);
    return NextResponse.json({ error: 'Failed to save floor element combination' }, { status: 500 });
  }
}
