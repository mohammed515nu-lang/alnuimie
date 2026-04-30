import { useMemo, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { initPaymentSheet, presentPaymentSheet } from '@stripe/stripe-react-native';

import { walletAPI } from '../../api/services';
import { getApiErrorMessage } from '../../api/http';
import { useStore } from '../../store/useStore';
import { getStripePaymentReturnURL } from '../../config/stripeDeepLink';
import { getStripePublishableKey } from '../../wallet/stripeEnv';
import { TopBar } from '../../components/TopBar';
import { pressableRipple, space, touch, useAppTheme } from '../../theme';
import { DASHBOARD_RADIUS, getDashboardPalette, type DashboardPalette } from '../../theme/dashboardLight';
import { hapticSuccess } from '../../utils/haptics';

export function AddCardScreen() {
  const refreshPaymentCards = useStore((s) => s.refreshPaymentCards);
  const [busy, setBusy] = useState(false);
  const insets = useSafeAreaInsets();
  const { resolved } = useAppTheme();
  const dash = useMemo(() => getDashboardPalette(resolved), [resolved]);
  const styles = useMemo(() => createStyles(dash), [dash]);

  const stripeOk = useMemo(() => !!getStripePublishableKey(), []);

  const resolveStripeErrorMessage = (error: unknown) => {
    const msg = getApiErrorMessage(error);
    const lower = msg.toLowerCase();
    if (lower.includes('stripe_secret_key') || lower.includes('stripe is not configured')) {
      return 'خادم الدفع غير مهيأ بعد. أضف STRIPE_SECRET_KEY في بيئة الخادم (Render) ثم أعد تشغيل الخدمة.';
    }
    return msg;
  };

  const onAdd = async () => {
    if (!stripeOk) {
      return Alert.alert(
        'Stripe غير مهيأ',
        'مفتاح التطبيق غير موجود. أضف EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY في EAS production ثم اعمل build جديد.'
      );
    }
    setBusy(true);
    try {
      const si = await walletAPI.createSetupIntent();
      const { error: initError } = await initPaymentSheet({
        merchantDisplayName: 'بنيان',
        customerId: si.customerId,
        customerEphemeralKeySecret: si.ephemeralKeySecret,
        setupIntentClientSecret: si.setupIntentClientSecret,
        allowsDelayedPaymentMethods: true,
        returnURL: getStripePaymentReturnURL(),
      });
      if (initError) throw new Error(initError.message);

      const { error: presentError } = await presentPaymentSheet();
      if (presentError) {
        if (presentError.code === 'Canceled') return;
        throw new Error(presentError.message);
      }

      await walletAPI.syncCards();
      await refreshPaymentCards();
      hapticSuccess();
      Alert.alert('تم', 'تم حفظ البطاقة بنجاح');
    } catch (e) {
      Alert.alert('تعذر إضافة البطاقة', resolveStripeErrorMessage(e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <TopBar tone="beige" title="إضافة بطاقة" />
      <View style={[styles.root, { paddingBottom: 24 + insets.bottom }]}>
        <Text style={styles.title}>إضافة بطاقة عبر Stripe</Text>
        <Text style={styles.body}>
          سيتم فتح واجهة Stripe الآمنة لإدخال بيانات البطاقة. بعد النجاح، يتم حفظ PaymentMethod على الخادم.
        </Text>

        <Pressable
          accessibilityRole="button"
          disabled={busy}
          onPress={onAdd}
          {...pressableRipple(dash.goldTint)}
          style={[styles.primary, busy && { opacity: 0.6 }]}
        >
          <Text style={styles.primaryText}>{busy ? 'جارٍ التنفيذ...' : 'بدء إضافة البطاقة'}</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

function createStyles(dash: DashboardPalette) {
  return StyleSheet.create({
    safe: { flex: 1, backgroundColor: dash.pageBg },
    root: { flex: 1, paddingHorizontal: 16, paddingTop: 8 },
    title: { color: dash.navy, fontSize: 18, fontWeight: '900', marginBottom: 10, textAlign: 'right' },
    body: { color: dash.muted, lineHeight: 22, marginBottom: 20, textAlign: 'right', fontSize: 14 },
    primary: {
      backgroundColor: dash.gold,
      borderRadius: DASHBOARD_RADIUS,
      paddingVertical: space.md,
      minHeight: touch.minHeight,
      justifyContent: 'center',
    },
    primaryText: { color: dash.onGold, textAlign: 'center', fontWeight: '900', fontSize: 16 },
  });
}
