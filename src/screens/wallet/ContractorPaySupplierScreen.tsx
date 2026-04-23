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
import { initPaymentSheet, presentPaymentSheet } from '@stripe/stripe-react-native';

import { walletAPI } from '../../api/services';
import { getApiErrorMessage } from '../../api/http';
import { useStore } from '../../store/useStore';
import { getStripePaymentReturnURL } from '../../config/stripeDeepLink';
import { getStripePublishableKey } from '../../wallet/stripeEnv';
import { useAppTheme, pressableRipple, radius, space, touch } from '../../theme';
import { hapticSuccess } from '../../utils/haptics';
import { isIOS } from '../../utils/platformEnv';
import type { AppPalette } from '../../theme/palettes';

export function ContractorPaySupplierScreen() {
  const refreshTransfers = useStore((s) => s.refreshTransfers);
  const addTransferLocal = useStore((s) => s.addTransferLocal);
  const updateTransferLocal = useStore((s) => s.updateTransferLocal);
  const refreshPaymentCards = useStore((s) => s.refreshPaymentCards);

  const [amount, setAmount] = useState('');
  const [supplierName, setSupplierName] = useState('');
  const [description, setDescription] = useState('');
  const [busy, setBusy] = useState(false);

  const { colors } = useAppTheme();
  const styles = useMemo(() => createContractorPaySupplierStyles(colors), [colors]);

  const stripeOk = useMemo(() => !!getStripePublishableKey(), []);

  useEffect(() => {
    void refreshPaymentCards();
  }, [refreshPaymentCards]);

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
      await refreshTransfers();
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
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={isIOS ? 'padding' : undefined}
      keyboardVerticalOffset={isIOS ? 64 : 0}
    >
      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        contentInsetAdjustmentBehavior="automatic"
      >
        <Text style={styles.title}>دفع مقاول → مورد</Text>
        <Text style={styles.lead}>أدخل المبلغ واختياريًا اسم المورد والوصف.</Text>

        <TextInput
          placeholder="المبلغ (USD)"
          placeholderTextColor={colors.placeholder}
          style={styles.input}
          value={amount}
          onChangeText={setAmount}
          keyboardType="decimal-pad"
        />
        <TextInput
          placeholder="اسم المورد (اختياري)"
          placeholderTextColor={colors.placeholder}
          style={styles.input}
          value={supplierName}
          onChangeText={setSupplierName}
        />
        <TextInput
          placeholder="وصف (اختياري)"
          placeholderTextColor={colors.placeholder}
          style={styles.input}
          value={description}
          onChangeText={setDescription}
        />

        <Pressable
          accessibilityRole="button"
          disabled={busy}
          onPress={onPay}
          {...pressableRipple(colors.primaryTint18)}
          style={[styles.primary, busy && { opacity: 0.6 }]}
        >
          <Text style={styles.primaryText}>{busy ? 'جارٍ التنفيذ...' : 'دفع عبر Stripe'}</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function createContractorPaySupplierStyles(colors: AppPalette) {
  return StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: space.lg, paddingBottom: space.xxl + 8 },
  title: { color: colors.text, fontSize: 18, fontWeight: '900', marginBottom: space.sm },
  lead: { color: colors.textMuted, marginBottom: space.md, lineHeight: 20 },
  input: {
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: space.md,
    paddingVertical: space.md,
    color: colors.textSecondary,
    marginBottom: space.sm + 2,
    minHeight: touch.minHeight,
  },
  primary: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: space.md,
    marginTop: space.sm,
    minHeight: touch.minHeight,
    justifyContent: 'center',
  },
  primaryText: { color: colors.onPrimary, textAlign: 'center', fontWeight: '900' },
});
}
