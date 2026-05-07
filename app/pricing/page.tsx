import Link from 'next/link';
import { Check, Zap, Shield, Star } from 'lucide-react';

const plans = [
  {
    name: '기본',
    price: '무료',
    desc: '소규모 의료기관 또는 체험용',
    color: 'border-gray-200',
    badge: '',
    features: [
      '월 10회 문서 생성',
      '6개 병원 유형 지원',
      '기본 서식 생성',
      '인증기준집 탐색',
    ],
    cta: '무료로 시작',
    ctaStyle: 'bg-gray-800 text-white hover:bg-gray-900',
  },
  {
    name: '스탠다드',
    price: '₩49,000',
    priceUnit: '/월',
    desc: '인증 준비 중인 의료기관',
    color: 'border-blue-500 ring-2 ring-blue-200',
    badge: '추천',
    features: [
      '월 100회 문서 생성',
      '6개 병원 유형 전체 지원',
      '완전한 문서 패키지',
      '인증기준집 전체 탐색',
      '서식·체크리스트 포함',
      '우선 지원',
    ],
    cta: '시작하기',
    ctaStyle: 'bg-blue-600 text-white hover:bg-blue-700',
  },
  {
    name: '프리미엄',
    price: '₩99,000',
    priceUnit: '/월',
    desc: '다수 의료기관 또는 컨설팅 기관',
    color: 'border-purple-200',
    badge: '',
    features: [
      '무제한 문서 생성',
      '전체 기능 포함',
      '커스텀 병원 정보 저장',
      '문서 내보내기 (Word/PDF)',
      '전용 고객 지원',
      '컨설팅 자료 패키지',
    ],
    cta: '문의하기',
    ctaStyle: 'bg-purple-600 text-white hover:bg-purple-700',
  },
];

export default function PricingPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-black text-gray-900 mb-2">요금제</h1>
        <p className="text-gray-500">의료기관 규모에 맞는 요금제를 선택하세요</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div key={plan.name} className={`bg-white rounded-2xl border-2 ${plan.color} p-6 relative`}>
            {plan.badge && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-blue-600 text-white text-xs font-bold px-4 py-1 rounded-full">{plan.badge}</span>
              </div>
            )}
            <div className="mb-4">
              <h2 className="font-black text-gray-900 text-lg">{plan.name}</h2>
              <div className="flex items-end gap-1 mt-1">
                <span className="text-3xl font-black text-gray-900">{plan.price}</span>
                {plan.priceUnit && <span className="text-gray-500 text-sm mb-1">{plan.priceUnit}</span>}
              </div>
              <p className="text-xs text-gray-500 mt-1">{plan.desc}</p>
            </div>

            <ul className="space-y-2 mb-6">
              {plan.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-gray-700">
                  <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>

            <Link
              href="/generate"
              className={`block text-center py-3 rounded-xl font-bold text-sm transition-colors ${plan.ctaStyle}`}
            >
              {plan.cta}
            </Link>
          </div>
        ))}
      </div>

      <div className="mt-10 text-center text-sm text-gray-500">
        <p>모든 요금제는 VAT 별도입니다. 기관 단위 계약 및 대량 구매는 별도 문의 주세요.</p>
      </div>
    </div>
  );
}
