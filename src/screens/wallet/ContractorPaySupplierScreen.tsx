import { useEffect, useMemo, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { initPaymentSheet, presentPaymentSheet } from '@stripe/stripe-react-native';

import { walletAPI } from '../../api/services';
import { getApiErrorMessage } from '../../api/http';
import { useStore } from '../../store/useStore';
import { getStripePublishableKey } from '../../wallet/stripeEnv';

export function ContractorPaySupplierScreen() {
  const refreshTransfers = useStore((s) => s.refreshTransfers);
  const addTransferLocal = useStore((s) => s.addTransferLocal);
  const updateTransferLocal = useStore((s) => s.updateTransferLocal);
  const refreshPaymentCards = useStore((s) => s.refreshPaymentCards);

  const [amount, setAmount] = useState('');
  const [supplierName, setSupplierName] = useState('');
  const [description, setDescription] = useState('');
  const [busy, setBusy] = useState(false);

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
      Alert.alert('تم', 'تم إرسال الدفع للمعالجة/التأكيد من الخادم');
    } catch (e) {
      if (transferId) updateTransferLocal(transferId, { status: 'failed' });
      Alert.alert('تعذر الدفع', getApiErrorMessage(e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <View style={styles.root}>
      <Text style={styles.title}>دفع مقاول → مورد</Text>

      <TextInput placeholder="المبلغ (USD)" placeholderTextColor="#64748B" style={styles.input} value={amount} onChangeText={setAmount} keyboardType="decimal-pad" />
      <TextInput placeholder="اسم المورد (اختياري)" placeholderTextColor="#64748B" style={styles.input} value={supplierName} onChangeText={setSupplierName} />
      <TextInput placeholder="وصف (اختياري)" placeholderTextColor="#64748B" style={styles.input} value={description} onChangeText={setDescription} />

      <Pressable disabled={busy} onPress={onPay} style={[styles.primary, busy && { opacity: 0.6 }]}>
        <Text style={styles.primaryText}>{busy ? 'جارٍ التنفيذ...' : 'دفع عبر Stripe'}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0B1220', padding: 16 },
  title: { color: '#F8FAFC', fontSize: 18, fontWeight: '900', marginBottom: 12 },
  input: {
    backgroundColor: '#0B1220',
    borderColor: '#1F2937',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    color: '#E2E8F0',
    marginBottom: 10,
  },
  primary: { backgroundColor: '#38BDF8', borderRadius: 12, paddingVertical: 12, marginTop: 8 },
  primaryText: { color: '#0B1220', textAlign: 'center', fontWeight: '900' },
});
