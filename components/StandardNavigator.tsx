'use client';
import { useState } from 'react';
import { ChevronDown, ChevronRight, BookOpen, FileText } from 'lucide-react';
import { StandardChapter } from '@/lib/types';

interface StandardNavigatorProps {
  chapters: StandardChapter[];
  hospitalTypeName: string;
}

export default function StandardNavigator({ chapters, hospitalTypeName }: StandardNavigatorProps) {
  const [openChapters, setOpenChapters] = useState<Set<string>>(new Set());

  const toggle = (chapterNum: string) => {
    setOpenChapters(prev => {
      const next = new Set(prev);
      if (next.has(chapterNum)) next.delete(chapterNum);
      else next.add(chapterNum);
      return next;
    });
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
                  <div key={item.itemNumber} className="px-4 py-3 hover:bg-blue-50 transition-colors">
                    <div className="flex items-start gap-2">
                      <FileText className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-800">
                          {item.itemNumber} {item.itemTitle}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{item.summary}</p>
                        {item.requiredDocuments.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1.5">
                            {item.requiredDocuments.slice(0, 3).map((doc) => (
                              <span key={doc} className="text-xs px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded">
                                {doc}
                              </span>
                            ))}
                            {item.requiredDocuments.length > 3 && (
                              <span className="text-xs text-gray-400">+{item.requiredDocuments.length - 3}</span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
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
