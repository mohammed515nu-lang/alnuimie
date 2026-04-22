import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { initPaymentSheet, presentPaymentSheet } from '@stripe/stripe-react-native';

import { walletAPI } from '../../api/services';
import { getApiErrorMessage } from '../../api/http';
import { useStore } from '../../store/useStore';
import { getStripePublishableKey } from '../../wallet/stripeEnv';
import { acceptedContractorsForClient } from '../../utils/connections';
import { colors, pressableRipple, radius, space, touch } from '../../theme';

export function PayContractorScreen() {
  const user = useStore((s) => s.user);
  const connections = useStore((s) => s.connections);
  const refreshTransfers = useStore((s) => s.refreshTransfers);
  const addTransferLocal = useStore((s) => s.addTransferLocal);
  const updateTransferLocal = useStore((s) => s.updateTransferLocal);
  const refreshPaymentCards = useStore((s) => s.refreshPaymentCards);
  const refreshConnections = useStore((s) => s.refreshConnections);

  const contractors = useMemo(
    () => (user ? acceptedContractorsForClient(user, connections) : []),
    [user, connections]
  );

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [manualMode, setManualMode] = useState(false);
  const [manualToUserId, setManualToUserId] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [projectName, setProjectName] = useState('');
  const [busy, setBusy] = useState(false);

  const stripeOk = useMemo(() => !!getStripePublishableKey(), []);

  useEffect(() => {
    void refreshPaymentCards();
    void refreshConnections();
  }, [refreshConnections, refreshPaymentCards]);

  useEffect(() => {
    if (manualMode) return;
    if (contractors.length === 1) setSelectedId(contractors[0].id);
  }, [contractors, manualMode]);

  const effectiveToUserId = manualMode ? manualToUserId.trim() : (selectedId ?? '').trim();

  const toggleManual = () => {
    setManualMode((m) => {
      const next = !m;
      if (next) setSelectedId(null);
      else setManualToUserId('');
      return next;
    });
  };

  const onPay = async () => {
    if (!stripeOk) {
      return Alert.alert('Stripe غير مهيأ', 'أضف EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY في إعدادات البناء (.env أو EAS env).');
    }
    if (user?.role !== 'client') {
      return Alert.alert('تنبيه', 'هذه الشاشة مخصصة لحساب صاحب المشروع (عميل).');
    }
    const amt = Number(amount);
    if (!(amt > 0)) return Alert.alert('تنبيه', 'أدخل مبلغاً صحيحاً');
    if (!effectiveToUserId) {
      return Alert.alert(
        'تنبيه',
        manualMode
          ? 'أدخل معرف المقاول (ObjectId).'
          : 'اختر مقاولًا من جهات الاتصال المقبولة، أو فعّل الإدخال اليدوي.'
      );
    }

    setBusy(true);
    let transferId: string | undefined;
    try {
      const intent = await walletAPI.createClientToContractorIntent({
        amount: amt,
        toUserId: effectiveToUserId,
        description: description.trim() || undefined,
        projectName: projectName.trim() || undefined,
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
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        nestedScrollEnabled
      >
        <Text style={styles.title}>دفع عميل → مقاول</Text>
        <Text style={styles.hint}>
          بعد قبول طلب التواصل مع مقاول، يظهر هنا لاختياره مباشرة (بدون نسخ ObjectId).
        </Text>

        {!manualMode ? (
          <>
            {contractors.length === 0 ? (
              <Text style={styles.warn}>
                لا يوجد مقاولون في قائمة «اتصال مقبول». ابحث عن مقاول، أرسل طلب تواصل، وبعد قبوله عد إلى هذه الشاشة.
              </Text>
            ) : (
              <View style={styles.chipsWrap}>
                <FlatList
                  data={contractors}
                  keyExtractor={(item) => item.id}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.chipsRow}
                  nestedScrollEnabled
                  renderItem={({ item }) => {
                    const on = selectedId === item.id;
                    return (
                      <Pressable
                        accessibilityRole="button"
                        accessibilityState={{ selected: on }}
                        onPress={() => setSelectedId(item.id)}
                        {...pressableRipple(colors.primaryTint12)}
                        style={[styles.chip, on && styles.chipOn]}
                      >
                        <Text style={[styles.chipText, on && styles.chipTextOn]} numberOfLines={2}>
                          {item.name}
                        </Text>
                        <Text style={[styles.chipSub, on && styles.chipSubOn]}>مقاول</Text>
                      </Pressable>
                    );
                  }}
                />
              </View>
            )}
          </>
        ) : (
          <TextInput
            placeholder="معرف المقاول (ObjectId)"
            placeholderTextColor={colors.placeholder}
            style={styles.input}
            value={manualToUserId}
            onChangeText={setManualToUserId}
            autoCapitalize="none"
          />
        )}

        <Pressable
          accessibilityRole="button"
          onPress={toggleManual}
          {...pressableRipple(colors.primaryTint12, true)}
          style={styles.linkBtn}
        >
          <Text style={styles.linkText}>{manualMode ? 'العودة لقائمة المقاولين' : 'إدخال معرف يدويًا'}</Text>
        </Pressable>

        <TextInput
          placeholder="اسم المشروع (اختياري)"
          placeholderTextColor={colors.placeholder}
          style={styles.input}
          value={projectName}
          onChangeText={setProjectName}
        />
        <TextInput
          placeholder="المبلغ (USD)"
          placeholderTextColor={colors.placeholder}
          style={styles.input}
          value={amount}
          onChangeText={setAmount}
          keyboardType="decimal-pad"
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

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: space.lg, paddingBottom: space.xxl + 8 },
  title: { color: colors.text, fontSize: 18, fontWeight: '900', marginBottom: space.sm },
  hint: { color: colors.textMuted, marginBottom: space.md, lineHeight: 20 },
  warn: { color: colors.warning, marginBottom: space.md, lineHeight: 20 },
  chipsWrap: { maxHeight: 132, marginBottom: space.sm },
  chipsRow: { gap: space.sm + 2, paddingVertical: space.xs, marginBottom: space.sm },
  chip: {
    maxWidth: 168,
    paddingVertical: space.md,
    paddingHorizontal: space.md + 2,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.borderMuted,
    backgroundColor: colors.chipBg,
    minHeight: touch.minHeight,
    justifyContent: 'center',
  },
  chipOn: { borderColor: colors.primary, backgroundColor: colors.primaryTint12 },
  chipText: { color: colors.textSecondary, fontWeight: '800' },
  chipTextOn: { color: colors.text },
  chipSub: { color: colors.placeholder, marginTop: space.xs, fontSize: 12 },
  chipSubOn: { color: colors.primary },
  linkBtn: { marginBottom: space.md, minHeight: touch.minHeight, justifyContent: 'center' },
  linkText: { color: colors.primary, fontWeight: '800' },
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
