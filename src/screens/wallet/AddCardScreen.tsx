import { useMemo, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { initPaymentSheet, presentPaymentSheet } from '@stripe/stripe-react-native';

import { walletAPI } from '../../api/services';
import { getApiErrorMessage } from '../../api/http';
import { useStore } from '../../store/useStore';
import { getStripePublishableKey } from '../../wallet/stripeEnv';

export function AddCardScreen() {
  const refreshPaymentCards = useStore((s) => s.refreshPaymentCards);
  const [busy, setBusy] = useState(false);

  const stripeOk = useMemo(() => !!getStripePublishableKey(), []);

  const onAdd = async () => {
    if (!stripeOk) {
      return Alert.alert('Stripe غير مهيأ', 'أضف EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY في إعدادات البناء (.env أو EAS env).');
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
      });
      if (initError) throw new Error(initError.message);

      const { error: presentError, paymentOption } = await presentPaymentSheet();
      if (presentError) {
        if (presentError.code === 'Canceled') return;
        throw new Error(presentError.message);
      }

      const pmId = (paymentOption as unknown as { id?: string } | null)?.id;
      if (!pmId) throw new Error('لم يتم استلام paymentMethodId');

      await walletAPI.saveCard(pmId, true);
      await refreshPaymentCards();
      Alert.alert('تم', 'تم حفظ البطاقة');
    } catch (e) {
      Alert.alert('تعذر إضافة البطاقة', getApiErrorMessage(e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <View style={styles.root}>
      <Text style={styles.title}>إضافة بطاقة عبر Stripe</Text>
      <Text style={styles.body}>
        سيتم فتح واجهة Stripe الآمنة لإدخال بيانات البطاقة. بعد النجاح، يتم حفظ PaymentMethod على الخادم.
      </Text>

      <Pressable disabled={busy} onPress={onAdd} style={[styles.primary, busy && { opacity: 0.6 }]}>
        <Text style={styles.primaryText}>{busy ? 'جارٍ التنفيذ...' : 'بدء إضافة البطاقة'}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0B1220', padding: 16 },
  title: { color: '#F8FAFC', fontSize: 18, fontWeight: '900', marginBottom: 10 },
  body: { color: '#94A3B8', lineHeight: 22, marginBottom: 14 },
  primary: { backgroundColor: '#38BDF8', borderRadius: 12, paddingVertical: 12 },
  primaryText: { color: '#0B1220', textAlign: 'center', fontWeight: '900' },
});
