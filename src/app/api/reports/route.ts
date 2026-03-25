import { NextRequest, NextResponse } from 'next/server';
import { generateReport } from '@/lib/report-engine';
import { SurveyData } from '@/lib/types';
import { localStore } from '@/lib/local-store';
import { isSupabaseEnabled } from '@/lib/config';

const VALID_MOODS = ['불안', '설렘', '평온', '초조', '자신감'];

export async function POST(request: NextRequest) {
  try {
    const body: SurveyData = await request.json();

    // Input validation
    if (!body?.userInfo?.birthDate || !body?.userInfo?.mood || !Array.isArray(body?.answers)) {
      return NextResponse.json({ error: '잘못된 입력입니다.' }, { status: 400 });
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(body.userInfo.birthDate)) {
      return NextResponse.json({ error: '생년월일 형식이 잘못되었습니다.' }, { status: 400 });
    }
    if (!VALID_MOODS.includes(body.userInfo.mood)) {
      return NextResponse.json({ error: '유효하지 않은 감정 값입니다.' }, { status: 400 });
    }
    if (body.answers.length === 0 || body.answers.length > 20) {
      return NextResponse.json({ error: '답변 수가 유효하지 않습니다.' }, { status: 400 });
    }

    const reportData = generateReport(body);

    if (isSupabaseEnabled) {
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
          invest_mood: reportData.investMood,
          biorhythm_physical: reportData.biorhythmPhysical,
          biorhythm_emotional: reportData.biorhythmEmotional,
          biorhythm_intellectual: reportData.biorhythmIntellectual,
          today_keywords: reportData.todayKeywords,
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
