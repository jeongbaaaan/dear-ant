import { NextRequest, NextResponse } from 'next/server';
import { generateReport } from '@/lib/report-engine';
import { SurveyData } from '@/lib/types';
import { localStore } from '@/lib/local-store';

const useSupabase = !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export async function POST(request: NextRequest) {
  try {
    const body: SurveyData = await request.json();
    const reportData = generateReport(body);

    if (useSupabase) {
      const { getSupabase } = await import('@/lib/supabase');
      const supabase = getSupabase();

      const { data: user, error: userError } = await supabase
        .from('users').insert({}).select().single();
      if (userError) throw userError;

      const { data: session, error: sessionError } = await supabase
        .from('sessions')
        .insert({
          user_id: user.id,
          birth_date: body.userInfo.birthDate,
          mood: body.userInfo.mood,
        })
        .select().single();
      if (sessionError) throw sessionError;

      const { error: answersError } = await supabase
        .from('answers')
        .insert(body.answers.map((a) => ({
          session_id: session.id,
          question_key: a.questionKey,
          answer_value: a.answerValue,
        })));
      if (answersError) throw answersError;

      const { data: report, error: reportError } = await supabase
        .from('reports')
        .insert({
          session_id: session.id,
          decision_mode: reportData.decisionMode,
          mood_score: reportData.moodScore,
          risk_tendency: reportData.riskTendency,
          today_message: reportData.todayMessage,
          today_letter: reportData.todayLetter,
        })
        .select().single();
      if (reportError) throw reportError;

      return NextResponse.json({ report });
    }

    // 로컬 모드 (Supabase 미설정)
    const report = localStore.createReport({
      decision_mode: reportData.decisionMode,
      mood_score: reportData.moodScore,
      risk_tendency: reportData.riskTendency,
      invest_mood: reportData.investMood,
      biorhythm_physical: reportData.biorhythmPhysical,
      biorhythm_emotional: reportData.biorhythmEmotional,
      biorhythm_intellectual: reportData.biorhythmIntellectual,
      today_keywords: reportData.todayKeywords,
      today_message: reportData.todayMessage,
      today_letter: reportData.todayLetter,
      mood: body.userInfo.mood,
      birth_date: body.userInfo.birthDate,
    });

    return NextResponse.json({ report });
  } catch (error) {
    console.error('Report creation error:', error);
    return NextResponse.json(
      { error: '리포트 생성에 실패했습니다.' },
      { status: 500 }
    );
  }
}
