import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const response = NextResponse.json(
      {
        message: 'Logout successful',
      },
      { status: 200 }
    );

    response.cookies.delete('auth-token');

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
