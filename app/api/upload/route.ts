import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const name = formData.get('name') as string;
    const file = formData.get('file') as File;
    const purpose = formData.get('purpose');
    const tableType = formData.get('tableType') as string;

    if (!file || !name || !purpose || !tableType) {
      return NextResponse.json({ error: 'payload has missing fields' }, { status: 400 });
    }

    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/Elements/upload`;

    const payload = new FormData();
    payload.append('Name', name || file.name.split('.')[0]);
    payload.append('ImageFile', file);
    payload.append('Purpose', purpose);
    payload.append('TableType', tableType);

    await axios.post(url, payload, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `${process.env.BACKEND_TOKEN}`,
      },
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error: any) {
    console.error('Upload error:', error?.response?.data);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
