import React, { useState } from 'react';
import { X, Copy, Check, BookOpen, Layers, Calculator, Database, ExternalLink } from 'lucide-react';
import { DEFAULT_SHEET_ID } from '../services/googleSheetService';

interface DataMappingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DataMappingModal: React.FC<DataMappingModalProps> = ({ isOpen, onClose }) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-4xl w-full border border-purple-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-950 via-purple-900 to-indigo-950 text-white p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-700/70 border border-purple-500/40 flex items-center justify-center text-white">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold">
                คู่มือโครงสร้าง Data Mapping & สูตรคำนวณ Dashboard (Step-by-Step)
              </h3>
              <p className="text-xs text-purple-200">
                วิเคราะห์จาก Google Sheet ID: <span className="font-mono">{DEFAULT_SHEET_ID}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-purple-300 hover:text-white p-1.5 rounded-lg hover:bg-purple-800/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-700">
          {/* Section 1: Data Source & Connection URL */}
          <div className="bg-purple-50/70 border border-purple-200 rounded-xl p-4">
            <div className="flex items-center gap-2 font-bold text-purple-950 text-base mb-2">
              <Database className="w-4 h-4 text-purple-700" />
              <span>1. วิธีการเชื่อมต่อข้อมูล (Connection & Data Source)</span>
            </div>
            <p className="text-xs text-slate-600 mb-2">
              สามารถเชื่อมต่อ Google Sheet นี้เข้าสู่ระบบทำ Dashboard (เช่น Looker Studio, Power BI หรือ Web App) ได้ทันที:
            </p>
            <div className="bg-white p-2.5 rounded-lg border border-purple-200 font-mono text-xs flex items-center justify-between gap-2 overflow-x-auto">
              <span className="text-purple-900 truncate">
                https://docs.google.com/spreadsheets/d/{DEFAULT_SHEET_ID}/gviz/tq?tqx=out:json
              </span>
              <button
                onClick={() =>
                  handleCopy(
                    `https://docs.google.com/spreadsheets/d/${DEFAULT_SHEET_ID}/gviz/tq?tqx=out:json`,
                    'url'
                  )
                }
                className="shrink-0 p-1.5 text-purple-700 hover:bg-purple-50 rounded flex items-center gap-1 text-[11px] font-sans font-semibold cursor-pointer"
              >
                {copiedKey === 'url' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'url' ? 'คัดลอกแล้ว' : 'คัดลอก'}</span>
              </button>
            </div>
          </div>

          {/* Section 2: Data Schema & Mapping Table */}
          <div>
            <div className="flex items-center gap-2 font-bold text-purple-950 text-base mb-2">
              <Layers className="w-4 h-4 text-purple-700" />
              <span>2. ตารางแมปปิ้งฟิลด์ข้อมูล (Data Schema Mapping) - ทั้งหมด 20 คอลัมน์</span>
            </div>
            <div className="overflow-x-auto border border-purple-100 rounded-xl">
              <table className="w-full text-xs text-left border-collapse">
                <thead className="bg-purple-900 text-white font-semibold">
                  <tr>
                    <th className="py-2.5 px-3">ชื่อคอลัมน์ใน Sheet</th>
                    <th className="py-2.5 px-3">ชื่อฟิลด์ภาษาอังกฤษ</th>
                    <th className="py-2.5 px-3">ชนิดข้อมูล (Type)</th>
                    <th className="py-2.5 px-3">บทบาทการนำไปใช้ใน Dashboard</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-purple-50">
                  <tr>
                    <td className="py-2 px-3 font-semibold text-purple-950">รหัสบุคคล</td>
                    <td className="py-2 px-3 font-mono">id (Patient ID)</td>
                    <td className="py-2 px-3">Text</td>
                    <td className="py-2 px-3">Primary Key, Dimension, แสดงในตารางและค้นหา</td>
                  </tr>
                  <tr className="bg-purple-50/30">
                    <td className="py-2 px-3 font-semibold text-purple-950">วันที่คัดกรอง</td>
                    <td className="py-2 px-3 font-mono">screeningDate</td>
                    <td className="py-2 px-3">Date</td>
                    <td className="py-2 px-3">Time Dimension, ใช้วิเคราะห์แนวโน้ม</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-semibold text-purple-950">พื้นที่</td>
                    <td className="py-2 px-3 font-mono">area</td>
                    <td className="py-2 px-3">Text</td>
                    <td className="py-2 px-3">Filter, แผนภูมิเฝ้าระวังพื้นที่ (Surveillance Bar)</td>
                  </tr>
                  <tr className="bg-purple-50/30">
                    <td className="py-2 px-3 font-semibold text-purple-950">เพศ</td>
                    <td className="py-2 px-3 font-mono">gender</td>
                    <td className="py-2 px-3">Text</td>
                    <td className="py-2 px-3">Filter, สัดส่วนผู้ประเมิน KPI Card 1</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-semibold text-purple-950">อายุ</td>
                    <td className="py-2 px-3 font-mono">age</td>
                    <td className="py-2 px-3">Number</td>
                    <td className="py-2 px-3">Dimension, กราฟวิเคราะห์ความเสี่ยงตามช่วงอายุ</td>
                  </tr>
                  <tr className="bg-purple-50/30">
                    <td className="py-2 px-3 font-semibold text-purple-950">ส่วนสูง_cm / น้ำหนัก_kg</td>
                    <td className="py-2 px-3 font-mono">height, weight</td>
                    <td className="py-2 px-3">Number</td>
                    <td className="py-2 px-3">ใช้คำนวณตรวจสอบค่า BMI: weight / ((height/100)^2)</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-semibold text-purple-950">BMI</td>
                    <td className="py-2 px-3 font-mono">bmi</td>
                    <td className="py-2 px-3">Number (Metric)</td>
                    <td className="py-2 px-3">KPI Card 2, Donut Chart, Trend Line, Scatter Plot</td>
                  </tr>
                  <tr className="bg-purple-50/30">
                    <td className="py-2 px-3 font-semibold text-purple-950">SBP_mmHg / DBP_mmHg</td>
                    <td className="py-2 px-3 font-mono">sbp, dbp</td>
                    <td className="py-2 px-3">Number</td>
                    <td className="py-2 px-3">KPI Card 4, กราฟความเสี่ยงความดัน, Scatter correlation</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-semibold text-purple-950">น้ำตาล_mg_dL</td>
                    <td className="py-2 px-3 font-mono">glucose</td>
                    <td className="py-2 px-3">Number</td>
                    <td className="py-2 px-3">KPI Card 4, กราฟความเสี่ยงน้ำตาล, Scatter correlation</td>
                  </tr>
                  <tr className="bg-purple-50/30">
                    <td className="py-2 px-3 font-semibold text-purple-950">สูบบุหรี่ / ดื่มแอลกอฮอล์</td>
                    <td className="py-2 px-3 font-mono">smoking, alcohol</td>
                    <td className="py-2 px-3">Text</td>
                    <td className="py-2 px-3">Stacked Bar, Radar Chart, Risk Matrix Heatmap</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-semibold text-purple-950">การออกกำลังกาย</td>
                    <td className="py-2 px-3 font-mono">exercise</td>
                    <td className="py-2 px-3">Text</td>
                    <td className="py-2 px-3">Horizontal Bar, Trend Chart, Radar Chart</td>
                  </tr>
                  <tr className="bg-purple-50/30">
                    <td className="py-2 px-3 font-semibold text-purple-950">เบาหวาน_คัดกรอง / ความดัน_คัดกรอง</td>
                    <td className="py-2 px-3 font-mono">dm_screen, ht_screen</td>
                    <td className="py-2 px-3">Text</td>
                    <td className="py-2 px-3">พายชาร์ตพฤติกรรมโภชนาการ (หวาน/มัน/เค็ม)</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-semibold text-purple-950">คะแนนความเสี่ยง / ระดับความเสี่ยง</td>
                    <td className="py-2 px-3 font-mono">riskScore, riskLevel</td>
                    <td className="py-2 px-3">Number / Text</td>
                    <td className="py-2 px-3">Gauge Chart, ตารางผู้มีความเสี่ยงสูง (High Risk)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 3: Calculated Fields & Formulas */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 font-bold text-purple-950 text-base">
              <Calculator className="w-4 h-4 text-purple-700" />
              <span>3. สูตรคำนวณฟิลด์ใหม่ (Calculated Fields / Formulas) ใน Looker Studio หรือ Google Sheets</span>
            </div>

            {/* Formula 1: BMI Category */}
            <div className="border border-purple-200 rounded-xl p-3.5 bg-slate-50/50">
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-purple-950 text-xs">
                  สูตร 1: การจำแนกระดับ BMI ตามเกณฑ์คนเอเชีย (BMI_Category)
                </span>
                <button
                  onClick={() =>
                    handleCopy(
                      `CASE \n  WHEN BMI < 18.5 THEN "1. น้ำหนักน้อย / ผอม"\n  WHEN BMI <= 22.9 THEN "2. สมส่วน / ปกติ"\n  WHEN BMI <= 24.9 THEN "3. น้ำหนักเกิน / ท้วม"\n  WHEN BMI <= 29.9 THEN "4. โรคอ้วนระดับ 1"\n  ELSE "5. โรคอ้วนระดับ 2 (อันตราย)"\nEND`,
                      'f1'
                    )
                  }
                  className="text-xs text-purple-700 hover:text-purple-950 font-medium flex items-center gap-1 cursor-pointer"
                >
                  {copiedKey === 'f1' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>คัดลอกสูตร</span>
                </button>
              </div>
              <pre className="bg-white p-2.5 rounded border border-purple-100 font-mono text-[11px] text-purple-950 overflow-x-auto">
{`CASE 
  WHEN BMI < 18.5 THEN "1. น้ำหนักน้อย / ผอม"
  WHEN BMI <= 22.9 THEN "2. สมส่วน / ปกติ"
  WHEN BMI <= 24.9 THEN "3. น้ำหนักเกิน / ท้วม"
  WHEN BMI <= 29.9 THEN "4. โรคอ้วนระดับ 1"
  ELSE "5. โรคอ้วนระดับ 2 (อันตราย)"
END`}
              </pre>
            </div>

            {/* Formula 2: High Risk Flag */}
            <div className="border border-purple-200 rounded-xl p-3.5 bg-slate-50/50">
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-purple-950 text-xs">
                  สูตร 2: ตัวชี้วัดกลุ่มเสี่ยงสูง (Is_High_Risk_Flag) สำหรับคำนวณ Card 3 & ตาราง
                </span>
                <button
                  onClick={() =>
                    handleCopy(
                      `IF(BMI >= 25, 1, 0)`,
                      'f2'
                    )
                  }
                  className="text-xs text-purple-700 hover:text-purple-950 font-medium flex items-center gap-1 cursor-pointer"
                >
                  {copiedKey === 'f2' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>คัดลอกสูตร</span>
                </button>
              </div>
              <pre className="bg-white p-2.5 rounded border border-purple-100 font-mono text-[11px] text-purple-950 overflow-x-auto">
{`// Looker Studio / Excel:
IF(BMI >= 25, 1, 0)

// ร้อยละของผู้มีความเสี่ยงสูง:
SUM(IF(BMI >= 25, 1, 0)) / COUNT(รหัสบุคคล) * 100`}
              </pre>
            </div>

            {/* Formula 3: Blood Pressure Risk */}
            <div className="border border-purple-200 rounded-xl p-3.5 bg-slate-50/50">
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-purple-950 text-xs">
                  สูตร 3: ระดับความเสี่ยงความดันโลหิต (BP_Risk_Category)
                </span>
                <button
                  onClick={() =>
                    handleCopy(
                      `CASE \n  WHEN SBP_mmHg >= 140 OR DBP_mmHg >= 90 THEN "ความดันสูง (≥140/90)"\n  WHEN SBP_mmHg >= 120 OR DBP_mmHg >= 80 THEN "เริ่มเสี่ยง (120-139/80-89)"\n  ELSE "ปกติ (<120/80)"\nEND`,
                      'f3'
                    )
                  }
                  className="text-xs text-purple-700 hover:text-purple-950 font-medium flex items-center gap-1 cursor-pointer"
                >
                  {copiedKey === 'f3' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>คัดลอกสูตร</span>
                </button>
              </div>
              <pre className="bg-white p-2.5 rounded border border-purple-100 font-mono text-[11px] text-purple-950 overflow-x-auto">
{`CASE 
  WHEN SBP_mmHg >= 140 OR DBP_mmHg >= 90 THEN "ความดันสูง (≥140/90)"
  WHEN SBP_mmHg >= 120 OR DBP_mmHg >= 80 THEN "เริ่มเสี่ยง (120-139/80-89)"
  ELSE "ปกติ (<120/80)"
END`}
              </pre>
            </div>

            {/* Formula 4: Blood Sugar Risk */}
            <div className="border border-purple-200 rounded-xl p-3.5 bg-slate-50/50">
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-purple-950 text-xs">
                  สูตร 4: ระดับความเสี่ยงน้ำตาลในเลือด (Blood_Sugar_Category)
                </span>
                <button
                  onClick={() =>
                    handleCopy(
                      `CASE \n  WHEN น้ำตาล_mg_dL >= 126 THEN "สงสัยเบาหวาน (≥126)"\n  WHEN น้ำตาล_mg_dL >= 100 THEN "เริ่มเสี่ยง (100-125)"\n  ELSE "ปกติ (<100)"\nEND`,
                      'f4'
                    )
                  }
                  className="text-xs text-purple-700 hover:text-purple-950 font-medium flex items-center gap-1 cursor-pointer"
                >
                  {copiedKey === 'f4' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>คัดลอกสูตร</span>
                </button>
              </div>
              <pre className="bg-white p-2.5 rounded border border-purple-100 font-mono text-[11px] text-purple-950 overflow-x-auto">
{`CASE 
  WHEN น้ำตาล_mg_dL >= 126 THEN "สงสัยเบาหวาน (≥126)"
  WHEN น้ำตาล_mg_dL >= 100 THEN "เริ่มเสี่ยง (100-125)"
  ELSE "ปกติ (<100)"
END`}
              </pre>
            </div>

            {/* Formula 5: Dietary Habit Proxy */}
            <div className="border border-purple-200 rounded-xl p-3.5 bg-slate-50/50">
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-purple-950 text-xs">
                  สูตร 5: พฤติกรรมการบริโภคอาหาร (Diet_Behavior_Category)
                </span>
                <button
                  onClick={() =>
                    handleCopy(
                      `CASE \n  WHEN เบาหวาน_คัดกรอง = "มีแนวโน้ม/เสี่ยง" AND ความดันโลหิตสูง_คัดกรอง = "มีแนวโน้ม/เสี่ยง" THEN "เสี่ยงพหุโภชนาการ (หวาน-มัน-เค็ม)"\n  WHEN เบาหวาน_คัดกรอง = "มีแนวโน้ม/เสี่ยง" THEN "เสี่ยงอาหารหวาน (น้ำตาลสูง)"\n  WHEN ความดันโลหิตสูง_คัดกรอง = "มีแนวโน้ม/เสี่ยง" THEN "เสี่ยงอาหารเค็ม (โซเดียมสูง)"\n  ELSE "บริโภคปกติ (สมดุล)"\nEND`,
                      'f5'
                    )
                  }
                  className="text-xs text-purple-700 hover:text-purple-950 font-medium flex items-center gap-1 cursor-pointer"
                >
                  {copiedKey === 'f5' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>คัดลอกสูตร</span>
                </button>
              </div>
              <pre className="bg-white p-2.5 rounded border border-purple-100 font-mono text-[11px] text-purple-950 overflow-x-auto">
{`CASE 
  WHEN เบาหวาน_คัดกรอง = "มีแนวโน้ม/เสี่ยง" AND ความดันโลหิตสูง_คัดกรอง = "มีแนวโน้ม/เสี่ยง" THEN "เสี่ยงพหุโภชนาการ (หวาน-มัน-เค็ม)"
  WHEN เบาหวาน_คัดกรอง = "มีแนวโน้ม/เสี่ยง" THEN "เสี่ยงอาหารหวาน (น้ำตาลสูง)"
  WHEN ความดันโลหิตสูง_คัดกรอง = "มีแนวโน้ม/เสี่ยง" THEN "เสี่ยงอาหารเค็ม (โซเดียมสูง)"
  ELSE "บริโภคปกติ (สมดุล)"
END`}
              </pre>
            </div>
          </div>

          {/* Section 4: Conditional Formatting Setup Step-by-Step */}
          <div className="bg-purple-950 text-white rounded-xl p-4 space-y-2">
            <h4 className="font-bold text-purple-200 text-sm">
              4. ขั้นตอนการตั้งค่า Conditional Formatting ในตารางข้อมูลดิบ:
            </h4>
            <ol className="list-decimal list-inside space-y-1.5 text-xs text-purple-100 leading-relaxed">
              <li>
                <strong>คอลัมน์ BMI:</strong> ตั้งกฎ Custom Formula <code className="bg-purple-800 px-1.5 py-0.5 rounded text-white font-mono">=BMI &gt;= 25</code> เลือกข้อความ <strong>Bold สีม่วงเข้ม (#581c87)</strong> และพื้นหลังสีม่วงอ่อน (#ede9fe).
              </li>
              <li>
                <strong>คอลัมน์ ความดัน (SBP):</strong>
                <br />• &lt; 120: พื้นหลังเขียวอ่อน (#d1fae5)
                <br />• 120 - 139: พื้นหลังเหลืองอ่อน (#fef3c7)
                <br />• &gt;= 140: พื้นหลังม่วงเข้ม/แดง (#e9d5ff / #fee2e2) ข้อความหนา.
              </li>
              <li>
                <strong>คอลัมน์ น้ำตาล (Glucose):</strong>
                <br />• &lt; 100: พื้นหลังเขียวอ่อน
                <br />• 100 - 125: พื้นหลังเหลืองอ่อน
                <br />• &gt;= 126: พื้นหลังม่วงเข้ม/แดง ข้อความหนา.
              </li>
            </ol>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 border-t border-purple-100 px-6 py-3.5 flex justify-between items-center shrink-0">
          <span className="text-xs text-slate-500">
            จัดทำโดย นางสาววาสนา ระพีเจิดสวัสดิ์ • ระบบประเมินสุขภาพ NCDs
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-semibold bg-purple-900 text-white hover:bg-purple-950 transition-colors cursor-pointer"
          >
            ปิดคู่มือ
          </button>
        </div>
      </div>
    </div>
  );
};
