'use client';
import { FileText, CheckSquare, ClipboardList, BookOpen, Shield, Activity } from 'lucide-react';

interface DocumentListProps {
  documents: string[];
  selectedDoc: string | null;
  onSelect: (doc: string) => void;
}

const docIcons: Record<string, React.ReactNode> = {
  '규정': <BookOpen className="w-4 h-4" />,
  '절차': <ClipboardList className="w-4 h-4" />,
  '체크': <CheckSquare className="w-4 h-4" />,
  '점검': <Activity className="w-4 h-4" />,
  '안전': <Shield className="w-4 h-4" />,
};

function getIcon(docName: string) {
  for (const [key, icon] of Object.entries(docIcons)) {
    if (docName.includes(key)) return icon;
  }
  return <FileText className="w-4 h-4" />;
}

export default function DocumentList({ documents, selectedDoc, onSelect }: DocumentListProps) {
  return (
    <div className="space-y-1">
      {documents.map((doc) => {
        const isSelected = selectedDoc === doc;
        return (
          <button
            key={doc}
            onClick={() => onSelect(doc)}
            className={`w-full text-left flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm transition-all ${
              isSelected
                ? 'border-l-4 border-blue-500 bg-blue-50 text-blue-800 font-medium pl-2'
                : 'hover:bg-gray-50 text-gray-700 border-l-4 border-transparent'
            }`}
          >
            <span className={isSelected ? 'text-blue-500' : 'text-gray-400'}>
              {getIcon(doc)}
            </span>
            <span className="leading-snug">{doc}</span>
          </button>
        );
      })}
    </div>
  );
}
