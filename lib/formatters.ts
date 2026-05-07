// =============================================
// 메디인증 문서센터 - 포맷터
// =============================================

import { GenerationResult } from './types';

export function resultToClipboardText(result: GenerationResult): string {
  const lines: string[] = [];

  lines.push('='.repeat(60));
  lines.push(`📋 ${result.summaryCard?.documentName || '문서'}`);
  lines.push(`🏥 ${result.summaryCard?.hospitalType || ''} | ${result.summaryCard?.standardItem || ''}`);
  lines.push('='.repeat(60));
  lines.push('');

  // 요약 카드
  if (result.summaryCard) {
    lines.push('[요약 카드]');
    lines.push(`문서명: ${result.summaryCard.documentName}`);
    lines.push(`사용 부서: ${result.summaryCard.usedBy}`);
    lines.push(`사용 시점: ${result.summaryCard.whenToUse}`);
    lines.push(`관련 기준: ${result.summaryCard.relatedStandard}`);
    lines.push(`핵심 증빙: ${result.summaryCard.requiredEvidence}`);
    lines.push(`보관 부서: ${result.summaryCard.retentionOwner}`);
    lines.push(`승인 필요: ${result.summaryCard.approvalRequired}`);
    lines.push('');
  }

  // 품질 점수
  if (result.qualityScore) {
    lines.push(`[문서 품질 점수] ${result.qualityScore.score}점 / 100점 - ${result.qualityScore.grade}`);
    lines.push('');
  }

  // 문서 초안
  if (result.draftDocument) {
    lines.push('[문서 초안]');
    lines.push(`제목: ${result.draftDocument.title}`);
    lines.push(`목적: ${result.draftDocument.purpose}`);
    lines.push(`적용범위: ${result.draftDocument.scope}`);
    if (result.draftDocument.procedure?.length > 0) {
      lines.push('절차:');
      result.draftDocument.procedure.forEach((p, i) => lines.push(`  ${i + 1}. ${p}`));
    }
    lines.push('');
  }

  // 빈 서식
  if (result.blankForm?.templateMarkdown) {
    lines.push('[빈 서식]');
    lines.push(result.blankForm.templateMarkdown);
    lines.push('');
  }

  // 작성 예시
  if (result.filledExample?.exampleMarkdown) {
    lines.push('[작성 예시]');
    lines.push(result.filledExample.privacyNotice || '');
    lines.push(result.filledExample.exampleMarkdown);
    lines.push('');
  }

  // 체크리스트
  if (result.checklist?.length > 0) {
    lines.push('[체크리스트]');
    result.checklist.forEach((c, i) => {
      lines.push(`${i + 1}. ${c.item}`);
      lines.push(`   주기: ${c.frequency} | 부서: ${c.responsibleDepartment}`);
    });
    lines.push('');
  }

  // 조치사항 추적표
  if (result.actionTrackingTable?.length > 0) {
    lines.push('[조치사항 추적표]');
    lines.push('번호 | 조치사항 | 담당부서 | 완료기한 | 진행상태');
    result.actionTrackingTable.forEach(a => {
      lines.push(`${a.number} | ${a.actionItem} | ${a.department} | ${a.dueDate} | ${a.status}`);
    });
    lines.push('');
  }

  // 공식 확인 필요
  if (result.officialCheckNeeded?.length > 0) {
    lines.push('[공식 확인 필요 항목]');
    result.officialCheckNeeded.forEach(o => {
      lines.push(`• ${o.item}`);
      lines.push(`  이유: ${o.reason}`);
      lines.push(`  확인처: ${o.whereToCheck}`);
    });
    lines.push('');
  }

  // 개정이력
  if (result.revisionHistory?.length > 0) {
    lines.push('[개정이력]');
    result.revisionHistory.forEach(r => {
      lines.push(`v${r.version} | ${r.date} | ${r.change} | 작성: ${r.writer}`);
    });
    lines.push('');
  }

  // 면책사항
  if (result.disclaimer) {
    lines.push('[주의사항]');
    lines.push(result.disclaimer);
  }

  return lines.join('\n');
}

export function sectionToClipboardText(title: string, content: string): string {
  return `=== ${title} ===\n\n${content}\n\n=== 끝 ===`;
}
