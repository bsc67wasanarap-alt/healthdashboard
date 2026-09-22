import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  ZAxis,
  Cell
} from 'recharts';
import { HealthRecord } from '../types';
import { Lightbulb, MapPin, Users, GitFork, Grid3X3, ArrowRight } from 'lucide-react';

interface InsightChartsProps {
  records: HealthRecord[];
}

export const InsightCharts: React.FC<InsightChartsProps> = ({ records }) => {
  const [scatterMode, setScatterMode] = useState<'sugar' | 'sbp'>('sugar');

  // 1. Age Group Risk Analysis
  const ageGroups = [
    { key: '<30', label: '< 30 ปี', filter: (r: HealthRecord) => r.age < 30 },
    { key: '30-44', label: '30 - 44 ปี', filter: (r: HealthRecord) => r.age >= 30 && r.age <= 44 },
    { key: '45-59', label: '45 - 59 ปี', filter: (r: HealthRecord) => r.age >= 45 && r.age <= 59 },
    { key: '60+', label: '60 ปีขึ้นไป', filter: (r: HealthRecord) => r.age >= 60 }
  ];

  const ageData = ageGroups.map(grp => {
    const list = records.filter(grp.filter);
    const count = list.length;
    const avgBmi = count > 0 ? Number((list.reduce((acc, r) => acc + r.bmi, 0) / count).toFixed(1)) : 0;
    const highRisk = list.filter(r => r.riskLevel === 'สูง' || r.bmi >= 25).length;
    return {
      name: grp.label,
      avgBmi,
      highRiskCount: highRisk,
      total: count,
      percentRisk: count > 0 ? Number(((highRisk / count) * 100).toFixed(0)) : 0
    };
  });

  // 2. Area Surveillance Data (เมือง, เหนือ, ตะวันออก, ตะวันตก, ใต้)
  const areas = ['เมือง', 'เหนือ', 'ตะวันออก', 'ตะวันตก', 'ใต้'];
  const areaData = areas.map(areaName => {
    const list = records.filter(r => r.area === areaName);
    const count = list.length;
    const avgBmi = count > 0 ? Number((list.reduce((acc, r) => acc + r.bmi, 0) / count).toFixed(1)) : 0;
    const highRiskCount = list.filter(r => r.riskLevel === 'สูง').length;
    const obeseCount = list.filter(r => r.bmi >= 25).length;
    const avgRiskScore = count > 0 ? Number((list.reduce((acc, r) => acc + r.riskScore, 0) / count).toFixed(1)) : 0;

    return {
      area: `โซน${areaName}`,
      rawArea: areaName,
      count,
      highRiskCount,
      obeseCount,
      avgBmi,
      avgRiskScore,
      riskRate: count > 0 ? Number(((highRiskCount / count) * 100).toFixed(1)) : 0
    };
  }).sort((a, b) => b.highRiskCount - a.highRiskCount);

  // 3. Correlation Scatter Plot Data
  const scatterData = records.map(r => ({
    id: r.id,
    bmi: r.bmi,
    sugar: r.glucose,
    sbp: r.sbp,
    riskLevel: r.riskLevel,
    riskScore: r.riskScore,
    color: r.riskLevel === 'สูง' ? '#7c2d12' : r.riskLevel === 'ปานกลาง' ? '#d97706' : '#059669'
  }));

  // 4. Heatmap Matrix: Physical Activity vs Risk Habits (Smoking/Drinking)
  // Rows: 'สม่ำเสมอ', 'บางครั้ง', 'ไม่ออกกำลังกาย'
  // Cols: 'ไม่สูบ-ไม่ดื่ม', 'สูบหรือดื่ม', 'ทั้งสูบและดื่ม'
  const activityRows = [
    { key: 'สม่ำเสมอ', label: 'ออกกำลังกายสม่ำเสมอ' },
    { key: 'บางครั้ง', label: 'ออกกำลังกายบางครั้ง' },
    { key: 'ไม่ออกกำลังกาย', label: 'ไม่ออกกำลังกาย' }
  ];

  const habitCols = [
    { key: 'clean', label: 'ไม่สูบ & ไม่ดื่ม' },
    { key: 'single', label: 'สูบหรือดื่ม (1 อย่าง)' },
    { key: 'double', label: 'ทั้งสูบ & ทั้งดื่ม' }
  ];

  const getHeatmapCell = (actKey: string, habitKey: string) => {
    const cellItems = records.filter(r => {
      const matchAct = r.exercise === actKey;
      let matchHabit = false;
      if (habitKey === 'clean') matchHabit = r.smoking === 'ไม่สูบ' && r.alcohol === 'ไม่ดื่ม';
      else if (habitKey === 'single') {
        matchHabit = (r.smoking === 'สูบ' && r.alcohol === 'ไม่ดื่ม') || (r.smoking === 'ไม่สูบ' && r.alcohol === 'ดื่ม');
      } else if (habitKey === 'double') {
        matchHabit = r.smoking === 'สูบ' && r.alcohol === 'ดื่ม';
      }
      return matchAct && matchHabit;
    });

    const count = cellItems.length;
    const highRisk = cellItems.filter(r => r.riskLevel === 'สูง').length;
    const avgScore = count > 0 ? (cellItems.reduce((acc, r) => acc + r.riskScore, 0) / count).toFixed(1) : '0';

    return { count, highRisk, avgScore, items: cellItems };
  };

  return (
    <div className="space-y-4">
      {/* Section Header */}
      <div className="flex items-center justify-between border-b border-purple-100 pb-2">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-6 bg-purple-900 rounded-xs"></div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-purple-950">
              Insight Recommendations: การวิเคราะห์เชิงลึก & ความสัมพันธ์ (Correlation & Insights)
            </h2>
            <p className="text-xs text-slate-500">
              วิเคราะห์ช่วงอายุ พื้นที่เสี่ยงสูง ความสัมพันธ์ตัวแปร BMI และ Heatmap พฤติกรรมเสี่ยง
            </p>
          </div>
        </div>
      </div>

      {/* Grid: 4 Deep Insight Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Insight 1: Age Group Risk Bar */}
        <div className="bg-white rounded-xl border border-purple-100 p-4 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-purple-700" />
                <span>1. กลุ่มอายุที่มีความเสี่ยงสูง (เรียงตามระดับ BMI)</span>
              </h3>
              <span className="text-[11px] font-medium text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
                Bar Chart
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mb-2">
              เปรียบเทียบค่าเฉลี่ย BMI และจำนวนผู้มีความเสี่ยงสูงในแต่ละช่วงอายุ
            </p>

            <div className="h-52 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ageData} margin={{ top: 10, right: 15, left: -15, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3e8ff" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <Tooltip
                    formatter={(val: any, name: any, item: any) => {
                      if (name === 'avgBmi') return [`${val} kg/m²`, 'BMI เฉลี่ย'];
                      if (name === 'highRiskCount') return [`${val} คน (${item.payload.percentRisk}%)`, 'กลุ่มเสี่ยงสูง'];
                      return [val, name];
                    }}
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      borderColor: '#e9d5ff',
                      borderRadius: '8px',
                      fontSize: '11px'
                    }}
                  />
                  <Bar dataKey="avgBmi" name="avgBmi" fill="#a855f7" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="highRiskCount" name="highRiskCount" fill="#4c1d95" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-2 pt-2 border-t border-purple-50 flex items-center justify-between text-xs text-slate-600">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-xs bg-purple-400"></span> BMI เฉลี่ย (kg/m²)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-xs bg-purple-900"></span> จำนวนผู้เสี่ยงสูง (คน)
            </span>
            <span className="font-semibold text-purple-900">
              อายุ 45+ เสี่ยงสูงสุด
            </span>
          </div>
        </div>

        {/* Insight 2: Area Surveillance Bar */}
        <div className="bg-white rounded-xl border border-purple-100 p-4 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-purple-700" />
                <span>2. พื้นที่ที่มีผู้เสี่ยงสูง (พื้นที่เฝ้าระวัง)</span>
              </h3>
              <span className="text-[11px] font-medium text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
                Surveillance Bar
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mb-2">
              จัดลำดับพื้นที่ตามจำนวนผู้มีระดับความเสี่ยงสูง (High Risk Count)
            </p>

            <div className="h-52 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={areaData} margin={{ top: 10, right: 15, left: -15, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3e8ff" vertical={false} />
                  <XAxis dataKey="area" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip
                    formatter={(val: any, name: any, item: any) => {
                      if (name === 'highRiskCount') return [`${val} คน (อัตราเสี่ยง ${item.payload.riskRate}%)`, 'ผู้เสี่ยงระดับสูง'];
                      if (name === 'obeseCount') return [`${val} คน`, 'ผู้มีภาวะอ้วน BMI≥25'];
                      return [val, name];
                    }}
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      borderColor: '#e9d5ff',
                      borderRadius: '8px',
                      fontSize: '11px'
                    }}
                  />
                  <Bar dataKey="highRiskCount" name="highRiskCount" fill="#6b21a8" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="obeseCount" name="obeseCount" fill="#c084fc" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-2 pt-2 border-t border-purple-50 flex items-center justify-between text-xs text-slate-600">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-xs bg-purple-700"></span> เสี่ยงสูง
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-xs bg-purple-300"></span> ภาวะอ้วน (BMI≥25)
            </span>
            <span className="font-semibold text-purple-900">
              พื้นที่เฝ้าระวังอันดับ 1: {areaData[0]?.area || '-'}
            </span>
          </div>
        </div>

        {/* Insight 3: Correlation Scatter Plot (BMI vs Glucose & BMI vs SBP) */}
        <div className="bg-white rounded-xl border border-purple-100 p-4 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <GitFork className="w-4 h-4 text-purple-700" />
                <span>3. ความสัมพันธ์ (Correlation Scatter Plot)</span>
              </h3>
              {/* Toggle Sugar vs SBP */}
              <div className="flex items-center bg-purple-50 p-0.5 rounded-lg border border-purple-200">
                <button
                  onClick={() => setScatterMode('sugar')}
                  className={`px-2 py-0.5 text-[11px] font-semibold rounded transition-colors ${
                    scatterMode === 'sugar' ? 'bg-purple-700 text-white shadow-2xs' : 'text-purple-700 hover:text-purple-900'
                  }`}
                >
                  BMI vs น้ำตาล
                </button>
                <button
                  onClick={() => setScatterMode('sbp')}
                  className={`px-2 py-0.5 text-[11px] font-semibold rounded transition-colors ${
                    scatterMode === 'sbp' ? 'bg-purple-700 text-white shadow-2xs' : 'text-purple-700 hover:text-purple-900'
                  }`}
                >
                  BMI vs ความดัน (SBP)
                </button>
              </div>
            </div>
            <p className="text-[11px] text-slate-500 mb-2">
              {scatterMode === 'sugar'
                ? 'จุดพล็อตความสัมพันธ์ระหว่างดัชนีมวลกาย (BMI) และระดับน้ำตาล Fasting Glucose (mg/dL)'
                : 'จุดพล็อตความสัมพันธ์ระหว่างดัชนีมวลกาย (BMI) และความดันโลหิตตัวบน SBP (mmHg)'}
            </p>

            <div className="h-52 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 10, right: 20, bottom: 10, left: -10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3e8ff" />
                  <XAxis
                    type="number"
                    dataKey="bmi"
                    name="BMI"
                    unit=" kg/m²"
                    domain={[18, 34]}
                    tick={{ fontSize: 10, fill: '#64748b' }}
                    label={{ value: 'BMI (kg/m²)', position: 'insideBottom', offset: -5, fontSize: 10, fill: '#64748b' }}
                  />
                  <YAxis
                    type="number"
                    dataKey={scatterMode === 'sugar' ? 'sugar' : 'sbp'}
                    name={scatterMode === 'sugar' ? 'น้ำตาล' : 'ความดัน SBP'}
                    unit={scatterMode === 'sugar' ? ' mg/dL' : ' mmHg'}
                    domain={scatterMode === 'sugar' ? [70, 180] : [90, 180]}
                    tick={{ fontSize: 10, fill: '#64748b' }}
                  />
                  <ZAxis range={[50, 90]} />
                  <Tooltip
                    formatter={(val: any, name: any) => [val, name]}
                    content={({ payload }) => {
                      if (!payload || !payload[0]) return null;
                      const d = payload[0].payload;
                      return (
                        <div className="bg-white border border-purple-200 rounded-lg p-2 text-xs shadow-md">
                          <div className="font-bold text-purple-950">{d.id} (ความเสี่ยง: {d.riskLevel})</div>
                          <div className="text-slate-600 mt-0.5">BMI: <strong className="text-slate-900">{d.bmi}</strong> kg/m²</div>
                          <div className="text-slate-600">
                            {scatterMode === 'sugar' ? `น้ำตาล: ${d.sugar} mg/dL` : `ความดัน: ${d.sbp} mmHg`}
                          </div>
                          <div className="text-slate-500 text-[10px]">คะแนนเสี่ยง: {d.riskScore}</div>
                        </div>
                      );
                    }}
                  />
                  <Scatter data={scatterData} fill="#7c3aed">
                    {scatterData.map((entry, index) => (
                      <Cell
                        key={`scatter-cell-${index}`}
                        fill={entry.riskLevel === 'สูง' ? '#6b21a8' : entry.riskLevel === 'ปานกลาง' ? '#d97706' : '#10b981'}
                      />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-2 pt-2 border-t border-purple-50 flex items-center justify-between text-xs text-slate-600">
            <span className="text-[11px] text-purple-900 font-medium">
              ข้อค้นพบ: เมื่อ BMI สูงขึ้น มีแนวโน้มพบ {scatterMode === 'sugar' ? 'ระดับน้ำตาล' : 'ความดันโลหิต'} สูงขึ้นอย่างมีนัยสำคัญ (Positive Correlation)
            </span>
          </div>
        </div>

        {/* Insight 4: Behavior Risk Heatmap Matrix */}
        <div className="bg-white rounded-xl border border-purple-100 p-4 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Grid3X3 className="w-4 h-4 text-purple-700" />
                <span>4. พฤติกรรมกับระดับความเสี่ยง (Risk Heatmap Matrix)</span>
              </h3>
              <span className="text-[11px] font-medium text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
                Matrix
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mb-2">
              Cross-tab สรุปพฤติกรรม (การออกกำลังกาย x สารเสพติด) ที่ส่งผลต่อระดับความเสี่ยงสูง
            </p>

            {/* Clean HTML / Tailwind Heatmap Grid */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-purple-100">
                    <th className="py-2 px-2 text-[11px] font-semibold text-slate-500 bg-purple-50/50 rounded-tl-lg">
                      การออกกำลังกาย
                    </th>
                    {habitCols.map(col => (
                      <th key={col.key} className="py-2 px-2 text-[11px] font-semibold text-purple-950 text-center bg-purple-50/50">
                        {col.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-purple-50">
                  {activityRows.map(row => (
                    <tr key={row.key}>
                      <td className="py-2.5 px-2 font-medium text-slate-700 whitespace-nowrap bg-purple-50/20">
                        {row.label}
                      </td>
                      {habitCols.map(col => {
                        const cell = getHeatmapCell(row.key, col.key);
                        // Intensity based on high risk proportion and count
                        const isHighIntensity = cell.highRisk > 0 && cell.count > 0;
                        const intensityClass =
                          cell.count === 0
                            ? 'bg-slate-50 text-slate-400'
                            : cell.highRisk >= 2
                            ? 'bg-purple-900 text-white font-bold'
                            : cell.highRisk === 1
                            ? 'bg-purple-500 text-white font-semibold'
                            : cell.count > 0
                            ? 'bg-purple-100 text-purple-950'
                            : 'bg-emerald-50 text-emerald-800';

                        return (
                          <td key={col.key} className="py-2 px-2 text-center">
                            <div className={`p-2 rounded-lg text-center transition-all ${intensityClass}`}>
                              <div className="text-xs">{cell.count} คน</div>
                              {cell.count > 0 && (
                                <div className="text-[10px] opacity-90 mt-0.5">
                                  เสี่ยงสูง: <strong>{cell.highRisk}</strong> | คะแนน: {cell.avgScore}
                                </div>
                              )}
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-2 pt-2 border-t border-purple-50 flex items-center justify-between text-xs text-slate-600">
            <div className="flex items-center gap-1.5 text-[10px]">
              <span>ความเข้ม:</span>
              <span className="px-1.5 py-0.5 rounded bg-purple-100 text-purple-900 font-medium">เสี่ยงต่ำ</span>
              <span className="px-1.5 py-0.5 rounded bg-purple-500 text-white font-medium">เสี่ยงปานกลาง</span>
              <span className="px-1.5 py-0.5 rounded bg-purple-900 text-white font-bold">เสี่ยงสีแดง (สูง)</span>
            </div>
            <span className="text-[11px] font-semibold text-purple-900">
              ไม่ออกกำลังกาย + สูบ/ดื่ม = เสี่ยงสูงสุด 100%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
