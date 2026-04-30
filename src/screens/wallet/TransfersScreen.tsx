import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';

import { useStore } from '../../store/useStore';
import { getApiErrorMessage } from '../../api/http';
import type { Transfer } from '../../api/types';
import { TopBar } from '../../components/TopBar';
import { space, useAppTheme } from '../../theme';
import { DASHBOARD_RADIUS, getDashboardPalette, type DashboardPalette } from '../../theme/dashboardLight';

function transferTypeAr(t: string) {
  switch (t) {
    case 'client_to_contractor':
      return 'عميل → مقاول';
    case 'contractor_to_supplier':
      return 'مقاول → مورد';
    case 'topup':
      return 'شحن رصيد';
    case 'withdraw':
      return 'سحب';
    default:
      return t;
  }
}

function statusLabel(s: string) {
  switch (s) {
    case 'pending':
      return 'قيد الانتظار';
    case 'processing':
      return 'قيد المعالجة';
    case 'completed':
      return 'مكتمل';
    case 'failed':
      return 'فشل';
    case 'cancelled':
      return 'ملغى';
    default:
      return s;
  }
}

export function TransfersScreen() {
  const transfers = useStore((s) => s.transfers);
  const insets = useSafeAreaInsets();
  const { resolved } = useAppTheme();
  const dash = useMemo(() => getDashboardPalette(resolved), [resolved]);
  const styles = useMemo(() => createStyles(dash), [dash]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    await useStore.getState().refreshTransfers();
  }, []);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        await load();
      } catch (e) {
        setError(getApiErrorMessage(e));
      } finally {
        setLoading(false);
      }
    })();
  }, [load]);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await load();
    } catch (e) {
      setError(getApiErrorMessage(e));
    } finally {
      setRefreshing(false);
    }
  };

  const renderItem = ({ item }: { item: Transfer }) => (
    <View style={styles.card}>
      <Text style={styles.title}>
        {transferTypeAr(String(item.type))} • {item.amount} {item.currency.toUpperCase()}
      </Text>
      <Text style={styles.meta}>الحالة: {statusLabel(String(item.status))}</Text>
      {item.description ? <Text style={styles.meta}>الوصف: {item.description}</Text> : null}
      {item.toUserName ? <Text style={styles.meta}>إلى: {item.toUserName}</Text> : null}
      {item.toSupplierName ? <Text style={styles.meta}>مورد: {item.toSupplierName}</Text> : null}
      <Text style={styles.small}>{new Date(item.createdAt).toLocaleString()}</Text>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <TopBar tone="beige" title="التحويلات" />
        <View style={styles.center}>
          <ActivityIndicator color={dash.gold} size="large" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <TopBar tone="beige" title="التحويلات" />
      <FlatList
        data={transfers}
        keyExtractor={(x) => x.id}
        renderItem={renderItem}
        contentInsetAdjustmentBehavior="automatic"
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={dash.gold} />}
        contentContainerStyle={[styles.listContent, { paddingBottom: 24 + insets.bottom }]}
        ListHeaderComponent={
          error ? (
            <View style={styles.banner}>
              <Text style={styles.bannerError} selectable>
                {error}
              </Text>
            </View>
          ) : null
        }
        ListEmptyComponent={<Text style={styles.empty}>لا تحويلات مسجّلة بعد.</Text>}
      />
    </SafeAreaView>
  );
}

function createStyles(dash: DashboardPalette) {
  return StyleSheet.create({
    safe: { flex: 1, backgroundColor: dash.pageBg },
    center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    listContent: { paddingHorizontal: 16, paddingTop: 4, flexGrow: 1 },
    banner: {
      backgroundColor: 'rgba(185, 28, 28, 0.08)',
      borderRadius: 12,
      borderWidth: 1,
      borderColor: 'rgba(185, 28, 28, 0.25)',
      padding: 12,
      marginBottom: 12,
    },
    bannerError: {
      color: dash.danger,
      textAlign: 'center',
      lineHeight: 20,
      fontWeight: '600',
    },
    card: {
      backgroundColor: dash.white,
      borderColor: dash.border,
      borderWidth: 1,
      borderRadius: DASHBOARD_RADIUS,
      padding: space.md,
      marginBottom: 10,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 8,
    },
    title: { color: dash.darkText, fontWeight: '900', fontVariant: ['tabular-nums'], textAlign: 'right' },
    meta: { color: dash.muted, marginTop: 6, textAlign: 'right' },
    small: { color: dash.muted, marginTop: 8, fontSize: 12, fontVariant: ['tabular-nums'], textAlign: 'right' },
    empty: { color: dash.muted, textAlign: 'center', marginTop: 32, paddingHorizontal: 24 },
  });
}
