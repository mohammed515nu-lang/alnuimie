import { isRunningInExpoGo } from 'expo';
import { Platform } from 'react-native';

/** في SDK 53+ لا يدعم Expo Go على أندرويد إشعارات الدفع — تجنّب تحميل الوحدة لتفادي أخطاء/ضجيج Metro. */
export function isRemotePushUnsupportedInThisRuntime(): boolean {
  return isRunningInExpoGo() && Platform.OS === 'android';
}

export type ExpoNotificationsModule = typeof import('expo-notifications');

let cachedModule: ExpoNotificationsModule | null | undefined;

/**
 * يحمّل expo-notifications عند الطلب فقط (لا يُستورد في Expo Go أندرويد).
 */
export async function loadExpoNotifications(): Promise<ExpoNotificationsModule | null> {
  if (Platform.OS === 'web') return null;
  if (isRemotePushUnsupportedInThisRuntime()) return null;
  if (cachedModule !== undefined) return cachedModule;
  try {
    cachedModule = await import('expo-notifications');
    return cachedModule;
  } catch {
    cachedModule = null;
    return null;
  }
}
