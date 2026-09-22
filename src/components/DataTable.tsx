import React, { useState } from 'react';
import {
  Search,
  Download,
  ArrowUpDown,
  AlertTriangle,
  UserCheck,
  Eye,
  FileSpreadsheet,
  CheckCircle,
  HelpCircle
} from 'lucide-react';
import { HealthRecord } from '../types';
import { formatThaiDate } from '../utils/healthCalculations';

interface DataTableProps {
  records: HealthRecord[];
  onSelectPatient: (patient: HealthRecord) => void;
}

type SortField = 'id' | 'screeningDate' | 'area' | 'gender' | 'age' | 'bmi' | 'sbp' | 'glucose' | 'riskScore';
type SortOrder = 'asc' | 'desc';

export const DataTable: React.FC<DataTableProps> = ({ records, onSelectPatient }) => {
  const [onlyHighRisk, setOnlyHighRisk] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortField, setSortField] = useState<SortField>('riskScore');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  // Filter for high risk if toggled
  const filteredList = records.filter(r => {
    if (onlyHighRisk) {
      if (r.riskLevel !== 'สูง' && r.bmi < 25 && r.riskScore < 4) return false;
    }
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase().trim();
      const matchId = r.id.toLowerCase().includes(q);
      const matchArea = r.area.toLowerCase().includes(q);
      const matchGender = r.gender.toLowerCase().includes(q);
      const matchRisk = r.riskLevel.toLowerCase().includes(q);
      if (!matchId && !matchArea && !matchGender && !matchRisk) return false;
    }
    return true;
  });

  // Sort records
  const sortedList = [...filteredList].sort((a, b) => {
    let valA: any = a[sortField];
    let valB: any = b[sortField];

    if (typeof valA === 'string') {
      return sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
    }
    return sortOrder === 'asc' ? valA - valB : valB - valA;
  });

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  // Export to CSV function
  const handleExportCSV = () => {
    const headers = [
      'รหัสบุคคล',
      'วันที่คัดกรอง',
      'พื้นที่',
      'เพศ',
      'อายุ',
      'ส่วนสูง_cm',
      'น้ำหนัก_kg',
      'BMI',
      'สถานะ_BMI',
      'SBP_mmHg',
      'DBP_mmHg',
      'ความดันโลหิต',
      'น้ำตาล_mg_dL',
      'ระดับน้ำตาล',
      'สูบบุหรี่',
      'ดื่มแอลกอฮอล์',
      'การออกกำลังกาย',
      'คะแนนความเสี่ยง',
      'ระดับความเสี่ยง'
    ];

    const rows = sortedList.map(r => [
      `"${r.id}"`,
      `"${r.screeningDate}"`,
      `"${r.area}"`,
      `"${r.gender}"`,
      r.age,
      r.height,
      r.weight,
      r.bmi,
      `"${r.bmiCategory}"`,
      r.sbp,
      r.dbp,
      `"${r.bpCategory}"`,
      r.glucose,
      `"${r.glucoseCategory}"`,
      `"${r.smoking}"`,
      `"${r.alcohol}"`,
      `"${r.exercise}"`,
      r.riskScore,
      `"${r.riskLevel}"`
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Health_Assessment_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-xl border border-purple-100 shadow-2xs p-4 sm:p-5 space-y-4">
      {/* Table Header & Action Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-purple-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-6 bg-purple-900 rounded-xs"></div>
            <h2 className="text-base sm:text-lg font-bold text-purple-950">
              รายละเอียดเชิงลึก: รายชื่อกลุ่มผู้มีความเสี่ยงระดับสูงที่ต้องได้รับการดูแลด่วน (High-Risk Patient Detail)
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            จำแนกพร้อมระบบเน้นสีตามเกณฑ์ Conditional Formatting (BMI ≥ 25, ความดัน & น้ำตาล)
          </p>
        </div>

        {/* Action buttons & View Toggle */}
        <div className="flex flex-wrap items-center gap-2.5 self-start lg:self-center">
          {/* Toggle Only High Risk vs All */}
          <div className="flex items-center bg-purple-50 p-1 rounded-lg border border-purple-200 text-xs">
            <button
              onClick={() => setOnlyHighRisk(true)}
              className={`px-3 py-1.5 rounded-md font-semibold transition-all cursor-pointer ${
                onlyHighRisk
                  ? 'bg-purple-900 text-white shadow-xs'
                  : 'text-purple-800 hover:text-purple-950'
              }`}
            >
              เฉพาะกลุ่มเสี่ยงสูง (High Risk)
            </button>
            <button
              onClick={() => setOnlyHighRisk(false)}
              className={`px-3 py-1.5 rounded-md font-semibold transition-all cursor-pointer ${
                !onlyHighRisk
                  ? 'bg-purple-900 text-white shadow-xs'
                  : 'text-purple-800 hover:text-purple-950'
              }`}
            >
              แสดงทั้งหมด ({records.length})
            </button>
          </div>

          {/* Quick Search */}
          <div className="relative w-44 sm:w-52">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="ค้นหาในตาราง..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-purple-500 focus:bg-white"
            />
          </div>

          {/* Export CSV Button */}
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-white text-purple-800 border border-purple-200 hover:bg-purple-50 rounded-lg transition-colors cursor-pointer shadow-2xs"
            title="ดาวน์โหลดข้อมูลเป็นไฟล์ Excel / CSV"
          >
            <Download className="w-3.5 h-3.5 text-purple-700" />
            <span>ส่งออก CSV</span>
          </button>
        </div>
      </div>

      {/* Conditional Formatting Guide Banner */}
      <div className="bg-purple-50/60 border border-purple-200/70 rounded-lg p-2.5 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-semibold text-purple-950 flex items-center gap-1">
            <HelpCircle className="w-3.5 h-3.5 text-purple-700" />
            <span>เกณฑ์สี Conditional Formatting:</span>
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded font-bold text-[#581c87] bg-purple-100 border border-purple-300">
            BMI ≥ 25 (ตัวหนาสีม่วงเข้ม พื้นหลังม่วงอ่อน)
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded font-medium text-emerald-800 bg-emerald-50 border border-emerald-200">
            เขียว = ปกติ
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded font-medium text-amber-800 bg-amber-50 border border-amber-200">
            เหลือง = เริ่มเสี่ยง
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded font-semibold text-red-750 bg-red-100 border border-red-200">
            แดง = อันตราย (เสี่ยงสูง)
          </span>
        </div>
        <div className="text-slate-500 font-medium">
          พบ <strong>{sortedList.length}</strong> รายการ
        </div>
      </div>

      {/* Main Table Responsive Container */}
      <div className="overflow-x-auto border border-purple-100 rounded-xl">
        <table className="w-full text-xs text-left border-collapse">
          <thead>
            <tr className="bg-purple-950 text-white font-semibold uppercase text-[11px] tracking-wider">
              <th
                onClick={() => handleSort('id')}
                className="py-3 px-3.5 cursor-pointer hover:bg-purple-900 transition-colors"
              >
                <div className="flex items-center gap-1">
                  <span>รหัสบุคคล</span>
                  <ArrowUpDown className="w-3 h-3 text-purple-300" />
                </div>
              </th>
              <th
                onClick={() => handleSort('screeningDate')}
                className="py-3 px-3 cursor-pointer hover:bg-purple-900 transition-colors"
              >
                <div className="flex items-center gap-1">
                  <span>วันที่</span>
                  <ArrowUpDown className="w-3 h-3 text-purple-300" />
                </div>
              </th>
              <th
                onClick={() => handleSort('area')}
                className="py-3 px-3 cursor-pointer hover:bg-purple-900 transition-colors"
              >
                <div className="flex items-center gap-1">
                  <span>พื้นที่</span>
                  <ArrowUpDown className="w-3 h-3 text-purple-300" />
                </div>
              </th>
              <th className="py-3 px-3">เพศ/อายุ</th>
              <th
                onClick={() => handleSort('bmi')}
                className="py-3 px-3 cursor-pointer hover:bg-purple-900 transition-colors text-right"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>BMI (kg/m²)</span>
                  <ArrowUpDown className="w-3 h-3 text-purple-300" />
                </div>
              </th>
              <th
                onClick={() => handleSort('sbp')}
                className="py-3 px-3 cursor-pointer hover:bg-purple-900 transition-colors text-right"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>ความดัน (SBP/DBP)</span>
                  <ArrowUpDown className="w-3 h-3 text-purple-300" />
                </div>
              </th>
              <th
                onClick={() => handleSort('glucose')}
                className="py-3 px-3 cursor-pointer hover:bg-purple-900 transition-colors text-right"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>น้ำตาล (mg/dL)</span>
                  <ArrowUpDown className="w-3 h-3 text-purple-300" />
                </div>
              </th>
              <th className="py-3 px-3">พฤติกรรมเสี่ยง</th>
              <th
                onClick={() => handleSort('riskScore')}
                className="py-3 px-3 cursor-pointer hover:bg-purple-900 transition-colors text-center"
              >
                <div className="flex items-center justify-center gap-1">
                  <span>ระดับความเสี่ยง</span>
                  <ArrowUpDown className="w-3 h-3 text-purple-300" />
                </div>
              </th>
              <th className="py-3 px-3 text-center">จัดการ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-purple-50">
            {sortedList.length === 0 ? (
              <tr>
                <td colSpan={10} className="py-8 text-center text-slate-400">
                  ไม่พบข้อมูลตามเงื่อนไขตัวกรอง
                </td>
              </tr>
            ) : (
              sortedList.map(item => {
                // Conditional Formatting rules:
                // 1. BMI: >= 25 -> bold text dark purple-crimson, light purple background
                const isBmiHigh = item.bmi >= 25;
                const bmiCellClass = isBmiHigh
                  ? 'font-bold text-[#581c87] bg-purple-100/90'
                  : 'text-slate-800';

                // 2. Blood Pressure (SBP/DBP) risk shading:
                // Green = Normal (<120/80), Yellow = Pre-HT (120-139/80-89), Red = High (>=140/90)
                let bpCellClass = 'bg-emerald-50 text-emerald-900';
                if (item.bpCategory === 'ความดันสูง') {
                  bpCellClass = 'bg-red-100 text-red-900 font-semibold border border-red-200';
                } else if (item.bpCategory === 'เริ่มเสี่ยง') {
                  bpCellClass = 'bg-amber-50 text-amber-900';
                }

                // 3. Glucose risk shading:
                // Green = Normal (<100), Yellow = Pre-DM (100-125), Red = High (>=126)
                let glucoseCellClass = 'bg-emerald-50 text-emerald-900';
                if (item.glucoseCategory === 'สงสัยเบาหวาน') {
                  glucoseCellClass = 'bg-red-100 text-red-900 font-semibold border border-red-200';
                } else if (item.glucoseCategory === 'เริ่มเสี่ยง') {
                  glucoseCellClass = 'bg-amber-50 text-amber-900';
                }

                return (
                  <tr
                    key={item.id}
                    className="hover:bg-purple-50/40 transition-colors group cursor-default"
                  >
                    {/* ID */}
                    <td className="py-2.5 px-3.5 font-bold text-purple-950 font-['Plus_Jakarta_Sans',sans-serif]">
                      {item.id}
                    </td>

                    {/* Date */}
                    <td className="py-2.5 px-3 text-slate-600 whitespace-nowrap">
                      {formatThaiDate(item.screeningDate)}
                    </td>

                    {/* Area */}
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded bg-purple-50 text-purple-800 border border-purple-200 font-medium">
                        {item.area}
                      </span>
                    </td>

                    {/* Gender & Age */}
                    <td className="py-2.5 px-3 text-slate-700 whitespace-nowrap">
                      <span>{item.gender}</span>, <span>{item.age} ปี</span>
                    </td>

                    {/* BMI (Conditional Formatting applied) */}
                    <td className={`py-2.5 px-3 text-right font-['Plus_Jakarta_Sans',sans-serif] ${bmiCellClass}`}>
                      <div className="flex items-center justify-end gap-1.5">
                        <span>{item.bmi.toFixed(1)}</span>
                        {isBmiHigh && (
                          <span className="text-[9px] bg-[#581c87] text-white px-1.5 py-0.2 rounded uppercase font-sans">
                            {item.bmi >= 30 ? 'อ้วน 2' : 'อ้วน 1'}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Blood Pressure (Conditional Formatting applied) */}
                    <td className="py-2.5 px-3 text-right">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-['Plus_Jakarta_Sans',sans-serif] ${bpCellClass}`}>
                        {item.sbp}/{item.dbp} mmHg
                      </span>
                    </td>

                    {/* Glucose (Conditional Formatting applied) */}
                    <td className="py-2.5 px-3 text-right">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-['Plus_Jakarta_Sans',sans-serif] ${glucoseCellClass}`}>
                        {item.glucose} mg/dL
                      </span>
                    </td>

                    {/* Behavior Tags */}
                    <td className="py-2.5 px-3">
                      <div className="flex flex-wrap gap-1">
                        {item.exercise === 'ไม่ออกกำลังกาย' && (
                          <span className="bg-purple-100 text-purple-900 px-1.5 py-0.2 rounded text-[10px]">
                            ไม่ออกกำลัง
                          </span>
                        )}
                        {item.smoking === 'สูบ' && (
                          <span className="bg-slate-200 text-slate-800 px-1.5 py-0.2 rounded text-[10px]">
                            สูบบุหรี่
                          </span>
                        )}
                        {item.alcohol === 'ดื่ม' && (
                          <span className="bg-amber-100 text-amber-900 px-1.5 py-0.2 rounded text-[10px]">
                            ดื่มสุรา
                          </span>
                        )}
                        {item.exercise === 'สม่ำเสมอ' && item.smoking === 'ไม่สูบ' && item.alcohol === 'ไม่ดื่ม' && (
                          <span className="bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded text-[10px]">
                            พฤติกรรมดี
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Risk Score & Level */}
                    <td className="py-2.5 px-3 text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-semibold text-[11px] ${
                          item.riskLevel === 'สูง'
                            ? 'bg-red-600 text-white shadow-xs'
                            : item.riskLevel === 'ปานกลาง'
                            ? 'bg-amber-100 text-amber-900'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {item.riskLevel === 'สูง' && <AlertTriangle className="w-3 h-3 text-white" />}
                        <span>เสี่ยง{item.riskLevel}</span>
                        <span className="opacity-75">({item.riskScore} คะแนน)</span>
                      </span>
                    </td>

                    {/* Action Button: Health Passport Card */}
                    <td className="py-2.5 px-3 text-center">
                      <button
                        onClick={() => onSelectPatient(item)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-purple-50 text-purple-800 hover:bg-purple-700 hover:text-white border border-purple-200 transition-colors font-medium cursor-pointer"
                        title="ดูประวัติสุขภาพและการวินิจฉัยรายบุคคล"
                      >
                        <Eye className="w-3 h-3" />
                        <span>เปิดแฟ้ม</span>
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
