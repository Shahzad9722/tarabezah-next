import { NextResponse } from 'next/server';
import axios from 'axios';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);

        const clientId = searchParams.get('RestaurantGuid');
        const numberOfGuests = searchParams.get('PartySize');
        const eventDate = searchParams.get('Date');
        const shiftGuid = searchParams.get('ShiftGuid');
        const tableType = searchParams.get('TableType') || 'Indoor'; // Default to 'Indoor' if not provided

        if (!clientId || !numberOfGuests || !eventDate || !shiftGuid || !tableType) {
            return NextResponse.json({ error: 'Missing required query parameters' }, { status: 400 });
        }

        // grab the user’s auth-token from the cookie
        const token = (await cookies()).get('auth-token')?.value;

        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const res = await axios.get<{ data: { result: any } }>(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/Shifts/time-duration`,
            {
                params: {
                    RestaurantGuid: clientId,
                    PartySize: numberOfGuests,
                    ShiftGuid: shiftGuid,
                    Date: eventDate,
                    TableType: tableType,
                },
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `${process.env.BACKEND_TOKEN}`,
                },
            }
        );

        return NextResponse.json({ timeSlots: res.data.data.result }, { status: 200 });
    } catch (error: any) {
        console.log("Error:", error?.response?.data || error);
        return NextResponse.json(
            { error: error?.response?.data?.errorMessage || 'Failed to fetch time slots' },
            { status: 400 }
        );
    }
}
