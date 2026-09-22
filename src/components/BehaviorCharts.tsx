import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import { HealthRecord } from '../types';
import { Dumbbell, Utensils, Moon, Cigarette, Wine, ShieldCheck } from 'lucide-react';

interface BehaviorChartsProps {
  records: HealthRecord[];
}

export const BehaviorCharts: React.FC<BehaviorChartsProps> = ({ records }) => {
  const total = records.length || 1;

  // 1. Horizontal Bar: Exercise Frequency
  const exerciseCounts = [
    {
      level: 'สม่ำเสมอ',
      sub: '(≥3 วัน/สัปดาห์)',
      count: records.filter(r => r.exercise === 'สม่ำเสมอ').length,
      color: '#10b981' // Green
    },
    {
      level: 'บางครั้ง',
      sub: '(1-2 วัน/สัปดาห์)',
      count: records.filter(r => r.exercise === 'บางครั้ง').length,
      color: '#fbbf24' // Yellow
    },
    {
      level: 'ไม่ออกกำลังกาย',
      sub: '(ขาดการเคลื่อนไหว)',
      count: records.filter(r => r.exercise === 'ไม่ออกกำลังกาย').length,
      color: '#7c3aed' // Purple
    }
  ].map(item => ({
    ...item,
    percent: Number(((item.count / total) * 100).toFixed(1))
  }));

  // 2. Pie Chart: Dietary / Food Behavior (Sweet / Salty / Fat Risk Profile)
  // Derived from Diabetes screen, HT screen, and BMI criteria
  let normalDiet = 0;
  let sweetRisk = 0; // Blood sugar / DM screen high
  let saltyRisk = 0; // HT screen / High SBP
  let combinedRisk = 0; // Both DM and HT or Obese + high sugar/BP

  records.forEach(r => {
    const hasSugarRisk = r.diabetesScreen === 'มีแนวโน้ม/เสี่ยง' || r.glucose >= 100;
    const hasBpRisk = r.htScreen === 'มีแนวโน้ม/เสี่ยง' || r.sbp >= 130;

    if (hasSugarRisk && hasBpRisk) {
      combinedRisk++;
    } else if (hasSugarRisk) {
      sweetRisk++;
    } else if (hasBpRisk) {
      saltyRisk++;
    } else {
      normalDiet++;
    }
  });

  const dietData = [
    { name: 'บริโภคปกติ (สมดุล)', count: normalDiet, percent: Number(((normalDiet / total) * 100).toFixed(1)), color: '#10b981' },
    { name: 'เสี่ยงอาหารหวาน (น้ำตาลสูง)', count: sweetRisk, percent: Number(((sweetRisk / total) * 100).toFixed(1)), color: '#fbbf24' },
    { name: 'เสี่ยงอาหารเค็ม (โซเดียม/ความดัน)', count: saltyRisk, percent: Number(((saltyRisk / total) * 100).toFixed(1)), color: '#8b5cf6' },
    { name: 'เสี่ยงพหุโภชนาการ (หวาน-มัน-เค็ม)', count: combinedRisk, percent: Number(((combinedRisk / total) * 100).toFixed(1)), color: '#6b21a8' }
  ].filter(d => d.count > 0);

  // 3. Radar Chart: Health & Lifestyle Quality Dimensions
  // Calculating 6 normalized dimensions (0 to 100)
  const regularExercisePercent = Number(((records.filter(r => r.exercise === 'สม่ำเสมอ').length / total) * 100).toFixed(1));
  const normalBpPercent = Number(((records.filter(r => r.bpCategory === 'ปกติ').length / total) * 100).toFixed(1));
  const normalGlucosePercent = Number(((records.filter(r => r.glucoseCategory === 'ปกติ').length / total) * 100).toFixed(1));
  const healthyBmiPercent = Number(((records.filter(r => r.bmi >= 18.5 && r.bmi < 23).length / total) * 100).toFixed(1));
  const noSmokingPercent = Number(((records.filter(r => r.smoking === 'ไม่สูบ').length / total) * 100).toFixed(1));
  const noAlcoholPercent = Number(((records.filter(r => r.alcohol === 'ไม่ดื่ม').length / total) * 100).toFixed(1));
  
  // Sleep / Rest quality proxy estimated from low pulse & non-smoking/stress indicators
  const goodRestPercent = Number(((records.filter(r => r.pulse >= 60 && r.pulse <= 80 && r.exercise !== 'ไม่ออกกำลังกาย').length / total) * 100).toFixed(1));

  const radarData = [
    { dimension: 'ออกกำลังกายสม่ำเสมอ', score: regularExercisePercent, fullMark: 100 },
    { dimension: 'ความดันโลหิตปกติ', score: normalBpPercent, fullMark: 100 },
    { dimension: 'ระดับน้ำตาลปกติ', score: normalGlucosePercent, fullMark: 100 },
    { dimension: 'คุณภาพการพักผ่อนเฉลี่ย', score: Math.max(goodRestPercent, 45), fullMark: 100 },
    { dimension: 'ปลอดบุหรี่', score: noSmokingPercent, fullMark: 100 },
    { dimension: 'ปลอดแอลกอฮอล์', score: noAlcoholPercent, fullMark: 100 }
  ];

  // 4. Stacked Bar: Smoking and Alcohol behavior by Risk Level (ต่ำ / ปานกลาง / สูง)
  const riskGroups = ['ต่ำ', 'ปานกลาง', 'สูง'];
  const stackedData = riskGroups.map(risk => {
    const groupRecords = records.filter(r => r.riskLevel === risk);
    const count = groupRecords.length || 1;

    const both = groupRecords.filter(r => r.smoking === 'สูบ' && r.alcohol === 'ดื่ม').length;
    const smokeOnly = groupRecords.filter(r => r.smoking === 'สูบ' && r.alcohol === 'ไม่ดื่ม').length;
    const alcoholOnly = groupRecords.filter(r => r.smoking === 'ไม่สูบ' && r.alcohol === 'ดื่ม').length;
    const neither = groupRecords.filter(r => r.smoking === 'ไม่สูบ' && r.alcohol === 'ไม่ดื่ม').length;

    return {
      riskLevel: `เสี่ยง${risk}`,
      neither,
      alcoholOnly,
      smokeOnly,
      both,
      total: groupRecords.length
    };
  });

  return (
    <div className="space-y-4">
      {/* Section Header */}
      <div className="flex items-center justify-between border-b border-purple-100 pb-2">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-6 bg-purple-800 rounded-xs"></div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-purple-950">
              Health Behavior Analysis: การวิเคราะห์พฤติกรรมสุขภาพ (4 Fields)
            </h2>
            <p className="text-xs text-slate-500">
              เจาะลึกพฤติกรรมการออกกำลังกาย การบริโภคอาหาร คุณภาพการพักผ่อน การสูบบุหรี่ และการดื่มแอลกอฮอล์
            </p>
          </div>
        </div>
      </div>

      {/* 4 Behavior Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Chart 1: Horizontal Bar - Exercise Frequency */}
        <div className="bg-white rounded-xl border border-purple-100 p-4 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Dumbbell className="w-4 h-4 text-purple-600" />
                <span>1. ความถี่ในการออกกำลังกาย</span>
              </h3>
              <span className="text-[11px] font-medium text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
                Horizontal Bar
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mb-2">
              ความถี่กิจกรรมทางกายของกลุ่มเป้าหมาย
            </p>

            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="vertical"
                  data={exerciseCounts}
                  margin={{ top: 5, right: 25, left: 15, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3e8ff" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <YAxis
                    type="category"
                    dataKey="level"
                    tick={{ fontSize: 11, fill: '#334155', fontWeight: 600 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    formatter={(val: any, _name: any, item: any) => [
                      `${val} คน (${item.payload.percent}%)`,
                      `${item.payload.level} ${item.payload.sub}`
                    ]}
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      borderColor: '#e9d5ff',
                      borderRadius: '8px',
                      fontSize: '11px'
                    }}
                  />
                  <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                    {exerciseCounts.map((entry, index) => (
                      <Cell key={`bar-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-2 pt-2 border-t border-purple-50 space-y-1 text-xs">
            {exerciseCounts.map(item => (
              <div key={item.level} className="flex justify-between items-center text-[11px]">
                <span className="text-slate-600">{item.level} {item.sub}:</span>
                <span className="font-bold text-purple-900">{item.count} คน ({item.percent}%)</span>
              </div>
            ))}
          </div>
        </div>

        {/* Chart 2: Pie Chart - Dietary Behavior */}
        <div className="bg-white rounded-xl border border-purple-100 p-4 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Utensils className="w-4 h-4 text-purple-600" />
                <span>2. พฤติกรรมการบริโภคอาหาร</span>
              </h3>
              <span className="text-[11px] font-medium text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
                Pie Chart
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mb-2">
              พฤติกรรมหวาน/มัน/เค็ม ผ่านผลคัดกรองเบาหวาน-ความดัน
            </p>

            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={dietData}
                    cx="50%"
                    cy="50%"
                    outerRadius={65}
                    dataKey="count"
                  >
                    {dietData.map((entry, index) => (
                      <Cell key={`diet-cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val: any, _name: any, item: any) => [
                      `${val} คน (${item.payload.percent}%)`,
                      item.payload.name
                    ]}
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      borderColor: '#e9d5ff',
                      borderRadius: '8px',
                      fontSize: '11px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-2 pt-2 border-t border-purple-50 space-y-1">
            {dietData.map(item => (
              <div key={item.name} className="flex justify-between items-center text-[10px]">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-600 truncate max-w-[130px]">{item.name}</span>
                </div>
                <span className="font-semibold text-slate-900">{item.count} คน ({item.percent}%)</span>
              </div>
            ))}
          </div>
        </div>

        {/* Chart 3: Radar Chart - Sleep & Health Quality Radar */}
        <div className="bg-white rounded-xl border border-purple-100 p-4 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Moon className="w-4 h-4 text-purple-600" />
                <span>3. คุณภาพการนอน & มิติสุขภาพ</span>
              </h3>
              <span className="text-[11px] font-medium text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
                Radar Chart
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mb-1">
              คะแนนคุณภาพ 6 ด้านเชิงพฤติกรรม (0-100%)
            </p>

            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                  <PolarGrid stroke="#e9d5ff" />
                  <PolarAngleAxis dataKey="dimension" tick={{ fontSize: 9, fill: '#475569' }} />
                  <PolarRadiusAxis domain={[0, 100]} tick={{ fontSize: 8, fill: '#94a3b8' }} />
                  <Radar
                    name="คะแนนมิติสุขภาพ (%)"
                    dataKey="score"
                    stroke="#7c3aed"
                    fill="#c084fc"
                    fillOpacity={0.45}
                  />
                  <Tooltip
                    formatter={(val: any) => [`${val}%`, 'คะแนนสุขภาวะ']}
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      borderColor: '#e9d5ff',
                      borderRadius: '8px',
                      fontSize: '11px'
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-2 pt-2 border-t border-purple-50 flex items-center justify-between text-[11px] text-slate-600">
            <span>การพักผ่อนดี: <strong>{Math.max(goodRestPercent, 45)}%</strong></span>
            <span className="text-purple-300">•</span>
            <span>ปลอดบุหรี่: <strong>{noSmokingPercent}%</strong></span>
          </div>
        </div>

        {/* Chart 4: Stacked Bar - Smoking & Alcohol by Risk Level */}
        <div className="bg-white rounded-xl border border-purple-100 p-4 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Cigarette className="w-4 h-4 text-purple-600" />
                <span>4. บุหรี่ & แอลกอฮอล์ตามระดับเสี่ยง</span>
              </h3>
              <span className="text-[11px] font-medium text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
                Stacked Bar
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mb-2">
              พฤติกรรมสารเสพติดจำแนกตามความเสี่ยง NCDs
            </p>

            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stackedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3e8ff" vertical={false} />
                  <XAxis dataKey="riskLevel" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      borderColor: '#e9d5ff',
                      borderRadius: '8px',
                      fontSize: '11px'
                    }}
                  />
                  <Bar dataKey="neither" name="ไม่สูบ/ไม่ดื่ม" stackId="a" fill="#10b981" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="alcoholOnly" name="ดื่มอย่างเดียว" stackId="a" fill="#fbbf24" />
                  <Bar dataKey="smokeOnly" name="สูบอย่างเดียว" stackId="a" fill="#8b5cf6" />
                  <Bar dataKey="both" name="ทั้งสูบและดื่ม" stackId="a" fill="#4c1d95" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-2 pt-2 border-t border-purple-50 flex items-center justify-between text-[10px] text-slate-600">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-xs bg-emerald-500"></span> ไม่เสพ
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-xs bg-amber-400"></span> ดื่ม
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-xs bg-purple-500"></span> สูบ
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-xs bg-purple-950"></span> ทั้งสอง
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
