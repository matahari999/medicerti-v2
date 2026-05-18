'use client';

import { useEffect, useState } from 'react';
import { NoticeResult, Notice } from '@/lib/noticeConfig';
import { ExternalLink, RefreshCw, Bell, AlertCircle } from 'lucide-react';

const COLOR_MAP: Record<string, { badge: string; dot: string; tab: string; tabActive: string }> = {
  rose:   { badge: 'bg-rose-100 text-rose-700',   dot: 'bg-rose-500',   tab: 'hover:bg-rose-50 text-rose-600 border-rose-200',   tabActive: 'bg-rose-600 text-white border-rose-600' },
  blue:   { badge: 'bg-blue-100 text-blue-700',   dot: 'bg-blue-500',   tab: 'hover:bg-blue-50 text-blue-600 border-blue-200',   tabActive: 'bg-blue-600 text-white border-blue-600' },
  green:  { badge: 'bg-green-100 text-green-700', dot: 'bg-green-500',  tab: 'hover:bg-green-50 text-green-600 border-green-200', tabActive: 'bg-green-600 text-white border-green-600' },
  purple: { badge: 'bg-purple-100 text-purple-700',dot: 'bg-purple-500', tab: 'hover:bg-purple-50 text-purple-600 border-purple-200',tabActive: 'bg-purple-600 text-white border-purple-600' },
  orange: { badge: 'bg-orange-100 text-orange-700',dot: 'bg-orange-500', tab: 'hover:bg-orange-50 text-orange-600 border-orange-200',tabActive: 'bg-orange-600 text-white border-orange-600' },
};

const SOURCE_COLORS: Record<string, string> = {
  koiha: 'rose',
  mohw:  'blue',
  hira:  'green',
  kha:   'purple',
  lmha:  'orange',
};

function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 animate-pulse">
      <div className="flex gap-3 mb-3">
        <div className="h-5 w-16 bg-gray-200 rounded-full" />
        <div className="h-5 w-12 bg-gray-200 rounded-full" />
      </div>
      <div className="h-4 bg-gray-200 rounded w-4/5 mb-2" />
      <div className="h-4 bg-gray-200 rounded w-3/5" />
    </div>
  );
}

