'use client';
import { useState } from 'react';
import { HOSPITAL_TYPES } from '@/lib/hospitalTypes';
import { STANDARD_CATALOG } from '@/lib/standardCatalog';
import { HospitalTypeKey } from '@/lib/types';
import StandardNavigator from '@/components/StandardNavigator';
import { BookOpen } from 'lucide-react';

export default function StandardsPage() {
  const hospitals = Object.values(HOSPITAL_TYPES);
  const [selectedType, setSelectedType] = useState<HospitalTypeKey>('nursing');

  const catalog = STANDARD_CATALOG[selectedType];
  const hospital = HOSPITAL_TYPES[selectedType];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-black text-gray-900 mb-2">인증기준집 탐색</h1>
        <p className="text-gray-500">병원 유형별 공식 인증기준집 목차와 각 항목에 필요한 문서를 확인하세요</p>
      </div>

      {/* 병원 유형 탭 */}
      <div className="flex flex-wrap gap-2 mb-6">
        {hospitals.map(h => (
          <button
            key={h.key}
            onClick={() => setSelectedType(h.key)}
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

      {/* 기준집 정보 */}
      {catalog && (
        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-start gap-2">
          <BookOpen className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-blue-800">{catalog.notice}</p>
        </div>
      )}

      {/* 목차 탐색 */}
      {catalog && hospital && (
        <StandardNavigator
          chapters={catalog.chapters}
          hospitalTypeName={hospital.name}
        />
      )}
    </div>
  );
}
