import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dataPath = path.join(process.cwd(), 'data', 'canvas.json');

// Ensure data directory exists
if (!fs.existsSync(path.dirname(dataPath))) {
  fs.mkdirSync(path.dirname(dataPath), { recursive: true });
}

export async function GET() {
  try {
    if (!fs.existsSync(dataPath)) {
      return NextResponse.json({ items: [] });
    }
    const data = fs.readFileSync(dataPath, 'utf-8');
    return NextResponse.json(JSON.parse(data));
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: 'Failed to load canvas data' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: 'Failed to save canvas data' }, { status: 500 });
  }
}
