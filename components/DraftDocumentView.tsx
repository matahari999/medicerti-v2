'use client';
import { useRef } from 'react';
import { DraftDocument } from '@/lib/types';

interface Props {
  doc: DraftDocument;
  disclaimer?: string;
}

// ──────────────────────────────────────────────
// 절차 항목 파서 — 가. 나. 다. 소항목을 분리
// ──────────────────────────────────────────────
const KOREAN_ALPHA = ['가','나','다','라','마','바','사','아','자','차','카','타','파','하'];

function parseProcedureItem(raw: string): { main: string; subs: string[] } {
  // 앞의 번호 "1. " / "1) " 제거
  const text = raw.replace(/^\s*\d+[.)]\s*/, '').trim();

  // 줄바꿈으로 분리
  const lines = text.split(/\n/).map(l => l.trim()).filter(Boolean);

  if (lines.length <= 1) {
    // 줄바꿈 없이 인라인에 가. 나. 다. 있는 경우
    // 예: "손위생 수행 가. 방법A 나. 방법B"
    const inlineRe = new RegExp(`(?=[${KOREAN_ALPHA.join('')}][.)]\\s)`, 'g');
    const chunks = text.split(inlineRe).map(s => s.trim()).filter(Boolean);
    if (chunks.length > 1) {
      return {
        main: chunks[0].replace(/[가-하][.)]\s*$/, '').trim(),
        subs: chunks.slice(1).filter(s => KOREAN_ALPHA.some(k => s.startsWith(k + '.') || s.startsWith(k + ')'))),
      };
    }
    return { main: text, subs: [] };
  }

  const mainLines: string[] = [];
  const subLines: string[] = [];

  for (const line of lines) {
    const isSub = KOREAN_ALPHA.some(k => line.startsWith(k + '.') || line.startsWith(k + ')'));
    if (isSub) {
      subLines.push(line);
    } else if (subLines.length === 0) {
      mainLines.push(line);
    } else {
      // 소항목 뒤에 이어지는 텍스트 → 마지막 소항목에 붙이기
      subLines[subLines.length - 1] += ' ' + line;
    }
  }

  return {
    main: mainLines.join(' ').trim() || lines[0],
    subs: subLines,
  };
}

