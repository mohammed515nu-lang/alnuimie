import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import { useStore } from '../../store/useStore';
import { getApiErrorMessage } from '../../api/http';
import type { PaymentCard } from '../../api/types';

export function ManageCardsScreen() {
  const refreshPaymentCards = useStore((s) => s.refreshPaymentCards);
  const setDefaultPaymentCard = useStore((s) => s.setDefaultPaymentCard);
  const removePaymentCard = useStore((s) => s.removePaymentCard);
  const cards = useStore((s) => s.paymentCards);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    await refreshPaymentCards();
  }, [refreshPaymentCards]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        await load();
      } catch (e) {
        Alert.alert('تعذر التحميل', getApiErrorMessage(e));
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
      Alert.alert('تعذر التحديث', getApiErrorMessage(e));
    } finally {
      setRefreshing(false);
    }
  };

  const renderItem = ({ item }: { item: PaymentCard }) => (
    <View style={styles.card}>
      <Text style={styles.title}>
        {item.brand.toUpperCase()} •••• {item.last4} {item.isDefault ? '(افتراضية)' : ''}
      </Text>
      <Text style={styles.meta}>
        {String(item.expMonth).padStart(2, '0')}/{item.expYear}
      </Text>
      <View style={{ flexDirection: 'row', gap: 10, marginTop: 10 }}>
        <Pressable
          onPress={async () => {
            try {
              await setDefaultPaymentCard(item.id);
            } catch (e) {
              Alert.alert('تعذر التعيين', getApiErrorMessage(e));
            }
          }}
          style={styles.secondary}
        >
          <Text style={styles.secondaryText}>تعيين افتراضي</Text>
        </Pressable>
        <Pressable
          onPress={async () => {
            Alert.alert('حذف', 'حذف البطاقة؟', [
              { text: 'إلغاء', style: 'cancel' },
              {
                text: 'حذف',
                style: 'destructive',
                onPress: async () => {
                  try {
                    await removePaymentCard(item.id);
                  } catch (e) {
                    Alert.alert('تعذر الحذف', getApiErrorMessage(e));
                  }
                },
              },
            ]);
          }}
          style={styles.danger}
        >
          <Text style={styles.dangerText}>حذف</Text>
        </Pressable>
      </View>
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
      data={cards}
      keyExtractor={(x) => x.id}
      renderItem={renderItem}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      contentContainerStyle={{ padding: 16, paddingBottom: 30, backgroundColor: '#0B1220' }}
      ListEmptyComponent={<Text style={styles.empty}>لا بطاقات</Text>}
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
  title: { color: '#F8FAFC', fontWeight: '900', fontSize: 16 },
  meta: { color: '#94A3B8', marginTop: 6, fontWeight: '700' },
  secondary: { flex: 1, borderRadius: 12, borderWidth: 1, borderColor: '#334155', paddingVertical: 10 },
  secondaryText: { color: '#E2E8F0', textAlign: 'center', fontWeight: '800' },
  danger: { flex: 1, borderRadius: 12, borderWidth: 1, borderColor: '#7F1D1D', paddingVertical: 10, backgroundColor: 'rgba(127,29,29,0.15)' },
  dangerText: { color: '#FCA5A5', textAlign: 'center', fontWeight: '900' },
  empty: { color: '#64748B', textAlign: 'center', marginTop: 18 },
});
