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

export function InvoicesScreen() {
  const insets = useSafeAreaInsets();
  const bottomPad = 24 + insets.bottom;
  const { resolved } = useAppTheme();
  const dash = useMemo(() => getDashboardPalette(resolved), [resolved]);
  const styles = useMemo(() => createStyles(dash), [dash]);
  const apiTone = resolved === 'light' ? 'beige' : 'default';

  const invoiceReports = useStore((s) => s.invoiceReports);
  const deleteAccountingReport = useStore((s) => s.deleteAccountingReport);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const loadInvoices = useCallback(async () => {
    try {
      setLoading(true);
      setLoadError(null);
      await useStore.getState().refreshInvoiceReports();
    } catch (err) {
      setLoadError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void loadInvoices();
    }, [loadInvoices])
  );

  const onDelete = (id: string) => {
    Alert.alert('حذف الفاتورة', 'هل تريد حذف هذه الفاتورة؟', [
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
        title="الفواتير"
        leftAction={
          <Pressable
            accessibilityRole="button"
            onPress={() => pushStackRoute('NewInvoice')}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            style={styles.headerAddWrap}
          >
            <Ionicons name="add" size={26} color={dash.navy} />
          </Pressable>
        }
      />
      <View style={styles.root}>
        {loading && invoiceReports.length === 0 ? (
          <ApiStateView tone={apiTone} mode="loading" title="جاري تحميل الفواتير..." />
        ) : loadError && invoiceReports.length === 0 ? (
          <ApiStateView
            tone={apiTone}
            mode="error"
            title="تعذر تحميل الفواتير"
            subtitle={loadError}
            onRetry={() => void loadInvoices()}
          />
        ) : invoiceReports.length === 0 ? (
          <ScrollView
            contentContainerStyle={[styles.emptyScroll, { paddingBottom: bottomPad }]}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <ApiStateView
              tone={apiTone}
              mode="empty"
              title="لا توجد فواتير حتى الآن"
              subtitle="أنشئ فاتورة جديدة لمتابعة المبالغ والحالات."
            />
            <Pressable
              accessibilityRole="button"
              onPress={() => pushStackRoute('NewInvoice')}
              {...pressableRipple(dash.goldTint)}
              style={styles.cta}
            >
              <Text style={styles.ctaText}>فاتورة جديدة</Text>
            </Pressable>
          </ScrollView>
        ) : (
          <ScrollView
            contentContainerStyle={[styles.listWrap, { paddingBottom: bottomPad }]}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {invoiceReports.map((item) => (
              <View key={item.id} style={styles.card}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardMeta}>الرقم: {item.reportNumber ?? item.id}</Text>
                <Text style={styles.cardMeta}>الحالة: {item.status ?? 'completed'}</Text>
                <Text style={styles.cardMeta}>
                  المبلغ:{' '}
                  {typeof (item.data as any)?.amount === 'number'
                    ? (item.data as any).amount.toLocaleString('ar-SY')
                    : '-'}{' '}
                  ل.س
                </Text>
                <Pressable
                  accessibilityRole="button"
                  onPress={() => onDelete(item.id)}
                  {...pressableRipple('rgba(185, 28, 28, 0.12)')}
                  style={styles.deleteBtn}
                >
                  <Text style={styles.deleteTxt}>حذف</Text>
                </Pressable>
              </View>
            ))}
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
