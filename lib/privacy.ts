// =============================================
// 메디인증 문서센터 - 개인정보 마스킹
// =============================================

export function maskPrivacy(text: string): string {
  if (!text) return text;
  return text
    // 주민등록번호
    .replace(/\d{6}-[1-4]\d{6}/g, '000000-*******')
    // 전화번호
    .replace(/010-\d{4}-\d{4}/g, '010-****-****')
    .replace(/\d{3}-\d{4}-\d{4}/g, '***-****-****')
    // 이름 패턴 (2-4자 한글)
    .replace(/[가-힣]{2,4}(?=\s*(님|씨|선생|원장|간호사|의사|직원|담당|보호자|환자))/g, (m) => {
      if (m.length === 2) return m[0] + '○';
      return m[0] + '○○';
    });
}

export const MASKED_EXAMPLES = {
  patientName: '홍○○',
  guardianName: '김○○',
  staffName: '이○○',
  date: '2026-00-00',
  chartNo: '000000',
  phone: '010-****-0000',
  aedId: 'AED-0001',
  vehicleNo: '00가0000',
  docNo: 'QPS-2026-001',
};
