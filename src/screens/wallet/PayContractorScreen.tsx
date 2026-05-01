import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { initPaymentSheet, presentPaymentSheet } from '@stripe/stripe-react-native';

import { walletAPI } from '../../api/services';
import { getApiErrorMessage } from '../../api/http';
import { useStore } from '../../store/useStore';
import { getStripePaymentReturnURL } from '../../config/stripeDeepLink';
import { getStripePublishableKey } from '../../wallet/stripeEnv';
import { acceptedContractorsForClient } from '../../utils/connections';
import { TopBar } from '../../components/TopBar';
import { pressableRipple, space, touch, useAppTheme } from '../../theme';
import { DASHBOARD_RADIUS, getDashboardPalette, type DashboardPalette } from '../../theme/dashboardLight';
import { hapticSuccess } from '../../utils/haptics';
import { isIOS } from '../../utils/platformEnv';
import { useKeyboardHeight } from '../../utils/useKeyboardHeight';

export function PayContractorScreen() {
  const user = useStore((s) => s.user);
  const connections = useStore((s) => s.connections);
  const addTransferLocal = useStore((s) => s.addTransferLocal);
  const updateTransferLocal = useStore((s) => s.updateTransferLocal);
  const insets = useSafeAreaInsets();
  const keyboardHeight = useKeyboardHeight();
  const { resolved } = useAppTheme();
  const dash = useMemo(() => getDashboardPalette(resolved), [resolved]);
  const styles = useMemo(() => createStyles(dash), [dash]);

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
    void useStore.getState().refreshPaymentCards();
    void useStore.getState().refreshConnections();
  }, []);

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
      <TopBar tone="beige" title="دفع لمقاول" />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={isIOS ? 'padding' : undefined}
        keyboardVerticalOffset={isIOS ? 64 : 0}
      >
        <ScrollView
          style={styles.flex}
          contentContainerStyle={[styles.scroll, { paddingBottom: 24 + insets.bottom + keyboardHeight }]}
          keyboardShouldPersistTaps="handled"
          nestedScrollEnabled
          contentInsetAdjustmentBehavior="automatic"
          showsVerticalScrollIndicator={false}
        >
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
                    contentInsetAdjustmentBehavior="automatic"
                    renderItem={({ item }) => {
                      const on = selectedId === item.id;
                      return (
                        <Pressable
                          accessibilityRole="button"
                          accessibilityLabel={`اختيار المقاول ${item.name}`}
                          accessibilityState={{ selected: on }}
                          onPress={() => setSelectedId(item.id)}
                          {...pressableRipple(dash.goldTint)}
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
              placeholderTextColor={dash.muted}
              style={styles.input}
              value={manualToUserId}
              onChangeText={setManualToUserId}
              autoCapitalize="none"
              textAlign="right"
            />
          )}

          <Pressable
            accessibilityRole="button"
            onPress={toggleManual}
            {...pressableRipple(dash.navyTint, true)}
            style={styles.linkBtn}
          >
            <Text style={styles.linkText}>{manualMode ? 'العودة لقائمة المقاولين' : 'إدخال معرف يدويًا'}</Text>
          </Pressable>

          <TextInput
            placeholder="اسم المشروع (اختياري)"
            placeholderTextColor={dash.muted}
            style={styles.input}
            value={projectName}
            onChangeText={setProjectName}
            textAlign="right"
          />
          <TextInput
            placeholder="المبلغ (USD)"
            placeholderTextColor={dash.muted}
            style={styles.input}
            value={amount}
            onChangeText={setAmount}
            keyboardType="decimal-pad"
            textAlign="right"
          />
          <TextInput
            placeholder="وصف (اختياري)"
            placeholderTextColor={dash.muted}
            style={styles.input}
            value={description}
            onChangeText={setDescription}
            textAlign="right"
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
    scroll: { paddingHorizontal: 16, paddingTop: 8 },
    hint: { color: dash.muted, marginBottom: 14, lineHeight: 22, textAlign: 'right', fontSize: 14 },
    warn: { color: dash.gold, marginBottom: 14, lineHeight: 22, textAlign: 'right', fontWeight: '700' },
    chipsWrap: { maxHeight: 132, marginBottom: 8 },
    chipsRow: { gap: 10, paddingVertical: 4, marginBottom: 8, paddingLeft: 4 },
    chip: {
      maxWidth: 168,
      paddingVertical: space.md,
      paddingHorizontal: space.md + 2,
      borderRadius: DASHBOARD_RADIUS,
      borderWidth: 1,
      borderColor: dash.border,
      backgroundColor: dash.white,
      minHeight: touch.minHeight,
      justifyContent: 'center',
    },
    chipOn: { borderColor: dash.gold, backgroundColor: dash.goldTint },
    chipText: { color: dash.darkText, fontWeight: '800', textAlign: 'center' },
    chipTextOn: { color: dash.navy },
    chipSub: { color: dash.muted, marginTop: 4, fontSize: 12, textAlign: 'center' },
    chipSubOn: { color: dash.gold, fontWeight: '700' },
    linkBtn: { marginBottom: 14, minHeight: touch.minHeight, justifyContent: 'center' },
    linkText: { color: dash.gold, fontWeight: '800', textAlign: 'right', fontSize: 15 },
    input: {
      backgroundColor: dash.white,
      borderColor: dash.border,
      borderWidth: 1,
      borderRadius: 12,
      paddingHorizontal: space.md,
      paddingVertical: space.md,
      color: dash.darkText,
      marginBottom: 10,
      minHeight: touch.minHeight,
      fontSize: 16,
    },
    primary: {
      backgroundColor: dash.gold,
      borderRadius: DASHBOARD_RADIUS,
      paddingVertical: space.md,
      marginTop: 8,
      minHeight: touch.minHeight,
      justifyContent: 'center',
    },
    primaryText: { color: dash.onGold, textAlign: 'center', fontWeight: '900', fontSize: 16 },
  });
}
