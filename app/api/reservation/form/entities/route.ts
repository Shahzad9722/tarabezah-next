import { NextResponse } from 'next/server';
import axios from 'axios';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const restaurantId = url.searchParams.get('restaurantId');
    const token = url.searchParams.get('token');

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const res: {
      data: {
        data: any;
        message: string;
        status: number;
      };
    } = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/Enums/lookupData/${restaurantId}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${token}`,
      },
    });

    // console.log('res.data.data', res.data.data);

    const { clientSources, clientTags, restaurantShifts, tableTypes } = res.data.data.result;
    return NextResponse.json(
      { entities: { sources: clientSources, tags: clientTags, shifts: restaurantShifts, tableTypes: tableTypes } },
      { status: 200 }
    );
  } catch (error: any) {
    console.log(error?.response?.data);
    return NextResponse.json({ error: 'Failed to get form entities.' }, { status: 500 });
  }
}
