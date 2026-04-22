/**
 * لوحة «بنيان»: خلفية عميقة + سماوي للتمييز + سليت للنصوص.
 */
export const colors = {
  background: '#0B1220',
  backgroundElevated: '#111827',
  surfaceDeep: '#0F172A',
  surfaceMid: '#1E293B',

  border: '#1F2937',
  borderMuted: '#334155',

  primary: '#38BDF8',
  onPrimary: '#0B1220',

  text: '#F8FAFC',
  textSecondary: '#E2E8F0',
  textMuted: '#94A3B8',
  placeholder: '#64748B',
  textSubtle: '#CBD5E1',

  link: '#93C5FD',
  accentIndigo: '#A5B4FC',

  card: 'rgba(15,23,42,0.72)',
  cardSoft: 'rgba(15,23,42,0.55)',
  chipBg: 'rgba(15,23,42,0.9)',
  primaryTint12: 'rgba(56,189,248,0.12)',
  primaryTint18: 'rgba(56,189,248,0.18)',
  walletInner: 'rgba(11,18,32,0.92)',
  walletBorderGlow: 'rgba(56,189,248,0.25)',

  error: '#FB7185',
  warning: '#FB923C',
  notification: '#F97316',

  dangerBorder: '#7F1D1D',
  dangerBg: 'rgba(127,29,29,0.15)',
  dangerText: '#FCA5A5',
} as const;

export const gradients = {
  login: [colors.background, colors.backgroundElevated] as const,
  walletCard: [colors.surfaceDeep, colors.surfaceMid] as const,
} as const;

export type ColorKey = keyof typeof colors;
