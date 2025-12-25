<<<<<<< HEAD
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
=======
// نظام الألوان الموحد للموقع - الأخضر الفاتح المريح للعين
export const BRAND = {
  // الألوان الأساسية
  primary: '#4caf50',        // أخضر أساسي
  accent: '#66bb6a',         // أخضر فاتح
  secondary: '#388e3c',      // أخضر داكن
  dark: '#2e7d32',           // أخضر غامق جداً
  
  // التدرجات
  gradient: 'linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)',
  gradientLight: 'linear-gradient(135deg, #388e3c 0%, #4caf50 50%, #66bb6a 100%)',
  gradientDark: 'linear-gradient(135deg, #2e7d32 0%, #388e3c 100%)',
  
  // ألوان محايدة
  light: '#f8fafc',
  muted: '#6c757d',
  
  // ألوان الحالات
  success: '#43a047',
  warning: '#ff9800',
  error: '#ef5350',
  info: '#42a5f5',
  
  // ألوان خاصة
  white: '#ffffff',
  black: '#000000',
  
  // شفافيات الأخضر
  greenAlpha: {
    10: 'rgba(76, 175, 80, 0.1)',
    20: 'rgba(76, 175, 80, 0.2)',
    30: 'rgba(76, 175, 80, 0.3)',
    40: 'rgba(76, 175, 80, 0.4)',
    50: 'rgba(76, 175, 80, 0.5)',
  },
  
  // ظلال محسّنة
  shadows: {
    sm: '0 2px 8px rgba(76, 175, 80, 0.1)',
    md: '0 4px 20px rgba(76, 175, 80, 0.15)',
    lg: '0 8px 30px rgba(76, 175, 80, 0.2)',
    xl: '0 12px 40px rgba(76, 175, 80, 0.25)',
>>>>>>> b0b3e7e3988920175cf99ac38c343c8fdac3bdfc
  }
};

export default BRAND;
