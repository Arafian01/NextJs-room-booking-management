// 1. src/app/api/bookings/route.ts
// Proxy CRUD to https://simaru.amisbudi.cloud/api/bookings
import { NextRequest, NextResponse } from 'next/server';

function extractToken(req: NextRequest) {
  const cookie = req.cookies.get('accessToken')?.value;
  if (cookie) return cookie;
  const auth = req.headers.get('authorization') || '';
  if (auth.startsWith('Bearer ')) return auth.slice(7);
  return null;
}

async function proxy(req: NextRequest, url: string) {
  const token = extractToken(req);
  if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  const res = await fetch(url, {
    method: req.method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'Cookie': req.headers.get('cookie') || ''
    },
    credentials: 'include',
    body: ['POST','PUT'].includes(req.method) ? await req.text() : undefined
  });
  const text = await res.text();
  try { return NextResponse.json(JSON.parse(text), { status: res.status }); }
  catch { return NextResponse.json({ data: text }, { status: res.status }); }
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const id = url.searchParams.get('id');
  const endpoint = id
    ? `https://simaru.amisbudi.cloud/api/bookings/${id}`
    : 'https://simaru.amisbudi.cloud/api/bookings';
  return proxy(req, endpoint);
}
export async function POST(req: NextRequest) {
  return proxy(req, 'https://simaru.amisbudi.cloud/api/bookings');
}
export async function PUT(req: NextRequest) {
  const url = new URL(req.url);
  const id = url.searchParams.get('id');
  if (!id) return NextResponse.json({ message: 'ID is required' }, { status: 400 });
  return proxy(req, `https://simaru.amisbudi.cloud/api/bookings/${id}`);
}
export async function DELETE(req: NextRequest) {
  const url = new URL(req.url);
  const id = url.searchParams.get('id');
  if (!id) return NextResponse.json({ message: 'ID is required' }, { status: 400 });
  return proxy(req, `https://simaru.amisbudi.cloud/api/bookings/${id}`);
}