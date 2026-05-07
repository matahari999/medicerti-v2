import { HOSPITAL_TYPES } from '@/lib/hospitalTypes';
import HospitalCard from '@/components/HospitalCard';

export default function HospitalsPage() {
  const hospitals = Object.values(HOSPITAL_TYPES);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-900 mb-2">병원 유형 선택</h1>
        <p className="text-gray-500">인증받을 병원 유형을 선택하면 해당 유형에 맞는 문서 라이브러리와 인증기준집을 확인할 수 있습니다.</p>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {hospitals.map((hospital) => (
          <HospitalCard key={hospital.key} hospital={hospital} />
        ))}
      </div>
    </div>
  );
}
