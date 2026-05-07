import { NextResponse } from 'next/server';
import { callGemini } from '@/lib/gemini';
import { SYSTEM_PROMPT, buildUserPrompt } from '@/lib/prompts';
import { GenerationFormInput } from '@/lib/types';

export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const clientKey = req.headers.get('X-Gemini-Key')?.trim();
    const apiKey = clientKey || process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'GEMINI_API_KEY가 설정되지 않았습니다. Vercel 환경변수에 GEMINI_API_KEY를 설정하세요.' },
        { status: 500 }
      );
    }

    const body = await req.json() as GenerationFormInput;
    if (!body.userRequest?.trim()) {
      return NextResponse.json({ error: '문서 요청 내용을 입력해주세요.' }, { status: 400 });
    }

    const userPrompt = buildUserPrompt(body);
    const result = await callGemini(SYSTEM_PROMPT, userPrompt, apiKey);
    return NextResponse.json({ result });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
