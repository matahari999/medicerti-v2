'use client';

import { useState, useRef, useCallback } from 'react';
import { Search, Phone, MapPin, ExternalLink, ChevronDown, ChevronUp, Building2, Info } from 'lucide-react';
import { findHealthCenter } from '@/lib/healthCenterMap';
import type { HospitalItem } from '@/app/api/directory/route';

// 부서별 표준 연락처 템플릿
const DEPARTMENTS = [
  { key: 'main',     label: '대표번호',    icon: '📞' },
  { key: 'er',       label: '응급실',      icon: '🚨' },
  { key: 'icu',      label: '중환자실',    icon: '🏥' },
  { key: 'admin',    label: '원무과',      icon: '📋' },
  { key: 'nursing',  label: '간호부',      icon: '💊' },
  { key: 'social',   label: '사회복지팀',  icon: '🤝' },
  { key: 'qm',       label: '질향상팀(QI)',icon: '📊' },
  { key: 'infect',   label: '감염관리실',  icon: '🦠' },
  { key: 'patient',  label: '환자안전팀',  icon: '⚠️' },
  { key: 'pharma',   label: '약제부',      icon: '💉' },
];

// 관공서 주요 연락처
const GOV_CONTACTS = [
  { category: '인증·평가', name: '의료기관평가인증원 대표', phone: '02-2076-5700',  url: 'https://www.koiha.or.kr' },
  { category: '인증·평가', name: '의료기관평가인증원 인증신청', phone: '02-2076-5724', url: '' },
  { category: '행정',      name: '보건복지부 대표',        phone: '044-202-3000', url: 'https://www.mohw.go.kr' },
  { category: '행정',      name: '보건복지부 민원콜센터',  phone: '129',          url: '' },
  { category: '수가·청구', name: '건강보험심사평가원 대표', phone: '033-739-1000', url: 'https://www.hira.or.kr' },
  { category: '수가·청구', name: '건강보험심사평가원 콜센터', phone: '1644-2000',  url: '' },
  { category: '건강보험',  name: '국민건강보험공단 대표',  phone: '033-736-6000', url: 'https://www.nhis.or.kr' },
  { category: '건강보험',  name: '국민건강보험공단 콜센터', phone: '1577-1000',   url: '' },
  { category: '요양',      name: '국민건강보험공단 요양기관콜센터', phone: '1644-2000', url: '' },
  { category: '협회',      name: '대한병원협회',           phone: '02-705-9200',  url: 'https://kha.or.kr' },
  { category: '협회',      name: '대한요양병원협회',       phone: '02-701-5530',  url: 'https://www.lmha.or.kr' },
  { category: '협회',      name: '대한한방병원협회',       phone: '02-753-0010',  url: '' },
  { category: '협회',      name: '대한치과병원협회',       phone: '02-597-3770',  url: '' },
  { category: '협회',      name: '한국정신병원협회',       phone: '02-2636-5000', url: '' },
  { category: '소방·안전', name: '119 구급상황관리센터',   phone: '119',          url: '' },
  { category: '소방·안전', name: '소방청 대표',            phone: '044-205-7000', url: '' },
];

const GOV_CATEGORIES = [...new Set(GOV_CONTACTS.map((g) => g.category))];

