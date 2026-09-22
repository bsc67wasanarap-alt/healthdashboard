import React from 'react';
import { Filter, RotateCcw, Search, Users, MapPin, Gauge, HeartPulse, Calendar, X } from 'lucide-react';
import { FilterState, HealthRecord } from '../types';

interface FiltersBarProps {
  filters: FilterState;
  onFilterChange: (newFilters: FilterState) => void;
  onResetFilters: () => void;
  allRecords: HealthRecord[];
  filteredCount: number;
}

export const FiltersBar: React.FC<FiltersBarProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  allRecords,
  filteredCount
}) => {
  // Extract unique areas and months dynamically from dataset
  const uniqueAreas = Array.from(new Set(allRecords.map(r => r.area))).filter(Boolean);
  const uniqueMonths = Array.from(new Set(allRecords.map(r => r.month))).filter(Boolean).sort();

  const handleFieldChange = (field: keyof FilterState, value: string) => {
    onFilterChange({
      ...filters,
      [field]: value
    });
  };

  const isFiltered =
    filters.gender !== 'all' ||
    filters.ageGroup !== 'all' ||
    filters.area !== 'all' ||
    filters.bmiCategory !== 'all' ||
    filters.riskLevel !== 'all' ||
    filters.month !== 'all' ||
    filters.searchQuery.trim() !== '';

  return (
    <div className="bg-white border-b border-purple-100/90 py-3.5 px-4 sm:px-6 lg:px-8 shadow-xs">
      <div className="max-w-7xl mx-auto space-y-3">
        {/* Main Filter Row */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-bold text-purple-950 uppercase tracking-wider shrink-0">
            <Filter className="w-3.5 h-3.5 text-purple-700" />
            <span>ตัวกรองควบคุมทั้งหน้า (Global Filters):</span>
          </div>

          {/* Search Box */}
          <div className="relative w-full lg:w-64 shrink-0">
            <Search className="w-4 h-4 text-purple-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={filters.searchQuery}
              onChange={e => handleFieldChange('searchQuery', e.target.value)}
              placeholder="ค้นหารหัสบุคคล, พื้นที่..."
              className="w-full pl-9 pr-8 py-1.5 text-xs bg-purple-50/50 border border-purple-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all"
            />
            {filters.searchQuery && (
              <button
                onClick={() => handleFieldChange('searchQuery', '')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Dropdowns Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {/* 1. Gender */}
          <div>
            <label className="block text-[11px] font-semibold text-purple-900 mb-1 flex items-center gap-1">
              <Users className="w-3 h-3 text-purple-600" />
              <span>เพศ</span>
            </label>
            <select
              value={filters.gender}
              onChange={e => handleFieldChange('gender', e.target.value)}
              className="w-full text-xs py-1.5 px-2.5 bg-white border border-purple-200 rounded-lg text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="all">ทั้งหมด (ชาย-หญิง)</option>
              <option value="ชาย">ชาย</option>
              <option value="หญิง">หญิง</option>
            </select>
          </div>

          {/* 2. Age Group */}
          <div>
            <label className="block text-[11px] font-semibold text-purple-900 mb-1">
              ช่วงอายุ
            </label>
            <select
              value={filters.ageGroup}
              onChange={e => handleFieldChange('ageGroup', e.target.value)}
              className="w-full text-xs py-1.5 px-2.5 bg-white border border-purple-200 rounded-lg text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="all">ทุกช่วงอายุ</option>
              <option value="<30">ต่ำกว่า 30 ปี</option>
              <option value="30-44">30 - 44 ปี</option>
              <option value="45-59">45 - 59 ปี</option>
              <option value="60+">60 ปีขึ้นไป (สูงวัย)</option>
            </select>
          </div>

          {/* 3. Area */}
          <div>
            <label className="block text-[11px] font-semibold text-purple-900 mb-1 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-purple-600" />
              <span>พื้นที่ / จังหวัด</span>
            </label>
            <select
              value={filters.area}
              onChange={e => handleFieldChange('area', e.target.value)}
              className="w-full text-xs py-1.5 px-2.5 bg-white border border-purple-200 rounded-lg text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="all">ทุกพื้นที่ ({uniqueAreas.length} โซน)</option>
              {uniqueAreas.map(area => (
                <option key={area} value={area}>
                  โซน {area}
                </option>
              ))}
            </select>
          </div>

          {/* 4. BMI Criteria */}
          <div>
            <label className="block text-[11px] font-semibold text-purple-900 mb-1 flex items-center gap-1">
              <Gauge className="w-3 h-3 text-purple-600" />
              <span>ระดับเกณฑ์ BMI</span>
            </label>
            <select
              value={filters.bmiCategory}
              onChange={e => handleFieldChange('bmiCategory', e.target.value)}
              className="w-full text-xs py-1.5 px-2.5 bg-white border border-purple-200 rounded-lg text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="all">ทุกระดับ BMI</option>
              <option value="high_risk">⚠️ กลุ่มเสี่ยงสูง (อ้วน/อ้วนมาก ≥ 25)</option>
              <option value="underweight">น้ำหนักน้อย (&lt; 18.5)</option>
              <option value="normal">สมส่วน / สุขภาพดี (18.5 - 22.9)</option>
              <option value="overweight">น้ำหนักเกิน / ท้วม (23 - 24.9)</option>
              <option value="obese1">โรคอ้วนระดับ 1 (25 - 29.9)</option>
              <option value="obese2">โรคอ้วนระดับ 2 (≥ 30)</option>
            </select>
          </div>

          {/* 5. NCD Risk Level */}
          <div>
            <label className="block text-[11px] font-semibold text-purple-900 mb-1 flex items-center gap-1">
              <HeartPulse className="w-3 h-3 text-purple-600" />
              <span>ระดับความเสี่ยง NCDs</span>
            </label>
            <select
              value={filters.riskLevel}
              onChange={e => handleFieldChange('riskLevel', e.target.value)}
              className="w-full text-xs py-1.5 px-2.5 bg-white border border-purple-200 rounded-lg text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="all">ทุกระดับความเสี่ยง</option>
              <option value="ต่ำ">ความเสี่ยงต่ำ</option>
              <option value="ปานกลาง">ความเสี่ยงปานกลาง</option>
              <option value="สูง">ความเสี่ยงสูง</option>
            </select>
          </div>

          {/* 6. Screening Month */}
          <div>
            <label className="block text-[11px] font-semibold text-purple-900 mb-1 flex items-center gap-1">
              <Calendar className="w-3 h-3 text-purple-600" />
              <span>รอบเดือนคัดกรอง</span>
            </label>
            <select
              value={filters.month}
              onChange={e => handleFieldChange('month', e.target.value)}
              className="w-full text-xs py-1.5 px-2.5 bg-white border border-purple-200 rounded-lg text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="all">ทุกเดือนที่ประเมิน</option>
              {uniqueMonths.map(m => (
                <option key={m} value={m}>
                  เดือน {m}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Filter status strip & Clear button */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-purple-100/60 text-xs">
          <div className="flex items-center gap-2 text-slate-600">
            <span>แสดงผล:</span>
            <span className="font-bold text-purple-900 bg-purple-100/70 px-2 py-0.5 rounded text-xs">
              {filteredCount} จาก {allRecords.length} รายการ
            </span>
            {isFiltered && (
              <span className="text-[11px] text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                เปิดใช้งานตัวกรอง
              </span>
            )}
          </div>

          {isFiltered && (
            <button
              onClick={onResetFilters}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-purple-700 hover:text-purple-950 hover:bg-purple-100/60 rounded transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>ล้างตัวกรองทั้งหมด (Reset)</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
