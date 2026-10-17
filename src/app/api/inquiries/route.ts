import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Received inquiry:', body);
    return NextResponse.json({
      success: true,
      message: 'درخواست شما با موفقیت ثبت شد. کارشناسان ما به زودی با شما تماس خواهند گرفت.'
    });
  } catch (e) {
    return NextResponse.json({ success: false, message: 'خطا در ثبت درخواست' }, { status: 400 });
  }
}
