import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
} from 'react-native';
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
import { isIOS } from '../../utils/platformEnv';
import { useKeyboardHeight } from '../../utils/useKeyboardHeight';

export function ContractorPaySupplierScreen() {
  const addTransferLocal = useStore((s) => s.addTransferLocal);
  const updateTransferLocal = useStore((s) => s.updateTransferLocal);
  const insets = useSafeAreaInsets();
  const keyboardHeight = useKeyboardHeight();
  const { resolved } = useAppTheme();
  const dash = useMemo(() => getDashboardPalette(resolved), [resolved]);
  const styles = useMemo(() => createStyles(dash), [dash]);

  const [amount, setAmount] = useState('');
  const [supplierName, setSupplierName] = useState('');
  const [description, setDescription] = useState('');
  const [busy, setBusy] = useState(false);

  const stripeOk = useMemo(() => !!getStripePublishableKey(), []);

  useEffect(() => {
    void useStore.getState().refreshPaymentCards();
  }, []);

  const onPay = async () => {
    if (!stripeOk) {
      return Alert.alert('Stripe غير مهيأ', 'أضف EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY في إعدادات البناء (.env أو EAS env).');
    }
    const amt = Number(amount);
    if (!(amt > 0)) return Alert.alert('تنبيه', 'أدخل مبلغاً صحيحاً');

    setBusy(true);
    let transferId: string | undefined;
    try {
      const intent = await walletAPI.createContractorToSupplierIntent({
        amount: amt,
        toSupplierName: supplierName.trim() || undefined,
        description: description.trim() || undefined,
        currency: 'usd',
      });
      transferId = intent.transfer.id;
      addTransferLocal(intent.transfer);

      const { error: initError } = await initPaymentSheet({
        merchantDisplayName: 'بنيان',
        customerId: intent.customerId,
        customerEphemeralKeySecret: intent.ephemeralKeySecret,
        paymentIntentClientSecret: intent.clientSecret,
        allowsDelayedPaymentMethods: true,
        returnURL: getStripePaymentReturnURL(),
      });
      if (initError) throw new Error(initError.message);

      const { error: presentError } = await presentPaymentSheet();
      if (presentError) {
        if (presentError.code === 'Canceled') {
          updateTransferLocal(transferId, { status: 'cancelled' });
          return;
        }
        throw new Error(presentError.message);
      }

      const latest = await walletAPI.confirmTransfer(transferId);
      addTransferLocal(latest);
      await useStore.getState().refreshTransfers();
      hapticSuccess();
      Alert.alert('تم', 'تم إرسال الدفع للمعالجة/التأكيد من الخادم');
    } catch (e) {
      if (transferId) updateTransferLocal(transferId, { status: 'failed' });
      Alert.alert('تعذر الدفع', getApiErrorMessage(e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <TopBar tone="beige" title="دفع الموردين" />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={isIOS ? 'padding' : undefined}
        keyboardVerticalOffset={isIOS ? 64 : 0}
      >
        <ScrollView
          style={styles.flex}
          contentContainerStyle={[styles.scroll, { paddingBottom: 24 + insets.bottom + keyboardHeight }]}
          keyboardShouldPersistTaps="handled"
          contentInsetAdjustmentBehavior="automatic"
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.lead}>أدخل المبلغ واختياريًا اسم المورد والوصف، ثم أكمل الدفع عبر Stripe.</Text>

          <Text style={styles.fieldLabel}>المبلغ (USD)</Text>
          <TextInput
            placeholder="المبلغ"
            placeholderTextColor={dash.muted}
            style={styles.input}
            value={amount}
            onChangeText={setAmount}
            keyboardType="decimal-pad"
            textAlign="right"
          />
          <Text style={styles.fieldLabel}>اسم المورد (اختياري)</Text>
          <TextInput
            placeholder="اسم المورد"
            placeholderTextColor={dash.muted}
            style={styles.input}
            value={supplierName}
            onChangeText={setSupplierName}
            textAlign="right"
          />
          <Text style={styles.fieldLabel}>وصف (اختياري)</Text>
          <TextInput
            placeholder="وصف الدفع"
            placeholderTextColor={dash.muted}
            style={[styles.input, styles.inputMultiline]}
            value={description}
            onChangeText={setDescription}
            textAlign="right"
            multiline
          />

          <Pressable
            accessibilityRole="button"
            disabled={busy}
            onPress={onPay}
            {...pressableRipple(dash.goldTint)}
            style={[styles.primary, busy && { opacity: 0.6 }]}
          >
            <Text style={styles.primaryText}>{busy ? 'جارٍ التنفيذ...' : 'دفع عبر Stripe'}</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function createStyles(dash: DashboardPalette) {
  return StyleSheet.create({
    safe: { flex: 1, backgroundColor: dash.pageBg },
    flex: { flex: 1 },
    scroll: { paddingHorizontal: 16, paddingTop: 4 },
    lead: { color: dash.muted, marginBottom: space.md, lineHeight: 22, textAlign: 'right', fontSize: 14 },
    fieldLabel: {
      color: dash.muted,
      fontSize: 13,
      fontWeight: '700',
      textAlign: 'right',
      marginBottom: 8,
      marginTop: 4,
    },
    input: {
      backgroundColor: dash.white,
      borderColor: dash.border,
      borderWidth: 1,
      borderRadius: 12,
      paddingHorizontal: space.md,
      paddingVertical: space.md,
      color: dash.darkText,
      marginBottom: space.sm,
      minHeight: touch.minHeight,
      fontSize: 16,
    },
    inputMultiline: { minHeight: 100, textAlignVertical: 'top' },
    primary: {
      backgroundColor: dash.gold,
      borderRadius: DASHBOARD_RADIUS,
      paddingVertical: space.md,
      marginTop: space.md,
      minHeight: touch.minHeight,
      justifyContent: 'center',
    },
    primaryText: { color: dash.onGold, textAlign: 'center', fontWeight: '900', fontSize: 16 },
  });
}
