import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    // console.log('payload', payload);
    const res: any = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/Reservations/walkin`,
      {
        clientGuid: payload.clientId,
        shiftGuid: payload.shiftId,
        partySize: payload.numberOfGuests,
        tags: payload.tags,
        notes: payload.additionalNotes,
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
    return NextResponse.json({ error: 'Failed to save reservation form' }, { status: 500 });
  }
}
