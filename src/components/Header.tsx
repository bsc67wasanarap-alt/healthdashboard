import React from 'react';
import { Activity, RefreshCw } from 'lucide-react';

interface HeaderProps {
  lastUpdated: string;
  source: 'live' | 'cache' | 'fallback';
  isLoading: boolean;
  onRefresh: () => void;
  onOpenDataGuide?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  lastUpdated,
  source,
  isLoading,
  onRefresh
}) => {
  return (
    <header className="bg-white border-b border-purple-100 shadow-xs sticky top-0 z-30">
      {/* Top Banner / Credit Ribbon */}
      <div className="bg-gradient-to-r from-purple-900 via-purple-800 to-indigo-900 text-white px-4 py-1.5 text-xs font-medium flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center justify-center bg-purple-700/80 px-2 py-0.5 rounded text-[11px] font-semibold text-purple-100 tracking-wide">
            ระบบคัดกรองสุขภาพปฐมภูมิ NCDs
          </span>
          <span className="text-purple-200">
            โครงการประเมินสภาวะสุขภาพชุมชน
          </span>
        </div>
        <div className="flex items-center gap-2 text-purple-200">
          <span>ผู้จัดทำ:</span>
          <span className="text-white font-semibold underline decoration-purple-400 underline-offset-2">
            นางสาววาสนา ระพีเจิดสวัสดิ์
          </span>
        </div>
      </div>

      {/* Main Header Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Title and Icon */}
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center text-white shadow-md shadow-purple-500/20 shrink-0 mt-0.5">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-bold text-purple-950 tracking-tight">
                  ข้อมูลประเมินสภาวะสุขภาพเบื้องต้นผ่านค่าดัชนีมวลกาย (BMI)
                </h1>
                <span className="bg-purple-50 text-purple-700 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-purple-200">
                  Live Analytics
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                เฝ้าระวังความเสี่ยงโรคไม่ติดต่อเรื้อรัง (NCDs) ผ่านดัชนีมวลกาย ความดันโลหิต และระดับน้ำตาล
              </p>
            </div>
          </div>

          {/* Controls: Last Updated, Refresh */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 self-start lg:self-center">
            {/* Realtime Live indicator & Last updated */}
            <div className="bg-purple-50/70 border border-purple-200/80 rounded-lg px-3 py-1.5 flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                {source === 'live' ? (
                  <>
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                  </>
                ) : (
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
                )}
              </span>
              <div className="text-left">
                <div className="text-[10px] uppercase font-semibold text-purple-600 tracking-wider">
                  {source === 'live' ? 'เชื่อมต่อสด (Live Sync)' : source === 'cache' ? 'ข้อมูลแคช (Cached)' : 'ข้อมูลตัวอย่าง'}
                </div>
                <div className="text-xs font-medium text-slate-700 whitespace-nowrap">
                  อัปเดต: {lastUpdated}
                </div>
              </div>
            </div>

            {/* Refresh Button */}
            <button
              onClick={onRefresh}
              disabled={isLoading}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-white text-purple-700 border border-purple-200 hover:bg-purple-50 hover:border-purple-300 transition-all shadow-2xs active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
              title="ดึงข้อมูลล่าสุดจาก Google Sheet ทันที"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-purple-600' : ''}`} />
              <span>{isLoading ? 'กำลังดึงข้อมูล...' : 'รีเฟรช'}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
