import { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';

import { TopBar } from '../../components/TopBar';
import { DASHBOARD_TAB_BAR_SCROLL_BASE } from '../../constants/dashboardTabBar';
import { isRemotePushUnsupportedInThisRuntime } from '../../notifications/loadNotifications';
import {
  ensureAndroidNotificationChannel,
  getNotificationPermissionStatus,
  openNotificationSystemSettings,
  registerForExpoPushTokenAsync,
  type NotificationPermissionStatus,
} from '../../notifications/push';
import { syncExpoPushTokenWithBackend } from '../../notifications/syncBackend';
import { pressableRipple, space, touch, useAppTheme } from '../../theme';
import { DASHBOARD_RADIUS, getDashboardPalette, type DashboardPalette } from '../../theme/dashboardLight';
import { hapticLight } from '../../utils/haptics';

function statusLabelAr(status: NotificationPermissionStatus): string {
  switch (status) {
    case 'granted':
      return 'مفعّل';
    case 'denied':
      return 'مرفوض — يمكن التفعيل من إعدادات الجهاز';
    case 'undetermined':
      return 'لم يُطلب بعد';
    default:
      return String(status);
  }
}

export function NotificationSettingsScreen() {
  const insets = useSafeAreaInsets();
  const tabPad = DASHBOARD_TAB_BAR_SCROLL_BASE + insets.bottom + space.lg;
  const { resolved } = useAppTheme();
  const dash = useMemo(() => getDashboardPalette(resolved), [resolved]);
  const styles = useMemo(() => createStyles(dash), [dash]);
  const expoGoAndroid = useMemo(() => isRemotePushUnsupportedInThisRuntime(), []);

  const [permission, setPermission] = useState<NotificationPermissionStatus | null>(null);
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const refreshStatus = useCallback(async () => {
    const status = await getNotificationPermissionStatus();
    setPermission(status);
  }, []);

  useFocusEffect(
    useCallback(() => {
      void refreshStatus();
    }, [refreshStatus])
  );

  const onEnable = async () => {
    if (Platform.OS === 'web') {
      Alert.alert('غير متاح', 'الإشعار الفوري غير مدعوم على الويب في هذا الإصدار.');
      return;
    }
    if (expoGoAndroid) {
      Alert.alert(
        'Expo Go على أندرويد',
        'إشعارات الدفع عن بُعد غير مدعومة في Expo Go منذ SDK 53. استخدم Development Build (`npx expo run:android` أو EAS) لتجربة الإشعارات كاملة.',
        [{ text: 'حسناً' }]
      );
      return;
    }
    setBusy(true);
    try {
      await ensureAndroidNotificationChannel();
      const token = await registerForExpoPushTokenAsync();
      await refreshStatus();
      setExpoPushToken(token);
      if (token) {
        await syncExpoPushTokenWithBackend();
        Alert.alert('تم', 'تم تفعيل الإشعارات وتسجيل الجهاز على الخادم (إن كان المسار مفعّلاً).');
      } else {
        const status = await getNotificationPermissionStatus();
        if (status === 'denied') {
          Alert.alert(
            'الإذن مرفوض',
            'فعّل الإشعارات من إعدادات النظام لهذا التطبيق.',
            [
              { text: 'إلغاء', style: 'cancel' },
              { text: 'فتح الإعدادات', onPress: openNotificationSystemSettings },
            ]
          );
        } else {
          Alert.alert(
            'تنبيه',
            'تأكد أنك على جهاز حقيقي، وأن المشروع يستخدم EAS (projectId) لإصدار رمز الدفع.'
          );
        }
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <TopBar tone="beige" title="الإشعارات" />
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: tabPad }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {expoGoAndroid ? (
          <View style={styles.warnBanner}>
            <Ionicons name="information-circle-outline" size={22} color={dash.navy} />
            <Text style={styles.warnText}>
              على أندرويد داخل Expo Go لا تُحمَّل وحدة الإشعارات لتجنّب أخطاء Metro. لاختبار الدفع استخدم{' '}
              <Text style={styles.warnBold}>development build</Text> (مثلاً `eas build --profile development`).
            </Text>
          </View>
        ) : null}

        <Text style={styles.lead}>
          استلم تنبيهات للرسائل والطلبات والمشاريع عندما يدعمها الخادم. فعّل الإذن هنا ثم اربط الرمز في لوحة الخادم
          (Expo Push).
        </Text>

        <View style={styles.card}>
          <View style={styles.row}>
            <Ionicons name="notifications-outline" size={22} color={dash.navy} />
            <View style={styles.rowText}>
              <Text style={styles.cardTitle}>حالة الإذن</Text>
              <Text style={styles.cardSub}>
                {permission == null ? '…' : expoGoAndroid ? 'غير متاح في Expo Go (أندرويد)' : statusLabelAr(permission)}
              </Text>
            </View>
          </View>

          <Pressable
            accessibilityRole="button"
            disabled={busy || expoGoAndroid}
            onPress={() => {
              hapticLight();
              void onEnable();
            }}
            style={[styles.primary, (busy || expoGoAndroid) && { opacity: 0.55 }]}
            {...pressableRipple(dash.goldTint)}
          >
            {busy ? (
              <ActivityIndicator color={dash.onGold} />
            ) : (
              <Text style={styles.primaryText}>طلب الإذن وتفعيل الإشعارات</Text>
            )}
          </Pressable>

          <Pressable
            accessibilityRole="button"
            onPress={() => {
              hapticLight();
              openNotificationSystemSettings();
            }}
            style={styles.secondary}
            {...pressableRipple(dash.navyTint)}
          >
            <Text style={styles.secondaryText}>فتح إعدادات التطبيق في الجهاز</Text>
          </Pressable>
        </View>

        {__DEV__ && expoPushToken ? (
          <View style={styles.devCard}>
            <Text style={styles.devTitle}>رمز Expo Push (للتطوير فقط)</Text>
            <Text selectable style={styles.devToken}>
              {expoPushToken}
            </Text>
          </View>
        ) : null}

        <Text style={styles.hint}>
          عند إرسال إشعار من الخادم، يمكن تضمين حقول مثل conversationId وtitle للانتقال مباشرة إلى المحادثة.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function createStyles(dash: DashboardPalette) {
  return StyleSheet.create({
    safe: { flex: 1, backgroundColor: dash.pageBg },
    scroll: { paddingHorizontal: 16, paddingTop: 8 },
    warnBanner: {
      flexDirection: 'row-reverse',
      alignItems: 'flex-start',
      gap: 10,
      padding: space.md,
      marginBottom: space.md,
      borderRadius: DASHBOARD_RADIUS,
      backgroundColor: 'rgba(37, 99, 235, 0.1)',
      borderWidth: 1,
      borderColor: 'rgba(37, 99, 235, 0.25)',
    },
    warnText: {
      flex: 1,
      fontSize: 13,
      lineHeight: 20,
      color: dash.darkText,
      textAlign: 'right',
    },
    warnBold: { fontWeight: '800', color: dash.navy },
    lead: {
      color: dash.muted,
      fontSize: 14,
      lineHeight: 22,
      textAlign: 'right',
      marginBottom: space.md,
    },
    card: {
      backgroundColor: dash.white,
      borderRadius: DASHBOARD_RADIUS,
      borderWidth: 1,
      borderColor: dash.border,
      padding: space.md,
      gap: space.md,
    },
    row: { flexDirection: 'row-reverse', alignItems: 'center', gap: 12 },
    rowText: { flex: 1, alignItems: 'flex-end' },
    cardTitle: { fontSize: 16, fontWeight: '800', color: dash.darkText, textAlign: 'right' },
    cardSub: { fontSize: 13, color: dash.muted, textAlign: 'right', marginTop: 4 },
    primary: {
      backgroundColor: dash.gold,
      borderRadius: DASHBOARD_RADIUS,
      paddingVertical: space.md,
      minHeight: touch.minHeight,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: dash.gold,
    },
    primaryText: { color: dash.onGold, fontWeight: '900', fontSize: 15 },
    secondary: {
      backgroundColor: dash.white,
      borderRadius: DASHBOARD_RADIUS,
      paddingVertical: space.md,
      minHeight: touch.minHeight,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: dash.border,
    },
    secondaryText: { color: dash.navy, fontWeight: '800', fontSize: 14 },
    devCard: {
      marginTop: space.md,
      padding: space.md,
      borderRadius: DASHBOARD_RADIUS,
      backgroundColor: 'rgba(26, 43, 68, 0.06)',
      borderWidth: 1,
      borderColor: dash.border,
    },
    devTitle: { fontSize: 12, fontWeight: '700', color: dash.muted, textAlign: 'right', marginBottom: 8 },
    devToken: { fontSize: 11, color: dash.darkText, textAlign: 'left' },
    hint: {
      marginTop: space.lg,
      fontSize: 12,
      color: dash.muted,
      textAlign: 'right',
      lineHeight: 18,
    },
  });
}
