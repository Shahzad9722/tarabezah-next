import { NextResponse } from 'next/server';
import axios from 'axios';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    // Get the auth token from cookies
    // const cookieStore = await cookies();
    // const token = cookieStore.get('auth-token')?.value;

    const token = process.env.BACKEND_TOKEN;

    // if (!token) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const res: any = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/Elements`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${process.env.BACKEND_TOKEN}`,
      },
    });

    return NextResponse.json({ elements: res?.data?.data?.result || [] }, { status: 200 });
  } catch (error) {
    console.error('Error fetching filters:', error);
    return NextResponse.json({ error: 'Failed to load filters' }, { status: 500 });
  }
}
