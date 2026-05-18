import { NextResponse } from 'next/server';
import { NOTICE_SOURCES, Notice, NoticeResult } from '@/lib/noticeConfig';

// 한국어 포함 앵커 태그에서 제목+링크 추출
function extractNoticesFromHTML(
  html: string,
  baseUrl: string,
  sourceKey: string,
  sourceName: string,
  shortName: string,
  color: string,
  category: string,
): Notice[] {
  // 스크립트·스타일 제거
  const clean = html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '');

  const results: Notice[] = [];
  const seen = new Set<string>();

  // 날짜 패턴 (YYYY-MM-DD, YYYY.MM.DD, YYYY/MM/DD)
  const dateRe = /(\d{4}[-./]\d{1,2}[-./]\d{1,2})/g;

  // 앵커 태그 + 내용 추출
  const anchorRe = /<a[^>]+href=["']([^"'#javascript][^"']*?)["'][^>]*>([\s\S]*?)<\/a>/gi;
  let m: RegExpExecArray | null;

  while ((m = anchorRe.exec(clean)) !== null) {
    let href = m[1].trim();
    const rawText = m[2].replace(/<[^>]+>/g, '').trim();

    // 한글 포함 10~120자 제목만 추출
    if (!/[가-힣]/.test(rawText)) continue;
    if (rawText.length < 8 || rawText.length > 150) continue;
    if (seen.has(rawText)) continue;

    // 상대 URL → 절대 URL
    if (href.startsWith('/')) href = baseUrl + href;
    else if (!href.startsWith('http')) href = baseUrl + '/' + href;

    // 날짜: 앵커 주변 100자에서 검색
    const surroundStart = Math.max(0, m.index - 200);
    const surroundEnd = Math.min(clean.length, m.index + m[0].length + 200);
    const surrounding = clean.slice(surroundStart, surroundEnd).replace(/<[^>]+>/g, ' ');
    const dateMatch = surrounding.match(/\d{4}[-./]\d{1,2}[-./]\d{1,2}/);
    const date = dateMatch ? dateMatch[0].replace(/\./g, '-') : undefined;

    seen.add(rawText);
    results.push({
      id: `${sourceKey}-${results.length}`,
      source: sourceKey,
      sourceName,
      shortName,
      color,
      category,
      title: rawText,
      link: href,
      date,
    });

    if (results.length >= 15) break;
  }

  return results;
}

async function fetchSource(source: typeof NOTICE_SOURCES[0]): Promise<NoticeResult> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 8000);

  try {
    const res = await fetch(source.fetchUrl, {
      signal: ctrl.signal,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8',
        'Accept-Encoding': 'gzip, deflate, br',
      },
      next: { revalidate: 3600 }, // 1시간 캐시
    });
    clearTimeout(timer);

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const html = await res.text();
    const notices = extractNoticesFromHTML(
      html,
      source.baseUrl,
      source.key,
      source.name,
      source.shortName,
      source.color,
      source.category,
    );

    return {
      source: source.key,
      status: notices.length > 0 ? 'ok' : 'error',
      notices,
      directUrl: source.noticeUrl,
      sourceName: source.name,
    };
  } catch {
    clearTimeout(timer);
    return {
      source: source.key,
      status: 'error',
      notices: [],
      directUrl: source.noticeUrl,
      sourceName: source.name,
    };
  }
}

export async function GET() {
  const results = await Promise.allSettled(NOTICE_SOURCES.map(fetchSource));

  const data: NoticeResult[] = results.map((r, i) =>
    r.status === 'fulfilled'
      ? r.value
      : {
          source: NOTICE_SOURCES[i].key,
          status: 'error' as const,
          notices: [],
          directUrl: NOTICE_SOURCES[i].noticeUrl,
          sourceName: NOTICE_SOURCES[i].name,
        },
  );

  return NextResponse.json(data, {
    headers: {
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
    },
  });
}
