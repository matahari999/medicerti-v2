import { NextRequest, NextResponse } from 'next/server';

const HIRA_KEY = process.env.HIRA_API_KEY || '';
const HIRA_BASE = 'https://apis.data.go.kr/B551182/hospInfoServicev2/getHospBasisList';

export interface HospitalItem {
  yadmNm: string;   // 병원명
  addr: string;     // 주소
  telno: string;    // 전화번호
  ykiho: string;    // 기관코드
  clCdNm: string;   // 종별 (종합병원, 요양병원 등)
  sgguCdNm: string; // 시군구명
  sidoCdNm: string; // 시도명
  hospUrl?: string; // 홈페이지
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const name = searchParams.get('name')?.trim() || '';
  const page = parseInt(searchParams.get('page') || '1', 10);

  if (!name) {
    return NextResponse.json({ items: [], total: 0 });
  }

  // HIRA API 키가 없으면 샘플 데이터 반환
  if (!HIRA_KEY) {
    return NextResponse.json({
      items: getSampleData(name),
      total: 2,
      demo: true,
    });
  }

  const params = new URLSearchParams({
    serviceKey: HIRA_KEY,
    pageNo: String(page),
    numOfRows: '20',
    yadmNm: name,
    _type: 'json',
  });

  try {
    const res = await fetch(`${HIRA_BASE}?${params}`, {
      next: { revalidate: 3600 },
    });
    const json = await res.json();
    const body = json?.response?.body;
    const rawItems = body?.items?.item;
    const items: HospitalItem[] = rawItems
      ? (Array.isArray(rawItems) ? rawItems : [rawItems])
      : [];

    return NextResponse.json({
      items,
      total: body?.totalCount || 0,
    });
  } catch {
    return NextResponse.json({ items: [], total: 0, error: 'API 오류' }, { status: 500 });
  }
}

function getSampleData(query: string): HospitalItem[] {
  return [
    {
      yadmNm: `${query} 종합병원 (샘플)`,
      addr: '서울특별시 강남구 일원로 81',
      telno: '02-3410-2114',
      ykiho: 'sample001',
      clCdNm: '종합병원',
      sgguCdNm: '강남구',
      sidoCdNm: '서울특별시',
      hospUrl: 'https://www.koiha.or.kr',
    },
    {
      yadmNm: `${query} 요양병원 (샘플)`,
      addr: '경기도 성남시 분당구 구미로 173번길 82',
      telno: '031-787-1234',
      ykiho: 'sample002',
      clCdNm: '요양병원',
      sgguCdNm: '성남시',
      sidoCdNm: '경기도',
    },
  ];
}
