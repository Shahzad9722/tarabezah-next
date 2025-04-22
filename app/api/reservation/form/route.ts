import { NextResponse } from 'next/server';
import axios from 'axios';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    // console.log('payload', payload);

    // Get the auth token from cookies
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const res: any = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/Reservations`,
      {
        clientGuid: payload.clientId,
        shiftGuid: payload.shiftId,
        date: new Date(payload.eventDate),
        time: new Date(payload.eventTime),
        partySize: payload.numberOfGuests,
        tags: payload.tags,
        notes: payload.additionalNotes,
        floorplanElementGuid: payload.tableId || null,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${process.env.BACKEND_TOKEN}`,
        },
      }
    );
    // console.log('res.data', res.data);
    return NextResponse.json({ reservation: res.data.data.result }, { status: 201 });
  } catch (error: any) {
    console.log(error?.response?.data);
    return NextResponse.json(
      { error: error?.response?.data?.errorMessage || 'Failed to save reservation form' },
      { status: 400 }
    );
  }
}
