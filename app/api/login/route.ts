import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    const res: any = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/Auth/login`,
      {
        username,
        password,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${process.env.BACKEND_TOKEN}`,
        },
      }
    );

    const data = res?.data?.data?.result;

    const response = NextResponse.json(
      {
        message: 'Login successful',
        data: res?.data?.data?.result,
      },
      { status: 200 }
    );

    // Set the token in an HTTP-only cookie
    response.cookies.set('auth-token', data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 24 hours
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
