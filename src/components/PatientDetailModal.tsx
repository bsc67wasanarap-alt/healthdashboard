import React from 'react';
import { X, User, Heart, Activity, AlertCircle, CheckCircle2, ShieldAlert, Calendar, MapPin } from 'lucide-react';
import { HealthRecord } from '../types';
import { formatThaiDate } from '../utils/healthCalculations';

interface PatientDetailModalProps {
  patient: HealthRecord | null;
  onClose: () => void;
}

export const PatientDetailModal: React.FC<PatientDetailModalProps> = ({ patient, onClose }) => {
  if (!patient) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full border border-purple-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-purple-950 via-purple-900 to-indigo-950 text-white p-5 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-purple-700/60 border border-purple-500/30 flex items-center justify-center text-purple-200 font-bold text-lg font-['Plus_Jakarta_Sans',sans-serif]">
              {patient.id}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold">แฟ้มข้อมูลสุขภาพรายบุคคล (Health Passport)</h3>
              </div>
              <div className="flex items-center gap-2 text-xs text-purple-200 mt-0.5">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-purple-300" /> พื้นที่ {patient.area}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-purple-300" /> คัดกรองเมื่อ {formatThaiDate(patient.screeningDate)}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-purple-300 hover:text-white p-1 rounded-lg hover:bg-purple-800/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* General Demographics & Risk Status */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-purple-50/70 border border-purple-100">
            <div>
              <span className="text-xs text-slate-500">ข้อมูลทั่วไป</span>
              <div className="font-semibold text-slate-800 text-sm">
                {patient.gender} อายุ {patient.age} ปี (ส่วนสูง {patient.height} ซม. / น้ำหนัก {patient.weight} กก.)
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-500">ผลประเมิน NCDs</span>
              <div className="mt-0.5">
                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  patient.riskLevel === 'สูง'
                    ? 'bg-purple-900 text-white'
                    : patient.riskLevel === 'ปานกลาง'
                    ? 'bg-amber-100 text-amber-900'
                    : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {patient.riskLevel === 'สูง' && <ShieldAlert className="w-3.5 h-3.5 text-white" />}
                  <span>ความเสี่ยงระดับ{patient.riskLevel}</span>
                  <span>({patient.riskScore} คะแนน)</span>
                </span>
              </div>
            </div>
          </div>

          {/* Vitals Grid */}
          <div className="grid grid-cols-3 gap-3">
            {/* BMI Card */}
            <div className={`p-3 rounded-xl border ${patient.bmi >= 25 ? 'bg-purple-100/70 border-purple-300 text-purple-950' : 'bg-slate-50 border-slate-200'}`}>
              <span className="text-[11px] font-semibold text-slate-500 block">ดัชนีมวลกาย (BMI)</span>
              <div className="text-xl font-bold font-['Plus_Jakarta_Sans',sans-serif] mt-0.5">
                {patient.bmi}
              </div>
              <span className="text-[10px] font-medium block mt-1">
                {patient.bmiCategory}
              </span>
            </div>

            {/* BP Card */}
            <div className={`p-3 rounded-xl border ${patient.bpCategory === 'ความดันสูง' ? 'bg-purple-200/80 border-purple-300 text-[#4a044e]' : patient.bpCategory === 'เริ่มเสี่ยง' ? 'bg-amber-50 border-amber-200 text-amber-900' : 'bg-emerald-50 border-emerald-200 text-emerald-900'}`}>
              <span className="text-[11px] font-semibold text-slate-500 block">ความดัน (SBP/DBP)</span>
              <div className="text-xl font-bold font-['Plus_Jakarta_Sans',sans-serif] mt-0.5">
                {patient.sbp}/{patient.dbp}
              </div>
              <span className="text-[10px] font-medium block mt-1">
                {patient.bpCategory} ({patient.pulse} bpm)
              </span>
            </div>

            {/* Glucose Card */}
            <div className={`p-3 rounded-xl border ${patient.glucoseCategory === 'สงสัยเบาหวาน' ? 'bg-purple-200/80 border-purple-300 text-[#4a044e]' : patient.glucoseCategory === 'เริ่มเสี่ยง' ? 'bg-amber-50 border-amber-200 text-amber-900' : 'bg-emerald-50 border-emerald-200 text-emerald-900'}`}>
              <span className="text-[11px] font-semibold text-slate-500 block">น้ำตาลในเลือด</span>
              <div className="text-xl font-bold font-['Plus_Jakarta_Sans',sans-serif] mt-0.5">
                {patient.glucose}
              </div>
              <span className="text-[10px] font-medium block mt-1">
                {patient.glucoseCategory} mg/dL
              </span>
            </div>
          </div>

          {/* Lifestyle & Risk Habits */}
          <div className="border border-purple-100 rounded-xl p-3.5 space-y-2">
            <h4 className="text-xs font-bold text-purple-950 uppercase tracking-wide">
              พฤติกรรมการดำเนินชีวิต & คัดกรองโรค
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex justify-between py-1 border-b border-purple-50">
                <span className="text-slate-500">การออกกำลังกาย:</span>
                <span className="font-semibold text-slate-800">{patient.exercise}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-purple-50">
                <span className="text-slate-500">การสูบบุหรี่:</span>
                <span className={`font-semibold ${patient.smoking === 'สูบ' ? 'text-purple-900' : 'text-slate-800'}`}>
                  {patient.smoking}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-purple-50">
                <span className="text-slate-500">การดื่มแอลกอฮอล์:</span>
                <span className={`font-semibold ${patient.alcohol === 'ดื่ม' ? 'text-purple-900' : 'text-slate-800'}`}>
                  {patient.alcohol}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-purple-50">
                <span className="text-slate-500">คัดกรองเบาหวาน:</span>
                <span className="font-semibold text-slate-800">{patient.diabetesScreen}</span>
              </div>
              <div className="flex justify-between py-1 col-span-2">
                <span className="text-slate-500">คัดกรองความดันโลหิตสูง:</span>
                <span className="font-semibold text-slate-800">{patient.htScreen}</span>
              </div>
            </div>
          </div>

          {/* Clinical Advice Box */}
          <div className="bg-purple-950 text-white rounded-xl p-3.5 space-y-1.5 text-xs">
            <div className="font-bold text-purple-200 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-purple-400" />
              <span>คำแนะนำทางการแพทย์และการดูแลสุขภาพปฐมภูมิ:</span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-purple-100 text-[11px] leading-relaxed">
              {patient.bmi >= 25 && (
                <li>ลดพลังงานจากอาหาร ลดหวาน-มัน-เค็ม และตั้งเป้าหมายลดน้ำหนัก 5-7% ใน 3 เดือน</li>
              )}
              {patient.exercise === 'ไม่ออกกำลังกาย' && (
                <li>เริ่มเดินเร็วหรือออกกำลังกายระดับปานกลางอย่างน้อย 150 นาทีต่อสัปดาห์</li>
              )}
              {patient.sbp >= 140 && (
                <li>เฝ้าระวังความดันโลหิตสูง นัดวัดความดันซ้ำที่ รพ.สต./คลินิก ภายใน 2 สัปดาห์</li>
              )}
              {patient.glucose >= 126 && (
                <li>ส่งตรวจระดับน้ำตาลสะสม HbA1c และพบแพทย์เพื่อวินิจฉัยโรคเบาหวาน</li>
              )}
              {patient.riskLevel === 'ต่ำ' && (
                <li>รักษาสุขภาพต่อเนื่องและตรวจคัดกรองประจำปีตามรอบ</li>
              )}
            </ul>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 border-t border-purple-100 px-5 py-3 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-purple-900 text-white hover:bg-purple-950 transition-colors cursor-pointer"
          >
            ปิดหน้าต่าง
          </button>
        </div>
      </div>
    </div>
  );
};