function NoticeCard({ notice }: { notice: Notice }) {
  const color = COLOR_MAP[notice.color] ?? COLOR_MAP.blue;
  return (
    <a
      href={notice.link}
      target="_blank"
      rel="noopener noreferrer"
      className="group block bg-white rounded-xl border border-gray-100 hover:border-gray-300 hover:shadow-md transition-all p-4"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${color.badge}`}>
              {notice.shortName}
            </span>
            <span className="text-xs text-gray-400">{notice.category}</span>
            {notice.date && (
              <span className="text-xs text-gray-400 ml-auto">{notice.date}</span>
            )}
          </div>
          <p className="text-sm text-gray-800 font-medium leading-relaxed line-clamp-2 group-hover:text-blue-700 transition-colors">
            {notice.title}
          </p>
        </div>
        <ExternalLink className="w-4 h-4 text-gray-300 group-hover:text-blue-500 shrink-0 mt-1 transition-colors" />
      </div>
    </a>
  );
}

function ErrorCard({ result }: { result: NoticeResult }) {
  return (
    <div className="bg-gray-50 rounded-xl border border-dashed border-gray-200 p-4 flex items-center justify-between">
      <div className="flex items-center gap-2 text-gray-400 text-sm">
        <AlertCircle className="w-4 h-4" />
        <span>{result.sourceName} — 직접 접근이 필요합니다</span>
      </div>
      <a
        href={result.directUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors"
      >
        사이트 방문 <ExternalLink className="w-3 h-3" />
      </a>
    </div>
  );
}

export default function NoticesPage() {
  const [results, setResults] = useState<NoticeResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<string>('all');
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  async function load(isRefresh = false) {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    try {
      const url = isRefresh
        ? `/api/notices?t=${Date.now()}`
        : '/api/notices';
      const res = await fetch(url);
      const data: NoticeResult[] = await res.json();
      setResults(data);
      setLastUpdated(new Date());
    } catch {
      // 조용히 실패
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => { load(); }, []);

  // 모든 공지를 날짜순 정렬
  const allNotices: Notice[] = results
    .flatMap((r) => r.notices)
    .sort((a, b) => {
      if (!a.date && !b.date) return 0;
      if (!a.date) return 1;
      if (!b.date) return -1;
      return b.date.localeCompare(a.date);
    });

  const filteredNotices =
    filter === 'all'
      ? allNotices
      : allNotices.filter((n) => n.source === filter);

  const failedSources = results.filter(
    (r) => r.status === 'error' && filter === 'all',
  );

  // 탭 목록
  const tabs = [
    { key: 'all', label: '전체', count: allNotices.length, color: '' },
    ...results.map((r) => ({
      key: r.source,
      label: r.sourceName,
      count: r.notices.length,
      color: SOURCE_COLORS[r.source] ?? 'blue',
    })),
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* 헤더 */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Bell className="w-6 h-6 text-rose-500" />
            <h1 className="text-2xl font-bold text-gray-900">병원 관련 공지사항</h1>
          </div>
          <p className="text-sm text-gray-500">
            인증원·복지부·HIRA·병원협회 등 주요 기관 공지를 한 곳에서 확인하세요
          </p>
          {lastUpdated && (
            <p className="text-xs text-gray-400 mt-1">
              마지막 수집: {lastUpdated.toLocaleTimeString('ko-KR')}
            </p>
          )}
        </div>
        <button
          onClick={() => load(true)}
          disabled={refreshing || loading}
          className="flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50 transition"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          새로고침
        </button>
      </div>

      {/* 필터 탭 */}
      {!loading && results.length > 0 && (
        <div className="flex gap-2 flex-wrap mb-6">
          {tabs.map((tab) => {
            const isActive = filter === tab.key;
            const c = tab.key === 'all'
              ? { tab: 'hover:bg-gray-100 text-gray-600 border-gray-200', tabActive: 'bg-gray-800 text-white border-gray-800' }
              : COLOR_MAP[tab.color ?? 'blue'];
            return (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-sm font-medium transition-all ${
                  isActive ? c.tabActive : c.tab
                }`}
              >
                {tab.label}
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${isActive ? 'bg-white/20' : 'bg-gray-100 text-gray-500'}`}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* 컨텐츠 */}
      {loading ? (
        <div className="grid gap-3">
          {Array.from({ length: 10 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : filteredNotices.length === 0 && failedSources.length === results.length ? (
        /* 전부 실패 */
        <div className="text-center py-20 text-gray-400">
          <Bell className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="font-medium">공지사항을 불러올 수 없습니다</p>
          <p className="text-sm mt-1">각 기관 사이트를 직접 방문해주세요</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {/* 실패 출처 알림 */}
          {failedSources.map((r) => (
            <ErrorCard key={r.source} result={r} />
          ))}

          {/* 공지 카드 */}
          {filteredNotices.map((notice) => (
            <NoticeCard key={notice.id} notice={notice} />
          ))}

          {filteredNotices.length === 0 && (
            <div className="text-center py-16 text-gray-400">
              <p>이 기관의 공지사항을 불러오지 못했습니다.</p>
              {results.find((r) => r.source === filter) && (
                <a
                  href={results.find((r) => r.source === filter)!.directUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 mt-3 text-sm text-blue-600 hover:underline"
                >
                  공식 사이트 방문 <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          )}
        </div>
      )}

      {/* 하단 출처 링크 */}
      {!loading && (
        <div className="mt-10 pt-6 border-t border-gray-100">
          <p className="text-xs text-gray-400 mb-3 font-medium">공식 사이트 바로가기</p>
          <div className="flex flex-wrap gap-2">
            {results.map((r) => (
              <a
                key={r.source}
                href={r.directUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs px-3 py-1.5 bg-gray-50 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors"
              >
                {r.sourceName} <ExternalLink className="w-3 h-3" />
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
