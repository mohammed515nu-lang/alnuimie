// نظام الألوان الموحد للموقع - رمادي مزرق داكن
export const BRAND = {
  // الألوان الأساسية
  primary: 'var(--brand-primary)',
  accent: 'var(--brand-accent)',
  secondary: 'var(--brand-secondary)',
  dark: 'var(--brand-dark)',
  light: 'var(--brand-light)',

  // التدرجات - أصبحت تعتمد على المتغيرات لتتفاعل مع الوضع الليلي
  gradient: 'var(--brand-gradient)',
  gradientLight: 'var(--brand-gradient-light)',
  gradientDark: 'var(--brand-gradient-dark)',
  gradientHero: 'var(--brand-gradient-hero)',

  // ألوان محايدة
  background: 'var(--brand-background)',
  card: 'var(--brand-card)',
  muted: 'var(--brand-muted)',
  text: 'var(--brand-text)',

  // ألوان الحالات
  success: '#10b981',       // أخضر
  warning: '#f59e0b',       // برتقالي
  error: '#ef4444',         // أحمر
  info: '#0ea5e9',          // أزرق فاتح

  // ألوان خاصة
  white: '#ffffff',
  black: '#000000',

  // شفافيات
  alpha: {
    5: 'rgba(15, 23, 42, 0.05)',
    10: 'rgba(15, 23, 42, 0.1)',
    20: 'rgba(15, 23, 42, 0.2)',
    30: 'rgba(15, 23, 42, 0.3)',
    40: 'rgba(15, 23, 42, 0.4)',
    50: 'rgba(15, 23, 42, 0.5)',
  },

  accentAlpha: {
    10: 'rgba(58, 66, 79, 0.08)',
    20: 'rgba(58, 66, 79, 0.15)',
    30: 'rgba(58, 66, 79, 0.25)',
    40: 'rgba(58, 66, 79, 0.35)',
    50: 'rgba(58, 66, 79, 0.45)',
  },

  // ظلال محسّنة - رمادي مزرق
  shadows: {
    sm: '0 2px 8px rgba(58, 66, 79, 0.08)',
    md: '0 4px 20px rgba(58, 66, 79, 0.12)',
    lg: '0 8px 30px rgba(58, 66, 79, 0.18)',
    xl: '0 12px 40px rgba(58, 66, 79, 0.22)',
    accent: '0 8px 30px rgba(74, 85, 104, 0.3)',
  },

  // تأثيرات Glass Morphism
  glass: {
    light: 'rgba(255, 255, 255, 0.1)',
    dark: 'rgba(15, 23, 42, 0.85)',
    blur: 'blur(10px)',
  }
};

export default BRAND;
