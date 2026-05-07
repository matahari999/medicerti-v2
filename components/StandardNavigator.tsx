'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDown, ChevronRight, BookOpen, FileText, Zap } from 'lucide-react';
import { StandardChapter } from '@/lib/types';

interface StandardNavigatorProps {
  chapters: StandardChapter[];
  hospitalTypeName: string;
  hospitalTypeKey?: string;
}

export default function StandardNavigator({ chapters, hospitalTypeName, hospitalTypeKey = 'nursing' }: StandardNavigatorProps) {
  const [openChapters, setOpenChapters] = useState<Set<string>>(new Set());
  const router = useRouter();

  const toggle = (chapterNum: string) => {
    setOpenChapters(prev => {
      const next = new Set(prev);
      if (next.has(chapterNum)) next.delete(chapterNum);
      else next.add(chapterNum);
      return next;
    });
  };

  const handleDocClick = (docName: string) => {
    const url = `/generate?type=${hospitalTypeKey}&doc=${encodeURIComponent(docName)}`;
    router.push(url);
  };

  return (
    <div className="space-y-2">
      {chapters.map((chapter) => {
        const isOpen = openChapters.has(chapter.chapterNumber);
        return (
          <div key={chapter.chapterNumber} className="border border-gray-200 rounded-xl overflow-hidden">
            <button
              onClick={() => toggle(chapter.chapterNumber)}
              className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
            >
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-blue-500 flex-shrink-0" />
                <span className="font-semibold text-gray-800 text-sm">
                  제{chapter.chapterNumber}장. {chapter.chapterTitle}
                </span>
                <span className="text-xs text-gray-400">({chapter.items.length}항목)</span>
              </div>
              {isOpen ? (
                <ChevronDown className="w-4 h-4 text-gray-400" />
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-400" />
              )}
            </button>

            {isOpen && (
              <div className="divide-y divide-gray-100">
                {chapter.items.map((item) => (
                  <div key={item.itemNumber} className="px-4 py-4 hover:bg-blue-50 transition-colors">
                    <div className="flex items-start gap-2 mb-2">
                      <FileText className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-800">
                          {item.itemNumber} {item.itemTitle}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{item.summary}</p>
                      </div>
                    </div>

                    {/* 클릭 가능한 문서 태그들 */}
                    {item.requiredDocuments.length > 0 && (
                      <div className="ml-6 mt-2">
                        <p className="text-xs text-gray-400 mb-1.5 font-medium">📄 필요 문서 (클릭하면 바로 생성)</p>
                        <div className="flex flex-wrap gap-1.5">
                          {item.requiredDocuments.map((doc) => (
                            <button
                              key={doc}
                              onClick={() => handleDocClick(doc)}
                              className="inline-flex items-center gap-1 text-xs px-2.5 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-600 hover:text-white transition-colors font-medium cursor-pointer group"
                            >
                              <Zap className="w-3 h-3 opacity-60 group-hover:opacity-100" />
                              {doc}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 서식 태그 */}
                    {item.requiredForms && item.requiredForms.length > 0 && (
                      <div className="ml-6 mt-2">
                        <p className="text-xs text-gray-400 mb-1.5 font-medium">📋 서식/양식 (클릭하면 바로 생성)</p>
                        <div className="flex flex-wrap gap-1.5">
                          {item.requiredForms.map((form) => (
                            <button
                              key={form}
                              onClick={() => handleDocClick(form)}
                              className="inline-flex items-center gap-1 text-xs px-2.5 py-1 bg-green-100 text-green-700 rounded-lg hover:bg-green-600 hover:text-white transition-colors font-medium cursor-pointer group"
                            >
                              <Zap className="w-3 h-3 opacity-60 group-hover:opacity-100" />
                              {form}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 체크리스트 태그 */}
                    {item.requiredChecklists && item.requiredChecklists.length > 0 && (
                      <div className="ml-6 mt-2">
                        <p className="text-xs text-gray-400 mb-1.5 font-medium">✅ 체크리스트 (클릭하면 바로 생성)</p>
                        <div className="flex flex-wrap gap-1.5">
                          {item.requiredChecklists.map((chk) => (
                            <button
                              key={chk}
                              onClick={() => handleDocClick(chk)}
                              className="inline-flex items-center gap-1 text-xs px-2.5 py-1 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-600 hover:text-white transition-colors font-medium cursor-pointer group"
                            >
                              <Zap className="w-3 h-3 opacity-60 group-hover:opacity-100" />
                              {chk}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
