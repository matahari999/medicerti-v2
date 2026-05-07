// =============================================
// 메디인증 문서센터 - Gemini API 클라이언트
// =============================================

import { GenerationResult } from './types';

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

export async function callGemini(
  systemPrompt: string,
  userPrompt: string,
  apiKey: string
): Promise<GenerationResult> {
  const body = {
    system_instruction: {
      parts: [{ text: systemPrompt }],
    },
    contents: [
      {
        role: 'user',
        parts: [{ text: userPrompt }],
      },
    ],
    generationConfig: {
      temperature: 0.4,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 8192,
      responseMimeType: 'application/json',
    },
  };

  const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API 오류: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) {
    throw new Error('Gemini API에서 빈 응답을 받았습니다.');
  }

  try {
    // 순수 JSON 파싱 시도
    return JSON.parse(text) as GenerationResult;
  } catch {
    // 마크다운 코드블록 제거 후 재시도
    const cleaned = text
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/\s*```$/i, '')
      .trim();
    try {
      return JSON.parse(cleaned) as GenerationResult;
    } catch (e2) {
      throw new Error(`JSON 파싱 실패: ${String(e2)}\n원본 응답 앞부분: ${text.slice(0, 300)}`);
    }
  }
}
