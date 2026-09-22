import React from 'react';
import { Users, Scale, AlertOctagon, Activity, ShieldAlert } from 'lucide-react';
import { HealthSummaryMetrics } from '../types';

interface KpiCardsProps {
  metrics: HealthSummaryMetrics;
}

export const KpiCards: React.FC<KpiCardsProps> = ({ metrics }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-3.5 sm:gap-4">
      {/* Card 1: Total Assessed Count */}
      <div className="bg-white rounded-xl border border-purple-100 p-4 shadow-2xs hover:shadow-xs transition-shadow relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-1.5 h-full bg-purple-600 rounded-l-xl"></div>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold text-purple-900/80 uppercase tracking-wide">
              ผู้เข้ารับการประเมิน
            </p>
            <div className="flex items-baseline gap-1.5 mt-1.5">
              <span className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight font-['Plus_Jakarta_Sans',sans-serif]">
                {metrics.totalCount}
              </span>
              <span className="text-xs font-medium text-slate-500">คน</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-700 group-hover:bg-purple-600 group-hover:text-white transition-colors">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="mt-3 pt-2.5 border-t border-purple-50 flex items-center justify-between text-[11px] text-slate-600">
          <span>ชาย: <strong className="text-purple-900">{metrics.maleCount}</strong> ({metrics.malePercent}%)</span>
          <span className="text-purple-300">•</span>
          <span>หญิง: <strong className="text-purple-900">{metrics.femaleCount}</strong> ({metrics.femalePercent}%)</span>
        </div>
      </div>

      {/* Card 2: Average BMI */}
      <div className="bg-white rounded-xl border border-purple-100 p-4 shadow-2xs hover:shadow-xs transition-shadow relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-1.5 h-full bg-violet-600 rounded-l-xl"></div>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold text-purple-900/80 uppercase tracking-wide">
              ค่าเฉลี่ยดัชนีมวลกาย (BMI)
            </p>
            <div className="flex items-baseline gap-1.5 mt-1.5">
              <span className="text-2xl sm:text-3xl font-bold text-violet-900 tracking-tight font-['Plus_Jakarta_Sans',sans-serif]">
                {metrics.avgBmi}
              </span>
              <span className="text-xs font-medium text-slate-500">kg/m²</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center text-violet-700 group-hover:bg-violet-600 group-hover:text-white transition-colors">
            <Scale className="w-5 h-5" />
          </div>
        </div>

        <div className="mt-3 pt-2.5 border-t border-purple-50 flex items-center justify-between text-[11px]">
          <span className="text-slate-500">
            ช่วง: <strong className="text-slate-700">{metrics.minBmi} - {metrics.maxBmi}</strong>
          </span>
          <span className={`px-2 py-0.5 rounded-full font-semibold ${
            metrics.avgBmi >= 25 
              ? 'bg-purple-100 text-purple-900' 
              : metrics.avgBmi >= 23 
              ? 'bg-amber-50 text-amber-800' 
              : 'bg-emerald-50 text-emerald-800'
          }`}>
            {metrics.avgBmi >= 25 ? 'เกณฑ์โรคอ้วน' : metrics.avgBmi >= 23 ? 'เริ่มท้วม' : 'สมส่วน'}
          </span>
        </div>
      </div>

      {/* Card 3: High Risk BMI (Obese/Obese Level 2) >= 25 */}
      <div className="bg-white rounded-xl border border-purple-100 p-4 shadow-2xs hover:shadow-xs transition-shadow relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-1.5 h-full bg-purple-700 rounded-l-xl"></div>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold text-purple-900/80 uppercase tracking-wide">
              กลุ่มเสี่ยงสูง (อ้วน/อ้วนมาก)
            </p>
            <div className="flex items-baseline gap-1.5 mt-1.5">
              <span className="text-2xl sm:text-3xl font-bold text-purple-950 tracking-tight font-['Plus_Jakarta_Sans',sans-serif]">
                {metrics.obesePercent}%
              </span>
              <span className="text-xs font-medium text-slate-500">
                ({metrics.obeseCount}/{metrics.totalCount} คน)
              </span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-700 group-hover:bg-purple-700 group-hover:text-white transition-colors">
            <AlertOctagon className="w-5 h-5" />
          </div>
        </div>

        <div className="mt-3 pt-2.5 border-t border-purple-50 flex items-center justify-between text-[11px] text-slate-600">
          <span>เกณฑ์: <strong>BMI ≥ 25.0</strong></span>
          <span className="text-purple-800 font-semibold bg-purple-50 px-2 py-0.5 rounded">
            ต้องควบคุมน้ำหนัก
          </span>
        </div>
      </div>

      {/* Card 4: Blood Pressure & Glucose Min-Max */}
      <div className="bg-white rounded-xl border border-purple-100 p-4 shadow-2xs hover:shadow-xs transition-shadow relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-1.5 h-full bg-indigo-600 rounded-l-xl"></div>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold text-purple-900/80 uppercase tracking-wide">
              ความดัน & น้ำตาล (Min - Max)
            </p>
            <div className="mt-1 space-y-1">
              <div className="flex items-baseline gap-1">
                <span className="text-xs font-semibold text-slate-500">BP:</span>
                <span className="text-sm font-bold text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
                  {metrics.sbpMin}/{metrics.dbpMin} - {metrics.sbpMax}/{metrics.dbpMax}
                </span>
                <span className="text-[10px] text-slate-400">mmHg</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-xs font-semibold text-slate-500">GLU:</span>
                <span className="text-sm font-bold text-indigo-900 font-['Plus_Jakarta_Sans',sans-serif]">
                  {metrics.glucoseMin} - {metrics.glucoseMax}
                </span>
                <span className="text-[10px] text-slate-400">mg/dL</span>
              </div>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-700 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
            <Activity className="w-5 h-5" />
          </div>
        </div>

        <div className="mt-2 pt-2 border-t border-purple-50 flex items-center justify-between text-[11px] text-slate-600">
          <span>เฉลี่ย BP: {metrics.sbpAvg}/{metrics.dbpAvg}</span>
          <span className="text-purple-300">•</span>
          <span>เฉลี่ย GLU: {metrics.glucoseAvg}</span>
        </div>
      </div>

      {/* Card 5: Overall High NCD Risk */}
      <div className="bg-white rounded-xl border border-red-100 p-4 shadow-2xs hover:shadow-xs transition-shadow relative overflow-hidden group sm:col-span-2 lg:col-span-4 xl:col-span-1">
        <div className="absolute top-0 left-0 w-1.5 h-full bg-red-600 rounded-l-xl"></div>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold text-red-900/80 uppercase tracking-wide">
              กลุ่มเสี่ยง NCDs สูง (High Risk)
            </p>
            <div className="flex items-baseline gap-1.5 mt-1.5">
              <span className="text-2xl sm:text-3xl font-bold text-red-600 tracking-tight font-['Plus_Jakarta_Sans',sans-serif]">
                {metrics.highRiskCount}
              </span>
              <span className="text-xs font-medium text-slate-500">
                คน ({metrics.highRiskPercent}%)
              </span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-red-600 group-hover:bg-red-600 group-hover:text-white transition-colors">
            <ShieldAlert className="w-5 h-5" />
          </div>
        </div>

        <div className="mt-3 pt-2.5 border-t border-purple-50 flex items-center justify-between text-[11px]">
          <span className="text-slate-500">คะแนนเฉลี่ย: <strong>{metrics.avgRiskScore}</strong> / 7</span>
          <span className="text-red-700 font-semibold bg-red-50 border border-red-200 px-2 py-0.5 rounded text-[10px]">
            นัดตรวจสุขภาพด่วน
          </span>
        </div>
      </div>
    </div>
  );
};
