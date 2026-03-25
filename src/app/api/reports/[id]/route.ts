import { NextRequest, NextResponse } from 'next/server';
import { localStore } from '@/lib/local-store';
import { isSupabaseEnabled } from '@/lib/config';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (isSupabaseEnabled) {
      const { getSupabase } = await import('@/lib/supabase');
      const supabase = getSupabase();
      const { data: report, error } = await supabase
        .from('reports')
        .select('*, sessions(mood, birth_date)')
        .eq('id', id)
        .single();

      if (error || !report) {
        return NextResponse.json(
          { error: '리포트를 찾을 수 없습니다.' },
          { status: 404 }
        );
      }
      return NextResponse.json({ report });
    }

    // 로컬 모드
    const report = localStore.getReport(id);
    if (!report) {
      return NextResponse.json(
        { error: '리포트를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }
    return NextResponse.json({ report });
  } catch (error) {
    console.error('Report fetch error:', error);
    return NextResponse.json(
      { error: '리포트 조회에 실패했습니다.' },
      { status: 500 }
    );
  }
}
