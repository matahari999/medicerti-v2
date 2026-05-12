'use client';
import { useState } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { use } from 'react';
import { HOSPITAL_TYPES } from '@/lib/hospitalTypes';
import { STANDARD_CATALOG } from '@/lib/standardCatalog';
import DocumentList from '@/components/DocumentList';
import DocumentDetail from '@/components/DocumentDetail';
import { BookOpen, FileText, Building2, ArrowRight } from 'lucide-react';

const colorGradientMap: Record<string, string> = {
  'text-blue-700': 'from-blue-600 to-blue-400',
  'text-purple-700': 'from-purple-600 to-purple-400',
  'text-green-700': 'from-green-600 to-green-400',
  'text-red-700': 'from-red-600 to-red-400',
  'text-orange-700': 'from-orange-600 to-orange-400',
  'text-teal-700': 'from-teal-600 to-teal-400',
  'text-indigo-700': 'from-indigo-600 to-indigo-400',
};

export default function HospitalDetailPage({ params }: { params: Promise<{ type: string }> }) {
  const { type } = use(params);
  const [selectedDoc, setSelectedDoc] = useState<string | null>(null);

  const hospital = HOSPITAL_TYPES[type as keyof typeof HOSPITAL_TYPES];
  if (!hospital) notFound();

  const catalog = STANDARD_CATALOG[type as keyof typeof STANDARD_CATALOG];
  const chapters = catalog?.chapters ?? [];
  const totalItems = chapters.reduce((acc, ch) => acc + ch.items.length, 0);
  const gradient = colorGradientMap[hospital.color] ?? 'from-gray-600 to-gray-400';

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid lg:grid-cols-5 gap-6">
        {/* ===== 왼쪽 패널 (40%) ===== */}
        <div className="lg:col-span-2 space-y-4">
          {/* 병원 유형 헤더 카드 */}
          <div className="rounded-2xl overflow-hidden bg-white border border-gray-200 shadow-sm">
            <div className={`h-24 bg-gradient-to-r ${gradient} flex items-center px-6 gap-4`}>
              <span className="text-5xl">{hospital.icon}</span>
              <div className="text-white">
                <h1 className="text-2xl font-black">{hospital.name}</h1>
                <p className="text-sm opacity-80">{hospital.description}</p>
              </div>
            </div>
            <div className="px-6 py-3 flex flex-wrap gap-2">
              <span className="inline-flex items-center px-2.5 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full font-medium">
                인증주기 {hospital.certificationCycle}
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                공식 목차 반영
              </span>
            </div>
          </div>

          {/* 주요 부서 태그 */}
          <div className="bg-white rounded-2xl border border-gray-200 p-4">
            <div className="flex items-center gap-2 mb-3">
              <Building2 className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-semibold text-gray-700">주요 부서</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {hospital.mainDepartments.map((dept) => (
                <span key={dept} className="text-xs px-2.5 py-1 bg-gray-100 text-gray-600 rounded-lg">
                  {dept}
                </span>
              ))}
            </div>
          </div>

          {/* 지원 문서 라이브러리 */}
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-500" />
              <span className="font-semibold text-gray-800 text-sm">지원 문서 라이브러리</span>
              <span className="ml-auto text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                {hospital.keyDocumentLibrary.length}종
              </span>
            </div>
            <div className="p-3 max-h-80 overflow-y-auto">
              <DocumentList
                documents={hospital.keyDocumentLibrary}
                selectedDoc={selectedDoc}
                onSelect={setSelectedDoc}
              />
            </div>
          </div>

          {/* 인증기준집 개요 */}
          {catalog && (
            <div className="bg-white rounded-2xl border border-gray-200 p-4">
              <div className="flex items-center gap-2 mb-3">
                <BookOpen className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-semibold text-gray-700">인증기준집 개요</span>
              </div>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-blue-50 rounded-xl p-3">
                  <p className="text-2xl font-black text-blue-700">{chapters.length}</p>
                  <p className="text-xs text-blue-600 mt-0.5">장(章)</p>
                </div>
                <div className="bg-green-50 rounded-xl p-3">
                  <p className="text-2xl font-black text-green-700">{totalItems}</p>
                  <p className="text-xs text-green-600 mt-0.5">항목 수</p>
                </div>
                <div className="bg-purple-50 rounded-xl p-3">
                  <p className="text-2xl font-black text-purple-700">{hospital.keyDocumentLibrary.length}</p>
                  <p className="text-xs text-purple-600 mt-0.5">문서 수</p>
                </div>
              </div>
            </div>
          )}

          {/* 버튼 2개 */}
          <div className="grid grid-cols-2 gap-3">
            <Link
              href={`/standards?type=${hospital.key}`}
              className="flex items-center justify-center gap-1.5 bg-white border-2 border-blue-200 text-blue-700 py-3 rounded-xl font-semibold text-sm hover:bg-blue-50 transition-colors"
            >
              <BookOpen className="w-4 h-4" />
              인증기준집 탐색
            </Link>
            <Link
              href={`/generate?type=${hospital.key}`}
              className="flex items-center justify-center gap-1.5 bg-blue-600 text-white py-3 rounded-xl font-semibold text-sm hover:bg-blue-700 transition-colors"
            >
              <FileText className="w-4 h-4" />
              문서 생성
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* ===== 오른쪽 패널 (60%) ===== */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-2xl border border-gray-200 min-h-80 sticky top-24">
            <div className="px-5 py-4 border-b border-gray-100">
              <h2 className="font-bold text-gray-800">
                {selectedDoc ? '문서 상세 정보' : '문서를 선택하세요'}
              </h2>
              {selectedDoc && (
                <p className="text-xs text-gray-400 mt-0.5">왼쪽 목록에서 다른 문서를 클릭하면 내용이 바뀝니다</p>
              )}
            </div>
            <DocumentDetail docName={selectedDoc} hospitalTypeKey={hospital.key} />
          </div>
        </div>
      </div>
    </div>
  );
}
