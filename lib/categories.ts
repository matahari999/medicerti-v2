// =============================================
// 메디인증 문서센터 - 카테고리 정의
// =============================================

export const DOCUMENT_TYPES = [
  { value: 'regulation', label: '규정집', desc: '목적·적용범위·책임·절차 전체 체계' },
  { value: 'guideline', label: '지침서', desc: '업무 흐름·단계별 수행 방법' },
  { value: 'procedure', label: '절차서', desc: '단계별 업무 처리 흐름' },
  { value: 'form', label: '서식/양식', desc: '기록·보고·신청 서식' },
  { value: 'checklist', label: '체크리스트', desc: '점검 항목 목록' },
  { value: 'appendix', label: '부록', desc: '별표·서식 모음' },
  { value: 'education', label: '교육자료', desc: '직원 교육용 자료' },
  { value: 'minutes', label: '회의록', desc: '위원회·회의 기록' },
  { value: 'report', label: '보고서', desc: '사건·활동 보고서' },
  { value: 'inspection', label: '점검표', desc: '정기 점검 기록지' },
  { value: 'equipment', label: '장비 점검표', desc: 'AED·의료기기 점검' },
  { value: 'ambulance', label: '구급차 점검일지', desc: '구급차 일일·월간 점검' },
  { value: 'action', label: '조치사항 추적표', desc: '개선 조치 이행 추적' },
  { value: 'revision', label: '개정이력표', desc: '문서 개정 기록' },
  { value: 'package', label: '전체 패키지', desc: '관련 문서 일괄 생성' },
] as const;

export const GENERATION_MODES = [
  { value: 'browse', label: '기준집 탐색', icon: '📚', desc: '병원 유형별 인증기준집 목차를 탐색하고 항목별 문서를 생성합니다' },
  { value: 'single', label: '단일 문서', icon: '📄', desc: '특정 문서 하나를 바로 생성합니다' },
  { value: 'package', label: '문서 패키지', icon: '📦', desc: '관련 문서를 묶어서 한 번에 생성합니다' },
  { value: 'full', label: '전체 인증집', icon: '🏛️', desc: '병원 유형별 전체 인증집 구조를 카테고리별로 생성합니다' },
  { value: 'search', label: '만물박사 검색', icon: '🔍', desc: '자연어로 필요한 문서를 찾아 생성합니다' },
] as const;

export const DETAIL_LEVELS = [
  { value: 'basic', label: '기본형', desc: '핵심 항목 위주로 간략하게 생성' },
  { value: 'standard', label: '표준형', desc: '표준 구조로 실무 수준 생성' },
  { value: 'expert', label: '전문가형', desc: '최상세 전문가급 문서 생성' },
] as const;

export const EMERGENCY_PACKAGES = [
  { id: 'aed', label: 'AED/전기충격기', icon: '⚡', docs: ['관리 지침서', '일일 점검표', '월간 점검표', '배터리·패드 유효기간 관리대장', '사용 후 보고서', '교육자료'] },
  { id: 'kit', label: '응급키트', icon: '🧰', docs: ['관리 지침서', '구성품 목록', '일일 점검표', '월간 점검표', '사용 후 보충 기록지', '유효기간 관리대장'] },
  { id: 'cart', label: '응급카트', icon: '🛒', docs: ['관리 지침서', '구성품 목록', '점검표', '의약품 유효기간 관리대장', '봉인 점검표', '교육자료'] },
  { id: 'ambulance', label: '구급차', icon: '🚑', docs: ['관리 지침서', '일일 점검일지', '월간 점검표', '장비 점검표', '운행일지', '이송 기록지'] },
  { id: 'response', label: '응급대응', icon: '🆘', docs: ['응급상황 대응 지침서', 'CPR 대응 절차서', '응급콜 체계표', '비상연락망', '야간·휴일 대응 절차'] },
] as const;
