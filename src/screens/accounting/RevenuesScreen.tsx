import { useCallback, useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ApiStateView } from '../../components/ApiStateView';
import { TopBar } from '../../components/TopBar';
import { getApiErrorMessage } from '../../api/http';
import { pushStackRoute } from '../../navigation/href';
import { useStore } from '../../store/useStore';
import { pressableRipple, space, touch, useAppTheme } from '../../theme';
import { DASHBOARD_RADIUS, getDashboardPalette, type DashboardPalette } from '../../theme/dashboardLight';
import type { RevenueData } from '../../api/types';

function getRevenueData(data: unknown): RevenueData {
  if (typeof data !== 'object' || data === null) return {};
  return data as RevenueData;
}

export function RevenuesScreen() {
  const insets = useSafeAreaInsets();
  const bottomPad = 24 + insets.bottom;
  const { resolved } = useAppTheme();
  const dash = useMemo(() => getDashboardPalette(resolved), [resolved]);
  const styles = useMemo(() => createStyles(dash), [dash]);
  const apiTone = resolved === 'light' ? 'beige' : 'default';

  const revenueReports = useStore((s) => s.revenueReports);
  const deleteAccountingReport = useStore((s) => s.deleteAccountingReport);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const totalRevenue = revenueReports.reduce((sum, r) => {
    const amount = getRevenueData(r.data).amount;
    return sum + (typeof amount === 'number' ? amount : 0);
  }, 0);

  const loadRevenues = useCallback(async () => {
    try {
      setLoading(true);
      setLoadError(null);
      await useStore.getState().refreshRevenueReports();
    } catch (err) {
      setLoadError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void loadRevenues();
    }, [loadRevenues])
  );

  const onDelete = (id: string) => {
    Alert.alert('حذف الإيراد', 'هل تريد حذف هذا الإيراد؟', [
      { text: 'إلغاء', style: 'cancel' },
      {
        text: 'حذف',
        style: 'destructive',
        onPress: () => {
          void (async () => {
            try {
              await deleteAccountingReport(id);
            } catch (err) {
              Alert.alert('تعذر الحذف', getApiErrorMessage(err));
            }
          })();
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <TopBar
        tone="beige"
        title="الإيرادات"
        leftAction={
          <Pressable
            onPress={() => pushStackRoute('AddRevenue')}
            hitSlop={12}
            style={styles.headerAddWrap}
            accessibilityRole="button"
          >
            <Ionicons name="add" size={26} color={dash.navy} />
          </Pressable>
        }
      />
      <View style={styles.root}>
        <View style={styles.summary}>
          <View style={styles.summaryText}>
            <Text style={styles.sumLabel}>إجمالي الإيرادات</Text>
            <Text style={styles.sumHint}>هذا الشهر</Text>
          </View>
          <View style={styles.sumRow}>
            <Text style={styles.sumVal}>{totalRevenue.toLocaleString('ar-SY')} ل.س</Text>
            <Ionicons name="trending-up" size={20} color={dash.success} style={{ marginRight: space.sm }} />
          </View>
        </View>

        {loading && revenueReports.length === 0 ? (
          <ApiStateView tone={apiTone} mode="loading" title="جاري تحميل الإيرادات..." />
        ) : loadError && revenueReports.length === 0 ? (
          <ApiStateView
            tone={apiTone}
            mode="error"
            title="تعذر تحميل الإيرادات"
            subtitle={loadError}
            onRetry={() => void loadRevenues()}
          />
        ) : revenueReports.length === 0 ? (
          <ScrollView
            contentContainerStyle={[styles.emptyScroll, { paddingBottom: bottomPad }]}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <ApiStateView
              tone={apiTone}
              mode="empty"
              title="لا توجد إيرادات بعد"
              subtitle="سجّل إيراداتك لمتابعة التدفق النقدي."
            />
            <Pressable
              accessibilityRole="button"
              onPress={() => pushStackRoute('AddRevenue')}
              {...pressableRipple(dash.goldTint)}
              style={styles.cta}
            >
              <Text style={styles.ctaText}>إضافة إيراد</Text>
            </Pressable>
          </ScrollView>
        ) : (
          <ScrollView
            contentContainerStyle={[styles.listWrap, { paddingBottom: bottomPad }]}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {revenueReports.map((item) => {
              const data = getRevenueData(item.data);
              return (
                <View key={item.id} style={styles.card}>
                  <Text style={styles.cardTitle}>{item.title}</Text>
                  <Text style={styles.cardMeta}>العميل: {data.clientName ?? '-'}</Text>
                  <Text style={styles.cardMeta}>
                    المبلغ: {typeof data.amount === 'number' ? data.amount.toLocaleString('ar-SY') : '-'} ل.س
                  </Text>
                  <Text style={styles.cardMeta}>الحالة: {data.received ? 'مستلم' : 'معلق'}</Text>
                  <Pressable
                    accessibilityRole="button"
                    onPress={() => onDelete(item.id)}
                    {...pressableRipple('rgba(185, 28, 28, 0.12)')}
                    style={styles.deleteBtn}
                  >
                    <Text style={styles.deleteTxt}>حذف</Text>
                  </Pressable>
                </View>
              );
            })}
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
}

function createStyles(dash: DashboardPalette) {
  return StyleSheet.create({
    safe: { flex: 1, backgroundColor: dash.pageBg },
    root: { flex: 1, paddingHorizontal: 16 },
    headerAddWrap: {
      width: 40,
      height: 40,
      borderRadius: DASHBOARD_RADIUS,
      backgroundColor: dash.white,
      borderWidth: 1,
      borderColor: dash.border,
      alignItems: 'center',
      justifyContent: 'center',
    },
    summary: {
      backgroundColor: dash.white,
      borderRadius: DASHBOARD_RADIUS,
      borderWidth: 1,
      borderColor: dash.border,
      padding: 16,
      flexDirection: 'row-reverse',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 12,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 8,
    },
    summaryText: { flex: 1, alignItems: 'flex-end' },
    sumRow: { flexDirection: 'row-reverse', alignItems: 'center' },
    sumVal: { color: dash.success, fontWeight: '900', fontSize: 18 },
    sumLabel: { color: dash.darkText, fontWeight: '800', textAlign: 'right', fontSize: 15 },
    sumHint: { color: dash.muted, fontSize: 12, marginTop: 4, textAlign: 'right' },
    listWrap: { gap: 12, paddingTop: 4 },
    emptyScroll: { flexGrow: 1, paddingTop: 8, gap: 16 },
    card: {
      backgroundColor: dash.white,
      borderRadius: DASHBOARD_RADIUS,
      borderWidth: 1,
      borderColor: dash.border,
      padding: 16,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 8,
    },
    cardTitle: { color: dash.darkText, fontWeight: '900', textAlign: 'right', marginBottom: 6, fontSize: 16 },
    cardMeta: { color: dash.muted, textAlign: 'right', fontSize: 14, marginTop: 4 },
    deleteBtn: {
      marginTop: 12,
      alignSelf: 'flex-start',
      borderWidth: 1,
      borderColor: dash.danger,
      borderRadius: 12,
      paddingHorizontal: 14,
      paddingVertical: 8,
    },
    deleteTxt: { color: dash.danger, fontWeight: '800' },
    cta: {
      backgroundColor: dash.gold,
      paddingHorizontal: 24,
      paddingVertical: 14,
      borderRadius: DASHBOARD_RADIUS,
      minHeight: touch.minHeight,
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'stretch',
    },
    ctaText: { color: dash.onGold, fontWeight: '900', fontSize: 16 },
  });
}
