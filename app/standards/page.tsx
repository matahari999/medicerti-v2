'use client';
import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { HOSPITAL_TYPES } from '@/lib/hospitalTypes';
import { STANDARD_CATALOG } from '@/lib/standardCatalog';
import { HospitalTypeKey } from '@/lib/types';
import StandardNavigator from '@/components/StandardNavigator';
import { BookOpen } from 'lucide-react';

function StandardsContent() {
  const searchParams = useSearchParams();
  const paramType = searchParams.get('type') as HospitalTypeKey | null;
  const hospitals = Object.values(HOSPITAL_TYPES);
  const validKeys = hospitals.map(h => h.key);
  const initialType: HospitalTypeKey =
    paramType && validKeys.includes(paramType) ? paramType : 'nursing';

  const [selectedType, setSelectedType] = useState<HospitalTypeKey>(initialType);

  const catalog = STANDARD_CATALOG[selectedType];
  const hospital = HOSPITAL_TYPES[selectedType];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-black text-gray-900 mb-2">인증기준집 탐색</h1>
        <p className="text-gray-500">
          병원 유형별 공식 인증기준집 목차를 확인하고, 필요한 문서를{' '}
          <span className="text-blue-600 font-semibold">클릭 한 번</span>으로 바로 생성하세요
        </p>
      </div>

      {/* 병원 유형 탭 */}
      <div className="flex flex-wrap gap-2 mb-6">
        {hospitals.map(h => (
          <button
            key={h.key}
            onClick={() => setSelectedType(h.key as HospitalTypeKey)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              selectedType === h.key
                ? 'bg-blue-600 text-white shadow'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            <span>{h.icon}</span>
            {h.name}
          </button>
        ))}
      </div>

      {/* 사용 안내 */}
      <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-xl flex items-start gap-2">
        <span className="text-blue-500 text-sm">💡</span>
        <p className="text-sm text-blue-800">
          <span className="font-semibold">파란색 = 규정집·지침서</span> &nbsp;
          <span className="font-semibold text-green-700">초록색 = 서식·양식</span> &nbsp;
          <span className="font-semibold text-orange-600">주황색 = 체크리스트</span> — 태그를 클릭하면 해당 문서 생성 페이지로 이동합니다
        </p>
      </div>

      {/* 기준집 안내 */}
      {catalog && (
        <div className="mb-4 p-4 bg-gray-50 border border-gray-200 rounded-xl flex items-start gap-2">
          <BookOpen className="w-4 h-4 text-gray-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-gray-600">{catalog.notice}</p>
        </div>
      )}

      {/* 목차 탐색 */}
      {catalog && hospital && (
        <StandardNavigator
          chapters={catalog.chapters}
          hospitalTypeName={hospital.name}
          hospitalTypeKey={selectedType}
        />
      )}
    </div>
  );
}

export default function StandardsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-gray-400">로딩 중...</div>}>
      <StandardsContent />
    </Suspense>
  );
}
