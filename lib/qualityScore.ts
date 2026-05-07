// =============================================
// 메디인증 문서센터 - 문서 품질 점수 평가
// =============================================

import { GenerationResult, QualityScore } from './types';

export function evaluateQuality(result: GenerationResult): QualityScore {
  let score = 0;
  const reasons: string[] = [];
  const suggestions: string[] = [];

  // 공식 기준 연결 여부 (8점)
  if (result.officialBasis && result.officialBasis.length > 0) {
    const confirmed = result.officialBasis.filter(b => b.confidence === '확인됨');
    if (confirmed.length > 0) {
      score += 8;
      reasons.push('✅ 공식 기준 연결됨');
    } else {
      score += 4;
      reasons.push('⚠️ 공식 기준 확인 필요');
      suggestions.push('공식 인증기준집을 업로드하면 정확도가 높아집니다.');
    }
  } else {
    suggestions.push('공식 인증기준집 업로드가 필요합니다.');
  }

  // 병원 종별 적합성 (7점)
  if (result.summaryCard?.hospitalType) {
    score += 7;
    reasons.push('✅ 병원 종별 적합성 확인됨');
  }

  // 문서 유형 적합성 (7점)
  if (result.draftDocument?.title) {
    score += 7;
    reasons.push('✅ 문서 유형 구조 적합');
  }

  // 담당부서 명확성 (6점)
  if (result.departmentGuide && result.departmentGuide.length >= 2) {
    score += 6;
    reasons.push('✅ 부서별 사용 가이드 포함');
  } else {
    suggestions.push('부서별 사용 가이드를 추가하세요.');
  }

  // 증빙자료 명확성 (6점)
  if (result.summaryCard?.requiredEvidence) {
    score += 6;
    reasons.push('✅ 증빙자료 목록 포함');
  }

  // 보관기간 표시 여부 (6점)
  if (result.draftDocument?.recordsAndRetention && result.draftDocument.recordsAndRetention.length > 0) {
    score += 6;
    reasons.push('✅ 기록 및 보관 기간 명시됨');
  } else {
    suggestions.push('보관기간을 명확히 기재하세요.');
  }

  // 빈 서식 포함 여부 (8점)
  if (result.blankForm?.templateMarkdown && result.blankForm.templateMarkdown.length > 50) {
    score += 8;
    reasons.push('✅ 빈 서식 포함됨');
  } else {
    suggestions.push('빈 서식 템플릿을 추가하세요.');
  }

  // 작성 예시 포함 여부 (8점)
  if (result.filledExample?.exampleMarkdown && result.filledExample.exampleMarkdown.length > 50) {
    score += 8;
    reasons.push('✅ 작성 예시 포함됨');
  } else {
    suggestions.push('작성 예시를 추가하면 활용도가 높아집니다.');
  }

  // 조치사항 추적표 포함 여부 (8점)
  if (result.actionTrackingTable && result.actionTrackingTable.length > 0) {
    score += 8;
    reasons.push('✅ 조치사항 추적표 포함됨');
  } else {
    suggestions.push('조치사항 추적표를 추가하세요.');
  }

  // 체크리스트 포함 여부 (8점)
  if (result.checklist && result.checklist.length >= 5) {
    score += 8;
    reasons.push('✅ 체크리스트 포함됨');
  } else {
    suggestions.push('체크리스트 항목을 보완하세요.');
  }

  // 내부 검토사항 포함 여부 (5점)
  if (result.internalReviewPoints && result.internalReviewPoints.length >= 2) {
    score += 5;
    reasons.push('✅ 내부 검토사항 포함됨');
  }

  // 공식 확인 필요 항목 분리 여부 (6점)
  if (result.officialCheckNeeded && result.officialCheckNeeded.length > 0) {
    score += 6;
    reasons.push('✅ 공식 확인 필요 항목 분리됨');
  }

  // 교육자료 포함 여부 (5점)
  if (result.educationMaterial?.title) {
    score += 5;
    reasons.push('✅ 교육자료 포함됨');
  }

  // 개정이력 포함 여부 (4점)
  if (result.revisionHistory && result.revisionHistory.length > 0) {
    score += 4;
    reasons.push('✅ 개정이력 포함됨');
  }

  // 병원 맞춤 항목 포함 여부 (3점)
  if (result.hospitalCustomization?.itemsToFillByHospital && result.hospitalCustomization.itemsToFillByHospital.length > 0) {
    score += 3;
    reasons.push('✅ 병원 맞춤 항목 포함됨');
  }

  // 점수 상한선
  score = Math.min(score, 100);

  let grade: QualityScore['grade'];
  if (score >= 90) {
    grade = '실무 사용 가능 초안';
  } else if (score >= 70) {
    grade = '보완 후 사용 가능';
  } else {
    grade = '재생성 또는 공식자료 추가 필요';
  }

  return { score, grade, reason: reasons, improvementSuggestions: suggestions };
}

export function getScoreColor(score: number): string {
  if (score >= 90) return 'text-green-700';
  if (score >= 70) return 'text-amber-600';
  return 'text-red-600';
}

export function getScoreBg(score: number): string {
  if (score >= 90) return 'bg-green-50 border-green-200';
  if (score >= 70) return 'bg-amber-50 border-amber-200';
  return 'bg-red-50 border-red-200';
}
