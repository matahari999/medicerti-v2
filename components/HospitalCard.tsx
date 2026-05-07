import Link from 'next/link';
import { HospitalTypeInfo } from '@/lib/hospitalTypes';
import { ChevronRight } from 'lucide-react';

interface HospitalCardProps {
  hospital: HospitalTypeInfo;
}

const colorMap: Record<string, string> = {
  'text-blue-700': 'from-blue-600 to-blue-400',
  'text-purple-700': 'from-purple-600 to-purple-400',
  'text-green-700': 'from-green-600 to-green-400',
  'text-red-700': 'from-red-600 to-red-400',
  'text-orange-700': 'from-orange-600 to-orange-400',
  'text-teal-700': 'from-teal-600 to-teal-400',
  'text-indigo-700': 'from-indigo-600 to-indigo-400',
  'text-yellow-700': 'from-yellow-600 to-yellow-400',
  'text-pink-700': 'from-pink-600 to-pink-400',
};

const bgMap: Record<string, string> = {
  'text-blue-700': 'hover:border-blue-300 hover:shadow-blue-100',
  'text-purple-700': 'hover:border-purple-300 hover:shadow-purple-100',
  'text-green-700': 'hover:border-green-300 hover:shadow-green-100',
  'text-red-700': 'hover:border-red-300 hover:shadow-red-100',
  'text-orange-700': 'hover:border-orange-300 hover:shadow-orange-100',
  'text-teal-700': 'hover:border-teal-300 hover:shadow-teal-100',
};

export default function HospitalCard({ hospital }: HospitalCardProps) {
  const gradient = colorMap[hospital.color] || 'from-gray-600 to-gray-400';
  const hoverStyle = bgMap[hospital.color] || '';
  const docCount = hospital.keyDocumentLibrary.length;

  return (
    <Link href={`/hospitals/${hospital.key}`}>
      <div className={`rounded-2xl overflow-hidden bg-white border border-gray-200 hover:shadow-lg transition-all duration-200 ${hoverStyle} cursor-pointer group`}>
        {/* 그라데이션 배너 */}
        <div className={`h-24 bg-gradient-to-r ${gradient} flex items-center px-6 gap-4`}>
          <span className="text-5xl">{hospital.icon}</span>
          <div className="text-white">
            <h2 className="text-xl font-black">{hospital.name}</h2>
            <p className="text-sm opacity-80 line-clamp-1">{hospital.description}</p>
          </div>
        </div>

        {/* 배지 */}
        <div className="px-6 py-3 flex flex-wrap gap-2 border-b border-gray-100">
          <span className="inline-flex items-center px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full font-medium">
            인증주기 {hospital.certificationCycle}
          </span>
          <span className="inline-flex items-center px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full font-medium">
            공식 목차 반영
          </span>
          <span className="inline-flex items-center px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
            문서 {docCount}종
          </span>
        </div>

        {/* 주요 부서 */}
        <div className="px-6 py-4">
          <p className="text-xs text-gray-500 mb-2 font-medium">주요 부서</p>
          <div className="flex flex-wrap gap-1">
            {hospital.mainDepartments.slice(0, 4).map((dept) => (
              <span key={dept} className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded">
                {dept}
              </span>
            ))}
            {hospital.mainDepartments.length > 4 && (
              <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-400 rounded">
                +{hospital.mainDepartments.length - 4}
              </span>
            )}
          </div>
        </div>

        {/* 하단 */}
        <div className="px-6 py-3 bg-gray-50 flex items-center justify-between">
          <span className="text-xs text-gray-500">상세 보기 및 문서 생성</span>
          <ChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
}
