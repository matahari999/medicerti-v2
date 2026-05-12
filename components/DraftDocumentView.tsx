'use client';
import { DraftDocument } from '@/lib/types';

interface Props {
  doc: DraftDocument;
  disclaimer?: string;
}

const PRINT_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@400;700;900&display=swap');
  body { font-family: 'Noto Serif KR', 'Malgun Gothic', serif; padding: 32px; font-size: 11px; color: #111; line-height: 1.8; }
  h1.doc-title { font-size: 18px; font-weight: 900; text-align: center; margin: 24px 0 20px; letter-spacing: 2px; }
  .header-table { border-collapse: collapse; width: 100%; margin-bottom: 20px; }
  .header-table td, .header-table th { border: 1px solid #999; padding: 5px 10px; font-size: 10px; }
  .header-table .label { background: #f5e6e8; font-weight: 700; text-align: center; width: 80px; }
  .header-table .value { background: white; }
  .chapter-badge { font-size: 9px; color: #888; text-align: right; margin-bottom: 4px; }
  h2.section { font-size: 12px; font-weight: 900; margin: 16px 0 6px; border-bottom: 1px solid #555; padding-bottom: 3px; }
  p, li { font-size: 11px; margin: 4px 0; }
  ol, ul { padding-left: 20px; }
  .sub-item { padding-left: 16px; }
  .ref-section { margin-top: 20px; font-size: 10px; color: #444; }
  .disclaimer { margin-top: 24px; font-size: 9px; color: #888; border-top: 1px solid #ddd; padding-top: 8px; }
  @media print { body { padding: 16px; } button { display: none; } }
`;

function openPrintWindow(doc: DraftDocument, disclaimer?: string) {
  const w = window.open('', '_blank');
  if (!w) { alert('팝업을 허용해주세요'); return; }

  const sectionHtml = (title: string, content: string) =>
    `<h2 class="section">${title}</h2>${content}`;

  const listHtml = (items: string[]) =>
    `<ol>${items.map(i => `<li>${i}</li>`).join('')}</ol>`;

  w.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8">
    <title>${doc.title}</title><style>${PRINT_CSS}</style></head><body>
    <div class="chapter-badge">제1장 (해당 장 기재)</div>
    <h1 class="doc-title">${doc.title}</h1>
    <table class="header-table">
      <tr>
        <td class="label">문 서 번 호</td>
        <td class="value">${doc.documentNumber || '　　　　　'}</td>
        <td class="label">제 &nbsp; 정 &nbsp; 일</td>
        <td class="value">${'0000. 00. 00.'}</td>
      </tr>
      <tr>
        <td class="label">검 토 주 기</td>
        <td class="value">${doc.reviewCycle || '1년'}</td>
        <td class="label">최 종 개 정 일</td>
        <td class="value">${'0000. 00. 00.'}</td>
      </tr>
      <tr>
        <td class="label">관 련 부 서</td>
        <td class="value" colspan="3">${doc.relatedDepartment || '　'}</td>
      </tr>
    </table>
    ${sectionHtml('목적', `<p>${doc.purpose}</p>`)}
    ${sectionHtml('적용 범위', `<p>${doc.scope}</p>`)}
    ${doc.definitions?.length ? sectionHtml('정의', listHtml(doc.definitions)) : ''}
    ${doc.responsibilities?.length ? sectionHtml('책임과 권한', listHtml(doc.responsibilities)) : ''}
    ${doc.procedure?.length ? sectionHtml('절차', listHtml(doc.procedure)) : ''}
    ${doc.recordsAndRetention?.length ? sectionHtml('기록 및 보존', listHtml(doc.recordsAndRetention)) : ''}
    ${doc.educationAndTraining?.length ? sectionHtml('교육 및 훈련', listHtml(doc.educationAndTraining)) : ''}
    ${doc.monitoring?.length ? sectionHtml('모니터링', listHtml(doc.monitoring)) : ''}
    ${doc.references?.length ? `<div class="ref-section"><h2 class="section">참고문헌</h2>${listHtml(doc.references)}</div>` : ''}
    ${doc.appendices?.length ? `<div class="ref-section"><h2 class="section">부록</h2>${listHtml(doc.appendices)}</div>` : ''}
    ${doc.additionalProvisions ? sectionHtml('부칙', `<p>${doc.additionalProvisions}</p>`) : ''}
    ${disclaimer ? `<div class="disclaimer">${disclaimer}</div>` : ''}
    </body></html>`);
  w.document.close();
  setTimeout(() => { w.focus(); w.print(); }, 400);
}

export default function DraftDocumentView({ doc, disclaimer }: Props) {
  return (
    <div className="space-y-0">
      {/* 인쇄 버튼 */}
      <div className="flex justify-end mb-4">
        <button
          onClick={() => openPrintWindow(doc, disclaimer)}
          className="text-xs bg-gray-700 text-white px-4 py-2 rounded-lg font-bold hover:bg-gray-900 transition-colors"
        >
          🖨️ 공문 형식으로 인쇄
        </button>
      </div>

      {/* 문서 미리보기 — PDF 사례집 형식 */}
      <div className="bg-white border border-gray-300 rounded-xl overflow-hidden font-serif">

        {/* 장 표시 */}
        <div className="text-right text-xs text-gray-400 px-6 pt-4 pb-1">
          제1장 (해당 장 기재)
        </div>

        {/* 제목 */}
        <div className="text-center py-4 px-6">
          <h2 className="text-xl font-black text-gray-900 tracking-widest">{doc.title}</h2>
        </div>

        {/* 문서 정보 표 */}
        <div className="px-6 pb-4">
          <table className="w-full border-collapse text-xs">
            <tbody>
              <tr>
                <td className="border border-gray-400 px-3 py-2 bg-rose-50 font-bold text-center w-24 text-gray-700">문 서 번 호</td>
                <td className="border border-gray-400 px-3 py-2 bg-white italic text-gray-500 w-40">{doc.documentNumber || '　'}</td>
                <td className="border border-gray-400 px-3 py-2 bg-rose-50 font-bold text-center w-24 text-gray-700">제 &nbsp; 정 &nbsp; 일</td>
                <td className="border border-gray-400 px-3 py-2 bg-white italic text-gray-500">0000. 00. 00.</td>
              </tr>
              <tr>
                <td className="border border-gray-400 px-3 py-2 bg-rose-50 font-bold text-center text-gray-700">검 토 주 기</td>
                <td className="border border-gray-400 px-3 py-2 bg-white text-gray-600">{doc.reviewCycle || '1년'}</td>
                <td className="border border-gray-400 px-3 py-2 bg-rose-50 font-bold text-center text-gray-700">최 종 개 정 일</td>
                <td className="border border-gray-400 px-3 py-2 bg-white italic text-gray-500">0000. 00. 00.</td>
              </tr>
              <tr>
                <td className="border border-gray-400 px-3 py-2 bg-rose-50 font-bold text-center text-gray-700">관 련 부 서</td>
                <td className="border border-gray-400 px-3 py-2 bg-white text-gray-600" colSpan={3}>{doc.relatedDepartment || '　'}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* 본문 */}
        <div className="px-6 pb-6 space-y-5 text-sm">

          {/* 목적 */}
          <section>
            <h3 className="font-black text-gray-900 border-b border-gray-400 pb-1 mb-2">목적</h3>
            <p className="text-gray-700 leading-relaxed text-justify">{doc.purpose}</p>
          </section>

          {/* 적용 범위 */}
          {doc.scope && (
            <section>
              <h3 className="font-black text-gray-900 border-b border-gray-400 pb-1 mb-2">적용 범위</h3>
              <p className="text-gray-700 leading-relaxed">{doc.scope}</p>
            </section>
          )}

          {/* 정의 */}
          {doc.definitions?.length > 0 && (
            <section>
              <h3 className="font-black text-gray-900 border-b border-gray-400 pb-1 mb-2">정의</h3>
              <ol className="space-y-1.5 list-decimal list-inside">
                {doc.definitions.map((d, i) => (
                  <li key={i} className="text-gray-700 leading-relaxed">{d.replace(/^\d+\.\s*/, '')}</li>
                ))}
              </ol>
            </section>
          )}

          {/* 절차 */}
          {doc.procedure?.length > 0 && (
            <section>
              <h3 className="font-black text-gray-900 border-b border-gray-400 pb-1 mb-2">절차</h3>
              <ol className="space-y-2 list-decimal list-inside">
                {doc.procedure.map((step, i) => (
                  <li key={i} className="text-gray-700 leading-relaxed">
                    {step.replace(/^\d+\.\s*/, '')}
                  </li>
                ))}
              </ol>
            </section>
          )}

          {/* 기록 및 보존 */}
          {doc.recordsAndRetention?.length > 0 && (
            <section>
              <h3 className="font-black text-gray-900 border-b border-gray-400 pb-1 mb-2">기록 및 보존</h3>
              <ul className="space-y-1 list-disc list-inside">
                {doc.recordsAndRetention.map((r, i) => (
                  <li key={i} className="text-gray-700">{r}</li>
                ))}
              </ul>
            </section>
          )}

          {/* 교육 */}
          {doc.educationAndTraining?.length > 0 && (
            <section>
              <h3 className="font-black text-gray-900 border-b border-gray-400 pb-1 mb-2">교육 및 훈련</h3>
              <ul className="space-y-1 list-disc list-inside">
                {doc.educationAndTraining.map((e, i) => (
                  <li key={i} className="text-gray-700">{e}</li>
                ))}
              </ul>
            </section>
          )}

          {/* 참고문헌 */}
          {doc.references?.length > 0 && (
            <section>
              <h3 className="font-black text-gray-900 border-b border-gray-400 pb-1 mb-2">참고문헌</h3>
              <ol className="space-y-1 list-decimal list-inside">
                {doc.references.map((r, i) => (
                  <li key={i} className="text-gray-600 text-xs">{r.replace(/^\d+\.\s*/, '')}</li>
                ))}
              </ol>
            </section>
          )}

          {/* 부록 */}
          {doc.appendices?.length > 0 && (
            <section>
              <h3 className="font-black text-gray-900 border-b border-gray-400 pb-1 mb-2">부록</h3>
              <ol className="space-y-1 list-decimal list-inside">
                {doc.appendices.map((a, i) => (
                  <li key={i} className="text-gray-700 text-xs">{a.replace(/^\d+\.\s*/, '')}</li>
                ))}
              </ol>
            </section>
          )}

          {/* 부칙 */}
          {doc.additionalProvisions && (
            <section>
              <h3 className="font-black text-gray-900 border-b border-gray-400 pb-1 mb-2">부칙</h3>
              <p className="text-gray-700">{doc.additionalProvisions}</p>
            </section>
          )}

          {/* 면책 */}
          {disclaimer && (
            <div className="mt-4 pt-3 border-t border-gray-200">
              <p className="text-xs text-gray-400">{disclaimer}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
