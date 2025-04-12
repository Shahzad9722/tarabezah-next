import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import axios from 'axios';

export async function GET(request: Request) {
  try {
    // Get the auth token from cookies
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const res: any = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/Restaurants`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${process.env.BACKEND_TOKEN}`,
      },
    });

    return NextResponse.json({ restaurants: res?.data?.data?.result || [] }, { status: 200 });
  } catch (error) {
    console.error('Restaurants fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
