'use client';
import Link from 'next/link';
import { FileText, ArrowRight, CheckCircle, Tag, Info } from 'lucide-react';

interface DocumentDetailProps {
  docName: string | null;
  hospitalTypeKey: string;
}

// 문서명에 따른 상세 정보 생성
function getDocumentDetail(docName: string) {
  // 관련 인증기준 번호 추론
  const standardMap: Record<string, string> = {
    '환자안전': '1.1.1 ~ 1.1.5',
    '낙상': '1.2.1 ~ 1.2.3',
    '욕창': '1.2.4 ~ 1.2.6',
    '감염': '2.1.1 ~ 2.1.8',
    '의약품': '3.1.1 ~ 3.1.6',
    '환자권리': '4.1.1 ~ 4.1.4',
    '불만': '4.2.1 ~ 4.2.3',
    '의무기록': '5.1.1 ~ 5.1.5',
    '개인정보': '5.2.1 ~ 5.2.3',
    '시설안전': '6.1.1 ~ 6.1.4',
    '화재': '6.2.1 ~ 6.2.3',
    '직원교육': '7.1.1 ~ 7.1.4',
    'QPS': '8.1.1 ~ 8.1.6',
    '응급': '1.3.1 ~ 1.3.5',
    'AED': '1.3.1',
    '구급차': '1.3.6',
    '영양': '3.2.1 ~ 3.2.4',
    '퇴원': '4.3.1 ~ 4.3.3',
  };

  let standards = '인증기준 해당 항목';
  for (const [key, val] of Object.entries(standardMap)) {
    if (docName.includes(key)) {
      standards = val;
      break;
    }
  }

  // 포함 서식 목록 생성
  const forms = generateForms(docName);
  const description = generateDescription(docName);

  return { standards, forms, description };
}

function generateForms(docName: string): string[] {
  if (docName.includes('낙상')) {
    return ['낙상위험도 평가도구(Morse Fall Scale)', '낙상 발생 보고서', '낙상예방 중재 체크리스트', '낙상 교육 확인서'];
  }
  if (docName.includes('욕창')) {
    return ['욕창위험도 평가도구(Braden Scale)', '욕창 발생 보고서', '욕창 예방 케어 기록지', '욕창 단계별 사진 기록'];
  }
  if (docName.includes('감염')) {
    return ['감염관리 점검표', '손위생 수행률 관찰 기록지', '의료관련감염 발생 보고서', '격리 환자 관리 기록지'];
  }
  if (docName.includes('의약품')) {
    return ['약품 이중 확인 기록지', '고위험약물 관리 현황표', '마약류 출납 장부', '의약품 냉장고 온도 기록지'];
  }
  if (docName.includes('AED') || docName.includes('전기충격')) {
    return ['AED 일일 점검표', 'AED 월별 유지관리 기록지', '배터리·패드 교체 이력', '직원 교육 서명부'];
  }
  if (docName.includes('응급키트')) {
    return ['응급키트 구성품 점검표', '약품 유효기간 점검 기록', '사용 후 보충 기록지'];
  }
  if (docName.includes('구급차')) {
    return ['구급차 일일 점검일지', '구급차 월별 점검 기록', '탑재 장비 현황표', '운행 기록부'];
  }
  if (docName.includes('화재')) {
    return ['소방설비 점검표', '화재 대피훈련 기록지', '화재 발생 보고서', '소화기 위치 현황도'];
  }
  if (docName.includes('환자권리')) {
    return ['환자 권리 안내문', '환자 권리·의무 고지 확인서', '환자 의견 수렴 기록지'];
  }
  if (docName.includes('직원교육')) {
    return ['교육 계획서', '교육 출석부', '교육 평가지', '교육 이수 현황표'];
  }
  if (docName.includes('QPS')) {
    return ['QPS 활동 계획서', '지표 모니터링 기록지', '개선 활동 보고서', '분기 성과 보고서'];
  }
  // 기본
  return [
    `${docName} 관련 서식 1호`,
    `${docName} 점검 기록지`,
    `${docName} 보고서 양식`,
    `${docName} 교육 확인서`,
  ];
}

function generateDescription(docName: string): string {
  if (docName.includes('낙상')) {
    return '입원 환자의 낙상 위험을 평가하고 예방 중재를 시행하기 위한 표준 절차를 규정합니다. 입원 시 및 상태 변화 시 낙상위험도를 평가하고, 위험도에 따른 예방 활동을 체계적으로 기록·관리합니다.';
  }
  if (docName.includes('욕창')) {
    return '욕창 발생 위험 환자를 조기에 식별하고, 욕창 예방 및 치료를 위한 근거 기반 간호를 제공하기 위한 절차를 규정합니다. Braden Scale을 활용한 위험도 평가와 단계적 케어 프로토콜을 포함합니다.';
  }
  if (docName.includes('감염')) {
    return '의료관련감염 예방을 위한 표준주의와 전파경로별 주의를 적용하는 절차를 규정합니다. 손위생, 개인보호구 사용, 환경 소독, 기구 관리 등 감염관리 전반을 포함합니다.';
  }
  if (docName.includes('AED')) {
    return 'AED(자동 제세동기)의 일상적 점검, 유지관리, 직원 교육을 규정하여 응급상황 시 즉시 사용 가능한 상태를 유지합니다. 배터리·패드 유효기간 관리와 점검 기록 유지를 포함합니다.';
  }
  return `${docName}에 관한 표준 절차와 서식을 규정합니다. 의료기관 인증 기준에 부합하는 체계적인 관리 방법과 기록 유지 방안을 포함합니다.`;
}

export default function DocumentDetail({ docName, hospitalTypeKey }: DocumentDetailProps) {
  if (!docName) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-64 text-center p-8">
        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
          <FileText className="w-8 h-8 text-blue-300" />
        </div>
        <p className="text-gray-500 font-medium">목록에서 항목을 클릭하세요</p>
        <p className="text-gray-400 text-sm mt-1">선택한 문서의 상세 정보가 여기에 표시됩니다</p>
      </div>
    );
  }

  const { standards, forms, description } = getDocumentDetail(docName);
  const encDoc = encodeURIComponent(docName);
  const generateUrl = `/generate?type=${hospitalTypeKey}&doc=${encDoc}`;

  return (
    <div className="p-6 space-y-5">
      {/* 문서명 헤더 */}
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
          <FileText className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900">{docName}</h3>
          <div className="flex items-center gap-1 mt-1">
            <Tag className="w-3 h-3 text-gray-400" />
            <span className="text-xs text-gray-500">인증기준 {standards}</span>
          </div>
        </div>
      </div>

      {/* 문서 설명 */}
      <div className="bg-gray-50 rounded-xl p-4">
        <div className="flex items-center gap-1 mb-2">
          <Info className="w-3.5 h-3.5 text-gray-500" />
          <span className="text-xs font-semibold text-gray-500 uppercase">문서 설명</span>
        </div>
        <p className="text-sm text-gray-700 leading-relaxed">{description}</p>
      </div>

      {/* 포함 서식 목록 */}
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase mb-2 flex items-center gap-1">
          <CheckCircle className="w-3.5 h-3.5" />
          포함 서식 목록
        </p>
        <div className="space-y-1.5">
          {forms.map((form, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                {i + 1}
              </span>
              <span className="text-sm text-gray-700">{form}</span>
            </div>
          ))}
        </div>
      </div>

      {/* CTA 버튼 */}
      <Link
        href={generateUrl}
        className="flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-xl font-semibold transition-colors"
      >
        이 문서 생성하기
        <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
}
