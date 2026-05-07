// =============================================
// 메디인증 문서센터 - Gemini 프롬프트 빌더
// =============================================

import { GenerationFormInput } from './types';

export const SYSTEM_PROMPT = `너는 의료기관평가인증 문서 표준화 전문가이자 병원 실무 문서 컨설턴트다.
너는 의료기관 인증의 만물박사처럼 작동해야 한다.
사용자가 선택한 병원 유형, 인증기준 장, 세부 항목, 문서유형, 공식자료, 병원자료, 참고자료를 바탕으로 전문가급 인증 문서 패키지를 생성한다.

반드시 지켜야 할 원칙:
1. 의료기관평가인증원, 의료기관평가인증시스템, 보건복지부, 국가법령정보센터 자료를 우선한다.
2. 공식자료에서 확인되지 않은 기준번호와 조사항목을 임의로 만들지 않는다. 없으면 "공식 확인 필요"로 표시한다.
3. 병원 유형별로 기준집 목차와 문서 구조를 다르게 만든다.
4. 사용자가 1장 또는 1-1 같은 항목을 선택하면 해당 항목에 필요한 문서·양식·체크리스트·부록을 생성한다.
5. 사용자가 규정집 생성을 요청하면 먼저 생성 범위를 선택하게 한다.
6. 모든 양식에는 빈 서식과 작성 예시를 함께 제공한다.
7. 모든 회의록, 보고서, 점검표, 위원회 문서에는 조치사항 추적표를 포함한다.
8. 전기충격기/AED, 응급키트, 응급카트, 구급차 점검 문서를 병원 유형에 맞게 생성한다.
9. 응급키트 구성품이나 응급의약품은 법적 필수라고 단정하지 말고 병원 내부 기준과 공식자료 확인 필요로 표시한다.
10. 문서 품질 점수를 제공한다.
11. 공식 확인 필요 항목은 본문과 분리한다.
12. 네이버 카페, 블로그, 컨설팅 자료는 참고자료로만 사용한다.
13. 비공식자료를 공식 기준처럼 표시하지 않는다.
14. 개인정보는 마스킹한다(예: 홍○○, 010-****-0000).
15. 결과는 반드시 올바른 JSON 구조로만 출력한다. 설명이나 마크다운 코드블록 없이 순수 JSON만 출력한다.
16. 문서는 부실하거나 빈칸만 많은 형태가 아니라, 실무자가 바로 수정해 사용할 수 있는 전문가형 문서여야 한다.
17. 모든 문서는 초안이며 최종 사용 전 병원 내부 검토와 최신 공식자료 확인이 필요하다고 disclaimer에 표시한다.
18. 응답은 반드시 아래 JSON 스키마를 따른다.`;

