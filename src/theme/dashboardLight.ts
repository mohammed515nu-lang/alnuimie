import type { ResolvedScheme } from './ThemeContext';

export const DASHBOARD_RADIUS = 16;

/** ألوان لوحة التحكم — نفس مفاتيح `D_LIGHT` للاستخدام الديناميكي */
export type DashboardPalette = {
  pageBg: string;
  white: string;
  navy: string;
  gold: string;
  darkText: string;
  muted: string;
  border: string;
  danger: string;
  success: string;
  inputBg: string;
  goldTint: string;
  navyTint: string;
  balanceCard: string;
  balanceMuted: string;
  onGold: string;
  warningBg: string;
  statTileBg: string;
  panelBg: string;
  logoMarkBg: string;
  /** خلفية شارة «قيد التنفيذ» في قائمة المشاريع */
  inProgressBadgeBg: string;
};

/** لوحة فاتحة — بيج، كحلي، ذهبي (الوضع الحالي) */
export const D_LIGHT: DashboardPalette = {
  pageBg: '#F4EFE6',
  white: '#FFFFFF',
  navy: '#1a2b44',
  gold: '#a67c52',
  darkText: '#2a2520',
  muted: '#5c5348',
  border: '#E0D6C8',
  danger: '#b91c1c',
  success: '#15803d',
  inputBg: '#FAF8F4',
  goldTint: 'rgba(166, 124, 82, 0.16)',
  navyTint: 'rgba(26, 43, 68, 0.08)',
  balanceCard: '#1a2b44',
  balanceMuted: 'rgba(255,255,255,0.72)',
  onGold: '#1a2b44',
  warningBg: 'rgba(166, 124, 82, 0.18)',
  statTileBg: '#3d4f66',
  panelBg: '#EDE8E0',
  logoMarkBg: '#1a2b44',
  inProgressBadgeBg: 'rgba(26, 43, 68, 0.1)',
};

/**
 * لوحة داكنة — مطابقة تقريبية لـ `authUiDark` في تسجيل الدخول
 * (`#0f172a` خلفية، `#1e293b` بطاقات، `#D4A574` ذهبي، حدود `#334155`).
 */
export const D_DARK: DashboardPalette = {
  pageBg: '#0f172a',
  white: '#1e293b',
  navy: '#f8fafc',
  gold: '#D4A574',
  darkText: '#e2e8f0',
  muted: '#94a3b8',
  border: '#334155',
  danger: '#fb7185',
  success: '#34d399',
  inputBg: '#162032',
  goldTint: 'rgba(212, 165, 116, 0.18)',
  navyTint: 'rgba(248, 250, 252, 0.08)',
  balanceCard: '#1e293b',
  balanceMuted: 'rgba(255,255,255,0.72)',
  onGold: '#0f172a',
  warningBg: 'rgba(212, 165, 116, 0.2)',
  statTileBg: '#273549',
  panelBg: '#121a26',
  logoMarkBg: '#334155',
  inProgressBadgeBg: 'rgba(248, 250, 252, 0.1)',
};

/** @deprecated استخدم `getDashboardPalette` داخل الشاشات؛ يُبقي استيراد `D` للشاشات القديمة */
export const D = D_LIGHT;

export function getDashboardPalette(resolved: ResolvedScheme): DashboardPalette {
  return resolved === 'dark' ? D_DARK : D_LIGHT;
}
