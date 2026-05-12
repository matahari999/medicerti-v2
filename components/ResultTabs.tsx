'use client';
import { useState } from 'react';
import { GenerationResult } from '@/lib/types';
import FormRenderer from './FormRenderer';
import DraftDocumentView from './DraftDocumentView';
import BlankFormPrint from './BlankFormPrint';

interface ResultTabsProps {
  result: GenerationResult;
}

type TabKey = 'summary' | 'draft' | 'form' | 'checklist' | 'blank' | 'basis';

const tabs: { key: TabKey; label: string }[] = [
  { key: 'summary', label: '요약 카드' },
  { key: 'draft', label: '문서 초안' },
  { key: 'form', label: '서식/양식' },
  { key: 'checklist', label: '체크리스트' },
  { key: 'blank', label: '🖨️ 빈 서식' },
  { key: 'basis', label: '공식 근거' },
];

export default function ResultTabs({ result }: ResultTabsProps) {
  const [activeTab, setActiveTab] = useState<TabKey>('summary');

  return (
    <div className="mt-6 border border-gray-200 rounded-2xl overflow-hidden">
      {/* 탭 헤더 */}
      <div className="flex border-b border-gray-200 bg-gray-50 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-shrink-0 px-5 py-3 text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? 'border-b-2 border-blue-600 text-blue-700 bg-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 탭 내용 */}
      <div className="p-6">

        {/* 요약 카드 */}
        {activeTab === 'summary' && (
          <div className="space-y-4">
            <h3 className="font-bold text-gray-900 text-lg">{result.summaryCard?.documentName}</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              {[
                ['병원 유형', result.summaryCard?.hospitalType],
                ['관련 기준', result.summaryCard?.relatedStandard],
                ['사용 부서', result.summaryCard?.usedBy],
                ['보관 담당', result.summaryCard?.retentionOwner],
                ['사용 시점', result.summaryCard?.whenToUse],
                ['결재 라인', result.summaryCard?.approvalRequired],
              ].map(([label, value]) => value ? (
                <div key={label} className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 mb-1">{label}</p>
                  <p className="text-gray-800 font-medium text-xs">{value}</p>
                </div>
              ) : null)}
            </div>
            {result.qualityScore && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl font-black text-green-700">{result.qualityScore.score}점</span>
                  <span className="text-sm text-green-600 font-medium">{result.qualityScore.grade}</span>
                </div>
                {result.qualityScore.reason?.length > 0 && (
                  <ul className="text-xs text-green-700 space-y-1">
                    {result.qualityScore.reason.map((r, i) => <li key={i}>• {r}</li>)}
                  </ul>
                )}
              </div>
            )}
            {result.internalReviewPoints?.length > 0 && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
                <p className="text-xs font-semibold text-amber-700 mb-1">⚠️ 내부 검토 필요 사항</p>
                <ul className="text-xs text-amber-700 space-y-1">
                  {result.internalReviewPoints.map((p, i) => <li key={i}>• {p}</li>)}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* 문서 초안 — 공식 규정 사례집 형식 */}
        {activeTab === 'draft' && result.draftDocument && (
          <DraftDocumentView
            doc={result.draftDocument}
            disclaimer={result.disclaimer}
          />
        )}

        {/* 서식/양식 */}
        {activeTab === 'form' && result.blankForm && (
          <div className="space-y-6">
            <FormRenderer
              title={result.blankForm.formTitle || '서식'}
              usageGuide={result.blankForm.usageGuide || ''}
              templateMarkdown={result.blankForm.templateMarkdown || ''}
            />
            {result.filledExample?.exampleMarkdown && (
              <div>
                <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-bold">작성 예시</span>
                  {result.filledExample.exampleTitle}
                </h4>
                {result.filledExample.privacyNotice && (
                  <p className="text-xs text-gray-400 mb-2">🔒 {result.filledExample.privacyNotice}</p>
                )}
                <FormRenderer
                  title={result.filledExample.exampleTitle || '작성 예시'}
                  usageGuide=""
                  templateMarkdown={result.filledExample.exampleMarkdown}
                />
              </div>
            )}
          </div>
        )}

        {/* 체크리스트 */}
        {activeTab === 'checklist' && result.checklist && result.checklist.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-gray-700 text-white">
                  <th className="border border-gray-500 px-2 py-2 text-xs w-8">번호</th>
                  <th className="border border-gray-500 px-3 py-2 text-xs">점검항목</th>
                  <th className="border border-gray-500 px-2 py-2 text-xs">주기</th>
                  <th className="border border-gray-500 px-2 py-2 text-xs">담당부서</th>
                  <th className="border border-gray-500 px-2 py-2 text-xs w-24">결과</th>
                  <th className="border border-gray-500 px-2 py-2 text-xs">조치사항</th>
                </tr>
              </thead>
              <tbody>
                {result.checklist.map((item, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="border border-gray-300 px-2 py-2 text-center text-xs font-bold text-gray-500">{i+1}</td>
                    <td className="border border-gray-300 px-3 py-2 text-xs text-gray-800">{item.item}</td>
                    <td className="border border-gray-300 px-2 py-2 text-center text-xs text-gray-600">{item.frequency}</td>
                    <td className="border border-gray-300 px-2 py-2 text-center text-xs text-gray-600">{item.responsibleDepartment}</td>
                    <td className="border border-gray-300 px-2 py-2 text-xs text-gray-500">
                      {item.resultOptions?.map(opt => `□${opt}`).join(' ')}
                    </td>
                    <td className="border border-gray-300 px-2 py-2 text-xs text-gray-600">{item.improvementAction}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 🖨️ 빈 서식 */}
        {activeTab === 'blank' && (
          <BlankFormPrint result={result} />
        )}

        {/* 공식 근거 */}
        {activeTab === 'basis' && (
          <div className="space-y-3 text-sm">
            {result.officialBasis?.map((basis, i) => (
              <div key={i} className="p-4 border border-gray-200 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs font-bold">{basis.standardNumber}</span>
                  <span className="font-semibold text-gray-800">{basis.standardTitle}</span>
                </div>
                <p className="text-xs text-gray-500 mb-2">{basis.sourceName} — {basis.sourceType}</p>
                <p className="text-gray-600 text-xs leading-relaxed">{basis.requirementSummary}</p>
                {basis.confidence === '확인 필요' && (
                  <p className="text-xs text-amber-600 mt-1">⚠️ 공식 문서에서 확인 권장</p>
                )}
              </div>
            ))}
            {result.officialCheckNeeded?.length > 0 && (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                <p className="font-semibold text-amber-800 text-sm mb-2">⚠️ 공식 확인 필요 항목</p>
                {result.officialCheckNeeded.map((item, i) => (
                  <div key={i} className="text-xs text-amber-700 mb-1">
                    • {item.item} — {item.whereToCheck}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
