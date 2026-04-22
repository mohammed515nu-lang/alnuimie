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
        {item.type} • {item.amount} {item.currency.toUpperCase()}
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
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <FlatList
      data={transfers}
      keyExtractor={(x) => x.id}
      renderItem={renderItem}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      contentContainerStyle={{ padding: 16, paddingBottom: 30, backgroundColor: '#0B1220' }}
      ListHeaderComponent={
        error ? (
          <Text style={{ color: '#FB7185', marginBottom: 10, textAlign: 'center' }}>{error}</Text>
        ) : null
      }
      ListEmptyComponent={<Text style={styles.empty}>لا تحويلات</Text>}
    />
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, backgroundColor: '#0B1220', alignItems: 'center', justifyContent: 'center' },
  card: {
    backgroundColor: 'rgba(15,23,42,0.72)',
    borderColor: '#1F2937',
    borderWidth: 1,
    borderRadius: 16,
    padding: 12,
    marginBottom: 10,
  },
  title: { color: '#F8FAFC', fontWeight: '900' },
  meta: { color: '#CBD5E1', marginTop: 6 },
  small: { color: '#64748B', marginTop: 8, fontSize: 12 },
  empty: { color: '#64748B', textAlign: 'center', marginTop: 18 },
});
