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
  }
};

export default BRAND;
