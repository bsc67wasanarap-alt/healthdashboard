import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { HealthRecord, HealthSummaryMetrics } from '../types';
import { BMI_CATEGORIES } from '../utils/healthCalculations';
import { Activity, Heart, Droplets, ShieldAlert, Info } from 'lucide-react';

interface RiskChartsProps {
  records: HealthRecord[];
  metrics: HealthSummaryMetrics;
}

export const RiskCharts: React.FC<RiskChartsProps> = ({ records, metrics }) => {
  // 1. BMI Donut Data
  const bmiCounts = BMI_CATEGORIES.map(cat => {
    const count = records.filter(r => r.bmiCategoryKey === cat.key).length;
    const percent = records.length > 0 ? Number(((count / records.length) * 100).toFixed(1)) : 0;
    return {
      name: cat.label,
      range: cat.rangeLabel,
      key: cat.key,
      value: count,
      percent,
      color: cat.color
    };
  }).filter(c => c.value > 0);

  // 2. Blood Pressure Risk Bar Data
  const bpCategories = [
    {
      category: 'ปกติ',
      label: 'ปกติ (<120/80)',
      count: records.filter(r => r.bpCategory === 'ปกติ').length,
      color: '#10b981'
    },
    {
      category: 'เริ่มเสี่ยง',
      label: 'เริ่มเสี่ยง (120-139)',
      count: records.filter(r => r.bpCategory === 'เริ่มเสี่ยง').length,
      color: '#fbbf24'
    },
    {
      category: 'ความดันสูง',
      label: 'ความดันสูง (≥140)',
      count: records.filter(r => r.bpCategory === 'ความดันสูง').length,
      color: '#ef4444'
    }
  ];

  // 3. Blood Sugar Risk Bar Data
  const glucoseCategories = [
    {
      category: 'ปกติ',
      label: 'ปกติ (<100 mg/dL)',
      count: records.filter(r => r.glucoseCategory === 'ปกติ').length,
      color: '#10b981'
    },
    {
      category: 'เริ่มเสี่ยง',
      label: 'เริ่มเสี่ยง (100-125)',
      count: records.filter(r => r.glucoseCategory === 'เริ่มเสี่ยง').length,
      color: '#fbbf24'
    },
    {
      category: 'สงสัยเบาหวาน',
      label: 'สงสัยเบาหวาน (≥126)',
      count: records.filter(r => r.glucoseCategory === 'สงสัยเบาหวาน').length,
      color: '#ef4444'
    }
  ];

  // 4. Overall NCD Risk Gauge Data & Angle
  const total = records.length || 1;
  const lowRiskCount = records.filter(r => r.riskLevel === 'ต่ำ').length;
  const medRiskCount = records.filter(r => r.riskLevel === 'ปานกลาง').length;
  const highRiskCount = records.filter(r => r.riskLevel === 'สูง').length;

  // Gauge calculation: max risk score is 7, average score
  const avgScore = metrics.avgRiskScore || 0;
  const gaugePercent = Math.min(100, Math.max(0, (avgScore / 7) * 100));
  // Needle rotation from -90 to +90 degrees
  const needleAngle = -90 + (gaugePercent / 100) * 180;

  return (
    <div className="space-y-4">
      {/* Section Header */}
      <div className="flex items-center justify-between border-b border-purple-100 pb-2">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-6 bg-purple-700 rounded-xs"></div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-purple-950">
              Health Risk Analysis: การวิเคราะห์ความเสี่ยงสุขภาพ (4 Fields)
            </h2>
            <p className="text-xs text-slate-500">
              ประเมินความเสี่ยงดัชนีมวลกาย ความดันโลหิต น้ำตาลในเลือด และภาพรวม NCDs ตามเกณฑ์สาธารณสุข
            </p>
          </div>
        </div>
        <span className="hidden sm:inline-flex text-xs font-semibold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full border border-purple-200">
          กลุ่มเป้าหมาย {records.length} ราย
        </span>
      </div>

      {/* 4 Risk Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Chart 1: Donut Chart - BMI Risk Breakdown */}
        <div className="bg-white rounded-xl border border-purple-100 p-4 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-purple-600"></span>
                <span>1. สัดส่วนระดับความเสี่ยง BMI</span>
              </h3>
              <span className="text-[11px] font-medium text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
                Donut Chart
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mb-2">
              การกระจายตัวตามเกณฑ์คนเอเชีย (Asian BMI)
            </p>

            <div className="h-44 w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={bmiCounts}
                    innerRadius={45}
                    outerRadius={68}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {bmiCounts.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: any, name: any, item: any) => [
                      `${value} คน (${item.payload.percent}%)`,
                      `${item.payload.name} (${item.payload.range})`
                    ]}
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      borderColor: '#e9d5ff',
                      borderRadius: '8px',
                      fontSize: '11px',
                      boxShadow: '0 2px 8px rgba(107, 33, 168, 0.1)'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xs font-semibold text-slate-400">BMI เฉลี่ย</span>
                <span className="text-base font-bold text-purple-950 font-['Plus_Jakarta_Sans',sans-serif]">
                  {metrics.avgBmi}
                </span>
              </div>
            </div>
          </div>

          {/* Legend Items */}
          <div className="mt-2 pt-2 border-t border-purple-50 space-y-1">
            {bmiCounts.map(item => (
              <div key={item.key} className="flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-700 truncate max-w-[130px]">{item.name}</span>
                </div>
                <span className="font-semibold text-slate-900">
                  {item.value} คน <span className="text-slate-400 font-normal">({item.percent}%)</span>
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Chart 2: Bar Chart - Blood Pressure Risk */}
        <div className="bg-white rounded-xl border border-purple-100 p-4 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Heart className="w-4 h-4 text-purple-600" />
                <span>2. ระดับความเสี่ยงความดันโลหิต</span>
              </h3>
              <span className="text-[11px] font-medium text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
                Bar Chart
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mb-2">
              เกณฑ์ SBP/DBP มิลลิเมตรปรอท (mmHg)
            </p>

            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={bpCategories} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3e8ff" vertical={false} />
                  <XAxis dataKey="category" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip
                    formatter={(val: any, _name: any, item: any) => [
                      `${val} คน (${Number(((Number(val) / total) * 100).toFixed(1))}%)`,
                      item.payload.label
                    ]}
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      borderColor: '#e9d5ff',
                      borderRadius: '8px',
                      fontSize: '11px'
                    }}
                  />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                    {bpCategories.map((entry, index) => (
                      <Cell key={`bp-cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-2 pt-2 border-t border-purple-50 flex items-center justify-between text-[11px] text-slate-600">
            <span>ความดันสูง (≥140):</span>
            <span className="font-bold text-red-600">
              {bpCategories[2].count} คน ({Number(((bpCategories[2].count / total) * 100).toFixed(1))}%)
            </span>
          </div>
        </div>

        {/* Chart 3: Bar Chart - Blood Sugar Risk */}
        <div className="bg-white rounded-xl border border-purple-100 p-4 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Droplets className="w-4 h-4 text-purple-600" />
                <span>3. ระดับความเสี่ยงน้ำตาลในเลือด</span>
              </h3>
              <span className="text-[11px] font-medium text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
                Bar Chart
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mb-2">
              ระดับน้ำตาลอดอาหาร Fasting Glucose (mg/dL)
            </p>

            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={glucoseCategories} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3e8ff" vertical={false} />
                  <XAxis dataKey="category" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip
                    formatter={(val: any, _name: any, item: any) => [
                      `${val} คน (${Number(((Number(val) / total) * 100).toFixed(1))}%)`,
                      item.payload.label
                    ]}
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      borderColor: '#e9d5ff',
                      borderRadius: '8px',
                      fontSize: '11px'
                    }}
                  />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                    {glucoseCategories.map((entry, index) => (
                      <Cell key={`glu-cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-2 pt-2 border-t border-purple-50 flex items-center justify-between text-[11px] text-slate-600">
            <span>สงสัยเบาหวาน (≥126):</span>
            <span className="font-bold text-red-600">
              {glucoseCategories[2].count} คน ({Number(((glucoseCategories[2].count / total) * 100).toFixed(1))}%)
            </span>
          </div>
        </div>

        {/* Chart 4: Minimalist Gauge Chart - Overall NCD Risk Score */}
        <div className="bg-white rounded-xl border border-purple-100 p-4 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-purple-700" />
                <span>4. ภาพรวมความเสี่ยงต่อโรค NCDs</span>
              </h3>
              <span className="text-[11px] font-medium text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
                Gauge Chart
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mb-1">
              คะแนนความเสี่ยงสะสมรวม (ระดับ 0 - 7)
            </p>

            {/* Custom Modern SVG Semi-circle Gauge */}
            <div className="h-44 w-full flex flex-col items-center justify-center relative">
              <svg viewBox="0 0 200 120" className="w-48 h-28 overflow-visible">
                {/* Arc Track - Background */}
                <path
                  d="M 20 105 A 80 80 0 0 1 180 105"
                  fill="none"
                  stroke="#f3e8ff"
                  strokeWidth="16"
                  strokeLinecap="round"
                />
                {/* Arc Segments: Low (Green), Med (Yellow), High (Purple) */}
                {/* Low risk zone (0 - 2 score: ~30%) */}
                <path
                  d="M 20 105 A 80 80 0 0 1 65 37"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="16"
                  strokeLinecap="round"
                  opacity={0.85}
                />
                {/* Medium risk zone (2 - 4 score) */}
                <path
                  d="M 68 35 A 80 80 0 0 1 132 35"
                  fill="none"
                  stroke="#fbbf24"
                  strokeWidth="16"
                  opacity={0.85}
                />
                {/* High risk zone (4 - 7 score) */}
                <path
                  d="M 135 37 A 80 80 0 0 1 180 105"
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="16"
                  strokeLinecap="round"
                  opacity={0.95}
                />

                {/* Gauge Needle */}
                <g transform={`rotate(${needleAngle}, 100, 105)`} className="transition-transform duration-700 ease-out">
                  <line
                    x1="100"
                    y1="105"
                    x2="100"
                    y2="34"
                    stroke="#3b0764"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                  <circle cx="100" cy="105" r="7" fill="#3b0764" />
                  <circle cx="100" cy="105" r="3" fill="#ffffff" />
                </g>

                {/* Min / Max Labels */}
                <text x="20" y="122" fontSize="9" fill="#64748b" textAnchor="middle" fontWeight="bold">0 (ต่ำ)</text>
                <text x="100" y="20" fontSize="9" fill="#64748b" textAnchor="middle" fontWeight="bold">กลาง</text>
                <text x="180" y="122" fontSize="9" fill="#64748b" textAnchor="middle" fontWeight="bold">7 (สูง)</text>
              </svg>

              {/* Value Indicator beneath the gauge */}
              <div className="text-center mt-1">
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-xs text-slate-500 font-medium">คะแนนเฉลี่ย:</span>
                  <span className="text-lg font-bold text-purple-950 font-['Plus_Jakarta_Sans',sans-serif]">
                    {metrics.avgRiskScore}
                  </span>
                  <span className="text-xs text-slate-400">/ 7</span>
                </div>
                <div className={`text-[11px] font-semibold ${metrics.avgRiskScore >= 4 ? 'text-red-700' : metrics.avgRiskScore >= 2 ? 'text-amber-700' : 'text-emerald-700'}`}>
                  {metrics.avgRiskScore >= 4 ? 'อยู่ในเกณฑ์ความเสี่ยงสูง' : metrics.avgRiskScore >= 2 ? 'ความเสี่ยงปานกลาง' : 'ความเสี่ยงต่ำ'}
                </div>
              </div>
            </div>
          </div>

          {/* Risk Level Distribution Strip */}
          <div className="mt-2 pt-2 border-t border-purple-50 grid grid-cols-3 gap-1 text-[10px] text-center">
            <div className="bg-emerald-50 text-emerald-800 rounded py-1 font-medium">
              ต่ำ: <strong>{lowRiskCount}</strong>
            </div>
            <div className="bg-amber-50 text-amber-800 rounded py-1 font-medium">
              กลาง: <strong>{medRiskCount}</strong>
            </div>
            <div className="bg-red-50 text-red-700 border border-red-200 rounded py-1 font-bold">
              สูง: <strong>{highRiskCount}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
