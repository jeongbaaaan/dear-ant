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

    if (!stock_name) {
      return NextResponse.json({ error: '종목명은 필수입니다.' }, { status: 400 });
    }

    const validActions = ['buy', 'sell', 'hold', 'watch'];
    const safeAction = validActions.includes(action) ? action : 'watch';

    const created = localStore.createMemo({
      stock_name: String(stock_name).slice(0, 100),
      action: safeAction,
      price: price ? Number(price) || undefined : undefined,
      quantity: quantity ? Number(quantity) || undefined : undefined,
      memo: String(memo).slice(0, 2000),
    });

    return NextResponse.json({ memo: created });
  } catch (error) {
    console.error('Memo create error:', error);
    return NextResponse.json({ error: '메모 생성에 실패했습니다.' }, { status: 500 });
  }
}
