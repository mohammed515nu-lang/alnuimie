import Constants from 'expo-constants';
import type { Href, Router } from 'expo-router';
import * as Device from 'expo-device';
import { Linking, Platform } from 'react-native';

import { loadExpoNotifications } from './loadNotifications';

export const ANDROID_DEFAULT_CHANNEL_ID = 'default';

export type NotificationPermissionStatus = 'granted' | 'denied' | 'undetermined';

/** قناة أندرويد الافتراضية — مطلوبة لعرض الإشعارات على 8+ */
export async function ensureAndroidNotificationChannel(): Promise<void> {
  if (Platform.OS !== 'android') return;
  const Notifications = await loadExpoNotifications();
  if (!Notifications) return;
  await Notifications.setNotificationChannelAsync(ANDROID_DEFAULT_CHANNEL_ID, {
    name: 'عام',
    importance: Notifications.AndroidImportance.DEFAULT,
    vibrationPattern: [0, 250, 250, 250],
    lightColor: '#a67c52',
    sound: 'default',
  });
}

function resolveProjectId(): string | undefined {
  const extra = Constants.expoConfig?.extra as { eas?: { projectId?: string } } | undefined;
  return extra?.eas?.projectId ?? Constants.easConfig?.projectId;
}

/** طلب الإذن وجلب رمز Expo Push (للأجهزة الحقيقية فقط). */
export async function registerForExpoPushTokenAsync(): Promise<string | null> {
  if (Platform.OS === 'web') return null;

  const Notifications = await loadExpoNotifications();
  if (!Notifications) return null;

  await ensureAndroidNotificationChannel();

  if (!Device.isDevice) {
    return null;
  }

  const { status: existing } = await Notifications.getPermissionsAsync();
  let finalStatus = existing;
  if (existing !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== 'granted') {
    return null;
  }

  const projectId = resolveProjectId();
  if (!projectId) {
    console.warn('[notifications] Missing EAS projectId in app.config extra.eas.projectId');
    return null;
  }

  try {
    const res = await Notifications.getExpoPushTokenAsync({ projectId });
    return res.data ?? null;
  } catch (e) {
    console.warn('[notifications] getExpoPushTokenAsync failed', e);
    return null;
  }
}

export async function getNotificationPermissionStatus(): Promise<NotificationPermissionStatus | null> {
  if (Platform.OS === 'web') return null;
  const Notifications = await loadExpoNotifications();
  if (!Notifications) return null;
  const { status } = await Notifications.getPermissionsAsync();
  return status as NotificationPermissionStatus;
}

export function openNotificationSystemSettings(): void {
  void Linking.openSettings();
}

export type ParsedNotificationData = {
  conversationId?: string;
  title?: string;
  href?: string;
};

export function parseNotificationData(data: unknown): ParsedNotificationData {
  if (!data || typeof data !== 'object') return {};
  const o = data as Record<string, unknown>;
  return {
    conversationId: typeof o.conversationId === 'string' ? o.conversationId : undefined,
    title: typeof o.title === 'string' ? o.title : undefined,
    href: typeof o.href === 'string' ? o.href : undefined,
  };
}

/** التنقّل من payload إشعار (نقرة أو استجابة أخيرة). */
export function navigateFromNotificationPayload(router: Router, data: ParsedNotificationData): void {
  const cid = data.conversationId?.trim();
  if (cid) {
    const title = (data.title ?? 'محادثة').trim() || 'محادثة';
    router.push({
      pathname: '/chat-room/[conversationId]',
      params: { conversationId: cid, title },
    } as const);
    return;
  }
  const href = data.href?.trim();
  if (href) {
    router.push(href as Href);
  }
}
