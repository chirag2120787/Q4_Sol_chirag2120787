import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  console.log('logging out');
  const cookieStore = await cookies();
  console.log('deleting session cookie');
  cookieStore.delete('session');
  console.log('session cookie deleted');
  return NextResponse.json({ success: true });
} 