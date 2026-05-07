'use client';
import { GenerationResult } from '@/lib/types';

interface Props {
  result: GenerationResult;
}

const CSS = `
  body { font-family: 'Malgun Gothic', sans-serif; padding: 20px; font-size: 11px; color: #111; }
  h2 { font-size: 15px; font-weight: 900; margin-bottom: 10px; }
  .approval { display: flex; justify-content: flex-end; margin-bottom: 12px; }
  .approval table { border-collapse: collapse; }
  .approval th { border: 1px solid #888; padding: 4px 16px; background: #f3f4f6; font-weight: 700; text-align: center; min-width: 60px; }
  .approval td { border: 1px solid #888; height: 40px; min-width: 60px; }
  table { border-collapse: collapse; width: 100%; margin-bottom: 16px; }
  th { border: 1px solid #555; padding: 6px 8px; background: #374151; color: white; text-align: center; font-size: 11px; }
  td { border: 1px solid #aaa; padding: 5px 8px; font-size: 11px; min-height: 28px; }
  tr:nth-child(even) td { background: #f9fafb; }
  .section-title { font-size: 13px; font-weight: 700; margin: 18px 0 6px 0; border-left: 4px solid #374151; padding-left: 8px; }
  .footer { display: flex; justify-content: space-between; font-size: 10px; color: #6b7280; margin-top: 8px; padding-top: 6px; border-top: 1px solid #e5e7eb; }
  @media print { body { padding: 10px; } }
`;

function approvalBox() {
  return `
    <div class="approval">
      <table>
        <tr><th>담당</th><th>팀장</th><th>부서장</th><th>병원장</th></tr>
        <tr><td></td><td></td><td></td><td></td></tr>
      </table>
    </div>
  `;
}

function footer() {
  return `<div class="footer"><span>문서번호: ___________</span><span>작성일: ___________</span><span>작성자: ___________</span></div>`;
}

function openPrint(title: string, bodyHtml: string) {
  const w = window.open('', '_blank');
  if (!w) { alert('팝업이 차단되었습니다. 팝업 허용 후 다시 시도하세요.'); return; }
  w.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8"><title>${title}</title><style>${CSS}</style></head><body>${bodyHtml}</body></html>`);
  w.document.close();
  setTimeout(() => { w.focus(); w.print(); }, 300);
}

// 마크다운 표에서 헤더 추출
function extractHeaders(md: string): string[] {
  if (!md) return [];
  for (const line of md.split('\n')) {
    const t = line.trim();
    if (t.startsWith('|') && t.replace(/[\|\-\s:]/g, '').length > 0) {
      return t.split('|').map(c => c.trim()).filter((_, i, a) => i > 0 && i < a.length - 1);
    }
  }
  return [];
}

