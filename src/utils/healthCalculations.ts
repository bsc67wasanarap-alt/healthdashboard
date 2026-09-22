import { HealthRecord, RawHealthRow, FilterState, HealthSummaryMetrics, BmiCategoryKey, BmiCategoryInfo } from '../types';

export const BMI_CATEGORIES: BmiCategoryInfo[] = [
  {
    key: 'underweight',
    label: 'น้ำหนักน้อย / ผอม',
    rangeLabel: '< 18.5',
    min: 0,
    max: 18.49,
    color: '#38bdf8', // Sky blue
    bgColor: '#e0f2fe',
    textColor: '#0369a1',
    description: 'ดัชนีมวลกายต่ำกว่าเกณฑ์มาตรฐาน อาจเสี่ยงภาวะขาดสารอาหาร'
  },
  {
    key: 'normal',
    label: 'สมส่วน / สุขภาพดี',
    rangeLabel: '18.5 - 22.9',
    min: 18.5,
    max: 22.99,
    color: '#10b981', // Emerald green
    bgColor: '#d1fae5',
    textColor: '#065f46',
    description: 'เกณฑ์ปกติมาตรฐานคนเอเชีย ความเสี่ยงต่อโรค NCDs ต่ำ'
  },
  {
    key: 'overweight',
    label: 'น้ำหนักเกิน / ท้วม',
    rangeLabel: '23.0 - 24.9',
    min: 23.0,
    max: 24.99,
    color: '#fbbf24', // Amber
    bgColor: '#fef3c7',
    textColor: '#92400e',
    description: 'เริ่มมีน้ำหนักเกินเกณฑ์ ควรเริ่มเฝ้าระวังพฤติกรรมบริโภค'
  },
  {
    key: 'obese1',
    label: 'โรคอ้วนระดับ 1',
    rangeLabel: '25.0 - 29.9',
    min: 25.0,
    max: 29.99,
    color: '#f97316', // Orange
    bgColor: '#ffedd5',
    textColor: '#c2410c',
    description: 'มีความเสี่ยงต่อภาวะความดันโลหิตสูงและเบาหวานเพิ่มขึ้น'
  },
  {
    key: 'obese2',
    label: 'โรคอ้วนระดับ 2 (อันตราย)',
    rangeLabel: '≥ 30.0',
    min: 30.0,
    max: 999,
    color: '#ef4444', // Red
    bgColor: '#fee2e2',
    textColor: '#b91c1c',
    description: 'ภาวะอ้วนอันตราย มีความเสี่ยงสูงมากต่อภาวะแทรกซ้อนหลอดเลือดหัวใจ'
  }
];

export function getBmiCategory(bmi: number): { label: string; key: BmiCategoryKey; isRisk: boolean } {
  if (bmi < 18.5) return { label: 'น้ำหนักน้อย / ผอม', key: 'underweight', isRisk: false };
  if (bmi <= 22.99) return { label: 'สมส่วน / สุขภาพดี', key: 'normal', isRisk: false };
  if (bmi <= 24.99) return { label: 'น้ำหนักเกิน / ท้วม', key: 'overweight', isRisk: false };
  if (bmi <= 29.99) return { label: 'โรคอ้วนระดับ 1', key: 'obese1', isRisk: true };
  return { label: 'โรคอ้วนระดับ 2 (อันตราย)', key: 'obese2', isRisk: true };
}

export function getBpCategory(sbp: number, dbp: number): 'ปกติ' | 'เริ่มเสี่ยง' | 'ความดันสูง' {
  if (sbp >= 140 || dbp >= 90) return 'ความดันสูง';
  if (sbp >= 120 || dbp >= 80) return 'เริ่มเสี่ยง';
  return 'ปกติ';
}

export function getGlucoseCategory(glucose: number): 'ปกติ' | 'เริ่มเสี่ยง' | 'สงสัยเบาหวาน' {
  if (glucose >= 126) return 'สงสัยเบาหวาน';
  if (glucose >= 100) return 'เริ่มเสี่ยง';
  return 'ปกติ';
}

