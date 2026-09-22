import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Area,
  ComposedChart
} from 'recharts';
import { HealthRecord } from '../types';
import { TrendingUp, Dumbbell } from 'lucide-react';

interface TrendChartsProps {
  records: HealthRecord[];
}

export const TrendCharts: React.FC<TrendChartsProps> = ({ records }) => {
  // Aggregate data by month
  // Find all distinct months or default to the 3 standard months in dataset
  const months = Array.from(new Set(records.map(r => r.month))).filter(Boolean).sort();
  const targetMonths = months.length > 0 ? months : ['2026-01', '2026-02', '2026-03'];

  // 1. BMI Monthly Trend Data
  const bmiTrendData = targetMonths.map(m => {
    const monthRecords = records.filter(r => r.month === m);
    if (monthRecords.length === 0) {
      return {
        month: m,
        monthLabel: formatMonthLabel(m),
        avgBmi: 0,
        minBmi: 0,
        maxBmi: 0,
        count: 0
      };
    }
    const bmis = monthRecords.map(r => r.bmi);
    const sum = bmis.reduce((a, b) => a + b, 0);
    const avg = Number((sum / bmis.length).toFixed(1));
    const min = Math.min(...bmis);
    const max = Math.max(...bmis);
    const obeseCount = monthRecords.filter(r => r.bmi >= 25).length;

    return {
      month: m,
      monthLabel: formatMonthLabel(m),
      avgBmi: avg,
      minBmi: min,
      maxBmi: max,
      obeseCount,
      count: monthRecords.length
    };
  });

  // 2. Exercise Behavior over Time
  const exerciseTrendData = targetMonths.map(m => {
    const monthRecords = records.filter(r => r.month === m);
    const count = monthRecords.length || 1;
    const regular = monthRecords.filter(r => r.exercise === 'สม่ำเสมอ').length;
    const occasional = monthRecords.filter(r => r.exercise === 'บางครั้ง').length;
    const none = monthRecords.filter(r => r.exercise === 'ไม่ออกกำลังกาย').length;

    return {
      month: m,
      monthLabel: formatMonthLabel(m),
      regularCount: regular,
      occasionalCount: occasional,
      noneCount: none,
      regularPercent: Number(((regular / count) * 100).toFixed(1)),
      occasionalPercent: Number(((occasional / count) * 100).toFixed(1)),
      nonePercent: Number(((none / count) * 100).toFixed(1)),
      total: count
    };
  });

  function formatMonthLabel(mStr: string) {
    if (mStr === '2026-01') return 'ม.ค. 2026';
    if (mStr === '2026-02') return 'ก.พ. 2026';
    if (mStr === '2026-03') return 'มี.ค. 2026';
    return mStr;
  }

  return (
    <div className="space-y-4">
      {/* Section Header */}
      <div className="flex items-center justify-between border-b border-purple-100 pb-2">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-6 bg-violet-700 rounded-xs"></div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-purple-950">
              Health Trend Analysis: การวิเคราะห์แนวโน้มสุขภาพตามช่วงเวลา (2 Fields)
            </h2>
            <p className="text-xs text-slate-500">
              เปรียบเทียบค่าเฉลี่ยดัชนีมวลกาย และพฤติกรรมการออกกำลังกายรายเดือน (ม.ค. - มี.ค. 2026)
            </p>
          </div>
        </div>
      </div>

      {/* 2 Trend Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Chart 1: Line Chart - Monthly BMI Trend */}
        <div className="bg-white rounded-xl border border-purple-100 p-4 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-purple-600" />
                <span>1. แนวโน้มค่าเฉลี่ย BMI ในแต่ละช่วงเวลา/เดือน</span>
              </h3>
              <span className="text-[11px] font-medium text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
                Line Chart
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mb-3">
              แสดงค่าเฉลี่ย BMI พร้อมกรอบช่วงต่ำสุด - สูงสุดในแต่ละรอบการคัดกรอง
            </p>

            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={bmiTrendData} margin={{ top: 15, right: 15, left: -15, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3e8ff" />
                  <XAxis dataKey="monthLabel" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{ stroke: '#e2e8f0' }} />
                  <YAxis domain={[18, 34]} tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <Tooltip
                    formatter={(val: any, name: any) => {
                      if (name === 'avgBmi') return [`${val} kg/m²`, 'ค่าเฉลี่ย BMI'];
                      if (name === 'maxBmi') return [`${val} kg/m²`, 'สูงสุด (Max)'];
                      if (name === 'minBmi') return [`${val} kg/m²`, 'ต่ำสุด (Min)'];
                      return [val, name];
                    }}
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      borderColor: '#e9d5ff',
                      borderRadius: '8px',
                      fontSize: '11px',
                      boxShadow: '0 2px 8px rgba(107, 33, 168, 0.1)'
                    }}
                  />
                  <Legend
                    verticalAlign="top"
                    align="right"
                    wrapperStyle={{ fontSize: '11px', paddingBottom: '10px' }}
                    formatter={val => {
                      if (val === 'avgBmi') return 'ค่าเฉลี่ย BMI';
                      if (val === 'maxBmi') return 'สูงสุด (Max)';
                      if (val === 'minBmi') return 'ต่ำสุด (Min)';
                      return val;
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="maxBmi"
                    stroke="#c084fc"
                    strokeWidth={1.5}
                    strokeDasharray="4 4"
                    dot={{ fill: '#c084fc', r: 3 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="avgBmi"
                    stroke="#6b21a8"
                    strokeWidth={3}
                    dot={{ fill: '#6b21a8', r: 5, stroke: '#ffffff', strokeWidth: 2 }}
                    activeDot={{ r: 7 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="minBmi"
                    stroke="#a855f7"
                    strokeWidth={1.5}
                    strokeDasharray="4 4"
                    dot={{ fill: '#a855f7', r: 3 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-2 pt-2 border-t border-purple-50 grid grid-cols-3 gap-2 text-center text-xs text-slate-600">
            {bmiTrendData.map(d => (
              <div key={d.month} className="bg-purple-50/50 rounded p-1.5">
                <div className="text-[10px] text-slate-500 font-medium">{d.monthLabel}</div>
                <div className="font-bold text-purple-950">{d.avgBmi} <span className="text-[10px] font-normal text-slate-400">BMI</span></div>
                <div className="text-[10px] text-purple-700">อ้วน {d.obeseCount} คน</div>
              </div>
            ))}
          </div>
        </div>

        {/* Chart 2: Multi-line Chart - Exercise Trend over Time */}
        <div className="bg-white rounded-xl border border-purple-100 p-4 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Dumbbell className="w-4 h-4 text-purple-600" />
                <span>2. แนวโน้มพฤติกรรมการออกกำลังกายเปรียบเทียบกับเวลา</span>
              </h3>
              <span className="text-[11px] font-medium text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
                Line Chart
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mb-3">
              ร้อยละ (%) สัดส่วนของผู้ที่ออกกำลังกายสม่ำเสมอ บางครั้ง และไม่ออกกำลังกาย
            </p>

            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={exerciseTrendData} margin={{ top: 15, right: 15, left: -15, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3e8ff" />
                  <XAxis dataKey="monthLabel" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{ stroke: '#e2e8f0' }} />
                  <YAxis unit="%" domain={[0, 100]} tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <Tooltip
                    formatter={(val: any, name: any, item: any) => {
                      if (name === 'regularPercent') return [`${val}% (${item.payload.regularCount} คน)`, 'ออกกำลังกายสม่ำเสมอ'];
                      if (name === 'occasionalPercent') return [`${val}% (${item.payload.occasionalCount} คน)`, 'ออกกำลังกายบางครั้ง'];
                      if (name === 'nonePercent') return [`${val}% (${item.payload.noneCount} คน)`, 'ไม่ออกกำลังกาย'];
                      return [val, name];
                    }}
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      borderColor: '#e9d5ff',
                      borderRadius: '8px',
                      fontSize: '11px',
                      boxShadow: '0 2px 8px rgba(107, 33, 168, 0.1)'
                    }}
                  />
                  <Legend
                    verticalAlign="top"
                    align="right"
                    wrapperStyle={{ fontSize: '11px', paddingBottom: '10px' }}
                    formatter={val => {
                      if (val === 'regularPercent') return 'สม่ำเสมอ';
                      if (val === 'occasionalPercent') return 'บางครั้ง';
                      if (val === 'nonePercent') return 'ไม่ออกกำลังกาย';
                      return val;
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="regularPercent"
                    stroke="#10b981"
                    strokeWidth={2.5}
                    dot={{ fill: '#10b981', r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="occasionalPercent"
                    stroke="#fbbf24"
                    strokeWidth={2.5}
                    dot={{ fill: '#fbbf24', r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="nonePercent"
                    stroke="#7c3aed"
                    strokeWidth={2.5}
                    dot={{ fill: '#7c3aed', r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-2 pt-2 border-t border-purple-50 flex items-center justify-between text-xs text-slate-600 px-2">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span>สม่ำเสมอ</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
              <span>บางครั้ง</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-700"></span>
              <span>ไม่ออกกำลังกาย (กลุ่มเสี่ยง)</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