export default function BlankFormPrint({ result }: Props) {
  const docName = result.summaryCard?.documentName || '서식';
  const formTitle = result.blankForm?.formTitle || docName;
  const formHeaders = extractHeaders(result.blankForm?.templateMarkdown || '');
  const headers = formHeaders.length > 0 ? formHeaders : ['항목', '내용', '담당자', '일자', '비고'];
  const checklist = result.checklist || [];

  function printBlankForm() {
    const headerRow = headers.map(h => `<th>${h}</th>`).join('');
    const dataRows = Array.from({ length: 12 }, (_, i) =>
      `<tr>${headers.map((_, c) => `<td>${c === 0 ? i + 1 : ''}</td>`).join('')}</tr>`
    ).join('');
    const html = `
      <h2>📋 빈 양식 — ${formTitle}</h2>
      ${approvalBox()}
      <table><tr>${headerRow}</tr>${dataRows}</table>
      ${footer()}
    `;
    openPrint(`빈 양식 — ${formTitle}`, html);
  }

  function printBlankChecklist() {
    const rows = checklist.map((item, i) =>
      `<tr>
        <td style="text-align:center">${i + 1}</td>
        <td>${item.item || ''}</td>
        <td style="text-align:center">${item.frequency || ''}</td>
        <td style="text-align:center">${item.responsibleDepartment || ''}</td>
        <td></td>
        <td></td>
      </tr>`
    ).join('');
    const html = `
      <h2>✅ 빈 체크리스트 — ${docName}</h2>
      ${approvalBox()}
      <table>
        <tr><th style="width:28px">번호</th><th>점검항목</th><th style="width:60px">주기</th><th style="width:72px">담당부서</th><th style="width:60px">결과</th><th>조치사항</th></tr>
        ${rows}
      </table>
      ${footer()}
    `;
    openPrint(`빈 체크리스트 — ${docName}`, html);
  }

  function printBlankRecord() {
    const rows = Array.from({ length: 15 }, (_, i) =>
      `<tr><td style="text-align:center">${i + 1}</td><td></td><td></td><td></td><td></td></tr>`
    ).join('');
    const html = `
      <h2>📝 빈 기록지 — ${docName}</h2>
      ${approvalBox()}
      <table>
        <tr><th style="width:28px">번호</th><th style="width:100px">일시</th><th>내용</th><th style="width:72px">담당자</th><th style="width:52px">서명</th></tr>
        ${rows}
      </table>
      ${footer()}
    `;
    openPrint(`빈 기록지 — ${docName}`, html);
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-2 pb-1">
        <span className="text-lg">🖨️</span>
        <div>
          <p className="font-bold text-gray-900">인쇄용 빈 서식</p>
          <p className="text-xs text-gray-500">버튼을 클릭하면 인쇄 창이 바로 열립니다.</p>
        </div>
      </div>

      {/* 빈 양식 */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="bg-gray-800 text-white flex items-center justify-between px-4 py-3">
          <div>
            <p className="text-sm font-black">📋 빈 양식</p>
            <p className="text-xs text-gray-300 mt-0.5">{formTitle}</p>
          </div>
          <button
            onClick={printBlankForm}
            className="text-xs bg-white text-gray-800 px-4 py-1.5 rounded font-bold hover:bg-gray-100 transition-colors"
          >
            🖨️ 인쇄
          </button>
        </div>
        <div className="p-4">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-xs">
              <thead>
                <tr className="bg-gray-700 text-white">
                  {headers.map((h, i) => <th key={i} className="border border-gray-500 px-3 py-2 text-center">{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 5 }).map((_, r) => (
                  <tr key={r} className={r % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    {headers.map((_, c) => (
                      <td key={c} className="border border-gray-300 px-3 py-3">
                        {c === 0 ? <span className="text-gray-400">{r + 1}</span> : ''}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-400 mt-2 text-center">인쇄 시 12행으로 출력됩니다</p>
        </div>
      </div>

      {/* 빈 체크리스트 */}
      {checklist.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="bg-gray-800 text-white flex items-center justify-between px-4 py-3">
            <div>
              <p className="text-sm font-black">✅ 빈 체크리스트</p>
              <p className="text-xs text-gray-300 mt-0.5">{docName} — {checklist.length}개 항목</p>
            </div>
            <button
              onClick={printBlankChecklist}
              className="text-xs bg-white text-gray-800 px-4 py-1.5 rounded font-bold hover:bg-gray-100 transition-colors"
            >
              🖨️ 인쇄
            </button>
          </div>
          <div className="p-4">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-xs">
                <thead>
                  <tr className="bg-gray-700 text-white">
                    <th className="border border-gray-500 px-2 py-2 w-8">번호</th>
                    <th className="border border-gray-500 px-3 py-2">점검항목</th>
                    <th className="border border-gray-500 px-2 py-2">주기</th>
                    <th className="border border-gray-500 px-2 py-2">담당부서</th>
                    <th className="border border-gray-500 px-2 py-2 w-16 bg-yellow-600">결과</th>
                    <th className="border border-gray-500 px-2 py-2 bg-yellow-600">조치사항</th>
                  </tr>
                </thead>
                <tbody>
                  {checklist.slice(0, 5).map((item, i) => (
                    <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="border border-gray-300 px-2 py-2 text-center text-gray-400">{i + 1}</td>
                      <td className="border border-gray-300 px-3 py-2 text-gray-800">{item.item}</td>
                      <td className="border border-gray-300 px-2 py-2 text-center text-gray-500">{item.frequency}</td>
                      <td className="border border-gray-300 px-2 py-2 text-center text-gray-500">{item.responsibleDepartment}</td>
                      <td className="border border-gray-200 px-2 py-2 bg-yellow-50"></td>
                      <td className="border border-gray-200 px-2 py-2 bg-yellow-50"></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {checklist.length > 5 && (
              <p className="text-xs text-gray-400 mt-2 text-center">미리보기: 5행 표시 / 인쇄 시 전체 {checklist.length}행 출력</p>
            )}
          </div>
        </div>
      )}

      {/* 빈 기록지 */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="bg-gray-800 text-white flex items-center justify-between px-4 py-3">
          <div>
            <p className="text-sm font-black">📝 빈 기록지</p>
            <p className="text-xs text-gray-300 mt-0.5">{docName} — 범용 기록지</p>
          </div>
          <button
            onClick={printBlankRecord}
            className="text-xs bg-white text-gray-800 px-4 py-1.5 rounded font-bold hover:bg-gray-100 transition-colors"
          >
            🖨️ 인쇄
          </button>
        </div>
        <div className="p-4">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-xs">
              <thead>
                <tr className="bg-gray-700 text-white">
                  <th className="border border-gray-500 px-2 py-2 w-8">번호</th>
                  <th className="border border-gray-500 px-3 py-2 w-24">일시</th>
                  <th className="border border-gray-500 px-3 py-2">내용</th>
                  <th className="border border-gray-500 px-2 py-2 w-16">담당자</th>
                  <th className="border border-gray-500 px-2 py-2 w-12">서명</th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="border border-gray-300 px-2 py-3 text-center text-gray-400">{i + 1}</td>
                    <td className="border border-gray-300 py-3"></td>
                    <td className="border border-gray-300 py-3"></td>
                    <td className="border border-gray-300 py-3"></td>
                    <td className="border border-gray-300 py-3"></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-400 mt-2 text-center">인쇄 시 15행으로 출력됩니다</p>
        </div>
      </div>
    </div>
  );
}
