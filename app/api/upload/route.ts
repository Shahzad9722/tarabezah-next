
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const tableType = formData.get('tableType') as string;
    const isInteractable = formData.get('isInteractable') === 'true';

    if (!file || !tableType) {
      return NextResponse.json(
        { error: 'File and table type are required' },
        { status: 400 }
      );
    }

    // Create upload directory if it doesn't exist
    const uploadDir = path.join(process.cwd(), 'public/images/elements');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Convert File to Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Save file
    const filename = `${Date.now()}-${file.name}`;
    const filepath = path.join(uploadDir, filename);
    fs.writeFileSync(filepath, buffer);

    // External API call
    const externalApiUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/ElementService/Save`;
    const externalFormData = new FormData();
    externalFormData.append('File', file);
    externalFormData.append('Name', file.name.split('.')[0]);
    externalFormData.append('Interactable', String(isInteractable));
    externalFormData.append('TableType', tableType);
    externalFormData.append('locale', 'en');

    const response = await fetch(externalApiUrl, {
      method: 'POST',
      body: externalFormData,
    });

    const data = await response.json();

    return NextResponse.json({ 
      success: true,
      filename,
      tableType,
      isInteractable,
      externalResponse: data
    }, {
      headers: {
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Origin': 'https://abdullahdev.bsite.net',
        'API-Supported-Versions': '1.0',
        'Content-Type': 'application/json; charset=utf-8',
        'X-Powered-By': 'ASP.NET'
      }
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Upload failed' },
      { status: 500 }
    );
  }
}
