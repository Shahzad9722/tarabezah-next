import { NextResponse } from 'next/server';
import axios from 'axios';
import { cookies } from 'next/headers';

// Delete selected combinations
export async function DELETE(request: Request) {
    try {
        const url = new URL(request.url);
        const combinationGuid = url.pathname.split('/').pop();
        // const combinationGuid = url.searchParams.get('guid');
        console.log("combinationGuid", combinationGuid)

        if (!combinationGuid) {
            return NextResponse.json({ error: 'Combination GUID is required' }, { status: 400 });
        }

        // Get the auth token from cookies
        const cookieStore = await cookies();
        const token = cookieStore.get('auth-token')?.value;

        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Make the delete API call
        const res = await axios.delete(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/CombinedTables/${combinationGuid}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `${process.env.BACKEND_TOKEN}`,
                },
            }
        );

        return NextResponse.json({ message: 'Combination deleted successfully' }, { status: 200 });
    } catch (error: any) {
        console.error('Error deleting combination:', error.response?.data || error.message);
        return NextResponse.json({ error: 'Failed to delete combination' }, { status: 500 });
    }
}