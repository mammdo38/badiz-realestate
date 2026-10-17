import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Forward the inquiry to the Express backend
    const res = await fetch('http://localhost:5000/api/inquiries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...body,
        inquiryType: body.inquiryType || 'general',
      }),
    });
    
    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error('Error forwarding contact submission:', error);
    return NextResponse.json({ success: false, message: 'خطا در ارتباط با سرور' }, { status: 500 });
  }
}