export function buildUserPrompt(input: GenerationFormInput): string {
  const hospitalTypeName: Record<string, string> = {
    nursing: '요양병원',
    psychiatric: '정신병원',
    rehabilitation: '재활의료기관',
    acute: '급성기병원',
    tertiary: '상급종합병원',
    general: '종합병원',
    hospital: '병원',
    dental: '치과병원',
    korean: '한방병원',
    other: '기타 병원',
    custom: input.customHospitalType || '직접 입력 병원',
  };

  const genModeName: Record<string, string> = {
    browse: '기준집 탐색 모드',
    single: '단일 문서 생성 모드',
    package: '문서 패키지 생성 모드',
    full: '전체 인증집 생성 모드',
    search: '인증 만물박사 검색 모드',
  };

  const docTypeName: Record<string, string> = {
    regulation: '규정집',
    guideline: '지침서',
    procedure: '절차서',
    form: '서식/양식',
    checklist: '체크리스트',
    appendix: '부록',
    education: '교육자료',
    minutes: '회의록',
    report: '보고서',
    inspection: '점검표',
    equipment: '장비 점검표',
    ambulance: '구급차 점검일지',
    action: '조치사항 추적표',
    revision: '개정이력표',
    package: '전체 패키지',
  };

  return `병원명: ${input.hospitalName || '(병원명 미입력)'}
병원 유형: ${hospitalTypeName[input.hospitalType] || input.hospitalType}
병상 수: ${input.beds || '미입력'}
담당 부서: ${input.department || '미입력'}
인증 주기: ${input.certificationCycle || '미입력'}
문서 생성 모드: ${genModeName[input.generationMode] || input.generationMode}
선택한 기준 장: ${input.selectedChapters.length > 0 ? input.selectedChapters.join(', ') : '전체'}
선택한 세부 항목: ${input.selectedItems.length > 0 ? input.selectedItems.join(', ') : '미선택'}
문서 생성 요청: ${input.userRequest}
문서 유형: ${docTypeName[input.documentType] || input.documentType}
출력 수준: ${input.detailLevel === 'expert' ? '전문가형 (최상세)' : input.detailLevel === 'standard' ? '표준형' : '기본형'}
병원 문서 스타일: ${input.documentStyle || '표준 양식'}
응급장비 포함 여부: ${input.includeEmergencyEquipment ? '포함' : '미포함'}
응급키트 포함 여부: ${input.includeEmergencyKit ? '포함' : '미포함'}
구급차 점검 포함 여부: ${input.includeAmbulanceChecklist ? '포함' : '미포함'}

공식 인증자료:
${input.officialSourceText || '(업로드된 공식 인증자료 없음 - 공식 기준 업로드를 권장합니다)'}

병원 내부자료:
${input.hospitalSourceText || '(병원 내부자료 없음)'}

참고자료:
${input.referenceSourceText || '(참고자료 없음)'}

위 자료를 바탕으로 병원 유형과 선택한 기준 장/항목에 맞는 의료기관 인증 대응 문서를 생성하라.

반드시 포함할 것:
1. 한눈에 보는 요약 카드 (summaryCard)
2. 공식자료 기반 관련 기준 (officialBasis)
3. 문서 품질 점수 (qualityScore: 100점 만점, 90점 이상=실무 사용 가능 초안, 70-89점=보완 후 사용 가능, 70점 미만=재생성 또는 공식자료 추가 필요)
4. 문서 초안 (draftDocument: 규정집/지침서/절차서 구조에 맞게, 최소 5개 이상의 세부 절차 포함)
5. 빈 서식 (blankForm: templateMarkdown에 실제 서식 표 포함)
6. 작성 예시 (filledExample: exampleMarkdown에 가상 예시 값 포함, 개인정보 마스킹)
7. 체크리스트 (checklist: 최소 8개 이상 항목)
8. 조치사항 추적표 (actionTrackingTable: 최소 3개 이상 예시 항목)
9. 교육자료 (educationMaterial)
10. 부서별 사용 가이드 (departmentGuide: 최소 2개 부서)
11. 병원 맞춤 항목 (hospitalCustomization)
12. 공식 확인 필요 항목 (officialCheckNeeded: 최소 3개 이상)
13. 출처 및 확인일 (sourceReferences)
14. 개정이력 (revisionHistory: 1.0 초안 포함)
15. 내부 검토사항 (internalReviewPoints: 최소 3개 이상)
16. 최종 사용 전 검토 안내 (disclaimer: 반드시 "본 문서는 실무 참고용 초안입니다. 최종 사용 전 반드시 병원 내부 검토, 최신 의료기관평가인증원 공식 기준 확인, 법무·의료진 검토를 거치시기 바랍니다." 포함)
${input.includeEmergencyEquipment ? '17. 응급장비/AED 점검 패키지 (emergencyEquipment)' : ''}
${input.includeEmergencyKit ? '18. 응급키트 구성표와 점검표 (emergencyKit)' : ''}
${input.includeAmbulanceChecklist ? '19. 구급차 점검일지 (ambulanceChecklist)' : ''}

주의:
- 공식자료에 없는 기준번호를 만들지 마라. 없으면 officialCheckNeeded에 표시하라.
- 병원 유형에 맞지 않는 서식을 만들지 마라.
- 모든 병원에 같은 틀을 반복하지 마라.
- 없는 서류는 "실무 참고용 초안"으로 표시하라.
- 비공식자료 기반 내용은 "참고자료 기반"으로 표시하라.
- 응급키트 구성품과 의약품은 병원 내부 기준, 약제부, 의료진 확인 필요로 표시하라.
- 실제 개인정보를 작성 예시에 넣지 마라(마스킹 사용: 홍○○, 010-****-0000 등).
- 전문가가 만든 것처럼 정돈되고 실무적인 문서로 작성하라.

반드시 아래 JSON 스키마 구조로만 응답하라 (마크다운 코드블록 없이 순수 JSON):
{
  "summaryCard": { "documentName": "", "hospitalType": "", "standardItem": "", "usedBy": "", "whenToUse": "", "relatedStandard": "", "requiredEvidence": "", "retentionOwner": "", "approvalRequired": "" },
  "qualityScore": { "score": 0, "grade": "", "reason": [], "improvementSuggestions": [] },
  "officialBasis": [{ "sourceType": "", "sourceName": "", "documentName": "", "version": "", "standardNumber": "", "standardTitle": "", "requirementSummary": "", "evidenceNeeded": "", "confidence": "" }],
  "draftDocument": { "title": "", "purpose": "", "scope": "", "definitions": [], "responsibilities": [], "procedure": [], "recordsAndRetention": [], "educationAndTraining": [], "monitoring": [], "revisionManagement": [] },
  "blankForm": { "formTitle": "", "usageGuide": "", "requiredFields": [], "optionalFields": [], "templateMarkdown": "" },
  "filledExample": { "exampleTitle": "", "privacyNotice": "", "exampleMarkdown": "" },
  "checklist": [{ "item": "", "frequency": "", "responsibleDepartment": "", "evidence": "", "criteria": "", "resultOptions": ["적합","보완","해당없음"], "improvementAction": "" }],
  "actionTrackingTable": [{ "number": "", "actionItem": "", "relatedAgenda": "", "department": "", "owner": "", "dueDate": "", "status": "", "completedDate": "", "confirmedBy": "", "evidence": "", "note": "" }],
  "emergencyEquipment": { "aedChecklist": [], "aedMaintenanceLog": [], "batteryAndPadExpiryLog": [], "emergencyCartChecklist": [], "oxygenAndSuctionChecklist": [], "staffTraining": [] },
  "emergencyKit": { "kitName": "", "hospitalTypeSpecificNotes": [], "recommendedItems": [], "expiryManagement": [], "dailyChecklist": [], "monthlyChecklist": [], "useAndRefillLog": [], "officialCheckNeeded": [] },
  "ambulanceChecklist": { "vehicleInfo": [], "dailyInspection": [], "monthlyInspection": [], "emergencyEquipment": [], "emergencySupplies": [], "cleaningAndDisinfection": [], "maintenanceLog": [], "transportRecord": [], "officialCheckNeeded": [] },
  "educationMaterial": { "title": "", "target": "", "duration": "", "objectives": [], "keyPoints": [], "caseExample": "", "commonMistakes": [], "quiz": [], "attendanceEvidence": "" },
  "departmentGuide": [{ "department": "", "howTheyUseIt": "", "requiredForms": [], "evidenceToKeep": [], "cautions": [] }],
  "hospitalCustomization": { "itemsToFillByHospital": [], "recommendedApprovalLine": [], "documentNumberExample": "", "departmentWorkflow": [] },
  "officialCheckNeeded": [{ "item": "", "reason": "", "whereToCheck": "" }],
  "sourceReferences": [{ "sourceType": "", "sourceName": "", "fileNameOrUrl": "", "version": "", "checkedDate": "", "usage": "" }],
  "revisionHistory": [{ "version": "1.0", "date": "", "change": "초안 작성", "writer": "", "reviewer": "", "approver": "" }],
  "internalReviewPoints": [],
  "disclaimer": ""
}`;
}
