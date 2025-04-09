import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const query = url.searchParams.get('query') || '';

    if (!query) return NextResponse.json({ error: 'query is required' }, { status: 400 });

    const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/Guest/Search?query=${query}`, {}, {});

    return NextResponse.json({ guests: res.data }, { status: 200 });
  } catch (error: any) {
    console.log(error?.response?.data);
    return NextResponse.json({ error: 'Failed to get guest search' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    // console.log('payload', payload);
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/Guest/Save?locale=en`,
      {
        name: payload.name,
        phoneNumber: payload.phone,
        email: payload.email,
        birthday: payload.birthday,
        guestTags: payload.tags,
        clientSourceId: payload.sources.length ? payload.sources[0] : null,
        notes: payload.clientNotes,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    // console.log('res.data', res.data);
    return NextResponse.json({ guest: res.data }, { status: 201 });
  } catch (error: any) {
    console.log(error?.response?.data);
    return NextResponse.json({ error: 'Failed to save guest' }, { status: 500 });
  }
}
