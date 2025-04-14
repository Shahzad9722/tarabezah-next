import { NextResponse } from 'next/server';
import axios from 'axios';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  try {
    // Get the auth token from cookies
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(request.url);
    const query = url.searchParams.get('query') || '';
    const restaurantId = url.searchParams.get('restaurantId');

    if (!query) return NextResponse.json({ error: 'query is required' }, { status: 400 });

    const res: any = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/Clients/search?restaurantGuid=${restaurantId}&query=${query}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${process.env.BACKEND_TOKEN}`,
        },
      }
    );

    return NextResponse.json({ guests: res.data?.data?.result }, { status: 200 });
  } catch (error: any) {
    console.log(error?.response?.data);
    return NextResponse.json({ error: 'Failed to search guests' }, { status: 500 });
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

    const payload = await request.json();
    // console.log('payload', payload);
    const res: any = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/Clients`,
      {
        name: payload.name,
        phoneNumber: payload.phone,
        email: payload.email || '',
        birthday: payload.birthday,
        tagValues: payload.tags,
        source: payload.sources.length ? payload.sources[0] : 0,
        notes: payload.clientNotes,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${process.env.BACKEND_TOKEN}`,
        },
      }
    );
    // console.log('res.data', res.data.data.result);
    return NextResponse.json({ guest: res.data.data.result }, { status: 201 });
  } catch (error: any) {
    console.log(error?.response?.data);
    return NextResponse.json({ error: 'Failed to save guest' }, { status: 500 });
  }
}
