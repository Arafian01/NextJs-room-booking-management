import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const response = await axios.post(
      'https://simaru.amisbudi.cloud/api/auth/login',
      body,
      { withCredentials: true }
    );

    const { accessToken } = response.data;
    const apiCookie = response.headers['set-cookie'];

    const nextResponse = NextResponse.json(response.data, { status: response.status });

    nextResponse.cookies.set('accessToken', accessToken, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60,
    });

    if (apiCookie) {
      nextResponse.cookies.set('apiCookie', apiCookie.join('; '), {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60,
      });
    }

    console.log('Login proxy success:', { accessToken, apiCookie });
    return nextResponse;
  } catch (error: any) {
    console.error('Proxy login error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    return NextResponse.json(
      { message: error.response?.data?.message || 'Login failed' },
      { status: error.response?.status || 500 }
    );
  }
}