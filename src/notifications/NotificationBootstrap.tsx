import { useEffect, useRef } from 'react';
import { useRouter } from 'expo-router';
import { Platform } from 'react-native';

import { useStore } from '../store/useStore';
import { loadExpoNotifications } from './loadNotifications';
import { navigateFromNotificationPayload, parseNotificationData } from './push';
import {
  clearRegisteredPushTokenCache,
  subscribeAppActivePushResync,
  syncExpoPushTokenWithBackend,
} from './syncBackend';

let handlerConfigured = false;

/**
 * يفعّل طلب الإذن/رمز الدفع بعد تسجيل الدخول، ويستمع لنقرات الإشعارات.
 * ضع المكوّن داخل جذر التوجيه (بجانب Stack).
 */
export function NotificationBootstrap() {
  const user = useStore((s) => s.user);
  const router = useRouter();
  const routerRef = useRef(router);
  routerRef.current = router;
  const coldStartHandled = useRef(false);
  const listenersCleanupRef = useRef<(() => void) | undefined>(undefined);

  useEffect(() => {
    if (Platform.OS === 'web') return;

    let cancelled = false;

    void (async () => {
      const Notifications = await loadExpoNotifications();
      if (cancelled || !Notifications) return;

      if (!handlerConfigured) {
        handlerConfigured = true;
        Notifications.setNotificationHandler({
          handleNotification: async () => ({
            shouldShowAlert: true,
            shouldPlaySound: true,
            shouldSetBadge: true,
            shouldShowBanner: true,
            shouldShowList: true,
          }),
        });
      }

      const sub = Notifications.addNotificationResponseReceivedListener((response) => {
        const data = parseNotificationData(response.notification.request.content.data);
        navigateFromNotificationPayload(routerRef.current, data);
      });

      listenersCleanupRef.current = () => sub.remove();

      if (!coldStartHandled.current) {
        coldStartHandled.current = true;
        const response = await Notifications.getLastNotificationResponseAsync();
        if (cancelled) return;
        if (response) {
          const data = parseNotificationData(response.notification.request.content.data);
          navigateFromNotificationPayload(routerRef.current, data);
        }
      }
    })();

    return () => {
      cancelled = true;
      listenersCleanupRef.current?.();
      listenersCleanupRef.current = undefined;
    };
  }, []);

  useEffect(() => {
    if (Platform.OS === 'web') return;
    const uid = user?._id ? String(user._id) : null;
    if (!uid) {
      clearRegisteredPushTokenCache();
      return;
    }

    let cancelled = false;
    const run = () => {
      if (!cancelled) void syncExpoPushTokenWithBackend();
    };
    run();
    const unsub = subscribeAppActivePushResync(run);
    return () => {
      cancelled = true;
      unsub();
    };
  }, [user?._id]);

  return null;
}
