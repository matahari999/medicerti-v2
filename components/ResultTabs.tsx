'use client';
import { useState } from 'react';
import { GenerationResult } from '@/lib/types';

interface ResultTabsProps {
  result: GenerationResult;
}

type TabKey = 'summary' | 'draft' | 'form' | 'checklist' | 'basis';

const tabs: { key: TabKey; label: string }[] = [
  { key: 'summary', label: '요약 카드' },
  { key: 'draft', label: '문서 초안' },
  { key: 'form', label: '서식/양식' },
  { key: 'checklist', label: '체크리스트' },
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
        {activeTab === 'summary' && (
          <div className="space-y-3">
            <h3 className="font-bold text-gray-900">{result.summaryCard.documentName}</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><span className="text-gray-500">병원 유형:</span> {result.summaryCard.hospitalType}</div>
              <div><span className="text-gray-500">인증 기준:</span> {result.summaryCard.relatedStandard}</div>
              <div><span className="text-gray-500">사용 부서:</span> {result.summaryCard.usedBy}</div>
              <div><span className="text-gray-500">보관 담당:</span> {result.summaryCard.retentionOwner}</div>
            </div>
            {result.qualityScore && (
              <div className="mt-4 p-4 bg-green-50 rounded-xl">
                <p className="text-sm font-semibold text-green-800">품질 점수: {result.qualityScore.score}점</p>
                <p className="text-xs text-green-700 mt-1">{result.qualityScore.grade}</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'draft' && result.draftDocument && (
          <div className="space-y-4 text-sm">
            <h3 className="font-bold text-lg text-gray-900">{result.draftDocument.title}</h3>
            <div>
              <p className="font-semibold text-gray-700 mb-1">목적</p>
              <p className="text-gray-600">{result.draftDocument.purpose}</p>
            </div>
            <div>
              <p className="font-semibold text-gray-700 mb-1">범위</p>
              <p className="text-gray-600">{result.draftDocument.scope}</p>
            </div>
            {result.draftDocument.procedure.length > 0 && (
              <div>
                <p className="font-semibold text-gray-700 mb-1">절차</p>
                <ol className="list-decimal list-inside space-y-1">
                  {result.draftDocument.procedure.map((step, i) => (
                    <li key={i} className="text-gray-600">{step}</li>
                  ))}
                </ol>
              </div>
            )}
          </div>
        )}

        {activeTab === 'form' && result.blankForm && (
          <div className="space-y-3 text-sm">
            <h3 className="font-bold text-gray-900">{result.blankForm.formTitle}</h3>
            <p className="text-gray-500 text-xs">{result.blankForm.usageGuide}</p>
            <div className="bg-gray-50 rounded-xl p-4 font-mono text-xs whitespace-pre-wrap">
              {result.blankForm.templateMarkdown}
            </div>
          </div>
        )}

        {activeTab === 'checklist' && result.checklist && result.checklist.length > 0 && (
          <div className="space-y-2 text-sm">
            {result.checklist.map((item, i) => (
              <div key={i} className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg">
                <span className="w-6 h-6 bg-blue-100 text-blue-700 rounded-full text-xs font-bold flex items-center justify-center flex-shrink-0">
                  {i + 1}
                </span>
                <div>
                  <p className="font-medium text-gray-800">{item.item}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{item.frequency} | {item.responsibleDepartment}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'basis' && result.officialBasis && (
          <div className="space-y-3 text-sm">
            {result.officialBasis.map((basis, i) => (
              <div key={i} className="p-4 border border-gray-200 rounded-xl">
                <p className="font-semibold text-gray-800">{basis.standardNumber} {basis.standardTitle}</p>
                <p className="text-xs text-gray-500 mt-1">{basis.sourceName} — {basis.sourceType}</p>
                <p className="text-gray-600 mt-2">{basis.requirementSummary}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