// ──────────────────────────────────────────────
// 인쇄 함수 — contentEditable 셀 값 캡처 포함
// ──────────────────────────────────────────────
const PRINT_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@400;600;700;900&display=swap');
  * { box-sizing: border-box; }
  body { font-family: 'Noto Serif KR', 'Malgun Gothic', '맑은 고딕', serif;
         padding: 32px 36px; font-size: 11px; color: #111; line-height: 1.9; }
  h1.doc-title { font-size: 17px; font-weight: 900; text-align: center;
                 margin: 20px 0 18px; letter-spacing: 2px; }
  .chapter-badge { font-size: 9px; color: #888; text-align: right; margin-bottom: 4px; }
  .header-table { border-collapse: collapse; width: 100%; margin-bottom: 22px; }
  .header-table td { border: 1px solid #aaa; padding: 5px 10px; font-size: 10.5px; }
  .header-table .lbl { background: #fce7ea; font-weight: 700; text-align: center; width: 88px; }
  .header-table .val { background: white; }
  h2.sec { font-size: 11.5px; font-weight: 900; border-bottom: 1.5px solid #444;
           padding-bottom: 3px; margin: 18px 0 7px; }
  ol.main-list { padding-left: 0; list-style: none; margin: 0; }
  ol.main-list > li { margin-bottom: 6px; }
  ol.main-list > li .main-text { font-weight: 600; }
  ol.main-list > li .sub-list { padding-left: 24px; list-style: none; margin-top: 3px; }
  ol.main-list > li .sub-list li { margin-bottom: 2px; font-weight: 400; }
  ul.plain-list { padding-left: 18px; margin: 0; }
  ul.plain-list li { margin-bottom: 3px; }
  p { margin: 4px 0; }
  .ref-section { margin-top: 18px; }
  .disclaimer { margin-top: 24px; font-size: 8.5px; color: #999;
                border-top: 1px solid #ddd; padding-top: 8px; }
  @media print { button, .no-print { display: none !important; }
                  body { padding: 16px; } }
`;

function openPrintWindow(
  doc: DraftDocument,
  disclaimer: string | undefined,
  headerValues: Record<string, string>
) {
  const w = window.open('', '_blank');
  if (!w) { alert('팝업을 허용해주세요'); return; }

  const sec = (title: string, body: string) =>
    `<h2 class="sec">${title}</h2>${body}`;

  const simpleList = (items: string[]) =>
    `<ul class="plain-list">${items.map(i => `<li>${i.replace(/^\d+[.)]\s*/, '')}</li>`).join('')}</ul>`;

  const procedureList = (items: string[]) => {
    const lis = items.map((raw, idx) => {
      const { main, subs } = parseProcedureItem(raw);
      const subHtml = subs.length
        ? `<ul class="sub-list">${subs.map(s => `<li>${s}</li>`).join('')}</ul>`
        : '';
      return `<li><span class="main-text">${idx + 1}. ${main}</span>${subHtml}</li>`;
    }).join('');
    return `<ol class="main-list">${lis}</ol>`;
  };

  w.document.write(`<!DOCTYPE html><html lang="ko"><head><meta charset="utf-8">
    <title>${doc.title}</title><style>${PRINT_CSS}</style></head><body>
    <div class="chapter-badge">규정집</div>
    <h1 class="doc-title">${doc.title}</h1>
    <table class="header-table">
      <tr>
        <td class="lbl">문 서 번 호</td>
        <td class="val">${headerValues.documentNumber || doc.documentNumber || ''}</td>
        <td class="lbl">제 &nbsp; 정 &nbsp; 일</td>
        <td class="val">${headerValues.issueDate || '　　　　　'}</td>
      </tr>
      <tr>
        <td class="lbl">검 토 주 기</td>
        <td class="val">${headerValues.reviewCycle || doc.reviewCycle || '1년'}</td>
        <td class="lbl">최 종 개 정 일</td>
        <td class="val">${headerValues.lastRevisionDate || '　　　　　'}</td>
      </tr>
      <tr>
        <td class="lbl">관 련 부 서</td>
        <td class="val" colspan="3">${headerValues.relatedDepartment || doc.relatedDepartment || ''}</td>
      </tr>
    </table>
    ${sec('목적', `<p>${doc.purpose}</p>`)}
    ${doc.scope ? sec('적용 범위', `<p>${doc.scope}</p>`) : ''}
    ${doc.definitions?.length ? sec('정의', simpleList(doc.definitions)) : ''}
    ${doc.responsibilities?.length ? sec('책임과 권한', simpleList(doc.responsibilities)) : ''}
    ${doc.procedure?.length ? sec('절차', procedureList(doc.procedure)) : ''}
    ${doc.recordsAndRetention?.length ? sec('기록 및 보존', simpleList(doc.recordsAndRetention)) : ''}
    ${doc.educationAndTraining?.length ? sec('교육 및 훈련', simpleList(doc.educationAndTraining)) : ''}
    ${doc.monitoring?.length ? sec('모니터링', simpleList(doc.monitoring)) : ''}
    ${doc.references?.length ? `<div class="ref-section">${sec('참고문헌', simpleList(doc.references))}</div>` : ''}
    ${doc.appendices?.length ? `<div class="ref-section">${sec('부록', simpleList(doc.appendices))}</div>` : ''}
    ${doc.additionalProvisions ? sec('부칙', `<p>${doc.additionalProvisions}</p>`) : ''}
    ${disclaimer ? `<div class="disclaimer">${disclaimer}</div>` : ''}
    </body></html>`);
  w.document.close();
  setTimeout(() => { w.focus(); w.print(); }, 500);
}

// ──────────────────────────────────────────────
// 공통 섹션 헤더
// ──────────────────────────────────────────────
function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="font-black text-gray-900 border-b-2 border-gray-500 pb-1 mb-3 text-sm tracking-wide">
      {children}
    </h3>
  );
}

// ──────────────────────────────────────────────
// 절차 렌더러 — 가/나/다 소항목 들여쓰기
// ──────────────────────────────────────────────
function ProcedureList({ items }: { items: string[] }) {
  return (
    <ol className="space-y-3">
      {items.map((raw, idx) => {
        const { main, subs } = parseProcedureItem(raw);
        return (
          <li key={idx} className="text-gray-800">
            <span className="font-semibold">{idx + 1}. {main}</span>
            {subs.length > 0 && (
              <ul className="mt-1.5 space-y-1 pl-5">
                {subs.map((sub, si) => (
                  <li key={si} className="text-gray-700 text-sm">{sub}</li>
                ))}
              </ul>
            )}
          </li>
        );
      })}
    </ol>
  );
}

// ──────────────────────────────────────────────
// 메인 컴포넌트
// ──────────────────────────────────────────────
export default function DraftDocumentView({ doc, disclaimer }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  function handlePrint() {
    const container = containerRef.current;
    const get = (field: string) =>
      (container?.querySelector(`[data-field="${field}"]`) as HTMLElement)?.innerText?.trim() ?? '';

    openPrintWindow(doc, disclaimer, {
      documentNumber: get('documentNumber'),
      issueDate: get('issueDate'),
      reviewCycle: get('reviewCycle'),
      lastRevisionDate: get('lastRevisionDate'),
      relatedDepartment: get('relatedDepartment'),
    });
  }

  // contentEditable 공통 스타일
  const editableClass =
    'outline-none focus:bg-blue-50 focus:ring-1 focus:ring-blue-300 rounded px-0.5 min-w-[80px] inline-block cursor-text';

  return (
    <div className="space-y-0" ref={containerRef}>
      {/* 상단 버튼 */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs text-blue-600 bg-blue-50 border border-blue-200 rounded-lg px-3 py-1.5">
          ✏️ 표 안의 빈칸을 클릭하면 직접 입력할 수 있습니다
        </p>
        <button
          onClick={handlePrint}
          className="text-xs bg-gray-800 text-white px-4 py-2 rounded-lg font-bold hover:bg-black transition-colors"
        >
          🖨️ 공문 형식으로 인쇄
        </button>
      </div>

      {/* 문서 본문 */}
      <div className="bg-white border border-gray-300 rounded-xl overflow-hidden">

        {/* 장 레이블 */}
        <div className="text-right text-xs text-gray-400 px-6 pt-4 pb-0">
          규정집
        </div>

        {/* 제목 */}
        <div className="text-center py-3 px-6">
          <h2 className="text-[17px] font-black text-gray-900 tracking-[3px]">{doc.title}</h2>
        </div>

        {/* 문서 정보 표 — contentEditable 셀 */}
        <div className="px-6 pb-5">
          <table className="w-full border-collapse text-[11.5px]">
            <tbody>
              <tr>
                <td className="border border-gray-400 px-3 py-2 bg-rose-50 font-bold text-center w-[88px] text-gray-700 whitespace-nowrap">
                  문 서 번 호
                </td>
                <td className="border border-gray-400 px-3 py-2 bg-white w-[140px]">
                  <span
                    data-field="documentNumber"
                    contentEditable
                    suppressContentEditableWarning
                    className={editableClass}
                  >
                    {doc.documentNumber || ''}
                  </span>
                </td>
                <td className="border border-gray-400 px-3 py-2 bg-rose-50 font-bold text-center w-[88px] text-gray-700 whitespace-nowrap">
                  제&nbsp;&nbsp;정&nbsp;&nbsp;일
                </td>
                <td className="border border-gray-400 px-3 py-2 bg-white">
                  <span
                    data-field="issueDate"
                    contentEditable
                    suppressContentEditableWarning
                    className={`${editableClass} text-gray-400`}
                  >
                    0000. 00. 00.
                  </span>
                </td>
              </tr>
              <tr>
                <td className="border border-gray-400 px-3 py-2 bg-rose-50 font-bold text-center text-gray-700 whitespace-nowrap">
                  검 토 주 기
                </td>
                <td className="border border-gray-400 px-3 py-2 bg-white">
                  <span
                    data-field="reviewCycle"
                    contentEditable
                    suppressContentEditableWarning
                    className={editableClass}
                  >
                    {doc.reviewCycle || '1년'}
                  </span>
                </td>
                <td className="border border-gray-400 px-3 py-2 bg-rose-50 font-bold text-center text-gray-700 whitespace-nowrap">
                  최 종 개 정 일
                </td>
                <td className="border border-gray-400 px-3 py-2 bg-white">
                  <span
                    data-field="lastRevisionDate"
                    contentEditable
                    suppressContentEditableWarning
                    className={`${editableClass} text-gray-400`}
                  >
                    0000. 00. 00.
                  </span>
                </td>
              </tr>
              <tr>
                <td className="border border-gray-400 px-3 py-2 bg-rose-50 font-bold text-center text-gray-700 whitespace-nowrap">
                  관 련 부 서
                </td>
                <td className="border border-gray-400 px-3 py-2 bg-white" colSpan={3}>
                  <span
                    data-field="relatedDepartment"
                    contentEditable
                    suppressContentEditableWarning
                    className={`${editableClass} w-full`}
                  >
                    {doc.relatedDepartment || ''}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* 본문 섹션 */}
        <div className="px-6 pb-8 space-y-6 text-sm">

          {/* 목적 */}
          <section>
            <SectionTitle>목적</SectionTitle>
            <p className="text-gray-800 leading-relaxed text-justify">{doc.purpose}</p>
          </section>

          {/* 적용 범위 */}
          {doc.scope && (
            <section>
              <SectionTitle>적용 범위</SectionTitle>
              <p className="text-gray-800 leading-relaxed">{doc.scope}</p>
            </section>
          )}

          {/* 정의 */}
          {doc.definitions?.length > 0 && (
            <section>
              <SectionTitle>정의</SectionTitle>
              <ol className="space-y-1.5">
                {doc.definitions.map((d, i) => (
                  <li key={i} className="text-gray-800">
                    {d.replace(/^\d+[.)]\s*/, '') ? `${i + 1}. ${d.replace(/^\d+[.)]\s*/, '')}` : d}
                  </li>
                ))}
              </ol>
            </section>
          )}

          {/* 책임과 권한 */}
          {doc.responsibilities?.length > 0 && (
            <section>
              <SectionTitle>책임과 권한</SectionTitle>
              <ul className="space-y-1.5">
                {doc.responsibilities.map((r, i) => (
                  <li key={i} className="text-gray-800 flex gap-2">
                    <span className="text-rose-500 font-bold shrink-0">▸</span>
                    <span>{r.replace(/^[-•▸]\s*/, '')}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* 절차 — 가/나/다 소항목 파싱 */}
          {doc.procedure?.length > 0 && (
            <section>
              <SectionTitle>절차</SectionTitle>
              <ProcedureList items={doc.procedure} />
            </section>
          )}

          {/* 기록 및 보존 */}
          {doc.recordsAndRetention?.length > 0 && (
            <section>
              <SectionTitle>기록 및 보존</SectionTitle>
              <ul className="space-y-1.5">
                {doc.recordsAndRetention.map((r, i) => (
                  <li key={i} className="text-gray-800 flex gap-2">
                    <span className="shrink-0 text-gray-400">{i + 1}.</span>
                    <span>{r.replace(/^\d+[.)]\s*/, '')}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* 교육 및 훈련 */}
          {doc.educationAndTraining?.length > 0 && (
            <section>
              <SectionTitle>교육 및 훈련</SectionTitle>
              <ul className="space-y-1.5">
                {doc.educationAndTraining.map((e, i) => (
                  <li key={i} className="text-gray-800 flex gap-2">
                    <span className="shrink-0 text-gray-400">{i + 1}.</span>
                    <span>{e.replace(/^\d+[.)]\s*/, '')}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* 모니터링 */}
          {doc.monitoring?.length > 0 && (
            <section>
              <SectionTitle>모니터링</SectionTitle>
              <ul className="space-y-1.5">
                {doc.monitoring.map((m, i) => (
                  <li key={i} className="text-gray-800 flex gap-2">
                    <span className="shrink-0 text-gray-400">{i + 1}.</span>
                    <span>{m.replace(/^\d+[.)]\s*/, '')}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* 참고문헌 */}
          {(doc.references?.length ?? 0) > 0 && (
            <section>
              <SectionTitle>참고문헌</SectionTitle>
              <ol className="space-y-1">
                {(doc.references ?? []).map((r, i) => (
                  <li key={i} className="text-gray-600 text-xs">
                    {i + 1}. {r.replace(/^\d+[.)]\s*/, '')}
                  </li>
                ))}
              </ol>
            </section>
          )}

          {/* 부록 */}
          {(doc.appendices?.length ?? 0) > 0 && (
            <section>
              <SectionTitle>부록</SectionTitle>
              <ol className="space-y-1">
                {(doc.appendices ?? []).map((a, i) => (
                  <li key={i} className="text-gray-700 text-xs">{a}</li>
                ))}
              </ol>
            </section>
          )}

          {/* 부칙 */}
          {doc.additionalProvisions && (
            <section>
              <SectionTitle>부칙</SectionTitle>
              <p className="text-gray-800">{doc.additionalProvisions}</p>
            </section>
          )}

          {/* 면책 고지 */}
          {disclaimer && (
            <div className="pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-400 leading-relaxed">{disclaimer}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
