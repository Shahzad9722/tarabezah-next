import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET() {
  try {
    const res: any = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/Enums/tableTypes`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${process.env.BACKEND_TOKEN}`,
      },
    });

    return NextResponse.json({ tableTypes: res?.data?.data?.result || [] }, { status: 200 });
  } catch (error) {
    console.error('Error fetching filters:', error);
    return NextResponse.json({ error: 'Failed to load filters' }, { status: 500 });
  }
}
