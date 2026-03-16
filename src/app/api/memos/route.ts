import { NextRequest, NextResponse } from 'next/server';
import { localStore } from '@/lib/local-store';

// GET: 메모 목록
export async function GET() {
  try {
    return NextResponse.json({ memos: localStore.listMemos() });
  } catch (error) {
    console.error('Memo list error:', error);
    return NextResponse.json({ error: '메모 조회에 실패했습니다.' }, { status: 500 });
  }
}

// POST: 메모 생성
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { stock_name, action, price, quantity, memo } = body;

    if (!stock_name || !memo) {
      return NextResponse.json({ error: '종목명과 메모는 필수입니다.' }, { status: 400 });
    }

    const created = localStore.createMemo({
      stock_name,
      action: action || 'watch',
      price: price || undefined,
      quantity: quantity || undefined,
      memo,
    });

    return NextResponse.json({ memo: created });
  } catch (error) {
    console.error('Memo create error:', error);
    return NextResponse.json({ error: '메모 생성에 실패했습니다.' }, { status: 500 });
  }
}
