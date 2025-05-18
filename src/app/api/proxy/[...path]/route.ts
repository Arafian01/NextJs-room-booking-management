import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

interface ProxyParams {
  params: Promise<{ path: string[] }>;
}

export async function GET(request: NextRequest, { params }: ProxyParams) {
  const { path } = await params;
  return handleRequest(request, path, 'GET');
}

export async function POST(request: NextRequest, { params }: ProxyParams) {
  const { path } = await params;
  return handleRequest(request, path, 'POST');
}

export async function PUT(request: NextRequest, { params }: ProxyParams) {
  const { path } = await params;
  return handleRequest(request, path, 'PUT');
}

export async function DELETE(request: NextRequest, { params }: ProxyParams) {
  const { path } = await params;
  return handleRequest(request, path, 'DELETE');
}

async function handleRequest(request: NextRequest, path: string[], method: string) {
  const apiUrl = `https://simaru.amisbudi.cloud/api/${path.join('/')}`;
  const token = request.cookies.get('accessToken')?.value;
  const apiCookie = request.cookies.get('apiCookie')?.value;

  // console.log(`Proxy ${method} request to: ${apiUrl}`);
  // console.log('Headers:', { Authorization: token ? `Bearer ${token}` : 'None', Cookie: apiCookie || 'None' });

  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    if (apiCookie) {
      headers['Cookie'] = apiCookie;
    }

    const response = await axios({
      method,
      url: apiUrl,
      headers,
      data: method !== 'GET' ? await request.json().catch(() => ({})) : undefined,
      withCredentials: true,
    });

    // console.log(`Proxy ${method} success: ${apiUrl}`, response.status, response.data);
    return NextResponse.json(response.data, { status: response.status });
  } catch (error: any) {
    console.error(`Proxy error for ${method} ${apiUrl}:`, {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      headers: error.response?.headers,
    });
    return NextResponse.json(
      {
        message: error.response?.data?.message || 'Proxy request failed',
        details: error.message,
      },
      { status: error.response?.status || 500 }
    );
  }
}