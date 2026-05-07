import Link from 'next/link';
import { FileText, Shield, Zap, CheckCircle, ArrowRight, Star } from 'lucide-react';

const hospitalTypes = [
  { key: 'nursing', name: '요양병원', icon: '🏥', color: 'bg-blue-50 border-blue-200 text-blue-700' },
  { key: 'psychiatric', name: '정신병원', icon: '🧠', color: 'bg-purple-50 border-purple-200 text-purple-700' },
  { key: 'rehabilitation', name: '재활병원', icon: '🦽', color: 'bg-green-50 border-green-200 text-green-700' },
  { key: 'acute', name: '급성기병원', icon: '🏨', color: 'bg-red-50 border-red-200 text-red-700' },
  { key: 'dental', name: '치과병원', icon: '🦷', color: 'bg-teal-50 border-teal-200 text-teal-700' },
  { key: 'korean', name: '한방병원', icon: '🌿', color: 'bg-orange-50 border-orange-200 text-orange-700' },
];

const features = [
  { icon: <Zap className="w-6 h-6 text-blue-500" />, title: 'AI 즉시 생성', desc: 'Gemini AI가 인증 기준에 맞는 문서를 즉시 생성' },
  { icon: <Shield className="w-6 h-6 text-green-500" />, title: '공식 목차 반영', desc: '의료기관평가인증원 공식 기준집 목차 완전 반영' },
  { icon: <FileText className="w-6 h-6 text-purple-500" />, title: '완전한 문서 패키지', desc: '규정집·서식·체크리스트를 한 번에 생성' },
  { icon: <CheckCircle className="w-6 h-6 text-orange-500" />, title: '6개 병원 유형', desc: '요양·정신·재활·급성기·치과·한방 전문 지원' },
];

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* 히어로 */}
      <section className="bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-medium mb-6">
            <Star className="w-4 h-4 text-yellow-300" />
            AI 기반 의료기관 인증 문서 자동 생성
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-4 leading-tight">
            메디인증 문서센터
          </h1>
          <p className="text-xl text-blue-100 mb-8 leading-relaxed">
            의료기관 인증에 필요한 규정집·서식·체크리스트를<br />
            AI로 자동 생성하는 전문 서비스
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/hospitals"
              className="inline-flex items-center gap-2 bg-white text-blue-700 px-8 py-3 rounded-xl font-bold text-lg hover:bg-blue-50 transition-colors shadow-lg"
            >
              병원 유형 선택하기
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/generate"
              className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-8 py-3 rounded-xl font-bold text-lg hover:bg-white/30 transition-colors border border-white/30"
            >
              바로 문서 생성
            </Link>
          </div>
        </div>
      </section>

      {/* 병원 유형 빠른 선택 */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-black text-gray-900 text-center mb-2">병원 유형 선택</h2>
        <p className="text-gray-500 text-center mb-8">인증받을 병원 유형을 선택하세요</p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {hospitalTypes.map((ht) => (
            <Link
              key={ht.key}
              href={`/hospitals/${ht.key}`}
              className={`flex flex-col items-center gap-2 p-4 border-2 rounded-2xl hover:shadow-md transition-all font-medium text-sm ${ht.color}`}
            >
              <span className="text-3xl">{ht.icon}</span>
              <span>{ht.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* 주요 기능 */}
      <section className="bg-gray-50 py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-black text-gray-900 text-center mb-8">주요 기능</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center mb-4">
                  {f.icon}
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl font-black text-gray-900 mb-4">지금 바로 시작하세요</h2>
        <p className="text-gray-500 mb-8">인증 준비에 걸리는 시간을 획기적으로 줄여드립니다</p>
        <Link
          href="/hospitals"
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-blue-700 transition-colors shadow-lg"
        >
          무료로 시작하기
          <ArrowRight className="w-5 h-5" />
        </Link>
      </section>
    </div>
  );
}
