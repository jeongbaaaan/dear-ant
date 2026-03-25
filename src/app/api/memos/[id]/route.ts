import { NextRequest, NextResponse } from 'next/server';
import { localStore } from '@/lib/local-store';

// GET: 메모 상세
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const memo = localStore.getMemo(id);
    if (!memo) {
      return NextResponse.json({ error: '메모를 찾을 수 없습니다.' }, { status: 404 });
    }
    return NextResponse.json({ memo });
  } catch (error) {
    console.error('Memo fetch error:', error);
    return NextResponse.json({ error: '메모 조회에 실패했습니다.' }, { status: 500 });
  }
}

// PATCH: 메모 수정
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const allowed: Parameters<typeof localStore.updateMemo>[1] = {};
    if (body.stock_name !== undefined) allowed.stock_name = String(body.stock_name).slice(0, 100);
    if (body.action !== undefined && ['buy', 'sell', 'hold', 'watch'].includes(body.action)) allowed.action = body.action;
    if (body.price !== undefined) allowed.price = Number(body.price) || undefined;
    if (body.quantity !== undefined) allowed.quantity = Number(body.quantity) || undefined;
    if (body.memo !== undefined) allowed.memo = String(body.memo).slice(0, 2000);
    const updated = localStore.updateMemo(id, allowed);
    if (!updated) {
      return NextResponse.json({ error: '메모를 찾을 수 없습니다.' }, { status: 404 });
    }
    return NextResponse.json({ memo: updated });
  } catch (error) {
    console.error('Memo update error:', error);
    return NextResponse.json({ error: '메모 수정에 실패했습니다.' }, { status: 500 });
  }
}

// DELETE: 메모 삭제
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const deleted = localStore.deleteMemo(id);
    if (!deleted) {
      return NextResponse.json({ error: '메모를 찾을 수 없습니다.' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Memo delete error:', error);
    return NextResponse.json({ error: '메모 삭제에 실패했습니다.' }, { status: 500 });
  }
}
