import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import { useStore } from '../../store/useStore';
import { getApiErrorMessage } from '../../api/http';
import type { Transfer } from '../../api/types';
import { colors, radius, space } from '../../theme';

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
  const refreshTransfers = useStore((s) => s.refreshTransfers);
  const transfers = useStore((s) => s.transfers);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    await refreshTransfers();
  }, [refreshTransfers]);

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
      <View style={styles.center}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  return (
    <FlatList
      data={transfers}
      keyExtractor={(x) => x.id}
      renderItem={renderItem}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      contentContainerStyle={styles.listContent}
      ListHeaderComponent={error ? <Text style={styles.bannerError}>{error}</Text> : null}
      ListEmptyComponent={<Text style={styles.empty}>لا تحويلات</Text>}
    />
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center' },
  listContent: { padding: space.lg, paddingBottom: space.xxl + 6, backgroundColor: colors.background, flexGrow: 1 },
  bannerError: {
    color: colors.error,
    marginBottom: space.sm + 2,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: space.sm,
  },
  card: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.xl,
    padding: space.md,
    marginBottom: space.sm + 2,
  },
  title: { color: colors.text, fontWeight: '900' },
  meta: { color: colors.textSubtle, marginTop: space.sm - 2 },
  small: { color: colors.placeholder, marginTop: space.sm, fontSize: 12 },
  empty: { color: colors.placeholder, textAlign: 'center', marginTop: space.lg + 2 },
});