function HospitalCard({ item }: { item: HospitalItem }) {
  const [open, setOpen] = useState(false);
  const hc = findHealthCenter(item.addr);
  const mapsQuery = encodeURIComponent(item.addr);
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`;
  const embedKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 hover:border-gray-200 shadow-sm hover:shadow-md transition-all overflow-hidden">
      {/* 병원 기본 정보 */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h3 className="font-bold text-gray-900 text-base">{item.yadmNm}</h3>
              <span className="text-xs px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full font-medium">
                {item.clCdNm}
              </span>
            </div>
            <div className="flex items-start gap-1.5 text-sm text-gray-500">
              <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0" />
              <span>{item.addr}</span>
            </div>
          </div>
          {item.hospUrl && (
            <a href={item.hospUrl} target="_blank" rel="noopener noreferrer"
              className="shrink-0 p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors">
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>

        {/* 대표번호 + 지도 버튼 */}
        <div className="flex items-center gap-2 flex-wrap">
          {item.telno && (
            <a href={`tel:${item.telno.replace(/[^0-9]/g, '')}`}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-sm font-medium hover:bg-green-100 transition-colors">
              <Phone className="w-3.5 h-3.5" />
              {item.telno}
            </a>
          )}
          <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 text-gray-600 rounded-lg text-sm hover:bg-gray-100 transition-colors">
            <MapPin className="w-3.5 h-3.5" />
            지도 보기
          </a>
          <button onClick={() => setOpen(!open)}
            className="ml-auto flex items-center gap-1 px-3 py-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors">
            {open ? <><ChevronUp className="w-4 h-4" />접기</> : <><ChevronDown className="w-4 h-4" />상세보기</>}
          </button>
        </div>
      </div>

      {/* 상세 펼침 */}
      {open && (
        <div className="border-t border-gray-100">
          {/* 지도 (Google Maps Embed) */}
          <div className="w-full h-52 bg-gray-100">
            {embedKey ? (
              <iframe
                title={item.yadmNm}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                src={`https://www.google.com/maps/embed/v1/place?key=${embedKey}&q=${encodeURIComponent(item.yadmNm + ' ' + item.addr)}&language=ko`}
              />
            ) : (
              <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer"
                className="flex flex-col items-center justify-center h-full gap-2 text-gray-400 hover:text-blue-600 transition-colors">
                <MapPin className="w-8 h-8" />
                <span className="text-sm">Google Maps에서 위치 보기</span>
                <span className="text-xs text-gray-300">(지도 표시는 Google Maps API 키 등록 후 가능)</span>
              </a>
            )}
          </div>

          {/* 부서별 연락처 */}
          <div className="p-5 grid grid-cols-2 sm:grid-cols-3 gap-2">
            {DEPARTMENTS.map((dept) => (
              dept.key === 'main' ? (
                <div key={dept.key} className="col-span-2 sm:col-span-3 flex items-center gap-2 p-2 bg-blue-50 rounded-lg">
                  <span className="text-base">{dept.icon}</span>
                  <span className="text-xs font-medium text-blue-800">{dept.label}</span>
                  {item.telno ? (
                    <a href={`tel:${item.telno.replace(/[^0-9]/g, '')}`}
                      className="ml-auto text-sm font-bold text-blue-700 hover:underline">{item.telno}</a>
                  ) : (
                    <span className="ml-auto text-xs text-gray-400">미등록</span>
                  )}
                </div>
              ) : (
                <div key={dept.key} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                  <span className="text-sm">{dept.icon}</span>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-gray-700">{dept.label}</p>
                    <p className="text-xs text-gray-400">직접 문의</p>
                  </div>
                </div>
              )
            ))}
            <p className="col-span-2 sm:col-span-3 text-xs text-gray-400 mt-1 flex items-center gap-1">
              <Info className="w-3 h-3" />
              부서 직통번호는 병원에 직접 문의 후 메모하세요
            </p>
          </div>

          {/* 관할 보건소 */}
          {hc && (
            <div className="mx-5 mb-5 p-4 bg-rose-50 rounded-xl border border-rose-100">
              <p className="text-xs font-semibold text-rose-700 mb-2 flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5" />
                관할 보건소 (주소 기준 자동 매핑)
              </p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-gray-800 text-sm">{hc.name}</p>
                  {hc.address && <p className="text-xs text-gray-500 mt-0.5">{hc.address}</p>}
                </div>
                <a href={`tel:${hc.phone.replace(/[^0-9]/g, '')}`}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 text-white rounded-lg text-sm font-medium hover:bg-rose-700 transition-colors shrink-0">
                  <Phone className="w-3.5 h-3.5" />
                  {hc.phone}
                </a>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function DirectoryPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<HospitalItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [isDemo, setIsDemo] = useState(false);
  const [govCategory, setGovCategory] = useState(GOV_CATEGORIES[0]);
  const inputRef = useRef<HTMLInputElement>(null);

  const search = useCallback(async (q: string) => {
    if (!q.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const res = await fetch(`/api/directory?name=${encodeURIComponent(q)}`);
      const data = await res.json();
      setResults(data.items || []);
      setIsDemo(!!data.demo);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* 헤더 */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <Phone className="w-6 h-6 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">병원·관공서 직통번호 디렉토리</h1>
        </div>
        <p className="text-sm text-gray-500">
          병원명 검색 → 관할 보건소 자동 매핑 · 부서별 연락처 · 주요 관공서 핵심 번호 제공
        </p>
      </div>

      {/* 검색창 */}
      <div className="flex gap-2 mb-8">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && search(query)}
            placeholder="병원명을 입력하세요 (예: 삼성서울병원, 아산병원...)"
            className="w-full pl-9 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-gray-800 text-sm"
          />
        </div>
        <button
          onClick={() => search(query)}
          disabled={loading || !query.trim()}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white rounded-xl text-sm font-semibold transition-colors"
        >
          {loading ? '검색 중...' : '검색'}
        </button>
      </div>

      {/* 검색 결과 */}
      {searched && (
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-700 text-sm">
              {loading ? '검색 중...' : `검색 결과 ${results.length}건`}
            </h2>
            {isDemo && (
              <span className="text-xs px-2 py-1 bg-amber-50 text-amber-700 rounded-full border border-amber-200">
                HIRA API 키 미설정 — 샘플 데이터 표시
              </span>
            )}
          </div>
          {loading ? (
            <div className="grid gap-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-28 bg-gray-100 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <Search className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p>검색 결과가 없습니다</p>
              <p className="text-xs mt-1">병원명을 더 짧게 입력해 보세요</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {results.map((item) => <HospitalCard key={item.ykiho} item={item} />)}
            </div>
          )}
        </div>
      )}

      {/* 관공서 핵심 번호 */}
      <div>
        <h2 className="font-bold text-gray-800 text-lg mb-4 flex items-center gap-2">
          <Building2 className="w-5 h-5 text-rose-500" />
          관공서 핵심 부서 연락처
        </h2>
        {/* 카테고리 탭 */}
        <div className="flex gap-2 flex-wrap mb-4">
          {GOV_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setGovCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
                govCategory === cat
                  ? 'bg-rose-600 text-white border-rose-600'
                  : 'text-gray-600 border-gray-200 hover:bg-gray-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        {/* 연락처 카드 */}
        <div className="grid sm:grid-cols-2 gap-3">
          {GOV_CONTACTS.filter((g) => g.category === govCategory).map((g, i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100 hover:border-gray-200 shadow-sm">
              <div>
                <p className="text-sm font-medium text-gray-800">{g.name}</p>
                {g.url && (
                  <a href={g.url} target="_blank" rel="noopener noreferrer"
                    className="text-xs text-blue-500 hover:underline flex items-center gap-0.5 mt-0.5">
                    공식 사이트 <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
              <a href={`tel:${g.phone.replace(/[^0-9]/g, '')}`}
                className="flex items-center gap-1.5 px-3 py-2 bg-green-50 text-green-700 rounded-lg text-sm font-bold hover:bg-green-100 transition-colors shrink-0">
                <Phone className="w-3.5 h-3.5" />
                {g.phone}
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
