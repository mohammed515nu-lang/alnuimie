import { Platform, type PressableAndroidRippleConfig } from 'react-native';

/** مسافات ثابتة — حافظ على إيقاع بصري موحّد */
export const space = { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24 } as const;

/** زوايا: حقول md، بطاقات xl */
export const radius = { sm: 10, md: 12, lg: 14, xl: 16 } as const;

/** حد أدنى مريح للمس (إرشادات WCAG تقريبية) */
export const touch = { minHeight: 48, minWidth: 44 } as const;

export const hitSlop = { top: 10, bottom: 10, left: 10, right: 10 } as const;

/** تموج مادي على أندرويد — يعطي استجابة لمس أوضح */
export function pressableRipple(
  color: string,
  borderless = false
): { android_ripple?: PressableAndroidRippleConfig } {
  if (Platform.OS !== 'android') return {};
  return { android_ripple: { color, borderless } };
}
