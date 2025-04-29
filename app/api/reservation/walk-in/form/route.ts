import { NextResponse } from 'next/server';
import axios from 'axios';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const payload = await request.json();

    if (!payload?.token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // console.log('payload', payload);
    const res: any = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/Reservations/walkin`,
      {
        clientGuid: payload.clientId === '0' ? undefined : payload.clientId,
        partySize: payload.numberOfGuests,
        tags: payload.tags,
        notes: payload.additionalNotes,
        floorplanElementGuid: payload.tableId || null,
        isUpcoming: payload.isUpcoming,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${payload.token}`,
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