export function parseRawRow(raw: RawHealthRow): HealthRecord {
  const bmi = Number(raw.BMI) || 0;
  const sbp = Number(raw.SBP_mmHg) || 0;
  const dbp = Number(raw.DBP_mmHg) || 0;
  const glucose = Number(raw.น้ำตาล_mg_dL) || 0;
  const riskScore = Number(raw.คะแนนความเสี่ยง) || 0;
  const bmiCat = getBmiCategory(bmi);
  const bpCat = getBpCategory(sbp, dbp);
  const glucoseCat = getGlucoseCategory(glucose);
  const riskLevel = (raw.ระดับความเสี่ยง || 'ต่ำ') as HealthRecord['riskLevel'];

  return {
    id: String(raw.รหัสบุคคล || ''),
    screeningDate: String(raw.วันที่คัดกรอง || ''),
    area: String(raw.พื้นที่ || ''),
    gender: String(raw.เพศ || ''),
    age: Number(raw.อายุ) || 0,
    height: Number(raw.ส่วนสูง_cm) || 0,
    weight: Number(raw.น้ำหนัก_kg) || 0,
    bmi,
    sbp,
    dbp,
    pulse: Number(raw.ชีพจร_bpm) || 0,
    glucose,
    smoking: String(raw.สูบบุหรี่ || 'ไม่สูบ'),
    alcohol: String(raw.ดื่มแอลกอฮอล์ || 'ไม่ดื่ม'),
    exercise: String(raw.การออกกำลังกาย || 'บางครั้ง'),
    diabetesScreen: String(raw.เบาหวาน_คัดกรอง || 'ไม่มี'),
    htScreen: String(raw.ความดันโลหิตสูง_คัดกรอง || 'ไม่มี'),
    riskScore,
    riskLevel,
    month: String(raw.เดือน || ''),
    bmiCategory: bmiCat.label,
    bmiCategoryKey: bmiCat.key,
    bpCategory: bpCat,
    glucoseCategory: glucoseCat,
    isObeseOrOverweight: bmi >= 25,
    isHighRisk: riskLevel === 'สูง'
  };
}

export function filterRecords(records: HealthRecord[], filters: FilterState): HealthRecord[] {
  return records.filter(item => {
    // Gender
    if (filters.gender !== 'all' && item.gender !== filters.gender) {
      return false;
    }

    // Age Group
    if (filters.ageGroup !== 'all') {
      if (filters.ageGroup === '<30' && item.age >= 30) return false;
      if (filters.ageGroup === '30-44' && (item.age < 30 || item.age > 44)) return false;
      if (filters.ageGroup === '45-59' && (item.age < 45 || item.age > 59)) return false;
      if (filters.ageGroup === '60+' && item.age < 60) return false;
    }

    // Area
    if (filters.area !== 'all' && item.area !== filters.area) {
      return false;
    }

    // BMI Category
    if (filters.bmiCategory !== 'all') {
      if (filters.bmiCategory === 'high_risk' && item.bmi < 25) return false;
      if (filters.bmiCategory !== 'high_risk' && item.bmiCategoryKey !== filters.bmiCategory) return false;
    }

    // Risk Level
    if (filters.riskLevel !== 'all' && item.riskLevel !== filters.riskLevel) {
      return false;
    }

    // Month
    if (filters.month !== 'all' && item.month !== filters.month) {
      return false;
    }

    // Search Query
    if (filters.searchQuery.trim()) {
      const q = filters.searchQuery.toLowerCase().trim();
      const matchId = item.id.toLowerCase().includes(q);
      const matchArea = item.area.toLowerCase().includes(q);
      const matchGender = item.gender.toLowerCase().includes(q);
      const matchRisk = item.riskLevel.toLowerCase().includes(q);
      const matchMonth = item.month.toLowerCase().includes(q);
      if (!matchId && !matchArea && !matchGender && !matchRisk && !matchMonth) {
        return false;
      }
    }

    return true;
  });
}

