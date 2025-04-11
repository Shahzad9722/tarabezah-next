import { NextResponse } from 'next/server';
import axios from 'axios';
import { mergeDateAndTime } from '@/app/lib/utils';

const restaurantId = 'a7fa1095-d8c5-4d00-8a44-7ba684eae835';

export async function GET(request: Request) {
  try {
    const res: {
      data: {
        data: any;
        message: string;
        status: number;
      };
    } = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/CommonData/GetAllLookups`, {}, {});

    if (res.data?.status != 200 || !res?.data?.data)
      return NextResponse.json({ error: 'something went wrong from server' }, { status: 500 });

    const { clientSources, guestTags, shifts, tabletypes } = res.data.data;
    // console.log('res.data.data', res.data.data);
    return NextResponse.json(
      { entities: { sources: clientSources, tags: guestTags, shifts: shifts, tableTypes: tabletypes } },
      { status: 200 }
    );
  } catch (error: any) {
    console.log(error?.response?.data);
    return NextResponse.json({ error: 'Failed to get form entities.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    // console.log('payload', payload);
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/Reservations`,
      {
        clientGuid: payload.clientId,
        shiftGuid: payload.shiftId,
        date: new Date(payload.eventDate),
        time: new Date(payload.eventTime),
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
    return NextResponse.json({ reservation: res.data }, { status: 201 });
  } catch (error: any) {
    console.log(error?.response?.data);
    return NextResponse.json({ error: 'Failed to save reservation form' }, { status: 500 });
  }
}
