import { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useStore } from '../../store/useStore';
import type { RootStackParamList } from '../../navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function WalletHomeScreen() {
  const navigation = useNavigation<Nav>();
  const refreshPaymentCards = useStore((s) => s.refreshPaymentCards);
  const refreshTransfers = useStore((s) => s.refreshTransfers);
  const refreshWalletSummary = useStore((s) => s.refreshWalletSummary);
  const summary = useStore((s) => s.walletSummary);
  const cards = useStore((s) => s.paymentCards);

  useEffect(() => {
    void (async () => {
      try {
        await Promise.all([refreshPaymentCards(), refreshTransfers(), refreshWalletSummary()]);
      } catch {
        // ignore
      }
    })();
  }, [refreshPaymentCards, refreshTransfers, refreshWalletSummary]);

  const defaultCard = cards.find((c) => c.isDefault) ?? cards[0];

  return (
    <View style={styles.root}>
      <Text style={styles.title}>المحفظة</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>الرصيد التقريبي (من تحويلات مكتملة)</Text>
        <Text style={styles.metric}>وارد: {summary?.incoming?.toFixed?.(2) ?? '—'}</Text>
        <Text style={styles.metric}>صادر: {summary?.outgoing?.toFixed?.(2) ?? '—'}</Text>
        <Text style={styles.metric}>صافي: {summary?.net?.toFixed?.(2) ?? '—'}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>البطاقة</Text>
        {defaultCard ? (
          <Text style={styles.metric}>
            {defaultCard.brand.toUpperCase()} •••• {defaultCard.last4} {defaultCard.isDefault ? '(افتراضية)' : ''}
          </Text>
        ) : (
          <Text style={styles.muted}>لا توجد بطاقة محفوظة بعد</Text>
        )}
        <Pressable onPress={() => navigation.navigate('AddCard')} style={styles.primary}>
          <Text style={styles.primaryText}>إضافة بطاقة</Text>
        </Pressable>
        <Pressable onPress={() => navigation.navigate('ManageCards')} style={styles.secondary}>
          <Text style={styles.secondaryText}>إدارة البطاقات</Text>
        </Pressable>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>تحويلات</Text>
        <Pressable onPress={() => navigation.navigate('Transfers')} style={styles.primary}>
          <Text style={styles.primaryText}>عرض التحويلات</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0B1220', padding: 16 },
  title: { color: '#F8FAFC', fontSize: 20, fontWeight: '900', marginBottom: 12 },
  card: {
    backgroundColor: 'rgba(15,23,42,0.72)',
    borderColor: '#1F2937',
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
  },
  cardTitle: { color: '#F8FAFC', fontWeight: '900', marginBottom: 10 },
  metric: { color: '#E2E8F0', marginBottom: 6 },
  muted: { color: '#64748B', marginBottom: 10 },
  primary: { backgroundColor: '#38BDF8', borderRadius: 12, paddingVertical: 12, marginTop: 8 },
  primaryText: { color: '#0B1220', textAlign: 'center', fontWeight: '900' },
  secondary: { borderRadius: 12, paddingVertical: 12, marginTop: 10, borderWidth: 1, borderColor: '#334155' },
  secondaryText: { color: '#E2E8F0', textAlign: 'center', fontWeight: '800' },
});
