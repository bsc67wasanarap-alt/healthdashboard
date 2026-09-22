import { RawHealthRow, HealthRecord } from '../types';
import { FALLBACK_SHEET_DATA } from '../data/mockFallback';
import { parseRawRow } from '../utils/healthCalculations';

export const DEFAULT_SHEET_ID = '1DBT0eKnTNRVZDBqbDGkr55KObFHzvDTpRKkFZZc5YVs';

export interface SheetFetchResult {
  records: HealthRecord[];
  lastUpdated: string;
  source: 'live' | 'cache' | 'fallback';
  rowCount: number;
  error?: string;
}

export async function fetchHealthDataFromSheet(sheetId: string = DEFAULT_SHEET_ID): Promise<SheetFetchResult> {
  const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json&t=${Date.now()}`;
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'text/plain, application/json'
      },
      cache: 'no-store'
    });

    if (!response.ok) {
      throw new Error(`Google Sheet API returned status ${response.status}`);
    }

    const text = await response.text();
    
    // Parse Google Visualization JSON response
    const jsonStart = text.indexOf('{');
    const jsonEnd = text.lastIndexOf('}');
    
    if (jsonStart === -1 || jsonEnd === -1) {
      throw new Error('Invalid Google Sheet API response format');
    }

    const jsonStr = text.substring(jsonStart, jsonEnd + 1);
    const gvizData = JSON.parse(jsonStr);

    if (!gvizData.table || !gvizData.table.rows) {
      throw new Error('No table data found in Google Sheet');
    }

    const cols: string[] = gvizData.table.cols.map((c: { label?: string; id?: string }) => c.label || c.id || '');
    
    const rawRows: RawHealthRow[] = gvizData.table.rows.map((rowItem: { c: Array<{ v: unknown; f?: string } | null> }) => {
      const rawObj: Record<string, unknown> = {};
      
      cols.forEach((colName, idx) => {
        if (!colName) return;
        const cell = rowItem.c[idx];
        let val = cell ? cell.v : null;

        // Clean Google Sheet Date(yyyy, m, d) format
        if (typeof val === 'string' && val.startsWith('Date(')) {
          const match = val.match(/Date\((\d+),(\d+),(\d+)\)/);
          if (match) {
            const y = match[1];
            const m = String(parseInt(match[2], 10) + 1).padStart(2, '0');
            const d = String(match[3]).padStart(2, '0');
            val = `${y}-${m}-${d}`;
          }
        }
        rawObj[colName] = val;
      });

      return rawObj as unknown as RawHealthRow;
    });

    // Filter out completely blank rows
    const validRows = rawRows.filter(r => r.รหัสบุคคล && String(r.รหัสบุคคล).trim() !== '');

    const records = validRows.map(parseRawRow);
    const now = new Date();
    const lastUpdated = now.toLocaleString('th-TH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });

    // Save to local cache
    try {
      localStorage.setItem('health_dashboard_cache', JSON.stringify({
        records,
        lastUpdated
      }));
    } catch {
      // Ignore cache write error
    }

    return {
      records,
      lastUpdated,
      source: 'live',
      rowCount: records.length
    };
  } catch (err) {
    console.warn('Live fetch failed, attempting cached or fallback data:', err);

    // Try reading cache
    try {
      const cachedStr = localStorage.getItem('health_dashboard_cache');
      if (cachedStr) {
        const cached = JSON.parse(cachedStr);
        if (Array.isArray(cached.records) && cached.records.length > 0) {
          return {
            records: cached.records,
            lastUpdated: cached.lastUpdated || 'ก่อนหน้า (จากแคช)',
            source: 'cache',
            rowCount: cached.records.length,
            error: err instanceof Error ? err.message : 'Unknown fetch error'
          };
        }
      }
    } catch {
      // Ignore cache read error
    }

    // Fallback to embedded data
    const records = FALLBACK_SHEET_DATA.map(parseRawRow);
    const now = new Date();
    return {
      records,
      lastUpdated: now.toLocaleString('th-TH', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }) + ' (ชุดข้อมูลสำรองพร้อมใช้)',
      source: 'fallback',
      rowCount: records.length,
      error: err instanceof Error ? err.message : 'Network fetch failed'
    };
  }
}
