'use client';
import { useState } from 'react';
import { GenerationResult } from '@/lib/types';
import FormRenderer from './FormRenderer';
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

        {/* 문서 초안 */}
        {activeTab === 'draft' && result.draftDocument && (
          <div className="space-y-5 text-sm">
            <h3 className="font-black text-xl text-gray-900 pb-2 border-b border-gray-200">
              {result.draftDocument.title}
            </h3>
            {[
              { label: '제1조 목적', content: result.draftDocument.purpose },
              { label: '제2조 적용 범위', content: result.draftDocument.scope },
            ].map(({ label, content }) => content && (
              <div key={label}>
                <p className="font-bold text-gray-800 mb-1">{label}</p>
                <p className="text-gray-600 leading-relaxed bg-gray-50 p-3 rounded-lg">{content}</p>
              </div>
            ))}
            {result.draftDocument.definitions?.length > 0 && (
              <div>
                <p className="font-bold text-gray-800 mb-2">제3조 용어 정의</p>
                <ul className="space-y-1">
                  {result.draftDocument.definitions.map((d, i) => (
                    <li key={i} className="text-gray-600 text-xs bg-gray-50 px-3 py-1.5 rounded">• {d}</li>
                  ))}
                </ul>
              </div>
            )}
            {result.draftDocument.responsibilities?.length > 0 && (
              <div>
                <p className="font-bold text-gray-800 mb-2">제4조 책임과 권한</p>
                <ul className="space-y-1">
                  {result.draftDocument.responsibilities.map((r, i) => (
                    <li key={i} className="text-gray-600 text-xs bg-blue-50 px-3 py-1.5 rounded">• {r}</li>
                  ))}
                </ul>
              </div>
            )}
            {result.draftDocument.procedure?.length > 0 && (
              <div>
                <p className="font-bold text-gray-800 mb-2">제5조 절차</p>
                <ol className="space-y-2">
                  {result.draftDocument.procedure.map((step, i) => (
                    <li key={i} className="flex gap-2 text-gray-700 text-xs">
                      <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold text-xs">{i+1}</span>
                      <span className="pt-0.5 leading-relaxed">{step.replace(/^\d+\.\s*/, '')}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}
            {result.draftDocument.recordsAndRetention?.length > 0 && (
              <div>
                <p className="font-bold text-gray-800 mb-2">제6조 기록 및 보존</p>
                <ul className="space-y-1">
                  {result.draftDocument.recordsAndRetention.map((r, i) => (
                    <li key={i} className="text-gray-600 text-xs bg-gray-50 px-3 py-1.5 rounded">• {r}</li>
                  ))}
                </ul>
              </div>
            )}
            {result.disclaimer && (
              <div className="mt-4 p-3 bg-gray-100 rounded-lg border border-gray-300">
                <p className="text-xs text-gray-500">{result.disclaimer}</p>
              </div>
            )}
          </div>
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
