/**
 * Data structures for Health Assessment Dashboard
 */

export interface RawHealthRow {
  รหัสบุคคล: string;
  วันที่คัดกรอง: string;
  พื้นที่: string;
  เพศ: string;
  อายุ: number;
  ส่วนสูง_cm: number;
  น้ำหนัก_kg: number;
  BMI: number;
  SBP_mmHg: number;
  DBP_mmHg: number;
  ชีพจร_bpm: number;
  น้ำตาล_mg_dL: number;
  สูบบุหรี่: string;
  ดื่มแอลกอฮอล์: string;
  การออกกำลังกาย: string;
  เบาหวาน_คัดกรอง: string;
  ความดันโลหิตสูง_คัดกรอง: string;
  คะแนนความเสี่ยง: number;
  ระดับความเสี่ยง: string;
  เดือน: string;
}

export type BmiCategoryKey = 'underweight' | 'normal' | 'overweight' | 'obese1' | 'obese2';

export interface BmiCategoryInfo {
  key: BmiCategoryKey;
  label: string;
  rangeLabel: string;
  min: number;
  max: number;
  color: string;
  bgColor: string;
  textColor: string;
  description: string;
}

export type RiskLevelType = 'ต่ำ' | 'ปานกลาง' | 'สูง';

export interface HealthRecord {
  id: string;
  screeningDate: string;
  area: string;
  gender: 'ชาย' | 'หญิง' | string;
  age: number;
  height: number;
  weight: number;
  bmi: number;
  sbp: number;
  dbp: number;
  pulse: number;
  glucose: number;
  smoking: 'สูบ' | 'ไม่สูบ' | string;
  alcohol: 'ดื่ม' | 'ไม่ดื่ม' | string;
  exercise: 'สม่ำเสมอ' | 'บางครั้ง' | 'ไม่ออกกำลังกาย' | string;
  diabetesScreen: 'ไม่มี' | 'มีแนวโน้ม/เสี่ยง' | string;
  htScreen: 'ไม่มี' | 'มีแนวโน้ม/เสี่ยง' | string;
  riskScore: number;
  riskLevel: RiskLevelType;
  month: string;

  // Computed fields
  bmiCategory: string;
  bmiCategoryKey: BmiCategoryKey;
  bpCategory: 'ปกติ' | 'เริ่มเสี่ยง' | 'ความดันสูง';
  glucoseCategory: 'ปกติ' | 'เริ่มเสี่ยง' | 'สงสัยเบาหวาน';
  isObeseOrOverweight: boolean; // BMI >= 25
  isHighRisk: boolean; // Risk level = 'สูง'
}

export interface FilterState {
  gender: string;
  ageGroup: string;
  area: string;
  bmiCategory: string;
  riskLevel: string;
  month: string;
  searchQuery: string;
}

export type DashboardTab = 'overview' | 'behavior_trend' | 'deep_detail';

export interface HealthSummaryMetrics {
  totalCount: number;
  maleCount: number;
  femaleCount: number;
  malePercent: number;
  femalePercent: number;
  
  avgBmi: number;
  medianBmi: number;
  minBmi: number;
  maxBmi: number;

  highRiskCount: number;
  highRiskPercent: number;

  obeseCount: number; // BMI >= 25
  obesePercent: number;

  sbpMin: number;
  sbpMax: number;
  sbpAvg: number;

  dbpMin: number;
  dbpMax: number;
  dbpAvg: number;

  glucoseMin: number;
  glucoseMax: number;
  glucoseAvg: number;

  avgRiskScore: number;
  maxRiskScore: number;
}
