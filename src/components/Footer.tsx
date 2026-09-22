import React from 'react';
import { Activity, ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-purple-100 mt-12 py-8 px-4 sm:px-6 lg:px-8 text-xs text-slate-500">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand & Credit */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-purple-700 text-white flex items-center justify-center font-bold">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-purple-950 text-sm">
              ระบบวิเคราะห์และประเมินสภาวะสุขภาพเบื้องต้นผ่านค่า BMI
            </div>
            <div className="text-slate-500 mt-0.5">
              จัดทำโดย:{' '}
              <strong className="text-purple-900 font-semibold underline decoration-purple-300 underline-offset-2">
                นางสาววาสนา ระพีเจิดสวัสดิ์
              </strong>
            </div>
          </div>
        </div>

        {/* Reference Links & Data Attribution */}
        <div className="flex flex-wrap items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5 text-purple-800 bg-purple-50 px-2.5 py-1 rounded-md border border-purple-200">
            <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
            <span>เกณฑ์ประเมิน BMI สาธารณสุขเอเชีย (สธ.)</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-4 pt-4 border-t border-purple-50 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-400">
        <div>
          © 2026 Health Assessment Analytics Dashboard • Purple & White Minimalist Design
        </div>
        <div>
          รองรับการแสดงผลทุกอุปกรณ์ (Responsive Desktop & Mobile) • Real-time Data Sync
        </div>
      </div>
    </footer>
  );
};
