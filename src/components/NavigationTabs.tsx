import React from 'react';
import { LayoutDashboard, TrendingUp, Table, Flame, AlertTriangle } from 'lucide-react';
import { DashboardTab } from '../types';

interface NavigationTabsProps {
  currentTab: DashboardTab;
  onTabChange: (tab: DashboardTab) => void;
  highRiskCount: number;
  totalFilteredCount: number;
}

export const NavigationTabs: React.FC<NavigationTabsProps> = ({
  currentTab,
  onTabChange,
  highRiskCount,
  totalFilteredCount
}) => {
  const tabs = [
    {
      id: 'overview' as DashboardTab,
      label: 'ภาพรวม & ความเสี่ยง (Overview)',
      desc: 'สรุปภาพรวม KPI และการวิเคราะห์ Health Risk',
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: 'behavior_trend' as DashboardTab,
      label: 'พฤติกรรม & แนวโน้ม (Behavior & Trend)',
      desc: 'เจาะลึกพฤติกรรมสุขภาพ แนวโน้ม และ Correlation',
      icon: TrendingUp,
      badge: null
    },
    {
      id: 'deep_detail' as DashboardTab,
      label: 'ตารางข้อมูลเชิงลึก (Deep Detail)',
      desc: 'รายชื่อผู้มีความเสี่ยงสูงที่ต้องดูแลด่วนและข้อมูลรายบุคคล',
      icon: Table,
      badge: highRiskCount > 0 ? `${highRiskCount} คนเสี่ยงสูง` : null,
      badgeColor: 'bg-red-50 text-red-700 border-red-200'
    }
  ];

  return (
    <div className="bg-white border-b border-purple-100 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex space-x-2 sm:space-x-4 overflow-x-auto scrollbar-none py-2" aria-label="Tabs">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`group inline-flex items-center gap-2.5 py-3 px-4 border-b-2 font-medium text-sm rounded-t-lg transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'border-purple-700 text-purple-950 bg-purple-50/60 font-semibold shadow-2xs'
                    : 'border-transparent text-slate-500 hover:text-purple-800 hover:border-purple-300 hover:bg-purple-50/30'
                }`}
              >
                <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-purple-700' : 'text-slate-400 group-hover:text-purple-600'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${tab.badgeColor}`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};
