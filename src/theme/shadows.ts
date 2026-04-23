import type { ViewStyle } from 'react-native';

import type { ResolvedScheme } from './palettes';

/** بطاقات على الخلفية الرئيسية */
export function surfaceLiftStyle(mode: ResolvedScheme): ViewStyle {
  if (mode === 'light') {
    return {
      borderCurve: 'continuous',
      boxShadow: '0 6px 22px rgba(15, 23, 42, 0.06)',
    };
  }
  return {
    borderCurve: 'continuous',
    boxShadow: '0 10px 28px rgba(15, 23, 42, 0.1)',
  };
}

/** بطاقة تسجيل الدخول */
export function authCardLiftStyle(mode: ResolvedScheme): ViewStyle {
  if (mode === 'light') {
    return {
      borderCurve: 'continuous',
      boxShadow: '0 0 0 1px rgba(234, 88, 12, 0.2), 0 16px 40px rgba(15, 23, 42, 0.08)',
    };
  }
  return {
    borderCurve: 'continuous',
    boxShadow: '0 0 0 1px rgba(245, 158, 11, 0.22), 0 22px 56px rgba(0, 0, 0, 0.55)',
  };
}

/** إطار بطاقة المحفظة */
export function walletCardHaloStyle(mode: ResolvedScheme): ViewStyle {
  if (mode === 'light') {
    return {
      borderCurve: 'continuous',
      boxShadow: '0 10px 32px rgba(15, 23, 42, 0.08)',
    };
  }
  return {
    borderCurve: 'continuous',
    boxShadow: '0 14px 40px rgba(15, 23, 42, 0.18)',
  };
}
