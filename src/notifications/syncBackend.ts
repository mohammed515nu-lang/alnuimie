import { AppState, type AppStateStatus, Platform } from 'react-native';

import { authAPI } from '../api/services/auth';
import { registerForExpoPushTokenAsync } from './push';

let lastSentToken: string | null = null;

export function clearRegisteredPushTokenCache(): void {
  lastSentToken = null;
}

/**
 * يطلب رمز Expo Push ويرسله للخادم (مرة لكل رمز جديد).
 * يتجاهل الفشل صامتاً (مثلاً إن لم يُنفَّذ المسار بعد على الخادم).
 */
export async function syncExpoPushTokenWithBackend(): Promise<void> {
  if (Platform.OS === 'web') return;

  const token = await registerForExpoPushTokenAsync();
  if (!token) return;
  if (lastSentToken === token) return;

  try {
    await authAPI.registerPushToken({
      expoPushToken: token,
      platform: Platform.OS === 'ios' ? 'ios' : 'android',
    });
    lastSentToken = token;
    if (__DEV__) {
      console.log('[notifications] Push token registered with backend');
    }
  } catch (e) {
    if (__DEV__) {
      console.warn('[notifications] registerPushToken skipped or failed', e);
    }
  }
}

/** اشتراك في `active`: مفيد بعد منح الإذن من إعدادات النظام أو الشاشة. */
export function subscribeAppActivePushResync(onActive: () => void): () => void {
  const handler = (s: AppStateStatus) => {
    if (s === 'active') onActive();
  };
  const sub = AppState.addEventListener('change', handler);
  return () => sub.remove();
}
