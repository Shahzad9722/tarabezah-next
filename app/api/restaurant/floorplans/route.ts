import { NextResponse } from 'next/server';
import axios from 'axios';

const restaurantId = 'a7fa1095-d8c5-4d00-8a44-7ba684eae835';

export async function GET() {
  try {
    const res: any = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/Restaurants/${restaurantId}/floorplans/with-elements`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${process.env.BACKEND_TOKEN}`,
        },
      }
    );

    return NextResponse.json({ floorPlans: res?.data?.data?.result || [] }, { status: 200 });
  } catch (error) {
    console.error('Error fetching filters:', error);
    return NextResponse.json({ error: 'Failed to fetch floorplans' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    console.log('payload', JSON.stringify(payload, null, 2));
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/Restaurants/${restaurantId}/create-floorplans`,
      {
        ...payload,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${process.env.BACKEND_TOKEN}`,
        },
      }
    );
    // console.log('res.data', res.data);
    return NextResponse.json({ reservation: res.data }, { status: 201 });
  } catch (error: any) {
    console.log(error);
    return NextResponse.json({ error: 'Failed to publish floorplans' }, { status: 500 });
  }
}
