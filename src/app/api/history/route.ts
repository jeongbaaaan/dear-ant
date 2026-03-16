import { NextResponse } from 'next/server';
import { localStore } from '@/lib/local-store';

const useSupabase = !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export async function GET() {
  try {
    if (useSupabase) {
      const { getSupabase } = await import('@/lib/supabase');
      const supabase = getSupabase();
      const { data: reports, error } = await supabase
        .from('reports')
        .select('id, decision_mode, mood_score, risk_tendency, invest_mood, biorhythm_physical, biorhythm_emotional, biorhythm_intellectual, today_keywords, today_message, created_at, sessions(mood)')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      return NextResponse.json({ reports: reports || [] });
    }

    // 로컬 모드
    return NextResponse.json({ reports: localStore.listReports() });
  } catch (error) {
    console.error('History fetch error:', error);
    return NextResponse.json(
      { error: '히스토리 조회에 실패했습니다.' },
      { status: 500 }
    );
  }
}
