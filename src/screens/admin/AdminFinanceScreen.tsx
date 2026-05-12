import { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { TopBar } from '../../components/TopBar';
import { DASHBOARD_TAB_BAR_SCROLL_BASE } from '../../constants/dashboardTabBar';
import { adminAPI, type AdminTransferRow } from '../../api/services/admin';
import { getApiErrorMessage } from '../../api/http';
import { useStore } from '../../store/useStore';
import { space, useAppTheme } from '../../theme';
import { DASHBOARD_RADIUS, getDashboardPalette } from '../../theme/dashboardLight';

export function AdminFinanceScreen() {
  const user = useStore((s) => s.user);
  const { resolved } = useAppTheme();
  const dash = useMemo(() => getDashboardPalette(resolved), [resolved]);
  const styles = useMemo(() => createStyles(dash), [dash]);
  const insets = useSafeAreaInsets();
  const tabPad = DASHBOARD_TAB_BAR_SCROLL_BASE + insets.bottom + space.lg;

  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<Awaited<ReturnType<typeof adminAPI.financeSummary>> | null>(null);
  const [transfers, setTransfers] = useState<AdminTransferRow[]>([]);

  const load = useCallback(async () => {
    if (user?.role !== 'admin') return;
    setLoading(true);
    try {
      const [s, t] = await Promise.all([adminAPI.financeSummary(), adminAPI.listTransfers({ limit: 40 })]);
      setSummary(s);
      setTransfers(t.transfers);
    } catch (e) {
      Alert.alert('خطأ', getApiErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }, [user?.role]);

  useEffect(() => {
    void load();
  }, [load]);

  if (user?.role !== 'admin') {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <TopBar tone="beige" title="المالية" />
        <Text style={styles.denied}>غير مصرّح.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <TopBar tone="beige" title="المالية (Stripe)" />
      <ScrollView contentContainerStyle={[styles.scroll, { paddingBottom: tabPad }]}>
        {loading && !summary ? (
          <ActivityIndicator color={dash.gold} style={{ marginTop: 24 }} />
        ) : (
          <>
            <Text style={styles.lead}>
              الملخص من قاعدة البيانات المحلية؛ الرسوم الفعلية والاسترداد من Stripe يتطلبان مفتاح الخادم الصحيح.
            </Text>
            {!summary?.stripeConfigured ? (
              <Text style={styles.warn}>Stripe غير مهيأ على الخادم — الاسترداد عبر API لن يعمل.</Text>
            ) : null}

            <Text style={styles.h}>التحويلات حسب الحالة</Text>
            {summary?.transfersByStatus?.map((x) => (
              <Text key={String(x._id)} style={styles.line}>
                {x._id}: {x.count} عملية — إجمالي {Number(x.total || 0).toFixed(2)}
              </Text>
            ))}

            <Text style={[styles.h, { marginTop: 16 }]}>المدفوعات (موردين) حسب الحالة</Text>
            {summary?.paymentsByStatus?.map((x) => (
              <Text key={String(x._id)} style={styles.line}>
                {x._id}: {x.count} — {Number(x.total || 0).toFixed(2)}
              </Text>
            ))}

            <Text style={[styles.h, { marginTop: 16 }]}>
              تحويلات كبيرة (≥ {summary?.largeTransferThresholdUsd ?? 500} USD)
            </Text>
            {(summary?.largeTransfers ?? []).map((x) => (
              <View key={x.id} style={styles.bigCard}>
                <Text style={styles.bigAmt}>
                  {x.amount} {x.currency?.toUpperCase()} — {x.status}
                </Text>
                <Text style={styles.bigMeta}>
                  {x.fromName ?? '?'} ← {x.toName ?? '?'}
                </Text>
                {x.stripePaymentIntentId ? (
                  <Pressable
                    style={styles.refundBtn}
                    onPress={() =>
                      Alert.alert('استرداد Stripe؟', 'يُنفَّذ عبر Stripe على PaymentIntent المرتبط.', [
                        { text: 'إلغاء', style: 'cancel' },
                        {
                          text: 'استرداد',
                          style: 'destructive',
                          onPress: () =>
                            void adminAPI
                              .stripeRefundTransfer(x.id)
                              .then((r) =>
                                Alert.alert(
                                  'تم',
                                  `Refund ${r.refundId} — المبلغ المسترد (بالعملة الصغرى): ${r.amount} ${r.currency}`
                                )
                              )
                              .then(() => load())
                              .catch((e) => Alert.alert('فشل', getApiErrorMessage(e))),
                        },
                      ])
                    }
                  >
                    <Text style={styles.refundTxt}>طلب استرداد</Text>
                  </Pressable>
                ) : null}
              </View>
            ))}

            <Text style={[styles.h, { marginTop: 20 }]}>آخر التحويلات</Text>
            {transfers.map((item) => (
              <View key={item.id} style={styles.row}>
                <Text style={styles.rowMain}>
                  {item.amount} {item.currency} · {item.status}
                </Text>
                <Text style={styles.rowSub} numberOfLines={2}>
                  {item.type} · {item.fromName} → {item.toName}
                </Text>
                <View style={styles.rowActions}>
                  <Pressable
                    onPress={() =>
                      Alert.alert('إلغاء التحويل محلياً؟', 'لا يسترد من Stripe تلقائياً.', [
                        { text: 'لا', style: 'cancel' },
                        {
                          text: 'تعيين ملغى',
                          onPress: () =>
                            void adminAPI
                              .patchTransfer(item.id, 'cancelled')
                              .then(() => load())
                              .catch((e) => Alert.alert('خطأ', getApiErrorMessage(e))),
                        },
                      ])
                    }
                  >
                    <Text style={styles.link}>إلغاء سجل</Text>
                  </Pressable>
                </View>
              </View>
            ))}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function createStyles(dash: ReturnType<typeof getDashboardPalette>) {
  return StyleSheet.create({
    safe: { flex: 1, backgroundColor: dash.pageBg },
    denied: { padding: 24, textAlign: 'center', color: dash.muted },
    scroll: { paddingHorizontal: 16, paddingTop: 12 },
    lead: { color: dash.muted, fontSize: 13, lineHeight: 20, textAlign: 'right', marginBottom: 12 },
    warn: { color: '#b45309', marginBottom: 12, textAlign: 'right', fontWeight: '700' },
    h: { fontWeight: '900', fontSize: 16, color: dash.navy, textAlign: 'right', marginBottom: 8 },
    line: { fontSize: 13, color: dash.darkText, textAlign: 'right', marginBottom: 4 },
    bigCard: {
      padding: 12,
      borderRadius: DASHBOARD_RADIUS,
      borderWidth: 1,
      borderColor: dash.border,
      backgroundColor: dash.white,
      marginBottom: 10,
    },
    bigAmt: { fontWeight: '900', textAlign: 'right', color: dash.darkText },
    bigMeta: { fontSize: 12, color: dash.muted, textAlign: 'right', marginTop: 4 },
    refundBtn: { alignSelf: 'flex-end', marginTop: 8 },
    refundTxt: { color: '#b91c1c', fontWeight: '800' },
    row: {
      paddingVertical: 10,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: dash.border,
    },
    rowMain: { fontWeight: '800', textAlign: 'right', color: dash.darkText },
    rowSub: { fontSize: 12, color: dash.muted, textAlign: 'right', marginTop: 4 },
    rowActions: { flexDirection: 'row-reverse', marginTop: 6 },
    link: { color: dash.navy, fontWeight: '700', fontSize: 13 },
  });
}
