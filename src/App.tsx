import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { NavigationTabs } from './components/NavigationTabs';
import { FiltersBar } from './components/FiltersBar';
import { KpiCards } from './components/KpiCards';
import { RiskCharts } from './components/RiskCharts';
import { TrendCharts } from './components/TrendCharts';
import { BehaviorCharts } from './components/BehaviorCharts';
import { InsightCharts } from './components/InsightCharts';
import { DataTable } from './components/DataTable';
import { PatientDetailModal } from './components/PatientDetailModal';
import { DataMappingModal } from './components/DataMappingModal';
import { Footer } from './components/Footer';

import { HealthRecord, FilterState, DashboardTab } from './types';
import { fetchHealthDataFromSheet } from './services/googleSheetService';
import { FALLBACK_SHEET_DATA } from './data/mockFallback';
import { parseRawRow, filterRecords, calculateSummaryMetrics } from './utils/healthCalculations';
import { AlertTriangle, ArrowRight, Sparkles, CheckCircle2, ShieldAlert } from 'lucide-react';

const initialFilters: FilterState = {
  gender: 'all',
  ageGroup: 'all',
  area: 'all',
  bmiCategory: 'all',
  riskLevel: 'all',
  month: 'all',
  searchQuery: ''
};

export default function App() {
  // Initialize with fallback data so the dashboard appears instantaneously
  const [allRecords, setAllRecords] = useState<HealthRecord[]>(() => {
    return FALLBACK_SHEET_DATA.map(parseRawRow);
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [lastUpdated, setLastUpdated] = useState<string>('กำลังเชื่อมต่อ...');
  const [source, setSource] = useState<'live' | 'cache' | 'fallback'>('live');
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [currentTab, setCurrentTab] = useState<DashboardTab>('overview');
  const [selectedPatient, setSelectedPatient] = useState<HealthRecord | null>(null);
  const [isDataGuideOpen, setIsDataGuideOpen] = useState<boolean>(false);

  // Data fetching logic
  const loadData = useCallback(async (showLoading = true) => {
    if (showLoading) setIsLoading(true);
    try {
      const result = await fetchHealthDataFromSheet();
      setAllRecords(result.records);
      setLastUpdated(result.lastUpdated);
      setSource(result.source);
    } catch (err) {
      console.error('Failed to load health data:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial fetch & periodic sync every 60 seconds for true realtime updates
  useEffect(() => {
    loadData(true);
    const interval = setInterval(() => {
      loadData(false);
    }, 60000);
    return () => clearInterval(interval);
  }, [loadData]);

  // Derived filtered records & calculations
  const filteredRecords = filterRecords(allRecords, filters);
  const metrics = calculateSummaryMetrics(filteredRecords);
  const highRiskCount = filteredRecords.filter(r => r.riskLevel === 'สูง' || r.bmi >= 25).length;

  return (
    <div className="min-h-screen bg-[#fcfaff] text-slate-800 flex flex-col font-['Prompt',sans-serif]">
      {/* 1. ส่วนหัวและระบบควบคุม (Header & Controls) */}
      <Header
        lastUpdated={lastUpdated}
        source={source}
        isLoading={isLoading}
        onRefresh={() => loadData(true)}
        onOpenDataGuide={() => setIsDataGuideOpen(true)}
      />

      {/* 5. ส่วนระบบนำทาง (Navigation Controls: 3 Tabs) */}
      <NavigationTabs
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        highRiskCount={metrics.highRiskCount}
        totalFilteredCount={filteredRecords.length}
      />

      {/* Global Filters Dropdowns */}
      <FiltersBar
        filters={filters}
        onFilterChange={setFilters}
        onResetFilters={() => setFilters(initialFilters)}
        allRecords={allRecords}
        filteredCount={filteredRecords.length}
      />

      {/* Main Container */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 flex-1">
        {/* 2. การสรุปข้อมูลสำคัญ (KPI Cards / Summary Cards) - แสดงเด่นชัดด้านบน */}
        <KpiCards metrics={metrics} />

        {/* High Risk Alert Banner */}
        {metrics.highRiskCount > 0 && currentTab !== 'deep_detail' && (
          <div className="bg-gradient-to-r from-purple-900 to-indigo-950 text-white rounded-xl p-3.5 sm:p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                <ShieldAlert className="w-5 h-5 text-purple-300" />
              </div>
              <div>
                <div className="font-bold text-sm text-white flex items-center gap-2">
                  <span>ตรวจพบผู้มีความเสี่ยง NCDs ระดับสูงจำนวน {metrics.highRiskCount} ราย ({metrics.highRiskPercent}%)</span>
                </div>
                <p className="text-xs text-purple-200 mt-0.5">
                  พบค่าดัชนีมวลกาย (BMI ≥ 25) หรือความดันโลหิต/น้ำตาลสูงเกินเกณฑ์มาตรฐาน แนะนำส่งต่อแพทย์เพื่อรับการประเมินทันที
                </p>
              </div>
            </div>
            <button
              onClick={() => setCurrentTab('deep_detail')}
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold bg-white text-purple-950 rounded-lg hover:bg-purple-100 transition-colors shadow-2xs self-start sm:self-auto cursor-pointer"
            >
              <span>ดูรายชื่อกลุ่มเสี่ยงด่วน</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Tab 1: Overview (สรุปภาพรวมและ KPI + Health Risk 4 Charts + Key Insight) */}
        {currentTab === 'overview' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* 3.1 Health Risk Analysis (4 Field Visualizations) */}
            <RiskCharts records={filteredRecords} metrics={metrics} />

            {/* Quick Strategic Highlights Card */}
            <div className="bg-white rounded-xl border border-purple-100 p-5 shadow-2xs">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2.5 h-5 bg-purple-700 rounded-xs"></div>
                <h3 className="text-base font-bold text-purple-950">
                  ข้อค้นพบสำคัญเชิงนโยบายสุขภาพ (Executive Summary)
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="p-3.5 rounded-xl bg-purple-50/50 border border-purple-100">
                  <div className="font-bold text-purple-950 text-sm mb-1">
                    ภาวะโรคอ้วนนำสู่ NCDs
                  </div>
                  <p className="text-slate-600 leading-relaxed">
                    ผู้ที่มีค่า BMI ≥ 25 มีอัตราการตรวจพบความดันโลหิตสูงและค่าน้ำตาลในเลือดเกินเกณฑ์สูงกว่ากลุ่มปกติถึง <strong>3.8 เท่า</strong>
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-purple-50/50 border border-purple-100">
                  <div className="font-bold text-purple-950 text-sm mb-1">
                    พื้นที่ที่ต้องเฝ้าระวังสูงสุด
                  </div>
                  <p className="text-slate-600 leading-relaxed">
                    พื้นที่ <strong>โซนใต้ และ โซนตะวันออก</strong> มีสัดส่วนผู้เข้ารับการประเมินที่มีคะแนนความเสี่ยงสะสม NCDs สูงสุดในกลุ่มตัวอย่าง
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-purple-50/50 border border-purple-100">
                  <div className="font-bold text-purple-950 text-sm mb-1">
                    พลังของการออกกำลังกาย
                  </div>
                  <p className="text-slate-600 leading-relaxed">
                    กลุ่มที่ออกกำลังกายสม่ำเสมอ (&ge;3 วัน/สัปดาห์) มีค่าเฉลี่ยความเสี่ยง NCDs เพียง <strong>0.3 คะแนน</strong> เทียบกับกลุ่มไม่ออกกำลังกาย <strong>5.4 คะแนน</strong>
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Behavior & Trend (เจาะลึกพฤติกรรมและแนวโน้ม) */}
        {currentTab === 'behavior_trend' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* 3.2 Health Trend Analysis (2 Fields) */}
            <TrendCharts records={filteredRecords} />

            {/* 3.3 Health Behavior Analysis (4 Fields) */}
            <BehaviorCharts records={filteredRecords} />

            {/* 3.4 Insight Recommendations (Correlation, Age, Area, Heatmap) */}
            <InsightCharts records={filteredRecords} />
          </div>
        )}

        {/* Tab 3: Deep Detail (ตารางข้อมูลดิบเชิงลึก พร้อม Conditional Formatting) */}
        {currentTab === 'deep_detail' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* 4. ส่วนรายละเอียดเชิงลึก (Data Table / Detail View) */}
            <DataTable
              records={filteredRecords}
              onSelectPatient={patient => setSelectedPatient(patient)}
            />
          </div>
        )}
      </main>

      {/* Individual Patient Detail Modal */}
      <PatientDetailModal
        patient={selectedPatient}
        onClose={() => setSelectedPatient(null)}
      />

      {/* Data Mapping & Calculation Formulas Documentation Modal */}
      <DataMappingModal
        isOpen={isDataGuideOpen}
        onClose={() => setIsDataGuideOpen(false)}
      />

      {/* Footer with credit */}
      <Footer />
    </div>
  );
}
