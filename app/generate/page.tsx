'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { HOSPITAL_TYPES } from '@/lib/hospitalTypes';
import { HospitalTypeKey } from '@/lib/types';
import { Loader2, AlertCircle, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import ResultTabs from '@/components/ResultTabs';

const QUICK_EXAMPLES = [
  '낙상 예방관리 규정집과 낙상위험도 평가도구(Morse Fall Scale) 서식 및 낙상 예방 체크리스트를 생성해주세요.',
  '감염관리 규정집과 손위생 수행률 관찰 기록지, 의료관련감염 발생 보고서 양식을 생성해주세요.',
  'AED(자동 제세동기) 일일 점검표, 월별 유지관리 기록지, 직원 교육 확인서를 생성해주세요.',
  '환자권리 및 책임 고지 절차와 환자 권리 안내문, 동의서 서식을 생성해주세요.',
  '욕창 예방관리 지침서와 Braden Scale 평가도구, 욕창 케어 기록지를 생성해주세요.',
  '화재 안전관리 규정집과 소방설비 점검표, 화재 대피훈련 기록지를 생성해주세요.',
];

const hospitalTypeOptions = Object.values(HOSPITAL_TYPES).map(h => ({
  value: h.key,
  label: h.name,
}));

function GenerateForm() {
  const searchParams = useSearchParams();
  const initialType = (searchParams.get('type') ?? 'nursing') as HospitalTypeKey;
  const initialDoc = searchParams.get('doc') ?? '';

  const [hospitalType, setHospitalType] = useState<HospitalTypeKey>(initialType);
  const [hospitalName, setHospitalName] = useState('');
  const [beds, setBeds] = useState('');
  const [department, setDepartment] = useState('');
  const [userRequest, setUserRequest] = useState(
    initialDoc ? `${initialDoc} 관련 규정집·서식·체크리스트를 생성해주세요.` : ''
  );
  const [showHospitalInfo, setShowHospitalInfo] = useState(false);
  const [showOfficialSource, setShowOfficialSource] = useState(false);
  const [officialSourceText, setOfficialSourceText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const canSubmit = userRequest.trim().length > 0 && !loading;

  const handleGenerate = async () => {
    if (!canSubmit) return;
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hospitalName,
          hospitalType,
          beds,
          department,
          certificationCycle: HOSPITAL_TYPES[hospitalType]?.certificationCycle ?? '3년',
          generationMode: 'single',
          selectedChapters: [],
          selectedItems: [],
          userRequest,
          documentType: 'regulation',
          detailLevel: 'standard',
          documentStyle: '표준',
          includeEmergencyEquipment: false,
          includeEmergencyKit: false,
          includeAmbulanceChecklist: false,
          officialSourceText,
          hospitalSourceText: '',
          referenceSourceText: '',
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? '생성 실패');
      setResult(data.result);
    } catch (e: any) {
      setError(e.message ?? '오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-black text-gray-900 mb-1">문서 생성</h1>
        <p className="text-gray-500">AI가 인증 기준에 맞는 규정집·서식·체크리스트를 생성합니다</p>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* 왼쪽: 설정 */}
        <div className="lg:col-span-2 space-y-4">
          {/* 병원 유형 선택 */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <label className="block text-sm font-semibold text-gray-700 mb-2">병원 유형 *</label>
            <select
              value={hospitalType}
              onChange={e => setHospitalType(e.target.value as HospitalTypeKey)}
              className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              {hospitalTypeOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          {/* 병원정보 (접기/펼치기) */}
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <button
              onClick={() => setShowHospitalInfo(!showHospitalInfo)}
              className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors"
            >
              <span className="text-sm font-semibold text-gray-700">병원 정보 (선택)</span>
              {showHospitalInfo ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
            </button>
            {showHospitalInfo && (
              <div className="px-5 pb-5 space-y-3 border-t border-gray-100">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">병원명</label>
                  <input
                    type="text"
                    value={hospitalName}
                    onChange={e => setHospitalName(e.target.value)}
                    placeholder="예: ○○요양병원"
                    className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">병상 수</label>
                    <input
                      type="text"
                      value={beds}
                      onChange={e => setBeds(e.target.value)}
                      placeholder="예: 150"
                      className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">담당 부서</label>
                    <input
                      type="text"
                      value={department}
                      onChange={e => setDepartment(e.target.value)}
                      placeholder="예: 간호부"
                      className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 공식 자료 입력 (접기/펼치기) */}
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <button
              onClick={() => setShowOfficialSource(!showOfficialSource)}
              className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors"
            >
              <span className="text-sm font-semibold text-gray-700">공식 자료 입력 (선택)</span>
              {showOfficialSource ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
            </button>
            {showOfficialSource && (
              <div className="px-5 pb-5 border-t border-gray-100">
                <label className="block text-xs font-medium text-gray-500 mb-1 mt-3">공식 인증기준 텍스트</label>
                <textarea
                  value={officialSourceText}
                  onChange={e => setOfficialSourceText(e.target.value)}
                  placeholder="공식 인증기준집에서 관련 내용을 붙여넣으세요 (선택사항)"
                  rows={4}
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>
            )}
          </div>
        </div>

        {/* 오른쪽: 요청 + 결과 */}
        <div className="lg:col-span-3 space-y-4">
          {/* 문서 요청 */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              문서 요청 내용 *
            </label>

            {/* 빠른 예시 버튼 */}
            <div className="flex flex-wrap gap-1.5 mb-3">
              {QUICK_EXAMPLES.slice(0, 3).map((ex, i) => (
                <button
                  key={i}
                  onClick={() => setUserRequest(ex)}
                  className="text-xs px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors border border-blue-200"
                >
                  예시 {i + 1}
                </button>
              ))}
            </div>

            <textarea
              value={userRequest}
              onChange={e => setUserRequest(e.target.value)}
              placeholder="생성할 문서를 설명해주세요.&#10;예: 낙상 예방관리 규정집과 낙상위험도 평가도구 서식을 생성해주세요."
              rows={6}
              className="w-full border border-gray-300 rounded-xl px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />

            {!userRequest.trim() && (
              <p className="text-xs text-amber-600 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                ✏️ 문서 요청 내용을 입력하세요
              </p>
            )}

            <button
              onClick={handleGenerate}
              disabled={!canSubmit}
              className={`mt-4 w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-base transition-colors ${
                canSubmit
                  ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  AI가 문서를 생성 중입니다...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  문서 생성하기
                </>
              )}
            </button>
          </div>

          {/* 에러 */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-red-800">오류 발생</p>
                <p className="text-sm text-red-600 mt-0.5">{error}</p>
              </div>
            </div>
          )}

          {/* 결과 */}
          {result && (
            <div className="bg-white rounded-2xl border border-gray-200 p-5">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-5 h-5 text-blue-500" />
                <h2 className="font-bold text-gray-900">생성 완료</h2>
              </div>
              <ResultTabs result={result} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function GeneratePage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-blue-500" /></div>}>
      <GenerateForm />
    </Suspense>
  );
}
