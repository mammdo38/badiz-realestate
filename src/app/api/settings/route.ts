import { NextResponse } from 'next/server';
import { defaultSettings } from '@/data';

export async function GET() {
  return NextResponse.json({ success: true, data: defaultSettings });
}
