import { NextRequest, NextResponse } from 'next/server';

const VALID_ID = process.env.ADMIN_ID || 'medicer';
const VALID_PW = process.env.ADMIN_PW || '1234';
const SESSION_TOKEN = 'medi_session';

export async function POST(req: NextRequest) {
  const { id, pw } = await req.json();

  if (id === VALID_ID && pw === VALID_PW) {
    const res = NextResponse.json({ ok: true });
    res.cookies.set(SESSION_TOKEN, 'authenticated', {
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7일
      sameSite: 'lax',
    });
    return res;
  }

  return NextResponse.json({ ok: false, message: '아이디 또는 비밀번호가 올바르지 않습니다.' }, { status: 401 });
}
