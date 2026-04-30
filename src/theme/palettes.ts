export type ResolvedScheme = 'light' | 'dark';

/**
 * لوحتان: داكن (افتراضي التطبيق) وفاتح (قراءة أوضح في النهار).
 * المفاتيح يجب أن تبقى متطابقة بين الاثنين لاستخدامها في الأنماط.
 */
export const paletteDark = {
  background: '#0f172a',
  backgroundElevated: '#121826',
  surfaceDeep: '#0f172a',
  surfaceMid: '#1e293b',

  border: '#1e293b',
  borderMuted: '#334155',

  primary: '#f59e0b',
  onPrimary: '#0f172a',

  text: '#f8fafc',
  textSecondary: '#e2e8f0',
  textMuted: '#94a3b8',
  placeholder: '#64748b',
  textSubtle: '#cbd5e1',

  link: '#3b82f6',
  accentIndigo: '#a5b4fc',

  aiPurple: '#8b5cf6',
  onAiPurple: '#ffffff',

  success: '#34d399',
  reportValue: '#38bdf8',

  card: 'rgba(30,41,59,0.92)',
  cardSoft: 'rgba(30,41,59,0.75)',
  chipBg: '#1e293b',
  primaryTint12: 'rgba(245,158,11,0.14)',
  primaryTint18: 'rgba(245,158,11,0.22)',
  walletInner: 'rgba(15,23,42,0.95)',
  walletBorderGlow: 'rgba(245,158,11,0.28)',

  error: '#fb7185',
  danger: '#ef4444',
  warning: '#fb923c',
  notification: '#f97316',

  dangerBorder: '#7f1d1d',
  dangerBg: 'rgba(127,29,29,0.15)',
  dangerText: '#fca5a5',

  tabBar: '#0b1120',
} as const;

export const paletteLight = {
  background: '#f8fafc',
  backgroundElevated: '#ffffff',
  surfaceDeep: '#f1f5f9',
  surfaceMid: '#ffffff',

  border: '#e2e8f0',
  borderMuted: '#cbd5e1',

  primary: '#ea580c',
  onPrimary: '#ffffff',

  text: '#0f172a',
  textSecondary: '#334155',
  textMuted: '#64748b',
  placeholder: '#94a3b8',
  textSubtle: '#475569',

  link: '#2563eb',
  accentIndigo: '#4f46e5',

  aiPurple: '#7c3aed',
  onAiPurple: '#ffffff',

  success: '#059669',
  reportValue: '#0284c7',

  card: 'rgba(255,255,255,0.97)',
  cardSoft: 'rgba(248,250,252,0.95)',
  chipBg: '#f1f5f9',
  primaryTint12: 'rgba(234,88,12,0.12)',
  primaryTint18: 'rgba(234,88,12,0.2)',
  walletInner: '#ffffff',
  walletBorderGlow: 'rgba(234,88,12,0.22)',

  error: '#e11d48',
  danger: '#dc2626',
  warning: '#ea580c',
  notification: '#ea580c',

  dangerBorder: '#fecaca',
  dangerBg: 'rgba(254,226,226,0.9)',
  dangerText: '#b91c1c',

  tabBar: '#ffffff',
} as const;

export const gradientsDark = {
  login: [paletteDark.background, paletteDark.backgroundElevated] as const,
  walletCard: [paletteDark.surfaceDeep, '#1e293b'] as const,
} as const;

export const gradientsLight = {
  login: [paletteLight.background, paletteLight.surfaceDeep] as const,
  walletCard: [paletteLight.surfaceDeep, '#e2e8f0'] as const,
} as const;

export const authUiDark = {
  bg: '#0f172a',
  card: '#1e293b',
  border: '#334155',
  inputBg: '#1e293b',
  label: '#94a3b8',
  text: '#f8fafc',
  muted: '#cbd5e1',
  placeholder: '#64748b',
  orange: '#f59e0b',
  orangePressed: '#d97706',
  onOrange: '#0f172a',
  // Gold/Beige colors from image
  gold: '#D4A574',
  goldPressed: '#B8935F',
  onGold: '#0f172a',
  errorText: '#fb7185',
  logoRing: '#1e293b',
  dim: 'rgba(15, 23, 42, 0.82)',
} as const;

export const authUiLight = {
  bg: '#f8fafc',
  card: '#ffffff',
  border: '#e2e8f0',
  inputBg: '#f1f5f9',
  label: '#475569',
  text: '#0f172a',
  muted: '#64748b',
  placeholder: '#94a3b8',
  orange: '#ea580c',
  orangePressed: '#c2410c',
  onOrange: '#ffffff',
  // Gold/Beige colors from image
  gold: '#C9A86C',
  goldPressed: '#B08F56',
  onGold: '#0f172a',
  errorText: '#dc2626',
  logoRing: '#fef3e2',
  dim: 'rgba(15, 23, 42, 0.35)',
} as const;

export type AppPalette = typeof paletteDark | typeof paletteLight;
export type AppGradients = typeof gradientsDark | typeof gradientsLight;
export type AuthUiPalette = typeof authUiDark | typeof authUiLight;