export function calculateSummaryMetrics(records: HealthRecord[]): HealthSummaryMetrics {
  const total = records.length;
  if (total === 0) {
    return {
      totalCount: 0,
      maleCount: 0,
      femaleCount: 0,
      malePercent: 0,
      femalePercent: 0,
      avgBmi: 0,
      medianBmi: 0,
      minBmi: 0,
      maxBmi: 0,
      highRiskCount: 0,
      highRiskPercent: 0,
      obeseCount: 0,
      obesePercent: 0,
      sbpMin: 0,
      sbpMax: 0,
      sbpAvg: 0,
      dbpMin: 0,
      dbpMax: 0,
      dbpAvg: 0,
      glucoseMin: 0,
      glucoseMax: 0,
      glucoseAvg: 0,
      avgRiskScore: 0,
      maxRiskScore: 0
    };
  }

  const males = records.filter(r => r.gender === 'ชาย').length;
  const females = records.filter(r => r.gender === 'หญิง').length;
  const obese = records.filter(r => r.bmi >= 25).length;
  const highRisk = records.filter(r => r.riskLevel === 'สูง').length;

  const bmis = records.map(r => r.bmi).sort((a, b) => a - b);
  const sbps = records.map(r => r.sbp);
  const dbps = records.map(r => r.dbp);
  const glucoses = records.map(r => r.glucose);
  const riskScores = records.map(r => r.riskScore);

  const sumBmi = bmis.reduce((a, b) => a + b, 0);
  const sumSbp = sbps.reduce((a, b) => a + b, 0);
  const sumDbp = dbps.reduce((a, b) => a + b, 0);
  const sumGlucose = glucoses.reduce((a, b) => a + b, 0);
  const sumRiskScore = riskScores.reduce((a, b) => a + b, 0);

  const mid = Math.floor(bmis.length / 2);
  const medianBmi = bmis.length % 2 !== 0 ? bmis[mid] : (bmis[mid - 1] + bmis[mid]) / 2;

  return {
    totalCount: total,
    maleCount: males,
    femaleCount: females,
    malePercent: Number(((males / total) * 100).toFixed(1)),
    femalePercent: Number(((females / total) * 100).toFixed(1)),
    avgBmi: Number((sumBmi / total).toFixed(1)),
    medianBmi: Number(medianBmi.toFixed(1)),
    minBmi: Math.min(...bmis),
    maxBmi: Math.max(...bmis),
    highRiskCount: highRisk,
    highRiskPercent: Number(((highRisk / total) * 100).toFixed(1)),
    obeseCount: obese,
    obesePercent: Number(((obese / total) * 100).toFixed(1)),
    sbpMin: Math.min(...sbps),
    sbpMax: Math.max(...sbps),
    sbpAvg: Number((sumSbp / total).toFixed(0)),
    dbpMin: Math.min(...dbps),
    dbpMax: Math.max(...dbps),
    dbpAvg: Number((sumDbp / total).toFixed(0)),
    glucoseMin: Math.min(...glucoses),
    glucoseMax: Math.max(...glucoses),
    glucoseAvg: Number((sumGlucose / total).toFixed(0)),
    avgRiskScore: Number((sumRiskScore / total).toFixed(1)),
    maxRiskScore: Math.max(...riskScores)
  };
}

// Format Thai date string from ISO or Google date
export function formatThaiDate(dateStr: string): string {
  if (!dateStr) return '-';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const monthsThai = [
      'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
      'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
    ];
    const day = d.getDate();
    const month = monthsThai[d.getMonth()];
    const year = d.getFullYear() + 543; // Buddhist Era
    return `${day} ${month} ${year}`;
  } catch {
    return dateStr;
  }
}
